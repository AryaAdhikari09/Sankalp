const express = require('express');
const app = express();

app.get('/api/hello', (req, res) => {
    res.send({ message: 'Hello from the API!' });
});

module.exports = app;
