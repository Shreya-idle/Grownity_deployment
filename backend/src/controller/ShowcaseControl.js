import Showcase from '../models/Showcase.js';
import { sendEmail } from '../utils/sendEmail.js';

export const createShowcase = async (req, res) => {
    try {
        console.log('Creating showcase with data:', JSON.stringify(req.body, null, 2));
        const showcase = new Showcase(req.body);
        await showcase.save();
        console.log('Showcase saved successfully:', showcase._id);

        // Try to send email but don't fail the request if email fails
        try {
            await sendEmail(
                showcase.email,
                "Showcase Zone Application Received",
                `
        <h2>Thank you for applying to Showcase Zone at SHIFT2025!</h2>
        <p>Hi ${showcase.name},</p>
        <p>Your showcase application has been received.</p>
        <p>Startup/Project: <strong>${showcase.startupName}</strong></p>
        <p>Category: <strong>${showcase.category}</strong></p>
        <p>Stage: <strong>${showcase.stage}</strong></p>
        <p>Status: <strong>Pending Review</strong></p>
        <p>Our team will review your application and get back to you soon.</p>
        `
            );
            console.log('Email sent successfully to:', showcase.email);
        } catch (emailError) {
            console.error('Failed to send email (but showcase was saved):', emailError);
        }

        res.status(201).json({ message: "Showcase application submitted successfully", showcase });
    } catch (error) {
        console.error('Error creating showcase:', error);
        res.status(500).json({ message: "Submission failed", error: error.message });
    }
};

export const getShowcaseByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const showcase = await Showcase.findOne({ email });

        if (!showcase) {
            return res.status(404).json({ message: "Showcase not found" });
        }

        res.json(showcase);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch showcase" });
    }
};

export const updateShowcase = async (req, res) => {
    try {
        const { status } = req.body;
        const updated = await Showcase.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "Showcase not found" });
        }

        if (status) {
            try {
                await sendEmail(
                    updated.email,
                    `Showcase Zone status update: ${status}`,
                    `
                    <h2>Application Status Update</h2>
                    <p>Hi ${updated.name},</p>
                    <p>The status of your Showcase Zone application for SHIFT2025 has been updated to: <strong>${status}</strong>.</p>
                    <p>Startup/Project: <strong>${updated.startupName}</strong></p>
                    <p>Thank you for your interest.</p>
                    `
                );
            } catch (emailError) {
                console.error('Email notification failed:', emailError);
            }
        }

        res.json({ message: "Showcase updated successfully", showcase: updated });
    } catch (error) {
        res.status(500).json({ message: "Update failed" });
    }
};

export const bulkUpdateShowcaseStatus = async (req, res) => {
    try {
        const { ids, status } = req.body;

        if (!ids || !Array.isArray(ids) || !status) {
            return res.status(400).json({ message: 'IDs array and status are required.' });
        }

        const updatedShowcases = await Showcase.find({ _id: { $in: ids } });

        await Showcase.updateMany(
            { _id: { $in: ids } },
            { $set: { status } }
        );

        // Send emails in background
        updatedShowcases.forEach(async (showcase) => {
            const emailSubject = `Showcase Zone status update: ${status}`;
            const emailText = `
                <h2>Application Status Update</h2>
                <p>Hi ${showcase.name},</p>
                <p>The status of your Showcase Zone application for SHIFT2025 has been updated to: <strong>${status}</strong>.</p>
                <p>Startup/Project: <strong>${showcase.startupName}</strong></p>
                <p>Thank you for your interest.</p>
            `;
            try {
                await sendEmail(showcase.email, emailSubject, emailText);
            } catch (emailError) {
                console.error(`Email notification failed for ${showcase.email}:`, emailError);
            }
        });

        res.status(200).json({
            message: `Successfully updated ${updatedShowcases.length} showcases to ${status}.`,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to perform bulk update" });
    }
};

export const getShowcases = async (req, res) => {
    try {
        const showcases = await Showcase.find().sort({ createdAt: -1 });
        res.json(showcases);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch showcases" });
    }
};
