const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const sgMail = require("@sendgrid/mail");

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.post("/send-emails", async (req, res) => {
  const { recipients } = req.body;

  const content = `
    <p>Hello Dear,</p>
    <p>I hope you are doing well.</p>
    <p>We are in urgent need of the subject mentioned product for an ongoing project.</p>
    <p>Please let us know if it is possible to provide us with a solution, kindly provide your company catalog so we can review.</p>
    <p>Thank you in advance and I look forward to receiving your prompt reply.</p>
    <p><b>Marc Steenhaut </b></p>
    <p><b>Procurement Manager</b></p>
    <div><img src="https://res.cloudinary.com/muyi-hira-app/image/upload/v1740568695/logs_z3xiyy.png" alt=""></div>
    <p><b>T:</b>[http://+17176783238]+1 717 678 3238</p>
    <p><b>E:</b> <a href="mailto:marc@rnerlinsourcing.com">marc@merlinsourcing.com</a></p>
    <p><b>W:</b> <a href="https://merlinsourcing.com/">merlinsourcing.com/</a></p>
  `;

  try {
    const emails = recipients.map((email) => ({
      to: email,
      from: "jintuwang@imexsuorcingservices.com", // Must be verified on SendGrid
      subject: "Urgent Procurement Request",
      text: "Please review our procurement request and get back to us.",
      html: content,
    }));

    await sgMail.send(emails);
    res.status(200).send({ message: "Emails sent successfully" });
  } catch (error) {
    console.error("Error sending emails:", error);
    res.status(500).send({ error: "Failed to send emails" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
