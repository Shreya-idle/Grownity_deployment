import Volunteer from '../models/Volunteer.js';
import { sendEmail } from '../utils/sendEmail.js';

export const createVolunteer = async (req, res) => {
  try {
    console.log('Creating volunteer with data:', JSON.stringify(req.body, null, 2));
    const volunteer = new Volunteer(req.body);
    await volunteer.save();
    console.log('Volunteer saved successfully:', volunteer._id);

    // Try to send email but don't fail the request if email fails
    try {
      await sendEmail(
        volunteer.email,
        "Volunteer Application Received",
        `
        <h2>Thank you for applying!</h2>
        <p>Hi ${volunteer.name},</p>
        <p>Your volunteer application has been received.</p>
        <p>Status: <strong>Pending Review</strong></p>
        `
      );
      console.log('Email sent successfully to:', volunteer.email);
    } catch (emailError) {
      console.error('Failed to send email (but volunteer was saved):', emailError);
    }

    res.status(201).json({ message: "Volunteer submitted successfully", volunteer });
  } catch (error) {
    console.error('Error creating volunteer:', error);
    res.status(500).json({ message: "Submission failed", error: error.message });
  }
};

export const getVolunteerByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const volunteer = await Volunteer.findOne({ email });

    if (!volunteer) {
      return res.status(404).json({ message: "Volunteer not found" });
    }

    res.json(volunteer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch volunteer" });
  }
};

export const updateVolunteer = async (req, res) => {
  try {
    const updated = await Volunteer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Volunteer not found" });
    }

    res.json({ message: "Volunteer updated successfully", updated });
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};

export const updateVolunteerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required.' });
    }

    const updatedVolunteer = await Volunteer.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedVolunteer) {
      return res.status(404).json({ message: 'Volunteer not found.' });
    }

    const emailSubject = `Your application status has been updated to ${status}`;
    const emailText = `
      <h1>Application Status Update</h1>
      <p>Hi ${updatedVolunteer.name},</p>
      <p>The status of your application has been updated to: <strong>${status}</strong>.</p>
      <p>Thank you for your interest in volunteering with us.</p>
      <br>
      <p>Thank you,</p>
      <p>The CommunityConnect Team</p>
    `;

    try {
      await sendEmail(updatedVolunteer.email, emailSubject, emailText);
    } catch (emailError) {
      console.error('Email notification failed for status update:', emailError);
    }

    res.status(200).json({
      message: 'Volunteer status updated successfully.',
      volunteer: updatedVolunteer,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update volunteer status" });
  }
};

export const bulkUpdateVolunteerStatus = async (req, res) => {
  try {
    const { ids, status } = req.body;

    if (!ids || !Array.isArray(ids) || !status) {
      return res.status(400).json({ message: 'IDs array and status are required.' });
    }

    const updatedVolunteers = await Volunteer.find({ _id: { $in: ids } });

    await Volunteer.updateMany(
      { _id: { $in: ids } },
      { $set: { status } }
    );

    // Send emails in background
    updatedVolunteers.forEach(async (volunteer) => {
      const emailSubject = `Your application status has been updated to ${status}`;
      const emailText = `
        <h1>Application Status Update</h1>
        <p>Hi ${volunteer.name},</p>
        <p>The status of your application has been updated to: <strong>${status}</strong>.</p>
        <p>Thank you for your interest in volunteering with us.</p>
        <br>
        <p>Thank you,</p>
        <p>The CommunityConnect Team</p>
      `;
      try {
        await sendEmail(volunteer.email, emailSubject, emailText);
      } catch (emailError) {
        console.error(`Email notification failed for ${volunteer.email}:`, emailError);
      }
    });

    res.status(200).json({
      message: `Successfully updated ${updatedVolunteers.length} volunteers to ${status}.`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to perform bulk update" });
  }
};

export const getAllVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.find().sort({ createdAt: -1 });
    res.json(volunteers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch volunteers" });
  }
};