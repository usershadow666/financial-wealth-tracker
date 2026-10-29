import mongoose from "mongoose";

async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("connect to the databse as",mongoose.connection.host)
    }catch(error){
        console.error("error:", error.message);
        process.exit(1);
    }
}
export default connectDB;