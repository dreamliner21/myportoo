document.addEventListener("DOMContentLoaded", () => {
    const generateKeyBtn = document.getElementById("generateKeyBtn");
    const copyKeyBtn = document.getElementById("copyKeyBtn");
    const closePopupBtn = document.getElementById("closePopupBtn");
    const popup = document.getElementById("popup");
    const generatedKeyElem = document.getElementById("generatedKey");
    const submitKeyBtn = document.getElementById("submitKeyBtn");
    const keyInput = document.getElementById("keyInput");
    const downloadLink = document.getElementById("downloadLink");

    // Disable download link until key is validated
    downloadLink.style.display = "none";

    // Function to show popup
    const showPopup = () => {
        popup.classList.remove("hidden"); // Show the pop-up
        popup.style.animation = "fadeIn 0.3s ease"; // Optional animation
    };

    // Function to hide popup
    const hidePopup = () => {
        popup.style.animation = "fadeOut 0.3s ease"; // Optional fade-out animation
        setTimeout(() => {
            popup.classList.add("hidden"); // Hide after animation ends
        }, 300); // Match the duration of fadeOut
    };

    generateKeyBtn.addEventListener("click", () => {
        // Fetch generate key API
        fetch("/generate-key")
            .then(response => response.json())
            .then(data => {
                generatedKeyElem.textContent = data.key;
                showPopup(); // Show the pop-up
            })
            .catch(error => console.error("Error generating key:", error));
    });

    copyKeyBtn.addEventListener("click", () => {
        // Copy the generated key to clipboard
        const key = generatedKeyElem.textContent;
        navigator.clipboard.writeText(key).then(() => {
            alert("Key copied to clipboard");
        }).catch(err => console.error("Error copying key:", err));
    });

    closePopupBtn.addEventListener("click", () => {
        hidePopup(); // Hide the pop-up
    });

    submitKeyBtn.addEventListener("click", () => {
        const key = keyInput.value;

        // Validate the key
        fetch("/validate-key", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ key })
        })
            .then(response => response.json())
            .then(data => {
                if (data.message === "Key is valid") {
                    downloadLink.style.display = "block"; // Show download link if key is valid
                    alert("Key is valid. You can now download the CV.");
                } else {
                    alert("Invalid or already used key");
                }
            })
            .catch(error => console.error("Error validating key:", error));
    });
});
