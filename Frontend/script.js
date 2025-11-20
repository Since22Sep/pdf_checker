document.getElementById('uploadBtn').addEventListener('click', async () => {
    const fileInput = document.getElementById('pdfFile');
    const rule1 = document.getElementById('rule1').value;
    const rule2 = document.getElementById('rule2').value;
    const rule3 = document.getElementById('rule3').value;
    const resultBox = document.getElementById('resultBox');

    if (!fileInput.files.length) {
        resultBox.textContent = "❗ Upload a PDF first.";
        return;
    }

    const rules = [rule1, rule2, rule3];
    if (rules.some(r => !r.trim())) {
        resultBox.textContent = "❗ Enter all 3 rules.";
        return;
    }

    resultBox.textContent = "⏳ Processing... This may take a few seconds.";

    const formData = new FormData();
    formData.append('pdf', fileInput.files[0]);
    formData.append('rules', JSON.stringify(rules));

    try {
        const res = await fetch("http://localhost:5000/upload", {
            method: "POST",
            body: formData
        });

        const data = await res.json();

        if (data.success) {
            resultBox.innerHTML = '';
            data.results.forEach((r, idx) => {
                resultBox.innerHTML += `
                    <div class="rule-result">
                        <p><strong>Rule ${idx+1}:</strong> ${r.rule}</p>
                        <p>Status: <strong>${r.status.toUpperCase()}</strong></p>
                        <p>Evidence: ${r.evidence}</p>
                        <p>Reasoning: ${r.reasoning}</p>
                        <p>Confidence: ${r.confidence}</p>
                        <hr>
                    </div>
                `;
            });
        } else {
            resultBox.textContent = "❌ Error: " + (data.error || "Unknown error");
        }
    } catch (err) {
        resultBox.textContent = "❌ Error: " + err.message;
    }
});
