let visualizerColor = '#ffffff'; // Default color

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
