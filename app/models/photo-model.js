const mongoose = require('mongoose') 
const { Schema, model } = mongoose

const photoSchema = new Schema({
    title:{
        type: String, 
        trim: true,
        required: true
    },
    description:{
        type: String,
        trim: true, 
        required: true
    },
    uploadDate:{
        type: Date, 
        default: Date.now()
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User" 
    },
    path:[{
        name:{
            type: String, 
            trim: true,
            required: true
        },
        views:{
            type: Number, 
            default: 0
        },
        tags:[{
            user: {type: Schema.Types.ObjectId, ref: "User"}
        }]
    }],    
    isPublic: {
        type: Boolean,
        default: true
    }
}, {timestamps: true})

const Photo = model("Photo", photoSchema)

module.exports = Photo