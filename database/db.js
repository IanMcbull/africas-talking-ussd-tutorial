const mongoose = require("mongoose");
const colors = require('colors');
const connectDb = async() =>{
    try{
      mongoose.connect(process.env.DATABASE_URL);
      console.log(colors.cyan.underline("Successfully connected to the database.."))
    }catch(e){  
      console.log(colors.red.underline("Unable to connect to the database"))
      process.exit(1)
    }
}

module.exports = connectDb;