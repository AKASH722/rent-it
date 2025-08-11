import { SendSmtpEmail, TransactionalEmailsApi } from "@getbrevo/brevo";

const apiInstance = new TransactionalEmailsApi();

apiInstance.setApiKey(0, process.env.BREVO_API_KEY);

console.log(process.env.BREVO_API_KEY);

/**
 * Sends an email using the Brevo transactional email API.
 *
 * @param {Object} payload - The payload for sending the email.
 * @param {number | null} payload.templateId - The ID of the email template to use.
 * @param {Object.<string, string|number>} payload.params - An object containing key-value pairs for the email template parameters.
 * @param {Array.<{email: string, name?: string}>} payload.recipients - An array of recipient objects, each containing an email and an optional name.
 * @param {string[]} payload.tags - An array of tags to categorize the email.
 * @param {string | null} payload.subject - The subject line of the email. If null, the template's default subject will be used.
 * @param {Array.<{to: Array.<{name: string, email: string}>, params: Object.<string, string|number>}>} [payload.messageVersions] - Optional. An array of message versions for different recipients, allowing customization per recipient.
 * @param {string} [payload.html] - Optional. The HTML content of the email. Overrides the template content if provided.
 * @returns {Promise<boolean>} - Resolves to `true` if the email was sent successfully, otherwise `false`.
 */
export const sendEmail = async ({
  templateId,
  params,
  recipients,
  tags,
  subject,
  messageVersions,
  html,
}) => {
  const sendSmtpEmail = new SendSmtpEmail();

  if (templateId) sendSmtpEmail.templateId = templateId;
  if (recipients) sendSmtpEmail.to = recipients;
  if (params) sendSmtpEmail.params = params;
  if (tags) sendSmtpEmail.tags = tags;
  if (subject) sendSmtpEmail.subject = subject;
  if (messageVersions) sendSmtpEmail.messageVersions = messageVersions;
  if (html) {
    sendSmtpEmail.sender = {
      name: "RENT IT",
      email: "dev.akashrai@gmail.com",
    };
    sendSmtpEmail.htmlContent = html;
  }

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    return true;
  } catch (err) {
    console.log(JSON.stringify(err, null, 2));
    return false;
  }
};
