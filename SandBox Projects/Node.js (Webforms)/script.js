const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.getElementById('btnText');
const statusMessage = document.getElementById('statusMessage');

form.addEventListener('submit', async (e) => {
    e.preventDefault(); 

    const formData = new FormData(form);

    submitBtn.disabled = true;
    btnText.textContent = "Sending...";
    statusMessage.className = "status-message";
    statusMessage.textContent = "";

    try {
        // Changed URL to point to YOUR local Node server
        const response = await fetch('http://localhost:3000/api/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: formData.get('name'),
                email: formData.get('email'),
                subject: formData.get('subject'),
                message: formData.get('message')
            })
        });

        const result = await response.json();

        if (result.success) {
            statusMessage.textContent = "Message sent successfully!";
            statusMessage.classList.add("success");
            form.reset(); 
        } else {
            throw new Error(result.message || "Something went wrong.");
        }

    } catch (error) {
        console.error("Error:", error);
        statusMessage.textContent = error.message || "Failed to send message. Please try again.";
        statusMessage.classList.add("error");
    } finally {
        submitBtn.disabled = false;
        btnText.textContent = "Send Message";
    }
});