export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { event_name, event_source_url, event_id } = req.body;

    const pixelId = process.env.META_PIXEL_ID;
    const accessToken = process.env.META_ACCESS_TOKEN;

    const clientIp =
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress ||
      "";

    const userAgent = req.headers["user-agent"];

    const payload = {
      data: [
        {
          event_name: event_name || "Subscribe",
          event_time: Math.floor(Date.now() / 1000),
          event_id: event_id,
          action_source: "website",
          event_source_url: event_source_url,
          user_data: {
            client_ip_address: clientIp,
            client_user_agent: userAgent
          }
        }
      ]
    };

    const response = await fetch(
      https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${accessToken},
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }
    );

    const result = await response.json();

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}
