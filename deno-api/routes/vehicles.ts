import { createRouter } from "../utils/router.ts";
import { KVStore, Vehicle } from "../utils/kv.ts";
import { corsHeaders } from "../utils/cors.ts";

const router = createRouter();

// Get all vehicles
router.get("/", async (req) => {
  try {
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") || "100");
    const offset = parseInt(url.searchParams.get("offset") || "0");
    const status = url.searchParams.get("status");
    const type = url.searchParams.get("type");
    const stationId = url.searchParams.get("stationId");

    let vehicles = await KVStore.list<Vehicle>("vehicles", limit, offset);

    // Apply filters
    if (status) {
      vehicles = vehicles.filter(vehicle => vehicle.status === status);
    }
    if (type) {
      vehicles = vehicles.filter(vehicle => vehicle.type === type);
    }
    if (stationId) {
      vehicles = vehicles.filter(vehicle => vehicle.stationId === stationId);
    }

    return new Response(JSON.stringify({
      vehicles,
      total: vehicles.length,
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

// Get vehicle by ID
router.get("/:id", async (req, params) => {
  try {
    const { id } = params!;
    const vehicle = await KVStore.get<Vehicle>("vehicles", id);

    if (!vehicle) {
      return new Response(JSON.stringify({ error: "Vehicle not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify(vehicle), {
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

// Create new vehicle
router.post("/", async (req) => {
  try {
    const body = await req.json();
    const {
      unitId,
      type,
      name,
      stationId,
      capabilities = [],
      year,
      make,
      model,
      vin,
      licensePlate,
      insuranceExpiry
    } = body;

    if (!unitId || !type || !name || !stationId) {
      return new Response(JSON.stringify({ 
        error: "Unit ID, type, name, and station ID are required" 
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Check if unit ID already exists
    const existingVehicles = await KVStore.findByField<Vehicle>("vehicles", "unitId", unitId);
    if (existingVehicles.length > 0) {
      return new Response(JSON.stringify({ error: "Vehicle with this unit ID already exists" }), {
        status: 409,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const vehicleData = {
      unitId,
      type,
      name,
      stationId,
      status: "OUT_OF_SERVICE" as const,
      capabilities,
      year,
      make,
      model,
      vin,
      licensePlate,
      insuranceExpiry,
      isActive: true
    };

    const vehicle = await KVStore.create<Vehicle>("vehicles", vehicleData);

    return new Response(JSON.stringify(vehicle), {
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

// Update vehicle
router.put("/:id", async (req, params) => {
  try {
    const { id } = params!;
    const body = await req.json();

    const existingVehicle = await KVStore.get<Vehicle>("vehicles", id);
    if (!existingVehicle) {
      return new Response(JSON.stringify({ error: "Vehicle not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Check unit ID uniqueness if being updated
    if (body.unitId && body.unitId !== existingVehicle.unitId) {
      const unitVehicles = await KVStore.findByField<Vehicle>("vehicles", "unitId", body.unitId);
      if (unitVehicles.length > 0) {
        return new Response(JSON.stringify({ error: "Unit ID already exists" }), {
          status: 409,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }

    const updatedVehicle = await KVStore.update<Vehicle>("vehicles", id, body);

    return new Response(JSON.stringify(updatedVehicle), {
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

// Update vehicle location
router.patch("/:id/location", async (req, params) => {
  try {
    const { id } = params!;
    const body = await req.json();
    const { latitude, longitude } = body;

    if (latitude === undefined || longitude === undefined) {
      return new Response(JSON.stringify({ error: "Latitude and longitude are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const existingVehicle = await KVStore.get<Vehicle>("vehicles", id);
    if (!existingVehicle) {
      return new Response(JSON.stringify({ error: "Vehicle not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const updatedVehicle = await KVStore.update<Vehicle>("vehicles", id, {
      latitude,
      longitude,
      lastLocationUpdate: new Date().toISOString()
    });

    return new Response(JSON.stringify(updatedVehicle), {
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

// Update vehicle status
router.patch("/:id/status", async (req, params) => {
  try {
    const { id } = params!;
    const body = await req.json();
    const { status } = body;

    if (!status) {
      return new Response(JSON.stringify({ error: "Status is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const existingVehicle = await KVStore.get<Vehicle>("vehicles", id);
    if (!existingVehicle) {
      return new Response(JSON.stringify({ error: "Vehicle not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const updatedVehicle = await KVStore.update<Vehicle>("vehicles", id, { status });

    return new Response(JSON.stringify(updatedVehicle), {
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

// Get vehicles by station
router.get("/station/:stationId", async (req, params) => {
  try {
    const { stationId } = params!;
    const vehicles = await KVStore.findByField<Vehicle>("vehicles", "stationId", stationId);

    return new Response(JSON.stringify(vehicles), {
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

// Get vehicles by status
router.get("/status/:status", async (req, params) => {
  try {
    const { status } = params!;
    const vehicles = await KVStore.findByField<Vehicle>("vehicles", "status", status);

    return new Response(JSON.stringify(vehicles), {
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

// Get vehicles near location
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

    const vehicles = await KVStore.list<Vehicle>("vehicles");
    
    // Filter by distance
    const nearbyVehicles = vehicles.filter(vehicle => {
      if (!vehicle.latitude || !vehicle.longitude) return false;
      const distance = calculateDistance(lat, lng, vehicle.latitude, vehicle.longitude);
      return distance <= radius;
    });

    return new Response(JSON.stringify(nearbyVehicles), {
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

export { router as vehicleRoutes };
