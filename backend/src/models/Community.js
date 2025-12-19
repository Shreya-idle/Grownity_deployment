import { Schema, model } from 'mongoose';
import { ZoneEnum } from '../Zones.js';

const memberSchema = new Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  isFounder: { type: Boolean, default: false },
  linkedin: { type: String },
  twitter: { type: String },
  email: { type: String },
});

export const CommunitySchema = new Schema(
  {
    _communityAdminid: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    banner:{
      type: String,
    },
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    tagline: {
      type: String
    },
    zone: {
      type: String,
      enum: Object.values(ZoneEnum),
      required: true
    },
    city: {
      type: String,
      required: true
    },
    countryState :{
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true,
    },
    domain: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected','moderate'],
      default: 'pending'
    },
    rejectionReason: {
      type: String,
    },
    approved_by: {
      type: Schema.Types.ObjectId,
      ref: 'Admin'
    },
    approved_at: {
      type: Date
    },
    moderation:{
      flag:{type: Boolean,default:false},
      reason:{type:String,required:true,default:" " }
      
    },
    social_links: {
      website: { type: String },
      linkedin: { type: String },
      twitter: { type: String },
      facebook: { type: String },
      instagram: { type: String },
      discord: { type: String },
      eventLink: { type: String },
    },
    members: [memberSchema],
    numberOfMembers:{
      type:Number,
      default:0
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  },
);

export const Community = model('Community', CommunitySchema);