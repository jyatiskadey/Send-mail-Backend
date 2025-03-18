const express = require("express");
const { signUp, signIn, getAllUserNames } = require("../controllers/authController");
const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.get("/getAllUserName", getAllUserNames);

module.exports = router;
