const messages = [
    ">> BOOTING...",
    ">> PLEASE WAIT...",
    ">> SIGNAL CONNECTED",
    ">> ACCESS CODE REQUIRED",
    ">> PLEASE ENTER ACCESS CODE OR TYPE /INFO"
];

const output = document.getElementById('output');
const input = document.getElementById('input');

let messageIndex = 0;
let lastCommandWasShowdates = false; // Flag to track if the last successful command was showdates

// Create an object to hold the codes and their respective actions (links or redirects)
const accessActions = {
    "/SPOTIFY": { type: 'link', value: "https://open.spotify.com/artist/7jQfqwxrxEsaPU2C9BiO9X?si=aJAuUgdRSUqD3lAkzS9z1g" },
    "/INSTAGRAM": { type: 'link', value: "https://www.instagram.com/darinkirksauvey/" },
    "/TIKTOK": { type: 'link', value: "https://www.tiktok.com/@darinkirksauvey" },
    "/TWITCH": { type: 'link', value: "https://www.twitch.tv/darinkirksauvey" },
    "/SOUNDCLOUD": { type: 'link', value: "https://soundcloud.com/darinkirksauvey/asitiwfse_041725" },
    "/TRASH": { type: 'redirect', value: "asitiwfse.html" }, // Assuming the main page is index.html
    "/TOUR": { type: 'showdates', value: [
        { text: ">> UPCOMING TOUR DATES:" },
        { text: ">> 04/17/2025 - The Roxy - Los Angeles, CA", link: "https://example.com/tickets/roxy" },
        { text: ">> 05/01/2025 - The Fillmore - San Francisco, CA", link: "https://example.com/tickets/fillmore" },
        { text: ">> 06/10/2025 - House of Blues - Chicago, IL", link: "https://example.com/tickets/houseofblues" }
    ]},
    "/SHOWS": { type: 'showdates', value: [
        { text: ">> UPCOMING SHOW DATES:" },
        { text: ">> 04/17/2025 - The Roxy - Los Angeles, CA", link: "https://example.com/tickets/roxy" },
        { text: ">> 05/01/2025 - The Fillmore - San Francisco, CA", link: "https://example.com/tickets/fillmore" },
        { text: ">> 06/10/2025 - House of Blues - Chicago, IL", link: "https://example.com/tickets/houseofblues" }
    ]},
    "/INFO": { type: 'info', value: [ // Added the /INFO code with a new type and an array of info messages
        { text: ">> AVAILABLE COMMANDS:" },
        { text: ">> /SPOTIFY" },
        { text: ">> /INSTAGRAM" },
        { text: ">> /TIKTOK" },
        { text: ">> /TWITCH" },
        { text: ">> /SOUNDCLOUD" },
        { text: ">> /SHOWS" },
        { text: ">> /MORE - SEE ADDITIONAL DATES (After /SHOWS or /TOUR)" } // Updated info message
    ]},
    "/MORE": { type: 'showdates', value: [ // Added /MORE with more show dates
        { text: ">> ADDITIONAL DATES:" },
        { text: ">> 07/20/2025 - The Observatory - Santa Ana, CA", link: "https://example.com/tickets/observatory" },
        { text: ">> 08/05/2025 - Webster Hall - New York, NY", link: "https://example.com/tickets/websterhall" },
        { text: ">> 09/15/2025 - Fox Theater - Oakland, CA", link: "https://example.com/tickets/foxtheater" }
    ]}
};

const morePrompt = ">> TYPE /MORE TO SEE MORE DATES"; // Message to prompt for more dates
const incorrectValueMessage = ">> INCORRECT VALUE";
const enterCodePrompt = ">> PLEASE ENTER ACCESS CODE OR TYPE /INFO";
const moreNotAvailableMessage = ">> NOTHING MORE TO SHOW AT THIS TIME"; // New message for invalid /MORE usage

const typingSpeed = 75; // Reduced from 100ms to 75ms for slightly faster typing

function typeMessage(message, callback) {
    let i = 0;
    const interval = setInterval(() => {
        if (i < message.length) {
            output.textContent += message[i++];
        } else {
            clearInterval(interval);
            callback();
        }
    }, typingSpeed); // Use the typingSpeed variable
}

function typeMessages(messagesToType, callbackAfterAll) {
    let currentMessageIndex = 0;

    function typeNextMessage() {
        if (currentMessageIndex < messagesToType.length) {
            const messageData = messagesToType[currentMessageIndex];
            const textToType = messageData.text;
            const linkToUse = messageData.link;

            // Always type the text part
            typeMessage(textToType, () => {
                if (linkToUse) {
                    // Create and append the link after typing the text
                    const linkElement = document.createElement('a');
                    linkElement.href = linkToUse;
                    linkElement.textContent = ' [TICKETS]'; // Added text for the link
                    linkElement.style.color = 'cyan'; // Different color for ticket link
                    linkElement.style.textDecoration = 'underline';
                    linkElement.target = '_blank';
                    output.appendChild(linkElement);
                }

                output.textContent += '\n'; // Add a newline after the text (and potential link)
                currentMessageIndex++;
                typeNextMessage(); // Type the next message
            });
        } else {
            if (callbackAfterAll) {
                callbackAfterAll(); // Call the callback after all messages are typed
            }
        }
    }

    typeNextMessage(); // Start typing the first message
}

function showInput() {
    input.focus();
}

input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const codeEntered = input.value.trim().toUpperCase();
        const action = accessActions[codeEntered];

        // Reset the flag unless the current command is showdates
        if (action && action.type !== 'showdates') {
            lastCommandWasShowdates = false;
        }

        if (action) {
             // Special handling for /MORE if the last command wasn't showdates
            if (codeEntered === "/MORE" && !lastCommandWasShowdates) {
                 typeMessage(`\n${moreNotAvailableMessage}`, () => {
                     output.textContent += '\n';
                     typeMessage(enterCodePrompt, () => {
                         output.textContent += '\n';
                         showInput();
                     });
                 });
                 input.value = '';
                 return; // Stop further processing for invalid /MORE
            }

            // Add a newline before displaying output for successful actions (excluding the handled invalid /MORE)
            output.textContent += '\n';


            if (action.type === 'link') {
                typeMessage(`>> ACCESS GRANTED >> `, () => { // Combined messages for link action
                    const linkElement = document.createElement('a');
                    linkElement.href = action.value;
                    linkElement.textContent = 'ENTER';
                    linkElement.style.color = 'lime';
                    linkElement.style.textDecoration = 'underline';
                    linkElement.target = '_blank';
                    output.appendChild(linkElement);
                });
            } else if (action.type === 'redirect') {
                output.textContent += '>> ACCESS GRANTED'; // Display access granted immediately for redirect
                window.location.href = action.value;
            } else if (action.type === 'showdates') {
                // Set the flag if the command was showdates
                lastCommandWasShowdates = true;

                // Do not clear output for showdates
                typeMessage(`>> ACCESS GRANTED\n`, () => { // Type access granted and then the show dates
                    typeMessages(action.value, () => { // After typing show dates...
                         // Only show the more prompt if the command was /TOUR or /SHOWS
                        if (codeEntered === "/TOUR" || codeEntered === "/SHOWS") {
                             typeMessage(morePrompt, () => { // Type the more prompt
                                output.textContent += '\n'; // Add a newline after the prompt
                                showInput(); // Show the input again
                            });
                        } else if (codeEntered === "/MORE") {
                             showInput(); // Just show input after typing additional dates
                        } else {
                            showInput(); // Default to just showing input
                        }
                    });
                });
            } else if (action.type === 'info') {
                // Do not clear output for info
                typeMessage(`>> ACCESS GRANTED\n`, () => { // Type access granted and then the info
                    typeMessages(action.value, showInput); // Type out the info messages and then show the input again
                });
            }

        } else {
            // Handle incorrect value with typing effect
            typeMessage(`\n${incorrectValueMessage}`, () => {
                output.textContent += '\n'; // Add a newline after incorrect value message
                typeMessage(enterCodePrompt, () => {
                    output.textContent += '\n'; // Add a newline after the prompt
                    showInput(); // Show the input again
                });
            });
        }
        input.value = '';
    }
});

// Initial typing of the startup messages
typeMessages(messages.map(msg => ({ text: msg })), showInput); // Modified initial call