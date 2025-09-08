import { createRouter } from "../utils/router.ts";
import { KVStore, User } from "../utils/kv.ts";
import { corsHeaders } from "../utils/cors.ts";

const router = createRouter();

// Get all users
router.get("/", async (req) => {
  try {
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") || "100");
    const offset = parseInt(url.searchParams.get("offset") || "0");
    const role = url.searchParams.get("role");
    const isActive = url.searchParams.get("isActive");

    let users = await KVStore.list<User>("users", limit, offset);

    // Apply filters
    if (role) {
      users = users.filter(user => user.role === role);
    }
    if (isActive !== null) {
      const activeFilter = isActive === "true";
      users = users.filter(user => user.isActive === activeFilter);
    }

    return new Response(JSON.stringify({
      users,
      total: users.length,
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

// Get user by ID
router.get("/:id", async (req, params) => {
  try {
    const { id } = params!;
    const user = await KVStore.get<User>("users", id);

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify(user), {
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

// Create new user
router.post("/", async (req) => {
  try {
    const body = await req.json();
    const { email, name, role = "FIELD_RESPONDER", badgeNumber, phone } = body;

    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Check if user already exists
    const existingUsers = await KVStore.findByField<User>("users", "email", email);
    if (existingUsers.length > 0) {
      return new Response(JSON.stringify({ error: "User with this email already exists" }), {
        status: 409,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Check if badge number is unique
    if (badgeNumber) {
      const badgeUsers = await KVStore.findByField<User>("users", "badgeNumber", badgeNumber);
      if (badgeUsers.length > 0) {
        return new Response(JSON.stringify({ error: "Badge number already exists" }), {
          status: 409,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }

    const userData = {
      email,
      name,
      role,
      badgeNumber,
      phone,
      isActive: true,
      preferences: {}
    };

    const user = await KVStore.create<User>("users", userData);

    return new Response(JSON.stringify(user), {
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

// Update user
router.put("/:id", async (req, params) => {
  try {
    const { id } = params!;
    const body = await req.json();

    const existingUser = await KVStore.get<User>("users", id);
    if (!existingUser) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Check email uniqueness if being updated
    if (body.email && body.email !== existingUser.email) {
      const emailUsers = await KVStore.findByField<User>("users", "email", body.email);
      if (emailUsers.length > 0) {
        return new Response(JSON.stringify({ error: "Email already exists" }), {
          status: 409,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }

    // Check badge number uniqueness if being updated
    if (body.badgeNumber && body.badgeNumber !== existingUser.badgeNumber) {
      const badgeUsers = await KVStore.findByField<User>("users", "badgeNumber", body.badgeNumber);
      if (badgeUsers.length > 0) {
        return new Response(JSON.stringify({ error: "Badge number already exists" }), {
          status: 409,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }

    const updatedUser = await KVStore.update<User>("users", id, body);

    return new Response(JSON.stringify(updatedUser), {
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

// Delete user
router.delete("/:id", async (req, params) => {
  try {
    const { id } = params!;

    const existingUser = await KVStore.get<User>("users", id);
    if (!existingUser) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    await KVStore.delete("users", id);

    return new Response(JSON.stringify({ message: "User deleted successfully" }), {
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

// Get user by email
router.get("/email/:email", async (req, params) => {
  try {
    const { email } = params!;
    const users = await KVStore.findByField<User>("users", "email", email);

    if (users.length === 0) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify(users[0]), {
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

// Get user by badge number
router.get("/badge/:badgeNumber", async (req, params) => {
  try {
    const { badgeNumber } = params!;
    const users = await KVStore.findByField<User>("users", "badgeNumber", badgeNumber);

    if (users.length === 0) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify(users[0]), {
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

// Update user preferences
router.patch("/:id/preferences", async (req, params) => {
  try {
    const { id } = params!;
    const body = await req.json();

    const existingUser = await KVStore.get<User>("users", id);
    if (!existingUser) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const updatedPreferences = {
      ...existingUser.preferences,
      ...body
    };

    const updatedUser = await KVStore.update<User>("users", id, {
      preferences: updatedPreferences
    });

    return new Response(JSON.stringify(updatedUser), {
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

// Toggle user active status
router.patch("/:id/toggle-active", async (req, params) => {
  try {
    const { id } = params!;

    const existingUser = await KVStore.get<User>("users", id);
    if (!existingUser) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const updatedUser = await KVStore.update<User>("users", id, {
      isActive: !existingUser.isActive
    });

    return new Response(JSON.stringify(updatedUser), {
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

export { router as userRoutes };
