const messages = [
    ">> BOOTING...",
    ">> PLEASE WAIT...",
    ">> SIGNAL CONNECTED",
    ">> ACCESS CODE REQUIRED",
    ">> PLEASE ENTER ACCESS CODE",
    ">> OR TYPE /INFO FOR MORE",
];

const output = document.getElementById('output');
const input = document.getElementById('input');

let messageIndex = 0;
let lastCommandWasShowdates = false; // Flag to track if the last successful command was showdates

// Create an object to hold the codes and their respective actions (links or redirects)
const accessActions = {
    "/SPOTIFY": { type: 'newtab', value: "https://open.spotify.com/artist/7jQfqwxrxEsaPU2C9BiO9X?si=aJAuUgdRSUqD3lAkzS9z1g" },
    "/INSTAGRAM": { type: 'newtab', value: "https://www.instagram.com/darinkirksauvey/" },
    "/TIKTOK": { type: 'newtab', value: "https://www.tiktok.com/@darinkirksauvey" },
    "/TWITCH": { type: 'newtab', value: "https://www.twitch.tv/darinkirksauvey" },
    "/SOUNDCLOUD": { type: 'newtab', value: "https://soundcloud.com/darinkirksauvey/asitiwfse_041725" },
    "/TRASH": { type: 'redirect', value: "asitiwfse.html" }, // Assuming the main page is index.html, still redirects in the same tab
    "/TOUR": { type: 'showdates', value: [
        { text: ">> UPCOMING TOUR DATES:" },
        { text: ">> REDACTED", link: "https://example.com/tickets/roxy" },
        { text: ">> REDACTED", link: "https://example.com/tickets/fillmore" },
        { text: ">> REDACTED", link: "https://example.com/tickets/houseofblues" }
    ]},
    "/SHOWS": { type: 'showdates', value: [
        { text: ">> UPCOMING SHOW DATES:" },
        { text: ">> REDACTED", link: "https://example.com/tickets/roxy" },
        { text: ">> REDACTED", link: "https://example.com/tickets/fillmore" },
        { text: ">> REDACTED", link: "https://example.com/tickets/houseofblues" }
    ]},
    "/INFO": { type: 'info', value: [ // Added the /INFO code with a new type and an array of info messages
        { text: ">> AVAILABLE COMMANDS:" },
        { text: ">> /SPOTIFY" },
        { text: ">> /INSTAGRAM" },
        { text: ">> /TIKTOK" },
        { text: ">> /TWITCH" },
        { text: ">> /SOUNDCLOUD" },
        { text: ">> /SHOWS" },
    ]},
    "/MORE": { type: 'showdates', value: [ // Added /MORE with more show dates
        { text: ">> ADDITIONAL DATES:" },
        { text: ">> REDACTED", link: "https://example.com/tickets/observatory" },
        { text: ">> REDACTED", link: "https://example.com/tickets/websterhall" },
        { text: ">> REDACTED", link: "https://example.com/tickets/foxtheater" }
    ]}
};

const morePrompt = ">> TYPE /MORE TO SEE MORE DATES"; // Message to prompt for more dates
const incorrectValueMessage = ">> INCORRECT VALUE";
const enterCodePrompt = ">> PLEASE ENTER ACCESS CODE OR TYPE /INFO";
const moreNotAvailableMessage = ">> NOTHING MORE TO SHOW AT THIS TIME"; // New message for invalid /MORE usage
const accessGrantedMessage = ">> ACCESS GRANTED"; // Moved to a constant

const typingSpeed = 75; // Reduced from 100ms to 75ms for slightly faster typing

function typeMessage(message, callback) {
    let i = 0;
    const interval = setInterval(() => {
        if (i < message.length) {
            output.textContent += message[i++];
        } else {
            clearInterval(interval);
            if (callback) { // Check if callback exists before calling
                 callback();
            }
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
                    linkElement.target = '_blank'; // This is already set for the ticket links
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

        // Reset the flag unless the current command is showdates type
        if (action && action.type !== 'showdates') {
            lastCommandWasShowdates = false;
        }

        // Add a newline before displaying the command entered by the user
        output.textContent += `>> ${input.value.trim()}\n`;


        if (action) {
             // Special handling for /MORE if the last command wasn't showdates
            if (codeEntered === "/MORE" && !lastCommandWasShowdates) {
                 typeMessage(`${moreNotAvailableMessage}`, () => { // Removed leading newline
                     output.textContent += '\n';
                     typeMessage(enterCodePrompt, () => {
                         output.textContent += '\n';
                         showInput();
                     });
                 });
                 input.value = '';
                 return; // Stop further processing for invalid /MORE
            }

            // Handle new tab actions
            if (action.type === 'newtab') {
                typeMessage(accessGrantedMessage, () => { // Type "ACCESS GRANTED"
                     // Introduce a slight delay before opening the new tab for effect
                    setTimeout(() => {
                         window.open(action.value, '_blank'); // Open in a new tab
                         showInput(); // Show input again after opening new tab
                    }, 500); // 500ms delay
                });

            }
            // Handle redirect actions (still in the same tab)
            else if (action.type === 'redirect') {
                typeMessage(accessGrantedMessage, () => { // Type "ACCESS GRANTED"
                     // Introduce a slight delay before redirecting for effect
                    setTimeout(() => {
                         window.location.href = action.value; // Perform the redirect
                    }, 500); // 500ms delay
                });

            } else if (action.type === 'showdates') {
                // Set the flag if the command was showdates
                lastCommandWasShowdates = true;

                typeMessage(`${accessGrantedMessage}\n`, () => { // Type access granted and then the show dates (removed leading newline)
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
                typeMessage(`${accessGrantedMessage}\n`, () => { // Type access granted and then the info (removed leading newline)
                    typeMessages(action.value, showInput); // Type out the info messages and then show the input again
                });
            }

        } else {
            // Handle incorrect value with typing effect
            typeMessage(`${incorrectValueMessage}`, () => { // Removed leading newline
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