import { createRouter } from "../utils/router.ts";
import { KVStore, Assignment } from "../utils/kv.ts";
import { corsHeaders } from "../utils/cors.ts";

const router = createRouter();

// Get all assignments
router.get("/", async (req) => {
  try {
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") || "100");
    const offset = parseInt(url.searchParams.get("offset") || "0");
    const status = url.searchParams.get("status");
    const userId = url.searchParams.get("userId");

    let assignments = await KVStore.list<Assignment>("assignments", limit, offset);

    if (status) {
      assignments = assignments.filter(assignment => assignment.status === status);
    }
    if (userId) {
      assignments = assignments.filter(assignment => assignment.userId === userId);
    }

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

// Get assignment by ID
router.get("/:id", async (req, params) => {
  try {
    const { id } = params!;
    const assignment = await KVStore.get<Assignment>("assignments", id);

    if (!assignment) {
      return new Response(JSON.stringify({ error: "Assignment not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify(assignment), {
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

// Update assignment status
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

    const existingAssignment = await KVStore.get<Assignment>("assignments", id);
    if (!existingAssignment) {
      return new Response(JSON.stringify({ error: "Assignment not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const updateData: any = { status };

    // Set appropriate timestamp based on status
    const now = new Date().toISOString();
    switch (status) {
      case "ACCEPTED":
        updateData.acceptedAt = now;
        break;
      case "COMPLETED":
        updateData.completedAt = now;
        break;
    }

    const updatedAssignment = await KVStore.update<Assignment>("assignments", id, updateData);

    return new Response(JSON.stringify(updatedAssignment), {
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

export { router as assignmentRoutes };
