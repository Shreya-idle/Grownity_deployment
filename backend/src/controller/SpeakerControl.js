import Speaker from '../models/Speaker.js';
import { sendEmail } from '../utils/sendEmail.js';

export const createSpeaker = async (req, res) => {
    try {
        console.log('Creating speaker with data:', JSON.stringify(req.body, null, 2));
        const speaker = new Speaker(req.body);
        await speaker.save();
        console.log('Speaker saved successfully:', speaker._id);

        // Try to send email but don't fail the request if email fails
        try {
            await sendEmail(
                speaker.email,
                "Speaker Application Received",
                `
        <h2>Thank you for your interest in speaking at SHIFT2025!</h2>
        <p>Hi ${speaker.name},</p>
        <p>Your speaker application has been received.</p>
        <p>Topic: <strong>${speaker.topic}</strong></p>
        <p>Session Type: <strong>${speaker.sessionType}</strong></p>
        <p>Status: <strong>Pending Review</strong></p>
        <p>Our team will review your application and get back to you soon.</p>
        `
            );
            console.log('Email sent successfully to:', speaker.email);
        } catch (emailError) {
            console.error('Failed to send email (but speaker was saved):', emailError);
        }

        res.status(201).json({ message: "Speaker application submitted successfully", speaker });
    } catch (error) {
        console.error('Error creating speaker:', error);
        res.status(500).json({ message: "Submission failed", error: error.message });
    }
};

export const getSpeakerByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const speaker = await Speaker.findOne({ email });

        if (!speaker) {
            return res.status(404).json({ message: "Speaker not found" });
        }

        res.json(speaker);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch speaker" });
    }
};

export const updateSpeaker = async (req, res) => {
    try {
        const { status } = req.body;
        const updated = await Speaker.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "Speaker not found" });
        }

        if (status) {
            try {
                await sendEmail(
                    updated.email,
                    `Speaker Application Status: ${status}`,
                    `
                    <h2>Application Status Update</h2>
                    <p>Hi ${updated.name},</p>
                    <p>The status of your speaker application for SHIFT2025 has been updated to: <strong>${status}</strong>.</p>
                    <p>Thank you for your interest.</p>
                    `
                );
            } catch (emailError) {
                console.error('Email notification failed:', emailError);
            }
        }

        res.json({ message: "Speaker updated successfully", speaker: updated });
    } catch (error) {
        res.status(500).json({ message: "Update failed" });
    }
};

export const bulkUpdateSpeakerStatus = async (req, res) => {
    try {
        const { ids, status } = req.body;

        if (!ids || !Array.isArray(ids) || !status) {
            return res.status(400).json({ message: 'IDs array and status are required.' });
        }

        const updatedSpeakers = await Speaker.find({ _id: { $in: ids } });

        await Speaker.updateMany(
            { _id: { $in: ids } },
            { $set: { status } }
        );

        // Send emails in background
        updatedSpeakers.forEach(async (speaker) => {
            const emailSubject = `Speaker Application Status: ${status}`;
            const emailText = `
                <h2>Application Status Update</h2>
                <p>Hi ${speaker.name},</p>
                <p>The status of your speaker application for SHIFT2025 has been updated to: <strong>${status}</strong>.</p>
                <p>Thank you for your interest.</p>
            `;
            try {
                await sendEmail(speaker.email, emailSubject, emailText);
            } catch (emailError) {
                console.error(`Email notification failed for ${speaker.email}:`, emailError);
            }
        });

        res.status(200).json({
            message: `Successfully updated ${updatedSpeakers.length} speakers to ${status}.`,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to perform bulk update" });
    }
};

export const getSpeakers = async (req, res) => {
    try {
        const speakers = await Speaker.find().sort({ createdAt: -1 });
        res.json(speakers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch speakers" });
    }
};
