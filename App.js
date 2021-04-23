const express = require('express');
const signup = require('./Routes/signup.js');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());

app.get('/', (req, res, next) => {
    console.log('Home Page Acess');
    res.send('<h1>STORIFY!<h1>');
})



app.use('/api/signup', signup);


app.listen(PORT, () => {
    console.log(`app lisening on ${PORT}..`);
})






