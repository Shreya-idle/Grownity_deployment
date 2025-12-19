import CommunityPartner from '../models/CommunityPartner.js';
import { sendEmail } from '../utils/sendEmail.js';

export const createCommunityPartner = async (req, res) => {
    try {
        console.log('Creating community partner with data:', JSON.stringify(req.body, null, 2));
        const partner = new CommunityPartner(req.body);
        await partner.save();
        console.log('Community partner saved successfully:', partner._id);

        // Try to send email but don't fail the request if email fails
        try {
            await sendEmail(
                partner.email,
                "Community Partner Application Received",
                `
        <h2>Thank you for applying to become a Community Partner!</h2>
        <p>Hi ${partner.name},</p>
        <p>Your community partnership application has been received.</p>
        <p>Community Size: <strong>${partner.communitySize}</strong></p>
        <p>Target Audience: <strong>${partner.targetAudience}</strong></p>
        <p>Status: <strong>Pending Review</strong></p>
        <p>Our team will review your application and get back to you soon.</p>
        `
            );
            console.log('Email sent successfully to:', partner.email);
        } catch (emailError) {
            console.error('Failed to send email (but partner was saved):', emailError);
        }

        res.status(201).json({ message: "Community partner application submitted successfully", partner });
    } catch (error) {
        console.error('Error creating community partner:', error);
        res.status(500).json({ message: "Submission failed", error: error.message });
    }
};

export const getCommunityPartnerByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const partner = await CommunityPartner.findOne({ email });

        if (!partner) {
            return res.status(404).json({ message: "Community partner not found" });
        }

        res.json(partner);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch community partner" });
    }
};

export const updateCommunityPartner = async (req, res) => {
    try {
        const { status } = req.body;
        const updated = await CommunityPartner.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "Community partner not found" });
        }

        if (status) {
            try {
                await sendEmail(
                    updated.email,
                    `Community Partnership Status: ${status}`,
                    `
                    <h2>Application Status Update</h2>
                    <p>Hi ${updated.name},</p>
                    <p>The status of your Community Partnership application for SHIFT2025 has been updated to: <strong>${status}</strong>.</p>
                    <p>Thank you for your interest in partnering with us.</p>
                    `
                );
            } catch (emailError) {
                console.error('Email notification failed:', emailError);
            }
        }

        res.json({ message: "Community partner updated successfully", partner: updated });
    } catch (error) {
        res.status(500).json({ message: "Update failed" });
    }
};

export const bulkUpdateCommunityPartnerStatus = async (req, res) => {
    try {
        const { ids, status } = req.body;

        if (!ids || !Array.isArray(ids) || !status) {
            return res.status(400).json({ message: 'IDs array and status are required.' });
        }

        const updatedPartners = await CommunityPartner.find({ _id: { $in: ids } });

        await CommunityPartner.updateMany(
            { _id: { $in: ids } },
            { $set: { status } }
        );

        // Send emails in background
        updatedPartners.forEach(async (partner) => {
            const emailSubject = `Community Partnership Status: ${status}`;
            const emailText = `
                <h2>Application Status Update</h2>
                <p>Hi ${partner.name},</p>
                <p>The status of your Community Partnership application for SHIFT2025 has been updated to: <strong>${status}</strong>.</p>
                <p>Thank you for your interest in partnering with us.</p>
            `;
            try {
                await sendEmail(partner.email, emailSubject, emailText);
            } catch (emailError) {
                console.error(`Email notification failed for ${partner.email}:`, emailError);
            }
        });

        res.status(200).json({
            message: `Successfully updated ${updatedPartners.length} partners to ${status}.`,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to perform bulk update" });
    }
};

export const getCommunityPartners = async (req, res) => {
    try {
        const partners = await CommunityPartner.find().sort({ createdAt: -1 });
        res.json(partners);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch community partners" });
    }
};
