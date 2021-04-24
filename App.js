const express = require('express');
const mongoose = require('mongoose');
const signup = require('./Routes/signup.js');
const getuser = require('./Routes/getuser'); 

const app = express();
const PORT = process.env.PORT || 3000;
const ATLAS = process.env.MONGO_PASSWORD;

mongoose.connect(`mongodb+srv://Hachem:${ATLAS}@storifydb.vkf6u.mongodb.net/test`, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open',() => {
  console.log('MongoDB connected!')
});

app.use(express.json());

app.get('/', (req, res, next) => {
    console.log('Home Page Acess');
    res.send('<h1>STORIFY!<h1>');
})


app.use('/api/signup', signup);
app.use('/api/getuser', getuser);


app.listen(PORT, () => {
    console.log(`app lisening on ${PORT}..`);
})






