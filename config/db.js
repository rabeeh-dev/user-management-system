const mongoose = require('mongoose')

const connectDB = async function(){
    try{
        const connect = await mongoose.connect(process.env.MONGO_URI)
    }catch(err){
        console.log(err)
        process.exit(1)
    }
}
module.exports = connectDB