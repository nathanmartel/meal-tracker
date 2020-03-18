const express = require('express');
const app = express();
const Recipe = require('./models/Recipe');

app.use(express.json());

app.use('/api/v1/recipes', require('./routes/recipes'));
// app.use('/api/v1/events', require('./routes/events'));

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
