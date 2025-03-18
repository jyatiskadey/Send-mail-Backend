const mongoose = require("mongoose");

const MailSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  subject: { type: String, required: true },
  content: { type: String, required: true },
  time: { type: Date, default: Date.now },
  folder: { type: String, enum: ["inbox", "sent", "drafts", "trash"], default: "inbox" }
});

const Mail = mongoose.model("Mail", MailSchema);

module.exports = Mail;
