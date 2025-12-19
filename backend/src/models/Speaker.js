import mongoose from 'mongoose';

const speakerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    city: { type: String, required: true },
    organization: { type: String, required: true },
    designation: { type: String, required: true },
    linkedin: { type: String, required: true },
    topic: { type: String, required: true },
    sessionType: { type: String, required: true },
    description: { type: String, required: true },
    audienceLevel: { type: String, required: true },
    reason: { type: String, required: true },
    spokenBefore: { type: String, enum: ["Yes", "No"], required: true },
    pastLinks: { type: String, default: "" },
    heardFrom: { type: String, required: true },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    }
}, { timestamps: true });

const Speaker = mongoose.model('Speaker', speakerSchema);

export default Speaker;
