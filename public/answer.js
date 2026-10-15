const pageLoadedAt = new Date();

const form = document.getElementById("surveyForm");
const message = document.getElementById("message");

form.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();

        const submittedAt = new Date();

        const name =
            document.getElementById("name").value;

        const feedback =
            document.getElementById("feedback").value;

        console.log("Load : " + pageLoadedAt + ", Send : " + submittedAt);
        document.getElementById("Load").innerHTML = pageLoadedAt;
        document.getElementById("Send").innerHTML = submittedAt;
        document.getElementById("Take").innerHTML = (submittedAt - pageLoadedAt) / 1000;

        try {

            const response = await fetch(
                "../submit",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body: JSON.stringify({
                        name,
                        feedback
                    })
                    /*
                    body: JSON.stringify({
                        name,
                        feedback,
                        pageLoadedAt:
                            pageLoadedAt.toISOString(),
                        submittedAt:
                            submittedAt.toISOString()
                    })
                    */
                }
            );

            const data =
                await response.json();

            if (data.success) {

                message.textContent =
                    "送信しました。";

                form.reset();
            }
            else {

                message.textContent =
                    data.message;
            }

        }
        catch (error) {

            message.textContent =
                "通信エラーが発生しました。";
        }
    }
);
