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
      <p>
        We are in urgent need of the subject mentioned product for an ongoing
        project.
      </p>
      <p>
        Please let us know if it is possible to provide us with a solution,
        kindly provide your company catalog so we can review.
      </p>
      <p>
        Thank you in advance and I look forward to receiving your prompt reply.
      </p>
      <p><b>Jintu Wang</b></p>
      <hr />
      <div style="display: grid; grid-template-columns: 10% 1fr">
        <div>
          <img
            src="https://res.cloudinary.com/muyi-hira-app/image/upload/v1753928772/IMEX-Sourcing-Logo-darkmaroon-300x143-300x143_fi2hj7.png"
            alt="IMEX Sourcing Services"
            style="width: 100%"
          />
        </div>
        <div style="border-left: 1px solid black; padding-left: 10px;">
          <p><b>Jintu Wang</b></p>
          <p><b>Project Manager/Project Contracting Department II</b></p>
          <p style="text-decoration: underline">IMEX LIAISONS GROUP</p>
          <p>Room 2812B, R & F Yingtong Building No. 30 Huaxia Road,</p>
          <p>Tianhe District,</p>
          <p>Guangzhou, Guangdong, China 510623</p>
          <p>FAX: (86571)8517 2055</p>
          <p>TEX: (86571)8781 9801</p>
          <p>MOBILE: +86 18829858559</p>
          <p>
            Email:
            <a href="mailto:jintuwang@imexsuorcingservices.com"
              >jintuwang@imexsourcingservices.com</a
            >
          </p>
          <p>
            <a href="https://imexsourcingservices.com"
              >https://imexsourcingservices.com</a
            >
          </p>
        </div>
      </div>
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
