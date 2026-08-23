let response;

try {
  response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
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
  });

  if (!response.ok) {
    const errorText = await response.text();

    console.error("EMAILJS ERROR:", response.status, errorText);

    return res.status(502).json({
      ok: false,
      error: "EmailJS: " + errorText
    });
  }

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
