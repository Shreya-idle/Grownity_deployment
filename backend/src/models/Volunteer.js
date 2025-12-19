import mongoose from 'mongoose';

const volunteerSchema = new mongoose.Schema({
  open: {
    type: Boolean,
    default: true,
  },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  city: { type: String, required: true },
  organization: { type: String, required: true },
  linkedin: { type: String, required: true },

  preferredRole: { type: String, required: true },
  secondaryRole: { type: String, required: true },
  availability: { type: String, required: true },
  inPerson: { type: String, enum: ["Yes", "No"], required: true },
  hoursPerWeek: { type: String, required: true },

  volunteeredBefore: { type: String, enum: ["Yes", "No"], required: true },
  prevDescription: { type: String, default: "" },

  teamExperience: { type: String, default: "" },
  sampleWork: { type: String, default: "" },

  whyVolunteer: { type: String, required: true },
  expectations: { type: String, required: true },
  pressureSituation: { type: String, default: "" },

  heardFrom: { type: String, required: true },
  tshirt: { type: String, required: true },
  emergency: { type: String, required: true },
  commute: { type: String, required: true },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  }
},
  { timestamps: true }
);

const Volunteer = mongoose.model('Volunteer', volunteerSchema);

export default Volunteer;