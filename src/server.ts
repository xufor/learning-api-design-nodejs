import express from 'express';

const app = express();

app.get('/health', (req, res) => {
    return res.send('Up and running.')
});

export { app };