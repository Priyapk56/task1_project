const express = require('express');
const app= express();
const dotenv=require('dotenv');
const path=require('path'); 
const connectDatabase=require('./config/connectDatabase')
const route=require('./routes/student')
const cors=require('cors');

dotenv.config({path: path.join(__dirname, 'config','config.env')}) //__dirname - current directory - backend

connectDatabase();

app.use(cors())
app.use(express.json());
app.use('/student',route);

app.listen(process.env.PORT,()=>{                                       //process-variable - node already have this variable
    console.log(`Server running on http://localhost:${process.env.PORT} `)
})


