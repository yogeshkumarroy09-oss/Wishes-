import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const dir = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json({ limit: "20kb" }));
app.use(express.static(path.join(dir, "public")));

app.post("/api/wish", async (req, res) => {
  try {
    const { fromName, message } = req.body || {};

    if (!fromName?.trim() || !message?.trim()) {
      return res.status(400).json({
        ok: false,
        error: "Name and wish are required"
      });
    }

    let config;

    try {
      config = JSON.parse(process.env.EMAIL_CONFIG || "{}");
    } catch {
      return res.status(500).json({
        ok: false,
        error: "Invalid EMAIL_CONFIG"
      });
    }

    const {
      publicKey,
      privateKey,
      serviceId,
      templateId,
      recipientEmail
    } = config;

    if (
      !publicKey ||
      !privateKey ||
      !serviceId ||
      !templateId ||
      !recipientEmail
    ) {
      return res.status(500).json({
        ok: false,
        error: "EmailJS is not configured"
      });
    }

    const response = await fetch(
      "https://api.emailjs.com/api/v1.0/email/send",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          accessToken: privateKey,
          template_params: {
            to_email: recipientEmail,
            from_name: fromName.trim(),
            message: message.trim(),
            birthday_person: "Yogesh",
            submitted_at: new Date().toISOString()
          }
        })
      }
    );

    if(!r.ok) {
  const errorText = await r.text();
  console.error("EMAILJS ERROR:", r.status, errorText);
  return res.status(502).json({
    ok:false,
    error:"EmailJS: " + errorText
  });
    }
  return res.json({ ok: true });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      ok: false,
      error: "Server error"
    });
  }
});

app.listen(port, () => {
  console.log(`Birthday site running on port ${port}`);
});
