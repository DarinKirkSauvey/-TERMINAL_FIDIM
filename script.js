const messages = [
    ">> BOOTING...",
    ">> SIGNAL CONNECTED",
    ">> ACCESS CODE REQUIRED",
    ">> PLEASE ENTER ACCESS CODE"
];

const output = document.getElementById('output');
const input = document.getElementById('input');

let messageIndex = 0;

// Create an object to hold the codes and their respective actions (links or redirects)
const accessActions = {
    "/SPOTIFY": { type: 'link', value: "https://open.spotify.com/artist/7jQfqwxrxEsaPU2C9BiO9X?si=aJAuUgdRSUqD3lAkzS9z1g" },
    "/INSTAGRAM": { type: 'link', value: "https://www.instagram.com/darinkirksauvey/" },
    "/TIKTOK": { type: 'link', value: "https://www.tiktok.com/@darinkirksauvey" },
    "/TWITCH": { type: 'link', value: "https://www.twitch.tv/darinkirksauvey" },
    "/SOUNDCLOUD": { type: 'link', value: "https://soundcloud.com/darinkirksauvey/asitiwfse_041725" },
    "/TRASH": { type: 'redirect', value: "asitiwfse.html" } // Added TRASH code with redirect type and the HTML page
};

function typeMessage(message, callback) {
    let i = 0;
    const interval = setInterval(() => {
        if (i < message.length) {
            output.textContent += message[i++];
        } else {
            clearInterval(interval);
            callback();
        }
    }, 100);
}

function typeMessages() {
    if (messageIndex < messages.length) {
        typeMessage(messages[messageIndex], () => {
            output.textContent += '\n';
            messageIndex++;
            typeMessages();
        });
    } else {
        showInput();
    }
}

function showInput() {
    input.focus();
}

input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const codeEntered = input.value.trim().toUpperCase(); // Normalize input: uppercase and remove spaces
        const action = accessActions[codeEntered]; // Get the action for the entered code

        if (action) {
            output.textContent += '\n>> ACCESS GRANTED';

            if (action.type === 'link') {
                typeMessage(`\n>> `, () => {
                    const linkElement = document.createElement('a');
                    linkElement.href = action.value;
                    linkElement.textContent = 'ENTER';
                    linkElement.style.color = 'lime';
                    linkElement.style.textDecoration = 'underline';
                    linkElement.target = '_blank';
                    output.appendChild(linkElement);
                });
            } else if (action.type === 'redirect') {
                // Redirect to the specified HTML page
                window.location.href = action.value;
            }

        } else {
            output.textContent += '\n>> INCORRECT VALUE';
            output.textContent += '\n>> PLEASE ENTER ACCESS CODE';
        }
        input.value = ''; // Clear input
    }
});

typeMessages();