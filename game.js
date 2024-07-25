const { v4: uuidv4 } = require('uuid');

const generateRandomPosition = (width, height) => {
    return {
        x: Math.floor(Math.random() * width),
        y: Math.floor(Math.random() * height)
    };
};

const startGame = (width, height) => {
    const gameState = {
        gameId: uuidv4(),
        width,
        height,
        score: 0,
        fruit: generateRandomPosition(width, height),
        snake: { x: 0, y: 0, velX: 1, velY: 0 }
    };
    return gameState;
};

const validateGame = (state, ticks) => {
    const { width, height, snake, fruit } = state;
    let currentPosition = { x: snake.x, y: snake.y };
    let currentVelocity = { x: snake.velX, y: snake.velY };

    for (let tick of ticks) {
        // Check for invalid 180-degree turns
        if ((tick.velX === -currentVelocity.x && tick.velX !== 0) ||
            (tick.velY === -currentVelocity.y && tick.velY !== 0)) {
            return { code:'02',valid: false, message: 'Invalid move: cannot do a 180-degree turn' };
        }
        
        // Update velocity
        currentVelocity = { x: tick.velX, y: tick.velY };
        
        // Move snake
        currentPosition.x += currentVelocity.x;
        currentPosition.y += currentVelocity.y;

        // Check for out of bounds
        if (
            currentPosition.x < 0 || currentPosition.x >= width ||
            currentPosition.y < 0 || currentPosition.y >= height
        ) {
            return { code:'02', valid: false, message: 'Game is over, snake went out of bounds or made an invalid move.' };
        }
    }
    
    // update game state
    state.snake = { x: currentPosition.x, y: currentPosition.y, velX: currentVelocity.x, velY: currentVelocity.y };

    // Check if snake has reached the fruit
    if (currentPosition.x === fruit.x && currentPosition.y === fruit.y) {
        // Fruit found, increment score and update state
        state.score += 1;
        state.fruit = generateRandomPosition(width, height);
        state.snake = { x: currentPosition.x, y: currentPosition.y, velX: currentVelocity.x, velY: currentVelocity.y };
        return { valid: true, gameState: state };
    }

    return { code:'01', valid: false, message: 'Fruit not found, the ticks do not lead the snake to the fruit position.', gameState: state };
};

module.exports = { startGame, validateGame };
