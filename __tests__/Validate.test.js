const { validateGame, generateRandomPosition } = require('../game')

describe('ValidateGame', () => {
    test('should move snake correctly and find fruit', () => {
        const fruit = { x: 2, y: 2 };
        const initialState = {
            gameId: 'test-game',
            width: 5,
            height: 5,
            score: 0,
            fruit: structuredClone(fruit),
            snake: { x: 0, y: 0, velX: 1, velY: 0 }
        };

        const ticks = [
            { velX: 1, velY: 0 },
            { velX: 1, velY: 0 },
            { velX: 0, velY: 1 },
            { velX: 0, velY: 1 }
        ];

        const result = validateGame(initialState, ticks); 
        expect(result.valid).toBe(true);
        expect(result.gameState.score).toBe(1);
        expect((fruit)).not.toEqual((initialState.fruit));
    });

    test('should handle 180-degree turn attempt', () => {
        const initialState = {
            gameId: 'test-game',
            width: 5,
            height: 5,
            score: 0,
            fruit: { x: 2, y: 0 },
            snake: { x: 0, y: 0, velX: 1, velY: 0 }
        };

        const ticks = [
            { velX: -1, velY: 0 } // Invalid move: 180-degree turn
        ];

        const result = validateGame(initialState, ticks);

        expect(result.valid).toBe(false);
        expect(result.message).toBe('Invalid move: cannot do a 180-degree turn');
    });

    test('should handle out of bounds scenario', () => {
        const initialState = {
            gameId: 'test-game',
            width: 5,
            height: 5,
            score: 0,
            fruit: { x: 2, y: 0 },
            snake: { x: 0, y: 0, velX: 1, velY: 0 }
        };

        const ticks = [
            { velX: 1, velY: 0 },
            { velX: 1, velY: 0 },
            { velX: 1, velY: 0 },
            { velX: 1, velY: 0 }, 
            { velX: 1, velY: 0 }// Moves the snake out of bounds
        ];

        const result = validateGame(initialState, ticks);

        expect(result.valid).toBe(false);
        expect(result.message).toBe('Game is over, snake went out of bounds or made an invalid move.');
    });

    test('should handle fruit not found scenario', () => {
        const initialState = {
            gameId: 'test-game',
            width: 5,
            height: 5,
            score: 0,
            fruit: { x: 2, y: 2 },
            snake: { x: 0, y: 0, velX: 1, velY: 0 }
        };

        const ticks = [
            { velX: 1, velY: 0 },
            { velX: 1, velY: 0 },
            { velX: 1, velY: 0 },
            { velX: 1, velY: 0 },
            { velX: 0, velY: 1 } // Moves snake to a position but does not find the fruit
        ];

        const result = validateGame(initialState, ticks);

        expect(result.valid).toBe(false);
        expect(result.message).toBe('Fruit not found, the ticks do not lead the snake to the fruit position.');
    });
});
