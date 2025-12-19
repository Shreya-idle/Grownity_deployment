import mongoose from 'mongoose';

const communityPartnerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    city: { type: String, required: true },
    communityName: { type: String, required: true },
    communitySize: { type: String, required: true },
    targetAudience: { type: String, required: true },
    valueProposition: { type: String, required: true },
    expectedBenefits: { type: String, required: true },
    communityWebsite: { type: String, required: true },
    heardFrom: { type: String, required: true },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    }
}, { timestamps: true });

const CommunityPartner = mongoose.model('CommunityPartner', communityPartnerSchema);

export default CommunityPartner;
