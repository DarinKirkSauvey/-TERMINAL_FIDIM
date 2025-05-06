const messages = [
    ">> BOOTING...",
    ">> SIGNAL CONNECTED",
    ">> ACCESS CODE REQUIRED",
    ">> PLEASE ENTER ACCESS CODE"
];

const output = document.getElementById('output');
const input = document.getElementById('input');

let messageIndex = 0;

// Create an object to hold the codes and their respective links
const accessCodes = {
    "SPOTIFY": "https://open.spotify.com/artist/7jQfqwxrxEsaPU2C9BiO9X?si=aJAuUgdRSUqD3lAkjS9z1g",
    "INSTAGRAM": "https://www.instagram.com/darinkirksauvey/",
    "TIKTOK": "https://www.tiktok.com/@darinkirksauvey",
    "TWITCH": "https://www.twitch.tv/darinkirksauvey",
    "GRANTED": "https://soundcloud.com/darinkirksauvey/asitiwfse_041725"
    
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
        if (accessCodes[codeEntered]) {
            output.textContent += '\n>> ACCESS GRANTED';
            const link = accessCodes[codeEntered]; // Get the link for the correct access code
            typeMessage(`\n>> `, () => {
                const linkElement = document.createElement('a');
                linkElement.href = link;
                linkElement.textContent = 'ENTER'; // Change the text to 'link'
                linkElement.style.color = 'lime';
                linkElement.style.textDecoration = 'underline'; // Optional style change
                linkElement.target = '_blank'; // Open in a new tab
                output.appendChild(linkElement);
            });
        } else {
            output.textContent += '\n>> INCORRECT VALUE';
            output.textContent += '\n>> PLEASE ENTER ACCESS CODE';
        }
        input.value = ''; // Clear input
    }
});

typeMessages();

