const sgMail = require("@sendgrid/mail");
const config = require("config");

async function sendEmail(data) {
  sgMail.setApiKey(config.get("sendgridApiKey"));
  const msg = {
    to: data.to, // Change to your recipient
    from: "development.gurug@gmail.com", // Change to your verified sender
    template_id: config.get("invitationTemplateId"),
    dynamic_template_data: data.variables,
  };
  await sgMail.send(msg);
  return true;
}

module.exports = {
  sendEmail,
};
