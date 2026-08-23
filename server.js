import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 10000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json({ limit: "20kb" }));

// Frontend files
app.use(express.static(path.join(__dirname, "public")));

// ===============================
// SEND WISH
// ===============================
app.post("/api/wish", async (req, res) => {
  try {
    const { fromName, message } = req.body || {};

    if (!fromName?.trim() || !message?.trim()) {
      return res.status(400).json({
        ok: false,
        error: "Name and wish are required"
      });
    }

    // Read EmailJS configuration
    let config;

    try {
      config = JSON.parse(process.env.EMAIL_CONFIG || "{}");
    } catch (error) {
      console.error("EMAIL_CONFIG JSON ERROR:", error);

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

    // Check configuration
    if (
      !publicKey ||
      !privateKey ||
      !serviceId ||
      !templateId ||
      !recipientEmail
    ) {
      console.error("EmailJS configuration is incomplete");

      return res.status(500).json({
        ok: false,
        error: "EmailJS is not configured"
      });
    }

    // Send email through EmailJS
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

    // EmailJS returned an error
    if (!response.ok) {
      const errorText = await response.text();

      console.error(
        "EMAILJS ERROR:",
        response.status,
        errorText
      );

      return res.status(502).json({
        ok: false,
        error: "EmailJS: " + errorText
      });
    }

    // Success
    console.log(
      `Wish received from ${fromName.trim()}`
    );

    return res.json({
      ok: true
    });

  } catch (error) {
    console.error("EMAIL SEND ERROR:", error);

    return res.status(500).json({
      ok: false,
      error: "Server error"
    });
  }
});

// ===============================
// START SERVER
// ===============================
app.listen(PORT, () => {
  console.log(
    `Birthday site running on port ${PORT}`
  );
});
