const apiBaseUrl = 'https://kganyamaleka-1-6.onrender.com'; // API base URL


document.getElementById('send-button').addEventListener('click', async () => {
    const inputField = document.getElementById('word');
    const userMessage = inputField.value;
    if (!userMessage) return; // Exit if input is empty

    // Display user message in the chat log
    addMessageToChatLog(`kganya: ${userMessage}`, 'user'); // Indicate it's a user message
    inputField.value = ''; // Clear input field

    try {
        const response = await fetch('https://kganyamaleka-1-6.onrender.com/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMessage })
        });

        if (!response.ok) {
            // Log response status and status text for debugging
            const errorResponse = await response.text();
            console.error(`HTTP error! status: ${response.status}, response: ${errorResponse}`);
            throw new Error(`please retry the bot is sleeping`);
        }

        const data = await response.text();
        addMessageToChatLog(`Iris: ${data}`, 'bot'); // Indicate it's a bot message
    } catch (error) {
        // Log the error to the console for debugging
        console.error(`Error occurred: ${error.message}`);
        addMessageToChatLog(`Error: ${error.message}`, 'bot'); // Show errors as bot messages
    }
});


// Function to add a message to the chat log
function addMessageToChatLog(message, type) {
    const chatLog = document.getElementById('chat-log');
    const messageClass = type === 'user' ? 'user-message' : 'bot-message'; // Determine message type
    const messageBubble = `<div class="message ${messageClass}">${message}</div>`;

    chatLog.innerHTML += messageBubble; // Add the new message
    chatLog.scrollTop = chatLog.scrollHeight; // Auto-scroll to the bottom

    // Save chat log to localStorage
    saveChatHistory();
}

// Function to save chat history to localStorage
function saveChatHistory() {
    const chatLog = document.getElementById('chat-log').innerHTML;
    localStorage.setItem('chatHistory', chatLog); // Store chat log in localStorage
}

// Function to load chat history from localStorage
function loadChatHistory() {
    const storedChatHistory = localStorage.getItem('chatHistory');
    if (storedChatHistory) {
        document.getElementById('chat-log').innerHTML = storedChatHistory; // Set chat log content
        const chatLog = document.getElementById('chat-log');
        chatLog.scrollTop = chatLog.scrollHeight; // Auto-scroll to the bottom
    }

}

//window.onload = loadChatHistory;

window.addEventListener('load', () => {
  console.log("Running!");
})
let visualizerColor = '#ff69b4'; // Default color

// Color picker event to change the visualizer color
const colorPicker = document.getElementById('color-picker');
colorPicker.addEventListener('input', (event) => {
    visualizerColor = event.target.value; // Update color when user picks a new one
});

const audioChunks = [];
let recorder, audioContext, analyser, dataArray, bufferLength;
const canvas = document.getElementById('visualizer');
const canvasCtx = canvas.getContext('2d');

// Request access to the user's microphone
navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
        // Set up the audio context and analyser
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();

        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);

        // Set up the analyser properties
        analyser.fftSize = 2048;
        bufferLength = analyser.fftSize;
        dataArray = new Uint8Array(bufferLength);

        // Initialize MediaRecorder for recording
        recorder = new MediaRecorder(stream);
        recorder.ondataavailable = event => {
            audioChunks.push(event.data);
        };

        recorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            sendAudioToServer(audioBlob);
        };

        // Start the improved waveform visualizer
        drawAIWaveform();
    })
    .catch(error => {
        console.error("Error accessing microphone: ", error);
    });

// Function to start recording
function startRecording() {
    if (recorder) {
        recorder.start();
    }
}

// Function to stop recording
function stopRecording() {
    if (recorder) {
        recorder.stop();
    }
}

// Function to draw the AI waveform on the canvas
function drawAIWaveform() {
    requestAnimationFrame(drawAIWaveform);

    analyser.getByteTimeDomainData(dataArray); // Get the current audio data

    // Clear the canvas
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    // Set up the gradient color for the waveform based on user selection
    const gradient = canvasCtx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, `${visualizerColor}80`); // Start with user-selected color (80% opacity)
    gradient.addColorStop(1, `${visualizerColor}ff`); // Full opacity at the bottom

    // Apply glow effect
    canvasCtx.strokeStyle = gradient;
    canvasCtx.lineWidth = 2;
    canvasCtx.shadowBlur = 15;
    canvasCtx.shadowColor = `${visualizerColor}70`; // Glow with user-selected color

    // Begin drawing the waveform
    canvasCtx.beginPath();
    const sliceWidth = canvas.width / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        const v = (dataArray[i] - 128) / 128.0;
        const sensitivity = 2;
        const y = (v * canvas.height * sensitivity / 2) + (canvas.height / 2);

        if (i === 0) {
            canvasCtx.moveTo(x, y);
        } else {
            const controlX = x + sliceWidth / 2;
            const controlY = y;
            canvasCtx.quadraticCurveTo(controlX, controlY, x + sliceWidth, y);
        }

        x += sliceWidth;
    }

    canvasCtx.lineTo(canvas.width, canvas.height / 2);
    canvasCtx.stroke();
}


