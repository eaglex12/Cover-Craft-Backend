import express from "express"; // Import express using ES Modules syntax
import {
	parseCoverLetter,
	generateBetterCoverLetter,
	CoverLetterRequest,
} from "../controller/coverLetterController";

const router = express.Router();

// Type definitions for request and response objects
interface ParseCoverLetterRequest {
	body: CoverLetterRequest;
}

interface ParseCoverLetterResponse {
	text?: string;
	error?: string;
}

interface GenerateBetterCoverLetterRequest extends ParseCoverLetterRequest {} // Reuse the same request structure

interface GenerateBetterCoverLetterResponse extends ParseCoverLetterResponse {} // Reuse the same response structure

// Define routes with type annotations
router.post<ParseCoverLetterRequest, ParseCoverLetterResponse>(
	"/parse-cover-letter",
	parseCoverLetter
);
router.post<GenerateBetterCoverLetterRequest, GenerateBetterCoverLetterResponse>(
	"/generate-better-cover-letter",
	generateBetterCoverLetter
);

export default router; // Use "export default" for the router object
