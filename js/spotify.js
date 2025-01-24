async function fetchTopTracksImages(artist) {
    const loader = document.getElementById('loader');
    loader.style.display = 'block'; // Show loader

    const Artist = artist.replace(/\s+/g, '').toLowerCase(); // Remove spaces and convert to lower case

    try {
        const response = await fetch(`https://kganyamaleka-1-7.onrender.com/api/TopSongs/${Artist}`, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json(); // Parse JSON response

        // Hide loader
        loader.style.display = 'none';

        // Clear previous images
        const container = document.getElementById('image-container');
        container.innerHTML = '';

        localStorage.setItem('artistName', artist);
        localStorage.setItem('topTracks', JSON.stringify(data.topTracks));

        // Display tracks
        data.topTracks.forEach((track, index) => { // Use index from forEach
            const card = document.createElement('div');
            card.classList.add('image-card');

            const img = document.createElement('img');
            img.src = track.imageUrl; // Set image source to track image URL

            const title = document.createElement('h2');
            title.innerText = track.name; // Set title to track name

            const popularity = document.createElement('p');
            popularity.innerText = `Popularity: ${track.popularity}`; // Set popularity

            card.appendChild(img); // Append image to card
            card.appendChild(title); // Append title to card
            card.appendChild(popularity); // Append popularity to card
            container.appendChild(card); // Append card to the container

            // Add initial styles for animation
            card.style.transform = 'translateX(-100%)'; // Start off-screen
            card.style.opacity = 0; // Initially hidden

            // Delay for each track
            setTimeout(() => {
                card.style.transition = 'transform 0.5s ease, opacity 0.5s ease'; // Set transition
                card.style.transform = 'translateX(0)'; // Move into view
                card.style.opacity = 1; // Fade in
            }, index * 500); // Delay based on index
        });
    } catch (error) {
        console.error('Fetch error:', error);
        alert('Failed to fetch images. Please try again.');
    }
}

function loadStoredData() {
    const storedArtistName = localStorage.getItem('artistName');
    const storedTopTracks = localStorage.getItem('topTracks');

    if (storedArtistName && storedTopTracks) {
        const data = JSON.parse(storedTopTracks);
        document.getElementById('artist-name').value = storedArtistName; // Set input value

        // Display stored tracks
        const container = document.getElementById('image-container');
        container.innerHTML = ''; // Clear existing images

        data.forEach(track => {
            const card = document.createElement('div');
            card.classList.add('image-card');

            const img = document.createElement('img');
            img.src = track.imageUrl; // Set image source to track image URL

            const title = document.createElement('h2');
            title.innerText = track.name; // Set title to track name

            const popularity = document.createElement('p');
            popularity.innerText = `Popularity: ${track.popularity}`; // Set popularity

            card.appendChild(img); // Append image to card
            card.appendChild(title); // Append title to card
            container.appendChild(card); // Append card to the container
        });
    }
}

// Call loadStoredData when the page loads
window.onload = loadStoredData;


async function fetchTracksImages(song) {
     const loader = document.getElementById('loader');
     loader.style.display = 'block'; // Show loader
     const songs = song.replace(/\s+/g, '').toLowerCase(); // Remove spaces and convert to lower case

     try {
         const response = await fetch(`https://kganyamaleka-1-7.onrender.com/api/Songs/${songs}`, {
             method: 'GET'
         });

         if (!response.ok) {
             throw new Error('Network response was not ok');
         }
         const data = await response.json(); // Parse JSON response

         // Hide loader
         loader.style.display = 'none';

         // Clear previous images
         const container = document.getElementById('image-container');
         container.innerHTML = '';

         data.Tracks.forEach((track, index) => {
             const card = document.createElement('div');
             card.classList.add('image-card');

             const img = document.createElement('img');
             img.src = track.imageUrl; // Set image source to track image URL

             const title = document.createElement('h2');
             title.innerText = track.name; // Set title to track name

             const artistName = document.createElement('h3');
             artistName.innerText = track.artist; // Set artist name

             card.appendChild(img); // Append image to card
             card.appendChild(title); // Append title to card
             card.appendChild(artistName); // Append artist name to card
             container.appendChild(card); // Append card to the container

             // Set initial position for animation
             card.style.transform = 'translateX(-100%)'; // Start off-screen
             card.style.opacity = 0; // Initially hidden

             // Delay for each track
             setTimeout(() => {
                 card.style.transition = 'transform 0.5s ease, opacity 0.5s ease'; // Set transition
                 card.style.transform = 'translateX(0)'; // Move into view
                 card.style.opacity = 1; // Fade in
             }, index * 500); // Delay for each track (500ms for each track)
         });
     } catch (error) {
         console.error('Fetch error:', error);
         alert('Failed to fetch images. Please try again.');
     }
 }


// Button click event to fetch images based on artist name
document.getElementById('fetch-button').addEventListener('click', async () => {
    const artistName = document.getElementById('artist-name').value.trim();
    if (artistName) {
        await fetchTopTracksImages(artistName);
    } else {
        alert('Please enter an artist name.');
    }
});

document.getElementById('song-button').addEventListener('click', async () => {
    const songName = document.getElementById('artist-name').value.trim();
    if (songName) {
        await fetchTracksImages(songName);
    } else {
        alert('Please enter a song name.');
    }

});

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




// Example: Buttons to control recording
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const output = document.getElementById('output');

// Add event listeners for buttons
startBtn.addEventListener('click', startRecording);
stopBtn.addEventListener('click', stopRecording);


// Function to handle speech synthesis
function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
}

// Check if the browser supports speech recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    const recognition = new SpeechRecognition();

    recognition.continuous = true; // Keep listening until stopped
    recognition.interimResults = false; // Show only final results
    recognition.lang = 'en-US'; // Set language to English (you can change this)

    // Start speech recognition
    startBtn.addEventListener('click', () => {
        recognition.start();
        startBtn.disabled = true;
        stopBtn.disabled = false;
        output.innerText = "Listening...";
    });

    // Stop speech recognition
    stopBtn.addEventListener('click', () => {
        recognition.stop();
        startBtn.disabled = false;
        stopBtn.disabled = true;
    });

    // When the speech recognition service returns a result
    recognition.onresult = async (event) => {
        const transcript = event.results[event.resultIndex][0].transcript.trim().toLowerCase();
        output.innerText = `Kganya: ${transcript}`;

        // Check if the transcript contains "go to gemini"
        if (transcript.includes('go to gemini')) {
            // Speak and redirect with smooth transition
            speak("Going to Gemini");
            smoothRedirect('gemini.html'); // Use smooth redirect function
        } else {
            try {
                // Send transcript to your API for further responses
                const response = await fetch('http://localhost:5050/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: transcript })
                });

                if (!response.ok) {
                    const errorResponse = await response.text();
                    console.error(`HTTP error! status: ${response.status}, response: ${errorResponse}`);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.text();
                speak(data); // Speak the bot's response
                output.innerText = `Iris: ${data}`; // Display bot's response
            } catch (error) {
                console.error(`Error occurred: ${error.message}`);
                output.innerText = `Error: ${error.message}`; // Show errors as bot messages
            }
        }
    };

    // Handle errors
    recognition.onerror = (event) => {
        output.innerText = `Error occurred in recognition: ${event.error}`;
        startBtn.disabled = false;
        stopBtn.disabled = true;
    };

    // Handle when recognition ends
    recognition.onend = () => {
        startBtn.disabled = false;
        stopBtn.disabled = true;
    };
} else {
    output.innerText = "Speech recognition not supported in this browser.";
    startBtn.disabled = true;
    stopBtn.disabled = true;
}

// Function to add smooth slide-out transition before redirect
function smoothRedirect(url) {
    document.body.classList.add('slide-out'); // Add slide-out class to body
    setTimeout(() => {
        window.location.href = url; // Redirect after animation
    }, 1000); // 1-second delay to match the CSS animation duration
}