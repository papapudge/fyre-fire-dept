import { createRouter } from "../utils/router.ts";
import { KVStore, Hydrant } from "../utils/kv.ts";
import { corsHeaders } from "../utils/cors.ts";

const router = createRouter();

// Get all hydrants
router.get("/", async (req) => {
  try {
    const hydrants = await KVStore.list<Hydrant>("hydrants");
    return new Response(JSON.stringify(hydrants), {
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

// Get hydrant by ID
router.get("/:id", async (req, params) => {
  try {
    const { id } = params!;
    const hydrant = await KVStore.get<Hydrant>("hydrants", id);

    if (!hydrant) {
      return new Response(JSON.stringify({ error: "Hydrant not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify(hydrant), {
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

// Create hydrant
router.post("/", async (req) => {
  try {
    const body = await req.json();
    const { hydrantId, latitude, longitude, flowRate, pressure } = body;

    if (!hydrantId || !latitude || !longitude) {
      return new Response(JSON.stringify({ 
        error: "Hydrant ID, latitude, and longitude are required" 
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const hydrantData = {
      hydrantId,
      latitude,
      longitude,
      flowRate,
      pressure,
      status: "ACTIVE" as const,
      type: "DRY_BARREL" as const,
      isActive: true
    };

    const hydrant = await KVStore.create<Hydrant>("hydrants", hydrantData);
    return new Response(JSON.stringify(hydrant), {
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

export { router as hydrantRoutes };
