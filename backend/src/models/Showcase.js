import mongoose from 'mongoose';

const showcaseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    city: { type: String, required: true },
    organization: { type: String, required: true },
    designation: { type: String, required: true },
    linkedin: { type: String, required: true },
    startupName: { type: String, required: true },
    tagline: { type: String, required: true },
    description: { type: String, required: true },
    website: { type: String, default: "" },
    category: { type: String, required: true },
    stage: { type: String, required: true },
    showcaseDetails: { type: String, required: true },
    supportNeeded: [{ type: String }],
    heardFrom: { type: String, required: true },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    }
}, { timestamps: true });

const Showcase = mongoose.model('Showcase', showcaseSchema);

export default Showcase;
