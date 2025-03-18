const express = require("express");
const router = express.Router();
const { sendMail, getMails, moveToTrash, deleteMail } = require("../controllers/mailController");
const { authenticateUser } = require("../middleware/authMiddleware");

// ✅ Send Mail (Protected Route)
router.post("/send",authenticateUser,  sendMail);

// ✅ Get Mails (Inbox, Sent, Trash) (Protected Route)
router.get("/",authenticateUser,  getMails);

// ✅ Move Mail to Trash (Protected Route)
router.put("/trash/:mailId",authenticateUser,  moveToTrash);

// ✅ Delete Mail Permanently (Protected Route)
router.delete("/:mailId",authenticateUser,  deleteMail);

module.exports = router;
