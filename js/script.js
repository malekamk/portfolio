// Game settings
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const eatSound = document.getElementById('eatSound');

canvas.width = 1000;  // Set canvas width
canvas.height = 800; // Set canvas height

// Player settings
const playerSize = 20;
const playerSpeed = 16; // Speed of player movement

// Player 1
const player1 = {
    x: 100,
    y: 100,
    score: 0,
    direction: { x: 0, y: 0 } // Direction object to control movement
};

// Player 2
const player2 = {
    x: 200,
    y: 100,
    score: 0,
    direction: { x: 0, y: 0 } // Direction object to control movement
};

// Food settings
const foodSize = 10;
let foods = [];

// Maze blocks
const mazeBlocks = [
    { x: 50, y: 50, width: 500, height: 20 }, // Top wall
    { x: 50, y: 50, width: 20, height: 300 }, // Left wall
    { x: 50, y: 330, width: 500, height: 20 }, // Bottom wall
    { x: 530, y: 50, width: 20, height: 300 }, // Right wall
    { x: 200, y: 100, width: 20, height: 200 }, // Inner wall
    { x: 300, y: 100, width: 20, height: 200 } // Another inner wall
];

// Function to generate random food positions
function generateFood() {
    const x = Math.floor(Math.random() * (canvas.width / foodSize)) * foodSize;
    const y = Math.floor(Math.random() * (canvas.height / foodSize)) * foodSize;
    const type = Math.random() < 0.5 ? 'orange' : 'orange'; // Randomly choose food type
    foods.push({ x: x, y: y, type: type });
}

// Function to draw a brick pattern
function drawBrick(x, y, width, height) {
    const brickColor = '#444'; // Dark color for bricks
    const mortarColor = '#222'; // Darker color for mortar

    ctx.fillStyle = brickColor;
    ctx.fillRect(x, y, width, height); // Draw the brick

    // Draw the mortar
    ctx.fillStyle = mortarColor;
    ctx.fillRect(x, y, width, 4); // Top mortar
    ctx.fillRect(x, y + height - 4, width, 4); // Bottom mortar
    ctx.fillRect(x, y, 4, height); // Left mortar
    ctx.fillRect(x + width - 4, y, 4, height); // Right mortar
}

// Function to draw the maze outline and blocks
function drawMaze() {
    ctx.fillStyle = 'black'; // Fill color for the maze
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill the canvas with black

    // Draw maze blocks with brick patterns
    mazeBlocks.forEach(block => {
        drawBrick(block.x, block.y, block.width, block.height);
        ctx.strokeStyle = 'red'; // Red outline for the blocks
        ctx.lineWidth = 3;
        ctx.strokeRect(block.x, block.y, block.width, block.height); // Draw outline
    });
}

// Function to draw the players
function drawPlayers() {
    // Player 1
    ctx.fillStyle = '#ffeb3b'; // Yellow color for Player 1
    ctx.fillRect(player1.x, player1.y, playerSize, playerSize);

    // Player 2
    ctx.fillStyle = '#00ff00'; // Green color for Player 2
    ctx.fillRect(player2.x, player2.y, playerSize, playerSize);
}

// Function to draw food as circles
function drawFood() {
    foods.forEach(food => {
        ctx.beginPath();
        ctx.arc(food.x + foodSize / 2, food.y + foodSize / 2, foodSize / 2, 0, Math.PI * 2);
        ctx.fillStyle = food.type === 'orange' ? '#FFA500' : '#228B22'; // Orange for orange fruit, green for green fruit
        ctx.fill();
        ctx.closePath();
    });
}

// Function to check for collisions with food
function checkCollision() {
    // Check for collisions for Player 1
    foods.forEach((food, index) => {
        if (
            player1.x < food.x + foodSize &&
            player1.x + playerSize > food.x &&
            player1.y < food.y + foodSize &&
            player1.y + playerSize > food.y
        ) {
            foods.splice(index, 1); // Remove food from array
            player1.score++;
            document.getElementById('score').innerText = `Player 1 Score: ${player1.score}`;
            eatSound.play(); // Play sound when eating food
        }
    });

    // Check for collisions for Player 2
    foods.forEach((food, index) => {
        if (
            player2.x < food.x + foodSize &&
            player2.x + playerSize > food.x &&
            player2.y < food.y + foodSize &&
            player2.y + playerSize > food.y
        ) {
            foods.splice(index, 1); // Remove food from array
            player2.score++;
            document.getElementById('score2').innerText = `Player 2 Score: ${player2.score}`;
            eatSound.play(); // Play sound when eating food
        }
    });
}

// Function to update the game
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    drawMaze(); // Draw maze outline and blocks

    // Update player positions based on direction
    player1.x += player1.direction.x * playerSpeed;
    player1.y += player1.direction.y * playerSpeed;
    player2.x += player2.direction.x * playerSpeed;
    player2.y += player2.direction.y * playerSpeed;

    // Keep players within canvas bounds
    if (player1.x < 0) player1.x = 0;
    if (player1.x > canvas.width - playerSize) player1.x = canvas.width - playerSize;
    if (player1.y < 0) player1.y = 0;
    if (player1.y > canvas.height - playerSize) player1.y = canvas.height - playerSize;

    if (player2.x < 0) player2.x = 0;
    if (player2.x > canvas.width - playerSize) player2.x = canvas.width - playerSize;
    if (player2.y < 0) player2.y = 0;
    if (player2.y > canvas.height - playerSize) player2.y = canvas.height - playerSize;

    drawPlayers(); // Draw players
    drawFood(); // Draw food
    checkCollision(); // Check for collisions
    requestAnimationFrame(update); // Keep updating
}

// Function to handle keyboard input for movement
window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            player1.direction = { x: 0, y: -1 }; // Move player 1 up
            break;
        case 'ArrowDown':
            player1.direction = { x: 0, y: 1 }; // Move player 1 down
            break;
        case 'ArrowLeft':
            player1.direction = { x: -1, y: 0 }; // Move player 1 left
            break;
        case 'ArrowRight':
            player1.direction = { x: 1, y: 0 }; // Move player 1 right
            break;
        case 'w':
            player2.direction = { x: 0, y: -1 }; // Move player 2 up
            break;
        case 's':
            player2.direction = { x: 0, y: 1 }; // Move player 2 down
            break;
        case 'a':
            player2.direction = { x: -1, y: 0 }; // Move player 2 left
            break;
        case 'd':
            player2.direction = { x: 1, y: 0 }; // Move player 2 right
            break;
    }
});

// Generate initial food items
for (let i = 0; i < 1000; i++) {
    generateFood();
}

// Start the game
update();
