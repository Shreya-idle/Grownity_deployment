import Sponsor from '../models/Sponsor.js';
import { sendEmail } from '../utils/sendEmail.js';

export const createSponsor = async (req, res) => {
    try {
        console.log('Creating sponsor with data:', JSON.stringify(req.body, null, 2));
        const sponsor = new Sponsor(req.body);
        await sponsor.save();
        console.log('Sponsor saved successfully:', sponsor._id);

        // Try to send email but don't fail the request if email fails
        try {
            await sendEmail(
                req.body.email || 'team@grownity.tech',
                "Sponsorship Interest Received",
                `
        <h2>Thank you for your interest!</h2>
        <p>Hi ${sponsor.name},</p>
        <p>Your sponsorship request has been received.</p>
        <p>Sponsorship Level: <strong>${sponsor.sponsorshipLevel}</strong></p>
        <p>Budget Range: <strong>${sponsor.budgetRange}</strong></p>
        <p>Our team will get back to you soon.</p>
        `
            );
            console.log('Email sent successfully');
        } catch (emailError) {
            console.error('Failed to send email (but sponsor was saved):', emailError);
        }

        res.status(201).json({ message: "Sponsor submitted successfully", sponsor });
    } catch (error) {
        console.error('Error creating sponsor:', error);
        res.status(500).json({ message: "Submission failed", error: error.message });
    }
};

export const getSponsorByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const sponsor = await Sponsor.findOne({ email });

        if (!sponsor) {
            return res.status(404).json({ message: "Sponsor not found" });
        }

        res.json(sponsor);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch sponsor" });
    }
};

export const updateSponsor = async (req, res) => {
    try {
        const { status } = req.body;
        const updated = await Sponsor.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "Sponsor not found" });
        }

        if (status) {
            try {
                await sendEmail(
                    updated.email,
                    `Sponsorship Status Update: ${status}`,
                    `
                    <h2>Sponsorship Status Update</h2>
                    <p>Hi ${updated.name},</p>
                    <p>The status of your sponsorship request for SHIFT2025 has been updated to: <strong>${status}</strong>.</p>
                    <p>Thank you for your interest and support.</p>
                    `
                );
            } catch (emailError) {
                console.error('Email notification failed:', emailError);
            }
        }

        res.json({ message: "Sponsor updated successfully", sponsor: updated });
    } catch (error) {
        res.status(500).json({ message: "Update failed" });
    }
};

export const bulkUpdateSponsorStatus = async (req, res) => {
    try {
        const { ids, status } = req.body;

        if (!ids || !Array.isArray(ids) || !status) {
            return res.status(400).json({ message: 'IDs array and status are required.' });
        }

        const updatedSponsors = await Sponsor.find({ _id: { $in: ids } });

        await Sponsor.updateMany(
            { _id: { $in: ids } },
            { $set: { status } }
        );

        // Send emails in background
        updatedSponsors.forEach(async (sponsor) => {
            const emailSubject = `Sponsorship Status Update: ${status}`;
            const emailText = `
                <h2>Sponsorship Status Update</h2>
                <p>Hi ${sponsor.name},</p>
                <p>The status of your sponsorship request for SHIFT2025 has been updated to: <strong>${status}</strong>.</p>
                <p>Thank you for your interest and support.</p>
            `;
            try {
                await sendEmail(sponsor.email, emailSubject, emailText);
            } catch (emailError) {
                console.error(`Email notification failed for ${sponsor.email}:`, emailError);
            }
        });

        res.status(200).json({
            message: `Successfully updated ${updatedSponsors.length} sponsors to ${status}.`,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to perform bulk update" });
    }
};

export const getSponsors = async (req, res) => {
    try {
        const sponsors = await Sponsor.find().sort({ createdAt: -1 });
        res.json(sponsors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch sponsors" });
    }
};
