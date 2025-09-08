import { createRouter } from "../utils/router.ts";
import { KVStore, Personnel } from "../utils/kv.ts";
import { corsHeaders } from "../utils/cors.ts";

const router = createRouter();

// Get all personnel
router.get("/", async (req) => {
  try {
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") || "100");
    const offset = parseInt(url.searchParams.get("offset") || "0");
    const status = url.searchParams.get("status");
    const stationId = url.searchParams.get("stationId");

    let personnel = await KVStore.list<Personnel>("personnel", limit, offset);

    if (status) {
      personnel = personnel.filter(p => p.status === status);
    }
    if (stationId) {
      personnel = personnel.filter(p => p.stationId === stationId);
    }

    return new Response(JSON.stringify({ personnel, total: personnel.length }), {
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

// Get personnel by ID
router.get("/:id", async (req, params) => {
  try {
    const { id } = params!;
    const personnel = await KVStore.get<Personnel>("personnel", id);

    if (!personnel) {
      return new Response(JSON.stringify({ error: "Personnel not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify(personnel), {
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

// Create personnel
router.post("/", async (req) => {
  try {
    const body = await req.json();
    const { userId, employeeId, rank, certifications = [], qualifications = [] } = body;

    if (!userId || !employeeId) {
      return new Response(JSON.stringify({ error: "User ID and employee ID are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const personnelData = {
      userId,
      employeeId,
      rank,
      certifications,
      qualifications,
      status: "OFF_DUTY" as const,
      trainingHours: 0
    };

    const personnel = await KVStore.create<Personnel>("personnel", personnelData);
    return new Response(JSON.stringify(personnel), {
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

// Update personnel status
router.patch("/:id/status", async (req, params) => {
  try {
    const { id } = params!;
    const body = await req.json();
    const { status } = body;

    const personnel = await KVStore.update<Personnel>("personnel", id, { status });
    return new Response(JSON.stringify(personnel), {
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

export { router as personnelRoutes };
