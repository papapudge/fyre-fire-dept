import { createRouter } from "../utils/router.ts";
import { KVStore, User } from "../utils/kv.ts";
import { corsHeaders } from "../utils/cors.ts";

const router = createRouter();

// Register user
router.post("/register", async (req) => {
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
      return new Response(JSON.stringify({ error: "User already exists" }), {
        status: 409,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
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

// Login user
router.post("/login", async (req) => {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Find user by email
    const users = await KVStore.findByField<User>("users", "email", email);
    if (users.length === 0) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const user = users[0];

    // Update last login
    await KVStore.update<User>("users", user.id, { 
      lastLogin: new Date().toISOString() 
    });

    // In a real app, you'd verify the password here
    // For now, we'll just return the user
    const { id, email: userEmail, name, role, badgeNumber, phone, isActive } = user;

    return new Response(JSON.stringify({
      user: { id, email: userEmail, name, role, badgeNumber, phone, isActive },
      token: `token_${id}_${Date.now()}` // Simple token for demo
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

// Verify token
router.post("/verify", async (req) => {
  try {
    const body = await req.json();
    const { token } = body;

    if (!token) {
      return new Response(JSON.stringify({ error: "Token is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Simple token validation (in real app, use JWT)
    const tokenParts = token.split('_');
    if (tokenParts.length !== 3 || tokenParts[0] !== 'token') {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const userId = tokenParts[1];
    const user = await KVStore.get<User>("users", userId);

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const { id, email, name, role, badgeNumber, phone, isActive } = user;

    return new Response(JSON.stringify({
      user: { id, email, name, role, badgeNumber, phone, isActive }
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

// Logout
router.post("/logout", async (req) => {
  try {
    // In a real app, you'd invalidate the token
    return new Response(JSON.stringify({ message: "Logged out successfully" }), {
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

// Change password
router.post("/change-password", async (req) => {
  try {
    const body = await req.json();
    const { userId, currentPassword, newPassword } = body;

    if (!userId || !newPassword) {
      return new Response(JSON.stringify({ error: "User ID and new password are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // In a real app, you'd verify the current password and hash the new one
    return new Response(JSON.stringify({ message: "Password changed successfully" }), {
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

// Reset password
router.post("/reset-password", async (req) => {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Find user by email
    const users = await KVStore.findByField<User>("users", "email", email);
    if (users.length === 0) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // In a real app, you'd send a password reset email
    return new Response(JSON.stringify({ message: "Password reset email sent" }), {
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

export { router as authRoutes };
