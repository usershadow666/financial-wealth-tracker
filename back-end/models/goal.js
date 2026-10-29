import mongoose from "mongoose";
import User from "./user.js";

const goalSchema = new mongoose.Schema({
    user:{type: mongoose.Schema.Types.ObjectId, ref:User,required:true},
    goal:{type:String, required:true},
    targetAmount:{type:Number, required:true},
    currentSavings:{type:Number, default:0},
    targtDate:{type:Date},
    status:{type:String, enum:["in_progress","Achieved","On Hold"],default:"in_progress"
    }
},
{timestamps:true}
);

const Goal = mongoose.model("Goal", goalSchema);
export default Goal;