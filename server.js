require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const GRAPH_API_URL = "https://graph.microsoft.com/v1.0/me/sendMail";

// Function to get access token using refresh token
async function getAccessToken() {
  const { CLIENT_ID, CLIENT_SECRET, TENANT_ID, REFRESH_TOKEN } = process.env;

  try {
    const response = await axios.post(
      `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`,
      new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        refresh_token: REFRESH_TOKEN,
        grant_type: "refresh_token",
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    return response.data.access_token;
  } catch (error) {
    console.error(
      "Error getting access token:",
      error.response?.data || error.message
    );
    return null;
  }
}

// Function to send email
async function sendEmail(accessToken, recipient) {
  const emailData = {
    message: {
      subject: "Important Notification",
      body: {
        contentType: "HTML",
        content: `<p>Hello Dear,</p>
      <p>I hope you are doing well. </p>
      <p>We are in urgent need of the subject mentioned product for an ongoing project.</p>
      <p>Please let us know if it is possible to provide us with a solution, kindly provide your company catalog so we can review.</p>
      <p>Thank you in advance and I look forward to receiving your prompt reply.</p>
      <p><b>Marc Steenhaut </b></p>
      <p><b>Procurement Manager</b></p>
      <div><img src="https://res.cloudinary.com/muyi-hira-app/image/upload/v1740568695/logs_z3xiyy.png" alt=""></div>
      <p><b>T:</b>[http://+17176783238]+1 717 678 3238</p>
      <p><b>E:</b>  <a href="mailto:marc@rnerlinsourcing.com">marc@merlinsourcing.com</a></p>
      <p><b>W:</b> <a href="https://merlinsourcing.com/">merlinsourcing.com/</a></p>`,
      },
      toRecipients: [{ emailAddress: { address: recipient } }],
    },
  };

  try {
    await axios.post(GRAPH_API_URL, emailData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    return { email: recipient, status: "Sent" };
  } catch (error) {
    return {
      email: recipient,
      status: "Failed",
      error: error.response?.data || error.message,
    };
  }
}

// Route to send bulk emails
app.post("/send-bulk-email", async (req, res) => {
  const { emails } = req.body;

  if (!emails || !Array.isArray(emails)) {
    return res.status(400).json({ message: "Invalid email list" });
  }

  const accessToken = await getAccessToken();
  if (!accessToken)
    return res.status(500).json({ message: "Failed to get access token" });

  const results = [];
  for (const email of emails) {
    const result = await sendEmail(accessToken, email);
    results.push(result);
  }

  res.json({ message: "Bulk email process completed", results });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
