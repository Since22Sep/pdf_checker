document.getElementById('uploadBtn').addEventListener('click', async () => {
    const fileInput = document.getElementById('pdfFile');
    const rule1 = document.getElementById('rule1').value;
    const rule2 = document.getElementById('rule2').value;
    const rule3 = document.getElementById('rule3').value;
    const resultBody = document.getElementById('resultBody');

    if (!fileInput.files.length) {
        resultBody.innerHTML = `<tr><td colspan="5">❗ Upload a PDF first.</td></tr>`
        return;
    }

    // this checkpoint was also important

     if (!rule1 || !rule2 || !rule3) {
        resultBody.innerHTML = `<tr><td colspan="5">❗ Enter all 3 rules.</td></tr>`;
        return;
    }

     resultBody.innerHTML = `<tr><td colspan="5">⏳ Processing... This may take a few seconds.</td></tr>`

       const rules = [rule1, rule2, rule3];

    const formData = new FormData();
    formData.append('pdf', fileInput.files[0]);
    formData.append('rules', JSON.stringify(rules));

    try {
        const res = await fetch("http://127.0.0.1:5000/upload", {
            method: "POST",
            body: formData
        });

        const data = await res.json();

        if (data.success) {
            resultBody.innerHTML = '';
          data.results.forEach(r => {
            resultBody.innerHTML += `
                <tr>
                    <td>${r.rule}</td>
                    <td>${r.status.toUpperCase()}</td>
                    <td>${r.evidence}</td>
                    <td>${r.reasoning}</td>
                    <td>${r.confidence}</td>
                </tr>
            `;
        });
        }
    } catch (err) {
        resultBody.textContent = "❌ Error: " + err.message;
    }
});
