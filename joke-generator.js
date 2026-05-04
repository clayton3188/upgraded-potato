let currentJoke = '';

// Initialize by loading a joke on page load
document.addEventListener('DOMContentLoaded', () => {
    getJoke();
});

async function getJoke() {
    const jokeType = document.querySelector('input[name="type"]:checked').value;
    const loading = document.getElementById('loading');
    const jokeContent = document.getElementById('jokeContent');
    const errorBox = document.getElementById('errorBox');

    // Show loading state
    loading.classList.add('active');
    jokeContent.classList.remove('active');
    errorBox.classList.remove('active');

    try {
        // Build the API URL based on selected joke type
        let url = 'https://v2.jokeapi.dev/joke/';
        
        if (jokeType === 'any') {
            url += 'Any';
        } else if (jokeType === 'general') {
            url += 'General';
        } else if (jokeType === 'programming') {
            url += 'Programming';
        } else if (jokeType === 'knock-knock') {
            url += 'Knock-Knock';
        }

        // Add format parameter to get safe jokes
        url += '?format=json&safe-mode';

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to fetch joke');
        }

        const data = await response.json();

        // Check if the API returned an error
        if (data.error) {
            throw new Error(data.message || 'Unable to get joke');
        }

        // Format the joke based on its type
        if (data.type === 'single') {
            currentJoke = data.joke;
        } else if (data.type === 'twopart') {
            currentJoke = `${data.setup}\n\n${data.delivery}`;
        }

        // Display the joke
        jokeContent.innerHTML = `<p>${currentJoke.replace(/\n/g, '<br>')}</p>`;
        jokeContent.classList.add('active');

    } catch (error) {
        console.error('Error fetching joke:', error);
        errorBox.textContent = `Error: ${error.message}. Please try again!`;
        errorBox.classList.add('active');
        currentJoke = '';
    } finally {
        // Hide loading state
        loading.classList.remove('active');
    }
}

function shareJoke() {
    if (!currentJoke) {
        alert('Please load a joke first!');
        return;
    }

    // Copy to clipboard
    navigator.clipboard.writeText(currentJoke).then(() => {
        alert('Joke copied to clipboard! 📋');
    }).catch(() => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = currentJoke;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('Joke copied to clipboard! 📋');
    });
}

// Add Enter key support for getting jokes
document.addEventListener('keypress', (event) => {
    if (event.key === 'Enter' && event.ctrlKey) {
        getJoke();
    }
});
