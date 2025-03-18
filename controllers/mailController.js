const Mail = require("../models/Mail");
const User = require("../models/User");

exports.sendMail = async (req, res) => {
    try {
      console.log("Received Token:", req.header("Authorization")); // ✅ Log the token
      console.log("Decoded User:", req.user); // ✅ Log req.user
  
      const { recipient, subject, content } = req.body;
      const senderId = req.user?.id; // Extract sender ID
  
      if (!senderId) {
        return res.status(401).json({ message: "Unauthorized: No sender ID found" });
      }
  
      // Check if recipient exists
      const recipientUser = await User.findById(recipient);
      if (!recipientUser) {
        return res.status(404).json({ message: "Recipient not found" });
      }
  
      // Create new mail document
      const newMail = new Mail({
        sender: senderId,
        recipient,
        subject,
        content,
        folder: "sent",
      });
  
      await newMail.save();
  
      res.status(201).json({ message: "Mail sent successfully", mail: newMail });
    } catch (error) {
      console.error("Error in sendMail:", error); // ✅ Log full error
      res.status(500).json({ message: "Server error", error: error.message || error });
    }
  };
  
  
  

// ✅ Get Mails for a User (Inbox, Sent, Trash, etc.)
exports.getMails = async (req, res) => {
    try {
      const userId = req.user.id;
  
      // Fetch all mails where the user is either sender or recipient
      const mails = await Mail.find({
        $or: [{ sender: userId }, { recipient: userId }],
      })
        .populate("sender", "name email")
        .populate("recipient", "name email");
  
      res.json(mails);
    } catch (error) {
      console.error("Error fetching mails:", error); // ✅ Debugging log
      res.status(500).json({ message: "Server error", error });
    }
  };
  

// ✅ Move Mail to Trash
exports.moveToTrash = async (req, res) => {
  try {
    const { mailId } = req.params;
    const mail = await Mail.findById(mailId);

    if (!mail) {
      return res.status(404).json({ message: "Mail not found" });
    }

    mail.folder = "trash";
    await mail.save();

    res.json({ message: "Mail moved to trash" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Delete Mail Permanently
exports.deleteMail = async (req, res) => {
  try {
    const { mailId } = req.params;
    await Mail.findByIdAndDelete(mailId);
    res.json({ message: "Mail deleted permanently" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
