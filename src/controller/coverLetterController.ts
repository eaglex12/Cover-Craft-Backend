import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEM as string);

export interface CoverLetterRequest {
	file: string;
	name: string;
	company: string;
	role: string;
}

interface CoverLetterResponse {
	text: string;
}

export const parseCoverLetter = async (
	req: any,
	res: any
): Promise<void | CoverLetterResponse> => {
	try {
		const { file, name, company, role }: CoverLetterRequest = req.body; // Type casting for request body

		if (!file || !name || !company || !role) {
			return res.status(400).json({ error: "Missing required fields" });
		}

		const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

		const prompt = `
        Please read the following cover letter and then replace the details with the provided information:
  
        Cover Letter:
       
        ${file}
       
        Replace the applicant's name with: ${name}
        Replace the company name with: ${company}
        Replace the role with: ${role}
  
        The result should have these details integrated into the cover letter as per the context.
      `;

		const result = await model.generateContent([prompt]);

		const candidates = result.response.candidates;
		if (candidates && candidates.length > 0) {
			let text =
				candidates[0].content.parts[0].text &&
				candidates[0].content.parts[0].text.trim();
			text = text && text.replace(/\*\*/g, "");
			return res.json({ text });
		} else {
			return res.status(500).json({ error: "No candidates found in response" });
		}
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Failed to parse cover letter" });
	}
};

export const generateBetterCoverLetter = async (
	req: any,
	res: any
): Promise<void | CoverLetterResponse> => {
	try {
		const { file, name, company, role }: CoverLetterRequest = req.body;

		if (!file || !name || !company || !role) {
			return res.status(400).json({
				error: "Missing required fields: file, name, company, or role.",
			});
		}

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
		const result = await model.generateContent([prompt]);

		const candidates = result.response.candidates;
		if (candidates && candidates.length > 0) {
			let text =
				candidates[0].content.parts[0].text &&
				candidates[0].content.parts[0].text.trim();

			if (text) {
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
	} catch (error: any) {
		console.error("Error generating cover letter:", error.message);
		return res.status(500).json({
			error: "Failed to generate better cover letter. Please try again later.",
		});
	}
};
