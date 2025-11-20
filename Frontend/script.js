// When user clicks "Analyze pdf btn"

document.getElementById('uploadBtn').addEventListener('click',async()=>{
    const fileInpt = document.getElementById('pdfFile')
    const resultBox = document.getElementById('resultBox')

    // now check if user uploaded a pdf or not

    if(!fileInpt.files.length){
        resultBox.textContent = " ❗Upload a PDF first."
        return
    }

     //FormData object to send file to backend
    const formData = new FormData()
    formData.append('pdf', fileInpt.files[0])

    // Showing loading text while backend processes the document
    resultBox.textContent = "⏳ Processing... Please wait.";

    try {
        // Sending POST request to backend server
        const res = await fetch("http://localhost:5000/upload", {
            method: "POST",
            body: formData,
        })

        // Extracting JSON response
        const data = await res.json();

        // Displaying nicely formatted result
        // this is showing raw Json string
        // resultBox.textContent = JSON.stringify(data, null, 2);

        if(data.success){
             resultBox.innerHTML = `
                <p>✅ <strong>Keyword Found:</strong> ${data.containsKeyword}</p>
                <p>📄 <strong>Preview:</strong> ${data.previewText}</p>
            `
        } else {
            resultBox.textContent = "❌ Error: " + (data.error || "Unknown error");
        
        }

    } catch (err) {
        // Showing error if request fails
        resultBox.textContent = "❌ Error: " + err.message;
    }
})