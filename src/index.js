const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')

const app = express(); 

app.use(bodyParser.urlencoded({ extended: false}));
app.use(cors());
app.use(express.json());


require('./controllers/authController')(app);
require('./controllers/projectController')(app);


app.listen(3000, ()=>{
    console.log("Serve online at port: 3000")
});