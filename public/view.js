async function loadAnswers() {

    try {

        const response =
            await fetch("/api/answers");

        const rows =
            await response.json();

        const tbody =
            document.querySelector(
                "#answerTable tbody"
            );

        tbody.innerHTML = "";

        for (const row of rows) {

            const tr =
                document.createElement("tr");
            const jst = new Date(row.created_at + "Z").toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
            tr.innerHTML = `
                <td>${row.id}</td>
                <td>${row.name}</td>
                <td>${row.feedback}</td>
                <td>${jst}</td>
            `;

            tbody.appendChild(tr);
        }
    }
    catch(error) {

        console.error(error);
    }
}

loadAnswers();