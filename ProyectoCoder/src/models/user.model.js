import mongoose from "mongoose";

const collection = 'users';


const schema = new mongoose.Schema({
    first_name: {
        type: String,
        required:true
    },
    last_name: {
        type: String,
        required:true
    },
    email: {
        type: String,
        required:true,
        unique: true
    },
    age: Number,
    password: {
        type:String,
        required:true
    },
    loggedBy: String,
    role: { type: String, default: 'user',enum: ['user', 'admin'], }
})

const userModel = mongoose.model(collection, schema)

export default userModel;