// Load environment variables
require('dotenv').config();

// Import required modules
const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const cors = require('cors');
const OpenAI = require("openai");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Multer memory storage
 const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// OpenAI client (v4)
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Health check
app.get('/', (req, res) => res.send('PDF LLM Checker Running'));

// Upload PDF and check rules
app.post('/upload', upload.single('pdf'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No PDF uploaded' });
        if (!req.body.rules) return res.status(400).json({ error: 'No rules provided' });

        const rules = JSON.parse(req.body.rules); // array of 3 rules

        // Safe PDF parsing
        let pdfText = "";
        try {
            const pdfData = await pdfParse(req.file.buffer);
            pdfText = pdfData.text;
        } catch  {
            return res.status(400).json({ 
                error: "Could not parse PDF. It might be corrupted or image-only." 
            });
        }

        const results = [];

        for (const rule of rules) {
            // Construct prompt for LLM
            const prompt = `
You are a document reviewer. Check the following PDF text against this rule:

Rule: "${rule}"

PDF Text: """${pdfText}"""

Respond in JSON format:
{
  "status": "pass/fail",
  "evidence": "one sentence supporting the answer",
  "reasoning": "short reasoning",
  "confidence": 0-100
}
`;

            // Call OpenAI API
            const completion = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: prompt }],
                temperature: 0
            });

            let llmResponse;
            try {
                llmResponse = JSON.parse(completion.choices[0].message.content);
            } catch (err) {
                llmResponse = {
                    status: "fail",
                    evidence: "",
                    reasoning: "Could not parse LLM response",
                    confidence: 0
                };
            }

            results.push({ rule, ...llmResponse});
        }

        res.json({ success: true, results });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
