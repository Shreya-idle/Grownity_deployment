import { Schema, model } from 'mongoose';
import { RolesEnum } from '../Role.js'; 

const UserSchema = new Schema({
    firebaseUid: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    isActive: {
        type: Boolean,
        default: false,
    },
    lastActive: {
        type: Date,
        default: Date.now,
    },
    isSuperUser: {
        type: Boolean,
        default: false,
    },
    rolesHaving: {
        type: [String],
        enum: Object.values(RolesEnum),
        default: [],
    },

    communityJoined:{
    type:[String],
    default:[]    
    },

    communityCreated:{
        type:[String],
        default:[]
    }
    
});


export const User = model('User', UserSchema);
// export const User = model('User', UserSchema);
