import React, { useEffect, useState } from "react";

type VolunteerFormState = {
  name: string;
  email: string;
  phone: string;
  city: string;
  organization: string;
  linkedin: string;
  preferredRole: string;
  secondaryRole: string;
  availability: string;
  inPerson: string;
  hoursPerWeek: string;
  volunteeredBefore: string;
  prevDescription: string;
  teamExperience: string;
  sampleWork: string;
  whyVolunteer: string;
  expectations: string;
  pressureSituation: string;
  heardFrom: string;
  tshirt: string;
  emergency: string;
  commute: string;
  _id?: string;
  status?: string;
};

type VolunteerFormErrors = Partial<Record<keyof VolunteerFormState, string>> & {
  submit?: string;
};

const initialFormState: VolunteerFormState = {
  name: "",
  email: "",
  phone: "",
  city: "",
  organization: "",
  linkedin: "",
  preferredRole: "",
  secondaryRole: "",
  availability: "",
  inPerson: "",
  hoursPerWeek: "",
  volunteeredBefore: "",
  prevDescription: "",
  teamExperience: "",
  sampleWork: "",
  whyVolunteer: "",
  expectations: "",
  pressureSituation: "",
  heardFrom: "",
  tshirt: "",
  emergency: "",
  commute: "",
};

interface VolunteerFormProps {
  initialData?: VolunteerFormState;
  isAdmin?: boolean;
  id?: string;
}

export default function VolunteerForm({ initialData, isAdmin = false, id }: VolunteerFormProps) {
  const [form, setForm] = useState<VolunteerFormState>(
    initialData || initialFormState
  );
  const [errors, setErrors] = useState<VolunteerFormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [existingVolunteer, setExistingVolunteer] = useState<VolunteerFormState | null>(null);

  const isReadOnly = !isAdmin && !!existingVolunteer;


  // Fetch user data and existing volunteer application on mount
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        if (isAdmin && id) {
          // Admin mode: fetch by specified ID
          const response = await fetch(`/api/volunteer/${id}`, {
            credentials: "include",
          });
          if (response.ok) {
            const result = await response.json();
            // result might be { volunteer: ... } or just the volunteer object
            const data = result.volunteer || result;
            setExistingVolunteer(data);
            setForm(data);
          }
          return;
        }

        const userResponse = await fetch("/api/user", {
          credentials: "include",
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          const user = userData.user;

          const volunteerResponse = await fetch(`/api/volunteer/user/${user.email}`, {
            credentials: "include",
          });

          if (volunteerResponse.ok) {
            const volunteerData = await volunteerResponse.json();
            if (volunteerData && volunteerData._id) {
              setExistingVolunteer(volunteerData);
              setForm(volunteerData);
            } else {
              setForm((prev) => ({
                ...prev,
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
              }));
            }
          } else {
            setForm((prev) => ({
              ...prev,
              name: user.name || "",
              email: user.email || "",
              phone: user.phone || "",
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!initialData) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [initialData]);

  const yesNo = ["Yes", "No"];
  const roles = [
    "Operations",
    "Design",
    "Social Media",
    "Sponsorship Outreach",
    "Tech",
    "Content",
    "Other",
  ];
  const availability = ["Weekdays", "Weekends", "Both", "Flexible"];
  const hours = ["2-4 hours", "4-6 hours", "6-8 hours", "8+ hours"];
  const heard = [
    "WhatsApp / Telegram",
    "LinkedIn",
    "Instagram",
    "Friend / Colleague",
    "Community",
    "Other",
  ];
  const tshirt = ["XS", "S", "M", "L", "XL", "XXL"];

  function validate(): VolunteerFormErrors {
    const e: VolunteerFormErrors = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    if (!form.phone.trim()) e.phone = "Phone number is required.";
    if (!form.city.trim()) e.city = "City is required.";
    if (!form.organization.trim()) e.organization = "Organization is required.";
    if (!form.linkedin.trim()) e.linkedin = "This field is required.";
    if (!form.preferredRole) e.preferredRole = "Select an option.";
    if (!form.secondaryRole) e.secondaryRole = "Select an option.";
    if (!form.availability) e.availability = "Select an option.";
    if (!form.inPerson) e.inPerson = "Select an option.";
    if (!form.hoursPerWeek) e.hoursPerWeek = "Select an option.";
    if (!form.volunteeredBefore) e.volunteeredBefore = "Select an option.";
    if (form.volunteeredBefore === "Yes" && !form.prevDescription.trim())
      e.prevDescription = "Please describe your experience.";
    if (!form.whyVolunteer.trim()) e.whyVolunteer = "This field is required.";
    if (!form.expectations.trim()) e.expectations = "This field is required.";
    if (!form.heardFrom) e.heardFrom = "Select an option.";
    if (!form.tshirt) e.tshirt = "Select a size.";
    if (!form.emergency.trim()) e.emergency = "Emergency contact required.";
    if (!form.commute) e.commute = "Select an option.";
    return e;
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const eobj = validate();
    if (Object.keys(eobj).length) return setErrors(eobj);

    setSubmitting(true);
    try {
      // Use existingVolunteer or initialData to determine if updating
      const volunteerId = existingVolunteer?._id || initialData?._id;
      const method = volunteerId ? "PUT" : "POST";
      const url = volunteerId
        ? `/api/volunteer/${volunteerId}`
        : "/api/volunteer";

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      const result = await response.json();

      setSuccess(
        volunteerId
          ? "Your volunteer application has been updated successfully!"
          : "Your volunteer application has been submitted successfully!"
      );

      // Update existing volunteer state if this was a new submission
      if (!volunteerId && result.volunteer) {
        setExistingVolunteer(result.volunteer);
      }

      // Disable editing after submission
    } catch (err) {
      setErrors({ submit: "Submission failed. Try again later." });
    } finally {
      setSubmitting(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white/80 dark:bg-slate-900/60 rounded-2xl shadow-md">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white/80 dark:bg-slate-900/60 rounded-2xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4">
        Volunteer Application Form
      </h2>

      {/* Show application status if exists */}
      {existingVolunteer?.status && (
        <div className={`mb-4 p-3 rounded-md ${
          existingVolunteer.status === 'approved' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
            : existingVolunteer.status === 'rejected'
            ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
        }`}>
          <strong>Application Status:</strong> {existingVolunteer.status.charAt(0).toUpperCase() + existingVolunteer.status.slice(1)}
        </div>
      )}


      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block mb-1 font-medium">Name *</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            readOnly={isReadOnly}
            className={`w-full border rounded-md px-3 py-2 ${isReadOnly ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
            placeholder="Your full name"
          />
          {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 font-medium">Email *</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            readOnly={isReadOnly}
            className={`w-full border rounded-md px-3 py-2 ${isReadOnly ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="text-red-600 text-sm">{errors.email}</p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label className="block mb-1 font-medium">Phone Number *</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            readOnly={isReadOnly}
            className={`w-full border rounded-md px-3 py-2 ${isReadOnly ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
            placeholder="Your phone number"
          />
          {errors.phone && (
            <p className="text-red-600 text-sm">{errors.phone}</p>
          )}
        </div>

        {/* City / Location */}
        <div>
          <label className="block mb-1 font-medium">City / Location *</label>
          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            readOnly={isReadOnly}
            className={`w-full border rounded-md px-3 py-2 ${isReadOnly ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
            placeholder="Your city or location"
          />
          {errors.city && <p className="text-red-600 text-sm">{errors.city}</p>}
        </div>

        {/* Organization / Institution / Startup Name */}
        <div>
          <label className="block mb-1 font-medium">
            Organization / Institution / Startup Name *
          </label>
          <input
            name="organization"
            value={form.organization}
            onChange={handleChange}
            readOnly={isReadOnly}
            className={`w-full border rounded-md px-3 py-2 ${isReadOnly ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
            placeholder="Your organization, institution, or startup"
          />
          {errors.organization && (
            <p className="text-red-600 text-sm">{errors.organization}</p>
          )}
        </div>
        {/* LinkedIn */}
        <div>
          <label className="block mb-1 font-medium">
            LinkedIn / Portfolio / Personal Website *
          </label>
          <input
            name="linkedin"
            value={form.linkedin}
            onChange={handleChange}
            readOnly={isReadOnly}
            className={`w-full border rounded-md px-3 py-2 ${isReadOnly ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
            placeholder="https://..."
          />
          {errors.linkedin && (
            <p className="text-red-600 text-sm">{errors.linkedin}</p>
          )}
        </div>

        {/* Preferred Role */}
        <div>
          <label className="block mb-1 font-medium">Preferred Role *</label>
          <select
            name="preferredRole"
            value={form.preferredRole}
            onChange={handleChange}
            disabled={isReadOnly}
            className={`w-full border rounded-md px-3 py-2 ${isReadOnly ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
          >
            <option value="">Select an option</option>
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          {errors.preferredRole && (
            <p className="text-red-600 text-sm">{errors.preferredRole}</p>
          )}
        </div>

        {/* Secondary Role */}
        <div>
          <label className="block mb-1 font-medium">Secondary Role *</label>
          <select
            name="secondaryRole"
            value={form.secondaryRole}
            onChange={handleChange}
            disabled={isReadOnly}
            className={`w-full border rounded-md px-3 py-2 ${isReadOnly ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
          >
            <option value="">Select an option</option>
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          {errors.secondaryRole && (
            <p className="text-red-600 text-sm">{errors.secondaryRole}</p>
          )}
        </div>

        {/* Availability */}
        <div>
          <label className="block mb-1 font-medium">Availability *</label>
          <select
            name="availability"
            value={form.availability}
            onChange={handleChange}
            disabled={isReadOnly}
            className={`w-full border rounded-md px-3 py-2 ${isReadOnly ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
          >
            <option value="">Select an option</option>
            {availability.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
          {errors.availability && (
            <p className="text-red-600 text-sm">{errors.availability}</p>
          )}
        </div>

        {/* In-person */}
        <div>
          <label className="block mb-1 font-medium">
            Available for in-person meetings in Delhi NCR? *
          </label>
          <select
            name="inPerson"
            value={form.inPerson}
            onChange={handleChange}
            disabled={isReadOnly}
            className={`w-full border rounded-md px-3 py-2 ${isReadOnly ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
          >
            <option value="">Select an option</option>
            {yesNo.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          {errors.inPerson && (
            <p className="text-red-600 text-sm">{errors.inPerson}</p>
          )}
        </div>

        {/* Hours per week */}
        <div>
          <label className="block mb-1 font-medium">
            Hours per week you can contribute *
          </label>
          <select
            name="hoursPerWeek"
            value={form.hoursPerWeek}
            onChange={handleChange}
            disabled={isReadOnly}
            className={`w-full border rounded-md px-3 py-2 ${isReadOnly ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
          >
            <option value="">Select an option</option>
            {hours.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
          {errors.hoursPerWeek && (
            <p className="text-red-600 text-sm">{errors.hoursPerWeek}</p>
          )}
        </div>

        {/* Volunteered before */}
        <div>
          <label className="block mb-1 font-medium">
            Have you volunteered before? *
          </label>
          <select
            name="volunteeredBefore"
            value={form.volunteeredBefore}
            onChange={handleChange}
            disabled={isReadOnly}
            className={`w-full border rounded-md px-3 py-2 ${isReadOnly ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
          >
            <option value="">Select an option</option>
            {yesNo.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          {errors.volunteeredBefore && (
            <p className="text-red-600 text-sm">{errors.volunteeredBefore}</p>
          )}
        </div>

        {form.volunteeredBefore === "Yes" && (
          <div>
            <label className="block mb-1 font-medium">
              Describe your experience
            </label>
            <textarea
              name="prevDescription"
              rows={3}
              value={form.prevDescription}
                onChange={handleChange}
              disabled={isReadOnly}
            className={`w-full border rounded-md px-3 py-2 ${isReadOnly ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
            />
            {errors.prevDescription && (
              <p className="text-red-600 text-sm">{errors.prevDescription}</p>
            )}
          </div>
        )}

        {/* Team Experience */}
        <div>
          <label className="block mb-1 font-medium">
            Team experience (optional)
          </label>
          <textarea
            name="teamExperience"
            rows={3}
            value={form.teamExperience}
            onChange={handleChange}
            disabled={isReadOnly}
            className={`w-full border rounded-md px-3 py-2 ${isReadOnly ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
          />
        </div>

        {/* Sample work */}
        <div>
          <label className="block mb-1 font-medium">
            Sample work link (optional)
          </label>
          <input
            name="sampleWork"
            value={form.sampleWork}
            onChange={handleChange}
            disabled={isReadOnly}
            className={`w-full border rounded-md px-3 py-2 ${isReadOnly ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
            placeholder="Drive/Portfolio link"
          />
        </div>

        {/* Why Volunteer */}
        <div>
          <label className="block mb-1 font-medium">
            Why do you want to volunteer? *
          </label>
          <textarea
            name="whyVolunteer"
            rows={3}
            value={form.whyVolunteer}
            onChange={handleChange}
            disabled={isReadOnly}
            className={`w-full border rounded-md px-3 py-2 ${isReadOnly ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
          />
          {errors.whyVolunteer && (
            <p className="text-red-600 text-sm">{errors.whyVolunteer}</p>
          )}
        </div>

        {/* Expectations */}
        <div>
          <label className="block mb-1 font-medium">
            What do you expect to gain? *
          </label>
          <textarea
            name="expectations"
            rows={3}
            value={form.expectations}
            onChange={handleChange}
            disabled={isReadOnly}
            className={`w-full border rounded-md px-3 py-2 ${isReadOnly ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
          />
          {errors.expectations && (
            <p className="text-red-600 text-sm">{errors.expectations}</p>
          )}
        </div>

        {/* Pressure */}
        <div>
          <label className="block mb-1 font-medium">
            Describe a pressure situation (optional)
          </label>
          <textarea
            name="pressureSituation"
            rows={3}
            value={form.pressureSituation}
            onChange={handleChange}
            disabled={isReadOnly}
            className={`w-full border rounded-md px-3 py-2 ${isReadOnly ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
          />
        </div>

        {/* Heard from */}
        <div>
          <label className="block mb-1 font-medium">
            How did you hear about us? *
          </label>
          <select
            name="heardFrom"
            value={form.heardFrom}
            onChange={handleChange}
            disabled={isReadOnly}
            className={`w-full border rounded-md px-3 py-2 ${isReadOnly ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
          >
            <option value="">Select an option</option>
            {heard.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
          {errors.heardFrom && (
            <p className="text-red-600 text-sm">{errors.heardFrom}</p>
          )}
        </div>

        {/* T-shirt */}
        <div>
          <label className="block mb-1 font-medium">T-shirt size *</label>
          <select
            name="tshirt"
            value={form.tshirt}
            onChange={handleChange}
            disabled={isReadOnly}
            className={`w-full border rounded-md px-3 py-2 ${isReadOnly ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
          >
            <option value="">Select a size</option>
            {tshirt.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {errors.tshirt && (
            <p className="text-red-600 text-sm">{errors.tshirt}</p>
          )}
        </div>

        {/* Emergency */}
        <div>
          <label className="block mb-1 font-medium">Emergency contact *</label>
          <input
            name="emergency"
            value={form.emergency}
            onChange={handleChange}
            disabled={isReadOnly}
            className={`w-full border rounded-md px-3 py-2 ${isReadOnly ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
            placeholder="Phone number"
          />
          {errors.emergency && (
            <p className="text-red-600 text-sm">{errors.emergency}</p>
          )}
        </div>

        {/* Commute */}
        <div>
          <label className="block mb-1 font-medium">Commute method *</label>
          <select
            name="commute"
            value={form.commute}
            onChange={handleChange}
            disabled={isReadOnly}
            className={`w-full border rounded-md px-3 py-2 ${isReadOnly ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
          >
            <option value="">Select an option</option>
            <option value="Own vehicle">Own vehicle</option>
            <option value="Public transport">Public transport</option>
            <option value="Cab/Taxi">Cab/Taxi</option>
            <option value="Other">Other</option>
          </select>
          {errors.commute && (
            <p className="text-red-600 text-sm">{errors.commute}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting || (isReadOnly && !isAdmin)}
          className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold disabled:opacity-50"
        >
          {submitting ? "Processing..." : (existingVolunteer || initialData ? "Update" : "Submit")}
        </button>

        {errors.submit && (
          <p className="text-red-600 text-sm">{errors.submit}</p>
        )}
        {success && <p className="text-green-600 text-sm">{success}</p>}
      </form>
    </div>
  );
}
