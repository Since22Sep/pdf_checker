// Import required modules

const express = require('express')
const multer = require('multer')
const pdfParse = require('pdf-parse')
const cors = require('cors')

const app = express()
const port = 5000

// then we enable cors for frontend requests

app.use(cors())

// for file uploads setup the multer

const storage = multer.memoryStorage();
const upload = multer({storage: storage})

// chckpoint 
app.get('/', (req, res)=>{
    res.send('PDF Checker Backend is running!');
})


// uploading pdf and checking the content
app.post('/upload', upload.single('pdf'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No PDF file uploaded' });
        }

        // Read PDF buffer
        const pdfData = await pdfParse(req.file.buffer);

        // Example: simple check for a keyword
        const keyword = "OpenAI"; 
        const containsKeyword = pdfData.text.includes(keyword);

        res.json({
            success: true,
            previewText: pdfData.text.substring(0, 200), // preview first 200 chars
            containsKeyword
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
})

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});