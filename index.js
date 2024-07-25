const express = require('express');
const bodyParser = require('body-parser'); 
const game = require('./game');

const app = express();
app.use(bodyParser.json());

app.get('/new', (req, res) => {
    const width = parseInt(req.query.w);
    const height = parseInt(req.query.h);

    if (isNaN(width) || isNaN(height)) {
        return res.status(400).json({ error: 'Invalid request' });
    }
    try {
        const gameState = game.startGame(width, height);
        res.json(gameState);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/validate', (req, res) => {
    const { state, ticks } = req.body;
    try{
        if (!state || !Array.isArray(ticks)) {
            return res.status(400).json({ error: 'Invalid request' });
        }
    
        const { code, valid, message, gameState } = game.validateGame(state, ticks);
    
        if (valid) {
            res.json(gameState);
        } else { 
             
            if(code === '02'){
                res.status(418).json({ error: message});
                return;
            } 

            res.status(404).json({ error: message, state});
        }
    }catch(error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
 
app.use((req, res) => {
    res.status(405).json({ error: 'Invalid method' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});