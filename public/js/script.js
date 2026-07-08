document.addEventListener('DOMContentLoaded', () => {
    const copyBtn = document.getElementById('copyBtn');
    const outputBox = document.getElementById('output');

    if (copyBtn && outputBox) {
        copyBtn.addEventListener('click', async () => {
            // Get the text content, trimming any accidental leading/trailing whitespace
            const textToCopy = outputBox.innerText.trim();

            try {
                // Use the modern Clipboard API
                await navigator.clipboard.writeText(textToCopy);

                // Visual feedback: Change button state temporarily
                const originalText = copyBtn.innerHTML;
                copyBtn.innerHTML = '<i class="fas fa-check me-1"></i> Copied!';
                copyBtn.classList.remove('btn-outline-light');
                copyBtn.classList.add('btn-success');

                // Reset button back to normal after 2 seconds
                setTimeout(() => {
                    copyBtn.innerHTML = originalText;
                    copyBtn.classList.remove('btn-success');
                    copyBtn.classList.add('btn-outline-light');
                }, 2000);

            } catch (err) {
                console.error('Failed to copy text: ', err);
                alert('Oops, unable to copy text. Please try selecting and copying manually.');
            }
        });
    }


    const textInput = document.getElementById('textInput');
    const charCount = document.getElementById('count');

    if (textInput && charCount) {
        // Function to handle the counting
        const updateCount = () => {
            const currentLength = textInput.value.length;
            charCount.textContent = `${currentLength} / 5000`;

            // Optional: Give it a warning color if they get close to the limit (e.g., 4800+ characters)
            if (currentLength >= 4800) {
                charCount.style.color = '#ef4444'; // Slick modern red
            } else {
                charCount.style.color = '#94a3b8'; // Back to standard muted gray
            }
        };

        // Run on page load in case EJS pre-fills the textarea with originalText
        updateCount();

        // Run every time the user types, pastes, or deletes text
        textInput.addEventListener('input', updateCount);
    }
});







