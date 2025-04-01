import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import axios from "axios";

import dotenv from "dotenv";

dotenv.config({
	path: "./.env",
});

const API_URL = process.env.AI_API_URL;

const getResponse = asyncHandler(async (req, res) => {
	const { question } = req.body;
	if (!question) {
		throw new ApiError(400, "Question is required");
	}

	const requestData = {
		contents: [
			{
				role: "user",
				parts: [
					{
						text: "About"+ question,
					},
				],
			},
		],
	};

	const response = await axios.post(API_URL, requestData, {
		headers: { "Content-Type": "application/json" },
	});

	const aiResponse =
		response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
	if (!aiResponse) throw new ApiError(403, "Got no response from server");

	return res
		.status(200)
		.json(new ApiResponse(200, aiResponse, "Got Response"));
});

const generateQuestion = asyncHandler(async (req, res) => {
	const { topics } = req.body;
	if (!topics || !Array.isArray(topics) || topics.length === 0) {
		throw new ApiError(404, "Missing or empty details");
	}

	const questionPromises = topics.map(async (topic) => {
		const prompt = `
		Generate a set of **exactly 5 to 10 multiple-choice questions** (MCQs) on the topic "${topic}".  
		Ensure each question follows this **strict JSON format**:

		[
			{
				"question": "What is AI?",
				"options": {
				"A": "Artificial Intelligence",
				"B": "Automated Input",
				"C": "Advanced Interaction",
				"D": "Analytical Insight"
				},
			"correct": "A
			},
			...
		]

		**Rules:**
		- Each question must have exactly 4 options labeled "A", "B", "C", and "D".
		- Provide only valid JSON. Do not include any explanations or extra text.
		`;

		const requestData = {
			contents: [{ role: "user", parts: [{ text: prompt }] }],
		};

		try {
			const response = await axios.post(API_URL, requestData, {
				headers: { "Content-Type": "application/json" },
			});

			const aiGeneratedText =
				response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
			// console.log(`🔹 AI Response for "${topic}":`, aiGeneratedText);

			if (!aiGeneratedText)
				throw new Error(`Invalid AI response for "${topic}"`);

			// ✅ Extract and parse JSON safely
			const jsonMatch = aiGeneratedText.match(/\[[\s\S]*\]/);
			if (!jsonMatch)
				throw new Error(`Invalid JSON format received for "${topic}"`);

			let questions;
			try {
				questions = JSON.parse(jsonMatch[0]);
				if (!Array.isArray(questions))
					throw new Error("AI did not return an array.");
			} catch (parseError) {
				throw new Error(
					`Failed to parse JSON for "${topic}": ${parseError.message}`
				);
			}

			// ✅ Ensure AI returns between 5 and 10 questions
			if (questions.length < 5) {
				throw new Error(
					`AI returned only ${questions.length} questions, expected at least 5.`
				);
			}

			return { topic, questions: questions.slice(0, 10) };
		} catch (error) {
			console.error(
				`❌ Error generating questions for "${topic}":`,
				error.message
			);
			return { topic, error: error.message };
		}
	});

	const results = await Promise.all(questionPromises);
	const successfulTopics = results.filter((r) => !r.error);
	const failedTopics = results.filter((r) => r.error);

	if (successfulTopics.length === 0) {
		throw new ApiError(500, "Failed to generate Question for all topics");
	}

	return res.status(200).json({ topics: successfulTopics, failedTopics });
});

export default {
	getResponse,
	generateQuestion,
};
