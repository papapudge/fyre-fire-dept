import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { corsHeaders } from "./utils/cors.ts";
import { createRouter } from "./utils/router.ts";

// Import all route handlers
import { authRoutes } from "./routes/auth.ts";
import { userRoutes } from "./routes/users.ts";
import { personnelRoutes } from "./routes/personnel.ts";
import { stationRoutes } from "./routes/stations.ts";
import { vehicleRoutes } from "./routes/vehicles.ts";
import { hydrantRoutes } from "./routes/hydrants.ts";
import { incidentRoutes } from "./routes/incidents.ts";
import { assignmentRoutes } from "./routes/assignments.ts";
import { notificationRoutes } from "./routes/notifications.ts";
import { reportRoutes } from "./routes/reports.ts";
import { equipmentRoutes } from "./routes/equipment.ts";
import { maintenanceRoutes } from "./routes/maintenance.ts";
import { auditRoutes } from "./routes/audit.ts";
import { configRoutes } from "./routes/config.ts";

// Create the main router
const router = createRouter();

// Register all routes
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/personnel", personnelRoutes);
router.use("/stations", stationRoutes);
router.use("/vehicles", vehicleRoutes);
router.use("/hydrants", hydrantRoutes);
router.use("/incidents", incidentRoutes);
router.use("/assignments", assignmentRoutes);
router.use("/notifications", notificationRoutes);
router.use("/reports", reportRoutes);
router.use("/equipment", equipmentRoutes);
router.use("/maintenance", maintenanceRoutes);
router.use("/audit", auditRoutes);
router.use("/config", configRoutes);

// Health check endpoint
router.get("/health", () => {
  return new Response(JSON.stringify({ 
    status: "healthy", 
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
});

// Root endpoint
router.get("/", () => {
  return new Response(JSON.stringify({ 
    message: "Fire Department Resource Management API",
    version: "1.0.0",
    endpoints: [
      "/auth - Authentication",
      "/users - User management",
      "/personnel - Personnel management", 
      "/stations - Station management",
      "/vehicles - Vehicle management",
      "/hydrants - Hydrant management",
      "/incidents - Incident management",
      "/assignments - Assignment management",
      "/notifications - Notification system",
      "/reports - Reporting system",
      "/equipment - Equipment management",
      "/maintenance - Maintenance records",
      "/audit - Audit logs",
      "/config - System configuration"
    ]
  }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
});

// Handle CORS preflight requests
const handleCORS = (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  return null;
};

// Main request handler
const handler = async (req: Request): Promise<Response> => {
  // Handle CORS
  const corsResponse = handleCORS(req);
  if (corsResponse) return corsResponse;

  try {
    // Route the request
    const response = await router.handle(req);
    
    // Add CORS headers to all responses
    if (response) {
      const headers = new Headers(response.headers);
      Object.entries(corsHeaders).forEach(([key, value]) => {
        headers.set(key, value);
      });
      
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers
      });
    }

    // 404 for unmatched routes
    return new Response(JSON.stringify({ error: "Not Found" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Request error:", error);
    return new Response(JSON.stringify({ 
      error: "Internal Server Error",
      message: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
};

// Start the server
serve(handler, { port: 8000 });
