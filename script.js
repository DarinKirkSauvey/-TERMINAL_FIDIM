// Declare variables
let awaitingEmail = false;
let isSignupProcess = false;
let currentTypeInterval = null; // track the typing interval

const output = document.getElementById('output');
const input = document.getElementById('input');

const accessActions = {
  "/SPOTIFY": { type: 'newtab', value: "https://open.spotify.com/artist/7jQfqwxrxEsaPU2C9BiO9X?si=aJAuUgdRSUqD3lAkzS9z1g" },
  "/INSTAGRAM": { type: 'newtab', value: "https://www.instagram.com/darinkirksauvey/" },
  "/TIKTOK": { type: 'newtab', value: "https://www.tiktok.com/@darinkirksauvey" },
  "/TWITCH": { type: 'newtab', value: "https://www.twitch.tv/darinkirksauvey" },
  "/SOUNDCLOUD": { type: 'newtab', value: "https://soundcloud.com/darinkirksauvey/asitiwfse_041725" },
  "/TRASH": { type: 'redirect', value: "asitiwfse.html" },
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
  "/INFO": { type: 'info', value: [
      { text: ">> AVAILABLE COMMANDS:" },
      { text: ">> /SIGNUP"},
      { text: ">> /SHOWS" },           
      { text: ">> /SPOTIFY" },
      { text: ">> /INSTAGRAM" },
      { text: ">> /TIKTOK" },
      { text: ">> /TWITCH" },
      { text: ">> /SOUNDCLOUD" },
      
  ]},
  "/MORE": { type: 'showdates', value: [
      { text: ">> ADDITIONAL DATES:" },
      { text: ">> REDACTED", link: "https://example.com/tickets/observatory" },
      { text: ">> REDACTED", link: "https://example.com/tickets/websterhall" },
      { text: ">> REDACTED", link: "https://example.com/tickets/foxtheater" }
  ]},
  "/SIGNUP": { type: 'signup' }
};

const morePrompt = ">> TYPE /MORE TO SEE MORE DATES";
const incorrectValueMessage = ">> INCORRECT VALUE";
const enterCodePrompt = ">> PLEASE ENTER ACCESS CODE OR TYPE /INFO";
const accessGrantedMessage = ">> ACCESS GRANTED";

const typingSpeed = 75;

function typeMessage(msg, callback) {
  // Clear ongoing typing
  if (currentTypeInterval) {
    clearInterval(currentTypeInterval);
    currentTypeInterval = null;
    output.textContent += '\n'; // start new line if interrupted
  }

  let i = 0;
  currentTypeInterval = setInterval(() => {
    if (i < msg.length) {
      output.textContent += msg[i++];
    } else {
      clearInterval(currentTypeInterval);
      currentTypeInterval = null;
      if (callback) callback();
    }
  }, typingSpeed);
}

function typeMessages(msgs, callback) {
  let index = 0;
  function next() {
    if (index < msgs.length) {
      const m = msgs[index];
      typeMessage(m.text, () => {
        if (m.link) {
          const a = document.createElement('a');
          a.href = m.link;
          a.textContent = ' [TICKETS]';
          a.style.color = 'cyan';
          a.style.textDecoration = 'underline';
          a.target = '_blank';
          output.appendChild(a);
        }
        output.textContent += '\n';
        index++;
        next();
      });
    } else if (callback) {
      callback();
    }
  }
  next();
}

function showInput() {
  input.focus();
}

// Event listener for Enter key
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    // Interrupt message typing
    if (currentTypeInterval) {
      clearInterval(currentTypeInterval);
      currentTypeInterval = null;
      output.textContent += '\n'; // start on a new line
    }

    const userInput = input.value.trim();

    // Handle email input
    if (awaitingEmail) {
      const email = userInput;
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        fetch("https://assets.mailerlite.com/jsonp/1523977/forms/154454105005229498/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fields: { email: email } })
        }).then(() => {
          typeMessage(">> THANK YOU! YOUR EMAIL HAS BEEN ADDED.\n");
        }).catch(() => {
          typeMessage(">> ERROR. PLEASE TRY AGAIN.\n");
        });
      } else {
        typeMessage(">> INVALID. PLEASE TRY AGAIN.\n");
      }
      awaitingEmail = false;
      input.value = '';
      showInput();
      return;
    }

    // Handle /SIGNUP: do NOT display "/SIGNUP"
    if (userInput.toUpperCase() === "/SIGNUP") {
      typeMessage(">> PLEASE ENTER YOUR EMAIL:\n", () => {
        awaitingEmail = true;
        isSignupProcess = true;
        input.value = '';
        showInput();
      });
      return; // exit early, don't show "/SIGNUP"
    }

    // Display user input
    output.textContent += `>> ${userInput}\n`;

    const cmd = userInput.toUpperCase();
    const action = accessActions[cmd];

    if (action) {
      if (action.type === 'newtab') {
        typeMessage(">> " + "ACCESS GRANTED\n", () => {
          setTimeout(() => {
            window.open(action.value, '_blank');
            showInput();
          }, 500);
        });
      } else if (action.type === 'redirect') {
        typeMessage(">> " + "ACCESS GRANTED\n", () => {
          setTimeout(() => {
            if (!isSignupProcess && cmd !== "/SIGNUP") {
              window.location.href = action.value;
            }
            showInput();
            isSignupProcess = false;
          }, 500);
        });
      } else if (action.type === 'showdates') {
        typeMessage(">> " + "ACCESS GRANTED\n", () => {
          typeMessages(action.value, () => {
            if (cmd === "/TOUR" || cmd === "/SHOWS") {
              typeMessage(">> TYPE /MORE TO SEE MORE DATES\n", () => {
                output.textContent += '\n';
                showInput();
              });
            } else {
              showInput();
            }
          });
        });
      } else if (action.type === 'info') {
        typeMessage(">> " + "ACCESS GRANTED\n", () => {
          typeMessages(action.value, showInput);
        });
      }
    } else {
      // Unknown command
      typeMessage(">> " + "INCORRECT VALUE\n", () => {
        output.textContent += '\n';
        typeMessage(">> PLEASE ENTER ACCESS CODE OR TYPE /INFO\n", () => {
          output.textContent += '\n';
          showInput();
        });
      });
    }

    input.value = '';
  }
});

// Start messages
const startMessages = [
  { text: ">> BOOTING..." },
  { text: ">> PLEASE WAIT..." },
  { text: ">> SIGNAL CONNECTED" },
  { text: ">> ACCESS CODE REQUIRED" },
  { text: ">> PLEASE ENTER ACCESS CODE" },
  { text: ">> OR TYPE /INFO FOR MORE" }
];

typeMessages(startMessages, showInput);