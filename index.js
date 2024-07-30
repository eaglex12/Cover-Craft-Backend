const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Initialize the Generative AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GEM);

// Enable CORS for the frontend
app.use(
	cors({
		origin: "http://localhost:3001", // Allow requests from this origin
	})
);

// Parse JSON body and handle large payloads
app.use(express.json({ limit: "10mb" }));

app.post("/parse-cover-letter", async (req, res) => {
	try {
		const { file, name, company, role } = req.body;

		if (!file || !name || !company || !role) {
			return res.status(400).json({ error: "Missing required fields" });
		}

		// Create a prompt for the Generative AI
		const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
		let config = {
			temperature: 2,
			topP: 0.95,
			topK: 64,
			maxOutputTokens: 1024,
			responseMimeType: "text/plain",
		};

		const prompt = `
Please read the following cover letter and then replace the details with the provided information:

Cover Letter:
\n\n${file}\n\n

Replace the applicant's name with: ${name}
Replace the company name with: ${company}
Replace the role with: ${role}

The result should have these details integrated into the cover letter as per the context.
`;

		const result = await model.generateContent(prompt, config);

		const candidates = result.response.candidates;
		if (candidates.length > 0) {
			let text = candidates[0].content.parts[0].text.trim();
			// Remove any remaining stars or unwanted formatting
			text = text.replace(/\*\*/g, "");

			return res.json({ text });
		} else {
			return res.status(500).json({ error: "No candidates found in response" });
		}
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Failed to parse cover letter" });
	}
});

app.post("/generate-better-cover-letter", async (req, res) => {
	try {
		const { file, name, company, role } = req.body;

		// Validate input
		if (!file || !name || !company || !role) {
			return res
				.status(400)
				.json({
					error: "Missing required fields: file, name, company, or role.",
				});
		}

		// Create a prompt for the Generative AI
		const prompt = `
You are a professional cover letter writer. Given the following details:

**Current Cover Letter:**
\n${file}\n

**Update with the following information:**
- **Name:** ${name}
- **Company:** ${company}
- **Role:** ${role}

Generate a more compelling and personalized cover letter. The updated cover letter should clearly highlight the candidate's relevant experience, achievements, and enthusiasm for the role and company. Ensure that the cover letter is well-structured, professional, and tailored to the specified job and company. Do not include square brackets in the final output; replace them with the provided information.

**Output Format:**
- Introduction that addresses the hiring manager.
- Description of relevant experience and achievements.
- Connection to the company’s values or mission.
- Conclusion with a call to action for further discussion.
`;

		const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
		let config = {
			temperature: 1.2, // Adjusted for better coherence and relevance
			topP: 0.9,
			topK: 50,
			maxOutputTokens: 1500, // Increased token limit for more detailed output
			responseMimeType: "text/plain",
		};

		// Generate content
		const result = await model.generateContent(prompt, config);

		// Process response
		const candidates = result.response.candidates;
		if (candidates.length > 0) {
			let text = candidates[0].content.parts[0].text.trim();

			// Optionally, validate the generated text
			if (text) {
				// Remove any remaining square brackets and ensure formatting
				text = text
					.replace(/\[updated name\]/gi, name)
					.replace(/\[updated company\]/gi, company)
					.replace(/\[updated role\]/gi, role);

				return res.json({ text });
			} else {
				return res.status(500).json({ error: "Generated text is empty." });
			}
		} else {
			return res
				.status(500)
				.json({ error: "No valid content candidates found in the response." });
		}
	} catch (error) {
		console.error("Error generating cover letter:", error.message);
		return res
			.status(500)
			.json({
				error:
					"Failed to generate better cover letter. Please try again later.",
			});
	}
});

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
