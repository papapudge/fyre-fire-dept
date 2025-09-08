import { createRouter } from "../utils/router.ts";
import { KVStore, Incident, Assignment, Notification } from "../utils/kv.ts";
import { corsHeaders } from "../utils/cors.ts";

const router = createRouter();

// Generate incident number
function generateIncidentNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  return `${year}${month}${day}-${random}`;
}

// Get all incidents
router.get("/", async (req) => {
  try {
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") || "100");
    const offset = parseInt(url.searchParams.get("offset") || "0");
    const status = url.searchParams.get("status");
    const type = url.searchParams.get("type");
    const severity = url.searchParams.get("severity");
    const stationId = url.searchParams.get("stationId");

    let incidents = await KVStore.list<Incident>("incidents", limit, offset);

    // Apply filters
    if (status) {
      incidents = incidents.filter(incident => incident.status === status);
    }
    if (type) {
      incidents = incidents.filter(incident => incident.type === type);
    }
    if (severity) {
      incidents = incidents.filter(incident => incident.severity === severity);
    }
    if (stationId) {
      incidents = incidents.filter(incident => incident.stationId === stationId);
    }

    // Sort by reportedAt descending (most recent first)
    incidents.sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime());

    return new Response(JSON.stringify({
      incidents,
      total: incidents.length,
      limit,
      offset
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});

// Get incident by ID
router.get("/:id", async (req, params) => {
  try {
    const { id } = params!;
    const incident = await KVStore.get<Incident>("incidents", id);

    if (!incident) {
      return new Response(JSON.stringify({ error: "Incident not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Get related assignments
    const assignments = await KVStore.findByField<Assignment>("assignments", "incidentId", id);

    return new Response(JSON.stringify({
      ...incident,
      assignments
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});

// Create new incident
router.post("/", async (req) => {
  try {
    const body = await req.json();
    const {
      type,
      severity,
      title,
      description,
      latitude,
      longitude,
      address,
      stationId,
      callerName,
      callerPhone,
      weather,
      temperature,
      windSpeed,
      windDirection,
      humidity,
      tags = []
    } = body;

    if (!type || !severity || !title || !latitude || !longitude) {
      return new Response(JSON.stringify({ 
        error: "Type, severity, title, latitude, and longitude are required" 
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const incidentData = {
      incidentNumber: generateIncidentNumber(),
      type,
      severity,
      status: "ACTIVE" as const,
      title,
      description,
      latitude,
      longitude,
      address,
      stationId,
      callerName,
      callerPhone,
      reportedAt: new Date().toISOString(),
      injuries: 0,
      fatalities: 0,
      weather,
      temperature,
      windSpeed,
      windDirection,
      humidity,
      tags
    };

    const incident = await KVStore.create<Incident>("incidents", incidentData);

    // Create notification for dispatch
    const notificationData = {
      userId: "system", // In real app, this would be the dispatcher's ID
      type: "INCIDENT_DISPATCH" as const,
      title: "New Incident Dispatch",
      message: `${incident.incidentNumber}: ${title} - ${severity} priority`,
      data: {
        incidentId: incident.id,
        incidentNumber: incident.incidentNumber,
        type,
        severity,
        location: address || `${latitude}, ${longitude}`
      },
      isRead: false,
      priority: severity === "CRITICAL" ? "CRITICAL" : severity === "HIGH" ? "HIGH" : "NORMAL" as const
    };

    await KVStore.create<Notification>("notifications", notificationData);

    return new Response(JSON.stringify(incident), {
      status: 201,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});

// Update incident
router.put("/:id", async (req, params) => {
  try {
    const { id } = params!;
    const body = await req.json();

    const existingIncident = await KVStore.get<Incident>("incidents", id);
    if (!existingIncident) {
      return new Response(JSON.stringify({ error: "Incident not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const updatedIncident = await KVStore.update<Incident>("incidents", id, body);

    // Create notification for status changes
    if (body.status && body.status !== existingIncident.status) {
      const notificationData = {
        userId: "system",
        type: "INCIDENT_UPDATE" as const,
        title: "Incident Status Update",
        message: `${existingIncident.incidentNumber} status changed to ${body.status}`,
        data: {
          incidentId: id,
          incidentNumber: existingIncident.incidentNumber,
          oldStatus: existingIncident.status,
          newStatus: body.status
        },
        isRead: false,
        priority: "NORMAL" as const
      };

      await KVStore.create<Notification>("notifications", notificationData);
    }

    return new Response(JSON.stringify(updatedIncident), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});

// Update incident status
router.patch("/:id/status", async (req, params) => {
  try {
    const { id } = params!;
    const body = await req.json();
    const { status, timestamp } = body;

    if (!status) {
      return new Response(JSON.stringify({ error: "Status is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const existingIncident = await KVStore.get<Incident>("incidents", id);
    if (!existingIncident) {
      return new Response(JSON.stringify({ error: "Incident not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const updateData: any = { status };

    // Set appropriate timestamp based on status
    const now = timestamp || new Date().toISOString();
    switch (status) {
      case "DISPATCHED":
        updateData.dispatchedAt = now;
        break;
      case "EN_ROUTE":
        // Keep dispatchedAt if not already set
        if (!existingIncident.dispatchedAt) {
          updateData.dispatchedAt = now;
        }
        break;
      case "ON_SCENE":
        updateData.arrivedAt = now;
        break;
      case "CONTAINED":
        updateData.containedAt = now;
        break;
      case "CLOSED":
        updateData.closedAt = now;
        break;
    }

    const updatedIncident = await KVStore.update<Incident>("incidents", id, updateData);

    // Create notification for status change
    const notificationData = {
      userId: "system",
      type: "INCIDENT_UPDATE" as const,
      title: "Incident Status Update",
      message: `${existingIncident.incidentNumber} status changed to ${status}`,
      data: {
        incidentId: id,
        incidentNumber: existingIncident.incidentNumber,
        oldStatus: existingIncident.status,
        newStatus: status
      },
      isRead: false,
      priority: "NORMAL" as const
    };

    await KVStore.create<Notification>("notifications", notificationData);

    return new Response(JSON.stringify(updatedIncident), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});

// Assign personnel/vehicles to incident
router.post("/:id/assign", async (req, params) => {
  try {
    const { id } = params!;
    const body = await req.json();
    const { userId, personnelId, vehicleId, role } = body;

    if (!userId || !role) {
      return new Response(JSON.stringify({ 
        error: "User ID and role are required" 
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const incident = await KVStore.get<Incident>("incidents", id);
    if (!incident) {
      return new Response(JSON.stringify({ error: "Incident not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const assignmentData = {
      incidentId: id,
      userId,
      personnelId,
      vehicleId,
      role,
      status: "ASSIGNED" as const,
      assignedAt: new Date().toISOString()
    };

    const assignment = await KVStore.create<Assignment>("assignments", assignmentData);

    // Create notification for assignment
    const notificationData = {
      userId,
      type: "ASSIGNMENT" as const,
      title: "New Assignment",
      message: `You have been assigned to incident ${incident.incidentNumber} as ${role}`,
      data: {
        incidentId: id,
        incidentNumber: incident.incidentNumber,
        role,
        assignmentId: assignment.id
      },
      isRead: false,
      priority: "HIGH" as const
    };

    await KVStore.create<Notification>("notifications", notificationData);

    return new Response(JSON.stringify(assignment), {
      status: 201,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});

// Get incident assignments
router.get("/:id/assignments", async (req, params) => {
  try {
    const { id } = params!;
    const assignments = await KVStore.findByField<Assignment>("assignments", "incidentId", id);

    return new Response(JSON.stringify(assignments), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});

// Get active incidents
router.get("/active", async (req) => {
  try {
    const activeStatuses = ["ACTIVE", "DISPATCHED", "EN_ROUTE", "ON_SCENE"];
    const incidents = await KVStore.search<Incident>("incidents", (incident) => 
      activeStatuses.includes(incident.status)
    );

    // Sort by severity and reportedAt
    incidents.sort((a, b) => {
      const severityOrder = { "CRITICAL": 4, "HIGH": 3, "MEDIUM": 2, "LOW": 1 };
      const severityDiff = (severityOrder[b.severity] || 0) - (severityOrder[a.severity] || 0);
      if (severityDiff !== 0) return severityDiff;
      return new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime();
    });

    return new Response(JSON.stringify(incidents), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});

// Get incidents by location (within radius)
router.get("/nearby", async (req) => {
  try {
    const url = new URL(req.url);
    const lat = parseFloat(url.searchParams.get("lat") || "0");
    const lng = parseFloat(url.searchParams.get("lng") || "0");
    const radius = parseFloat(url.searchParams.get("radius") || "10"); // km

    if (!lat || !lng) {
      return new Response(JSON.stringify({ error: "Latitude and longitude are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const incidents = await KVStore.list<Incident>("incidents");
    
    // Filter by distance
    const nearbyIncidents = incidents.filter(incident => {
      const distance = calculateDistance(lat, lng, incident.latitude, incident.longitude);
      return distance <= radius;
    });

    return new Response(JSON.stringify(nearbyIncidents), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});

// Helper function to calculate distance between two points
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export { router as incidentRoutes };
