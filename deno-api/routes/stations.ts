import { createRouter } from "../utils/router.ts";
import { KVStore, Station } from "../utils/kv.ts";
import { corsHeaders } from "../utils/cors.ts";

const router = createRouter();

// Get all stations
router.get("/", async (req) => {
  try {
    const stations = await KVStore.list<Station>("stations");
    return new Response(JSON.stringify(stations), {
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

// Get station by ID
router.get("/:id", async (req, params) => {
  try {
    const { id } = params!;
    const station = await KVStore.get<Station>("stations", id);

    if (!station) {
      return new Response(JSON.stringify({ error: "Station not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify(station), {
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

// Create station
router.post("/", async (req) => {
  try {
    const body = await req.json();
    const { name, address, latitude, longitude } = body;

    if (!name || !address || !latitude || !longitude) {
      return new Response(JSON.stringify({ 
        error: "Name, address, latitude, and longitude are required" 
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const stationData = {
      name,
      address,
      latitude,
      longitude,
      isActive: true
    };

    const station = await KVStore.create<Station>("stations", stationData);
    return new Response(JSON.stringify(station), {
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

export { router as stationRoutes };
