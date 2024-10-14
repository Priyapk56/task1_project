const mongoose=require('mongoose');

const connectDatabase= () =>{
    mongoose.connect(process.env.DB_URL)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error(err));
};



module.exports = connectDatabase;