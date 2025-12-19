import { Community } from "../models/Community.js";
import { User } from "../models/User.js";
import { sendEmail } from '../utils/sendEmail.js';

export const getZoneStats = async (req, res) => {
  try {
    const zoneStats = await Community.aggregate([
      { $match: { status: "approved" } },
      {
        $group: {
          _id: { zone: "$zone", state: "$countryState" },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.zone",
          states: {
            $push: {
              name: "$_id.state",
              count: "$count",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          states: {
            $slice: [
              {
                $sortArray: {
                  input: "$states",
                  sortBy: { count: -1 },
                },
              },
              6,
            ],
          },
        },
      },
    ]);

    res.status(200).json(zoneStats);
  } catch (error) {
    console.error("Error fetching zone stats:", error);
    res.status(500).json({
      message: "Failed to fetch zone stats.",
      error: error.message,
    });
  }
};


export const getCommunityState = async (req, res) => {
  try {
    const { state } = req.params;
    const communities = await Community.find({ countryState: state, status: 'approved' });

    if (!communities.length) {
      return res.status(404).json({
        message: `No approved communities found in ${state}.`,
      });
    }
    return res.status(200).json(communities);
  } catch (error) {
    console.error("Error fetching communities by state:", error);
    res.status(500).json({
      message: "Failed to fetch communities by state.",
      error: error.message,
    });
  }
};

export const getCommunityType = async (req, res) => {
  try {
    const { domainType } = req.params;
    const communities = await Community.find({ domain: domainType, status: 'approved' });

    if (!communities.length) {
      return res.status(404).json({
        message: `No approved communities found for type ${domainType}.`,
      });
    }

    res.status(200).json(communities);
  } catch (error) {
    console.error("Error fetching communities by type:", error);
    res.status(500).json({
      message: "Failed to fetch communities by type.",
      error: error.message,
    });
  }
};

export const getCommunityZones = async (req, res) => {
  try {
    const { zoneInput } = req.params;
    const communities = await Community.find({ zone: String(zoneInput), status: "approved" });
    console.log(communities)
    if (!communities.length) {
      return res.status(404).json({
        message: `No approved communities found in zone ${zoneInput}.`,
      });
    }
    return res.status(200).json(communities);
  } catch (error) {
    console.error("Error fetching communities by zones", error);
    res.status(500).json({
      message: "Failed to fetch communities by zones.",
      error: error.message,
    });
  }
};

export const createCommunity = async (req, res) => {
  try {
    let {
      name,
      description,
      tagline,
      banner,
      zone,
      city,
      pincode,
      domain,
      website,
      linkedin,
      twitter,
      facebook,
      instagram,
      discord,
      eventLink,
      countryState,
      members,
    } = req.body;
    console.log("Body of submitted community", req.body)
    const firebaseUid = req.cookies.uid;
    const user = await User.findOne({ firebaseUid: firebaseUid });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const _communityAdminid = user._id;
    zone = `${zone.toLowerCase()}_zone`

    if (!_communityAdminid || !name || !description || !zone || !city || !pincode || !domain) {
      return res.status(400).json({
        message: "Fields _communityAdminid, name, description, zone, city, pincode, and domain are required.",
      });
    }

    const social_links = {
      website,
      linkedin,
      twitter,
      facebook,
      instagram,
      discord,
      eventLink,
    };

    const newCommunity = new Community({
      _communityAdminid,
      banner,
      name,
      description,
      tagline,
      zone,
      city,
      pincode,
      domain,
      countryState,
      social_links,
      members,
      status: "pending",
    });

    const savedCommunity = await newCommunity.save();


    res.status(201).json({
      message: "Community created successfully.",
      community: savedCommunity,
    });
    const emailSubject = 'Your Community Submission is Pending Approval';
    const emailText = `
      <h1>Thank you for submitting your community!</h1>
      <p>Hi ${user.name || 'User'},</p>
      <p>Your community, "<strong>${savedCommunity.name}</strong>," has been successfully submitted for review.</p>
      <p>Its current status is: <strong>${savedCommunity.status}</strong>.</p>
      <p>We will notify you again once the status of your community has been updated.</p>
      <br>
      <p>Thank you,</p>
      <p>The CommunityConnect Team</p>
    `;

    await sendEmail(user.email, emailSubject, emailText);

  } catch (error) {
    console.error("Error creating community:", error);
    res.status(500).json({
      message: "Failed to create community.",
      error: error.message,
    });
  }
};

export const searchCommunities = async (req, res) => {
  try {
    const { q } = req.query;


    let communities;
    if (!q) {
      communities = await Community.find({ status: "approved" });
    } else {
      const query = {
        $and: [
          { status: "approved" },
          {
            $or: [
              { name: { $regex: q, $options: "i" } },
              { description: { $regex: q, $options: "i" } },
              { domain: { $regex: q, $options: "i" } },
              { city: { $regex: q, $options: "i" } },
              { zone: { $regex: q, $options: "i" } },
            ],
          },
        ],
      };
      communities = await Community.find(query);
    }



    res.status(200).json(communities);
  } catch (error) {
    console.error("Error searching communities:", error);
    res.status(500).json({
      message: "Failed to search for communities.",
      error: error.message,
    });
  }
};


export const multiCommunitySearch = async (req, res) => {
  try {
    const { q, zone, state, level, domain } = req.query;


    const filters = { status: "approved" };

    if (zone) filters.zone = zone;
    if (state) filters.countryState = state;
    if (level) filters.level = level;
    if (domain) filters.domain = domain;

    let finalQuery = filters;

    if (q) {
      const searchQuery = {
        $or: [
          { name: { $regex: q, $options: "i" } },
          { description: { $regex: q, $options: "i" } },
        ],
      };
      finalQuery = { $and: [filters, searchQuery] };
    }

    const communities = await Community.find(finalQuery);



    res.status(200).json(communities);
  } catch (error) {
    console.error("Error performing multi-filter search:", error);
    res.status(500).json({
      message: "Failed to search for communities.",
      error: error.message,
    });
  }
};



export const deleteCommunity = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCommunity = await Community.findByIdAndDelete(id);

    if (!deletedCommunity) {
      return res.status(404).json({ message: "Community not found." });
    }



    res.status(200).json({
      message: "Community deleted successfully.",
      deletedCommunity,
    });
  } catch (error) {
    console.error("Error deleting community:", error);
    res.status(500).json({
      message: "Failed to delete community.",
      error: error.message,
    });
  }
};

export const getCommunityById = async (req, res) => {
  try {
    const { id } = req.params;

    const current_firebaseUid = req.cookies.uid;
    const community = await Community.findById(id).populate('_communityAdminid')
    if (!community) {
      return res.status(404).json({ message: "Community not found." });
    }

    if (community.status === "pending" || community.status === "rejected") {
      if (!current_firebaseUid) {
        return res.status(403).json({
          message: "This community is pending approval.",
          status: "pending"
        });
      }

      const user = await User.findOne({ firebaseUid: current_firebaseUid });
      if (!user) {
        return res.status(403).json({
          message: "This community is pending approval.",
          status: "pending"
        });
      }
      const isCreator = community._communityAdminid._firebaseUid === current_firebaseUid;
      const isPrivileged = user.isSuperUser || user.rolesHaving.includes("admin");

      if (!isCreator && !isPrivileged) {
        return res.status(403).json({
          message: "Only the creator or admins can view pending communities.",
          status: "pending"
        });
      }
    }




    res.status(200).json(community);
  } catch (error) {
    console.error("Error fetching community by ID:", error);
    res.status(500).json({
      message: "Failed to fetch community.",
      error: error.message,
    });
  }
};

export const getApprovedCommunity = async (req, res) => {
  try {


    const communities = await Community.find({ status: "approved" }).populate('_communityAdminid', 'name');

    if (!communities.length) {
      return res.status(404).json({
        message: "No approved communities found.",
      });
    }



    res.status(200).json(communities);
  } catch (error) {
    console.error("Error fetching approved communities:", error);
    res.status(500).json({
      message: "Failed to fetch approved communities.",
      error: error.message,
    });
  }
};

export const getPendingCommunity = async (req, res) => {
  try {
    const communities = await Community.find({ status: "pending" }).populate('_communityAdminid', 'name');

    if (!communities.length) {
      return res.status(404).json({
        message: "No pending communities found.",
      });
    }

    res.status(200).json(communities);
  } catch (error) {
    console.error("Error fetching pending communities:", error);
    res.status(500).json({
      message: "Failed to fetch pending communities.",
      error: error.message,
    });
  }
};

export const updateCommunity = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({ message: "Community ID is required for update." });
    }

    const updatedCommunity = await Community.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedCommunity) {
      return res.status(404).json({ message: "Community not found with this ID" });
    }



    if (updateData.status === "approved") {
      const adminId = updatedCommunity._communityAdminid;
      await User.findByIdAndUpdate(adminId, {
        $addToSet: { communityCreated: updatedCommunity._id },
      });
    }

    res.status(200).json({
      message: "Community updated successfully.",
      community: updatedCommunity,
    });
  } catch (error) {
    console.error("Error updating community:", error);
    res.status(500).json({
      message: "Failed to update community.",
      error: error.message,
    });
  }
};

export const getRejectedCommunity = async (req, res) => {
  try {
    const communities = await Community.find({ status: "rejected" }).populate('_communityAdminid', 'name');

    if (!communities.length) {
      return res.status(404).json({
        message: "No rejected communities found.",
      });
    }

    res.status(200).json(communities);
  } catch (error) {
    console.error("Error fetching rejected communities:", error);
    res.status(500).json({
      message: "Failed to fetch rejected communities.",
      error: error.message,
    });
  }
};

export const getModeratedCommunity = async (req, res) => {
  try {
    const communities = await Community.find({ 'moderation.isModerated': true }).populate('_communityAdminid', 'name');

    if (!communities.length) {
      return res.status(404).json({
        message: "No moderated communities found.",
      });
    }

    res.status(200).json(communities);
  } catch (error) {
    console.error("Error fetching moderated communities:", error);
    res.status(500).json({
      message: "Failed to fetch moderated communities.",
      error: error.message,
    });
  }
};


export const getDomainStats = async (req, res) => {
  try {
    const domainStats = await Community.aggregate([
      { $match: { status: "approved" } },
      {
        $group: {
          _id: "$domain",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          count: "$count",
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json(domainStats);
  } catch (error) {
    console.error("Error fetching domain stats:", error);
    res.status(500).json({
      message: "Failed to fetch domain stats.",
      error: error.message,
    });
  }
};

export const joinCommuntiy = async (req, res) => {
  try {
    const cookie_uid = req.cookies.uid;
    const user = await User.findOne({ firebaseUid: cookie_uid });
    const { communityID } = req.body;
    const community = await Community.findById(communityID);
    if (!community) {
      return res.status(404).json({
        message: "Community not found",
      });
    }
    if (user.communityJoined.includes(communityID)) {
      return res
        .status(400)
        .json({ message: "You have already joined this community." });
    }

    user.communityJoined.push(communityID);
    community.numberOfMembers += 1;
    await user.save();
    await community.save();

    return res.status(200).json({
      message: "Successfully joined the community ",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const getUserCommunities = async (req, res) => {
  try {
    const cookie_uid = req.cookies.uid;
    const user = await User.findOne({ firebaseUid: cookie_uid }).populate([
      {
        path: "communityJoined",
        model: "Community",
      },
      {
        path: "communityCreated",
        model: "Community",
      },
    ]);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const { communityJoined, communityCreated } = user;

    return res.status(200).json({
      joined: communityJoined,
      created: communityCreated,
    });
  } catch (error) {
    console.error("Error fetching user communities:", error);
    return res.status(500).json({
      message: "Failed to fetch user communities.",
      error: error.message,
    });
  }
};


export const getUserCreatedCommunities = async (req, res) => {
  try {
    const cookie_uid = req.cookies.uid;
    const { status } = req.query;

    const user = await User.findOne({ firebaseUid: cookie_uid }).populate({
      path: "communityCreated",
      match: status ? { status } : {},
      model: "Community",
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json(user.communityCreated);
  } catch (error) {
    console.error("Error fetching user-created communities:", error);
    return res.status(500).json({
      message: "Failed to fetch user-created communities.",
      error: error.message,
    });
  }
};