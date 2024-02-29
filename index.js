const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser');
const cors = require('cors');
const connectToMongo = require('./db');

connectToMongo();
  
app.use(express.json())
app.use(cors({ origin: "http://localhost:5173" }));
 //Available Routes
app.use('/api/auth',require('./routes/auth'))
//app.use('/api/notes',require('./routes/notes'))




app.use(bodyParser.json());



app.listen(port, () => {
console.log(`Example app listening on port ${port}`)
})
