import mongoose from "mongoose";
import User from "./user.js";

const habitSchema = new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:User,required:true},
    title: {type:String , required:true, trim:true},
    streak: {type:Number, required:true},
    streakLog: [{ type: Date }],
    description:{type:String,trim:true},
},
{timestamps: true}
);

const Habit = mongoose.model("Habit", habitSchema);
export default Habit;   