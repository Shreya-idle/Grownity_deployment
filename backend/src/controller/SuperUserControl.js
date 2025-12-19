import { User } from "../models/User.js";
import { Community } from "../models/Community.js";
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { RolesEnum } from "../Role.js";

export const adminInvitation = async (req, res) => {
  try {
    const { mail } = req.body;
    console.log(mail)
    const user = await User.findOne({ email: mail });
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    const token = jwt.sign(
      { userId: user._id, action: 'make_admin' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    const magicLink = `${process.env.APP_BASE_URL}/api/super_user/verify-admin-invitation?token=${token}`;
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: mail,
      subject: 'Admin Invitation',
      html: `<p>Hello ${user.username},</p><p>You have been invited to become an admin. Click the link to accept:</p><p><a href="${magicLink}">Accept Invitation</a></p><p>This link expires in 24 hours.</p>`,
    });

    return res.status(200).json({ message: 'Admin invitation sent successfully.' });
  } catch (error) {
    console.error("Admin invitation error:", error);
    return res.status(500).json({ message: 'Error sending admin invitation.', error: error.message });
  }
};

export const verifyAdminInvitation = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({ message: "Token is required." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.action !== 'make_admin') {
      return res.status(401).json({ message: "Invalid token action." });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.rolesHaving.push(RolesEnum.ADMIN);
    await user.save();

    return res.status(200).json({ message: "User role updated to admin successfully." });
  } catch (error) {
    console.error("Verify admin invitation error:", error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Invalid or expired token." });
    }
    return res.status(500).json({ message: "Error verifying invitation.", error: error.message });
  }
};

export const getDashboardStats = async (req, res) => {
    try {
        const totalCommunities = await Community.countDocuments();
        const pendingApprovals = await Community.countDocuments({ status: 'pending' });
      
        const activeEvents = 0;   
        const teamMembers = await User.countDocuments({ rolesHaving: RolesEnum.ADMIN });

        res.status(200).json([
            {
                label: "Total Communities",
                value: totalCommunities,
                icon: "Users",
                color: "from-blue-500 to-blue-600",
                bgColor: "bg-blue-50",
                textColor: "text-blue-700",
            },
            {
                label: "Pending Approvals",
                value: pendingApprovals,
                icon: "Clock",
                color: "from-orange-500 to-amber-500",
                bgColor: "bg-orange-50",
                textColor: "text-orange-700",
                action: true,
            },
            {
                label: "Active Events",
                value: activeEvents,
                icon: "TrendingUp",
                color: "from-green-500 to-green-600",
                bgColor: "bg-green-50",
                textColor: "text-green-700",
            },
            {
                label: "Team Members",
                value: teamMembers,
                icon: "Shield",
                color: "from-purple-500 to-purple-600",
                bgColor: "bg-purple-50",
                textColor: "text-purple-700",
            },
        ]);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching dashboard stats.', error: error.message });
    }
};

export const getRecentActivities = async (req, res) => {
  try {
    const recentCommunities = await Community.find()
      .sort({ "updated_at": -1 }) 
      .limit(10) 
      .select("name status created_at updated_at");  

    const recentActivity = recentCommunities
      .map(community => {
        const date = community.updated_at || community.created_at; 
        if (!date) {
          return null;
        }

        return {
          type: community.status === 'approved' ? 'approval' : 'submission',
          title: community.status === 'approved' ? 'Community Approved' : 'New Submission',
          description: `${community.name} - ${community.status === 'approved' ? 'Approved' : 'Awaiting approval'}`,
          time: date.toISOString(),
          icon: community.status === 'approved' ? 'CheckCircle' : 'FileText',
        };
      })
      .filter(Boolean) 
      .slice(0, 5); 

    return res.status(200).json(recentActivity);
  } catch (error) {
      return res.status(500).json({ message: 'Error fetching recent activities.', error: error.message });
  }
};