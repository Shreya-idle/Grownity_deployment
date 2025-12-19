import {Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import ZoneEnum from '../Zones.js';
import RolesEnum from '../Role.js';

 
// Considering the _id as user id 

const AdminSchema = new Schema({
    _adminid: {
        type: String,
        default: uuidv4,
        unique: true,
        immutable: true
    },
    appointedBy:{
        type: Schema.Types.ObjectId,
        ref: 'SuperUser'
    },
    zoneAlloted:{
        type: String,
        enum: Object.values(ZoneEnum),
        required: true
    },
    roleAlloted:{
        type: [String],
        enum: Object.values(RolesEnum),
        default: []
    },
    name:{
        type:String,
        required:true,
    },
    username:{
        type:String,
        required:true,
        unique:true,
    },
    description: {
        type: String
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    isActive:{
        type:Boolean,
        default:false
    },
    lastActive:{
        type:Date,
        default:Date.now
    },
//     _communityApproved:{

//     }
});


export default model('Admin', AdminSchema);