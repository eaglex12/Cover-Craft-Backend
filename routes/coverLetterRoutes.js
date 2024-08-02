const express = require("express");
const {
	parseCoverLetter,
	generateBetterCoverLetter,
} = require("../controller/coverLetterController");

const router = express.Router();

router.post("/parse-cover-letter", parseCoverLetter);
router.post("/generate-better-cover-letter", generateBetterCoverLetter);

module.exports = router;
