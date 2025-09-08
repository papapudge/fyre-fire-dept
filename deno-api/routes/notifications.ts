import { createRouter } from "../utils/router.ts";
import { KVStore, Notification } from "../utils/kv.ts";
import { corsHeaders } from "../utils/cors.ts";

const router = createRouter();

// Get notifications for user
router.get("/", async (req) => {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    const isRead = url.searchParams.get("isRead");
    const type = url.searchParams.get("type");

    if (!userId) {
      return new Response(JSON.stringify({ error: "User ID is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    let notifications = await KVStore.findByField<Notification>("notifications", "userId", userId);

    if (isRead !== null) {
      const readFilter = isRead === "true";
      notifications = notifications.filter(notification => notification.isRead === readFilter);
    }

    if (type) {
      notifications = notifications.filter(notification => notification.type === type);
    }

    // Sort by createdAt descending (most recent first)
    notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return new Response(JSON.stringify(notifications), {
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

// Get notification by ID
router.get("/:id", async (req, params) => {
  try {
    const { id } = params!;
    const notification = await KVStore.get<Notification>("notifications", id);

    if (!notification) {
      return new Response(JSON.stringify({ error: "Notification not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify(notification), {
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

// Create notification
router.post("/", async (req) => {
  try {
    const body = await req.json();
    const { userId, type, title, message, data, priority = "NORMAL" } = body;

    if (!userId || !type || !title || !message) {
      return new Response(JSON.stringify({ 
        error: "User ID, type, title, and message are required" 
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const notificationData = {
      userId,
      type,
      title,
      message,
      data,
      isRead: false,
      priority
    };

    const notification = await KVStore.create<Notification>("notifications", notificationData);

    return new Response(JSON.stringify(notification), {
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

// Mark notification as read
router.patch("/:id/read", async (req, params) => {
  try {
    const { id } = params!;

    const existingNotification = await KVStore.get<Notification>("notifications", id);
    if (!existingNotification) {
      return new Response(JSON.stringify({ error: "Notification not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const updatedNotification = await KVStore.update<Notification>("notifications", id, {
      isRead: true
    });

    return new Response(JSON.stringify(updatedNotification), {
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

// Mark all notifications as read for user
router.patch("/mark-all-read", async (req) => {
  try {
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return new Response(JSON.stringify({ error: "User ID is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const notifications = await KVStore.findByField<Notification>("notifications", "userId", userId);
    const unreadNotifications = notifications.filter(n => !n.isRead);

    // Update all unread notifications
    for (const notification of unreadNotifications) {
      await KVStore.update<Notification>("notifications", notification.id, {
        isRead: true
      });
    }

    return new Response(JSON.stringify({ 
      message: `Marked ${unreadNotifications.length} notifications as read` 
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

// Delete notification
router.delete("/:id", async (req, params) => {
  try {
    const { id } = params!;

    const existingNotification = await KVStore.get<Notification>("notifications", id);
    if (!existingNotification) {
      return new Response(JSON.stringify({ error: "Notification not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    await KVStore.delete("notifications", id);

    return new Response(JSON.stringify({ message: "Notification deleted successfully" }), {
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

export { router as notificationRoutes };
