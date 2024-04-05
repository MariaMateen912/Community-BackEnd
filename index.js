const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const connectToMongo = require('./db');

connectToMongo();

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

// Available Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/grievance', require('./routes/grievance'));
app.use('/api/events', require('./routes/events'));
app.use('/api/getevents', require('./routes/auth'));
//app.use('/api/notice', require('./routes/notice'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

