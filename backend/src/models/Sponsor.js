import mongoose from 'mongoose';

const sponsorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    designation: { type: String, required: true },
    linkedin: { type: String, default: "" },
    website: { type: String, default: "" },
    sponsorshipLevel: { type: String, required: true },
    branding: { type: String, default: "" },
    budgetRange: { type: String, required: true },
    expectations: { type: String, default: "" },
    heardFrom: { type: String, required: true },
    heardFromOther: { type: String, default: "" },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    }
}, { timestamps: true });

const Sponsor = mongoose.model('Sponsor', sponsorSchema);

export default Sponsor;
