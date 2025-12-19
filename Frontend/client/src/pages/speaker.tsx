import React, { useState, useEffect } from "react";

type SpeakerFormState = {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  organization: string;
  designation: string;
  linkedin: string;
  topic: string;
  sessionType: string;
  description: string;
  audienceLevel: string;
  reason: string;
  spokenBefore: string;
  pastLinks: string;
  heardFrom: string;
};

type SpeakerFormErrors = Partial<Record<keyof SpeakerFormState, string>> & {
  submit?: string;
};

interface SpeakerFormProps {
  isAdmin?: boolean;
  id?: string;
}

export default function SpeakerForm({ isAdmin = false, id }: SpeakerFormProps) {
  const [existingSpeaker, setExistingSpeaker] = useState<SpeakerFormState | null>(null);
  const isReadOnly = !isAdmin && !!existingSpeaker;

  const initial: SpeakerFormState = {
    name: "",
    email: "",
    phone: "",
    city: "",
    organization: "",
    designation: "",
    linkedin: "",
    topic: "",
    sessionType: "",
    description: "",
    audienceLevel: "",
    reason: "",
    spokenBefore: "",
    pastLinks: "",
    heardFrom: "",
  };

  const [form, setForm] = useState<SpeakerFormState>(initial);
  const [errors, setErrors] = useState<SpeakerFormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isAdmin && id) {
          const res = await fetch(`/api/speaker/${id}`, { credentials: "include" });
          if (res.ok) {
            const data = await res.json();
            setExistingSpeaker(data);
            setForm(data);
          }
          return;
        }

        const resUser = await fetch("/api/user", { credentials: "include" });
        if (resUser.ok) {
          const dataUser = await resUser.json();
          const user = dataUser.user;
          if (user?.email) {
            const resSpeaker = await fetch(`/api/speaker/user/${user.email}`, { credentials: "include" });
            if (resSpeaker.ok) {
              const dataSpeaker = await resSpeaker.json();
              if (dataSpeaker && dataSpeaker._id) {
                setExistingSpeaker(dataSpeaker);
                setForm(dataSpeaker);
              } else {
                setForm(prev => ({ ...prev, email: user.email }));
              }
            } else {
              setForm(prev => ({ ...prev, email: user.email }));
            }
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, [isAdmin, id]);

  const sessionTypes = ["Workshop", "Talk", "Panel", "Fireside Chat", "Other"];
  const audienceLevels = ["Beginner", "Intermediate", "Advanced", "Mixed"];
  const yesNo = ["Yes", "No"];
  const heardOptions = [
    "WhatsApp / Telegram",
    "LinkedIn",
    "Instagram",
    "Partner Community",
    "Friend / Colleague",
    "Other",
  ];

  function validate(): SpeakerFormErrors {
    const e: SpeakerFormErrors = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    if (!form.phone.trim()) e.phone = "Phone number is required.";
    if (!form.city.trim()) e.city = "City / Location is required.";
    if (!form.organization.trim()) e.organization = "Organization is required.";
    if (!form.designation.trim()) e.designation = "Designation is required.";
    if (!form.linkedin.trim()) e.linkedin = "LinkedIn profile is required.";
    if (!form.topic.trim()) e.topic = "Topic / Theme is required.";
    if (!form.sessionType) e.sessionType = "Select a session type.";
    if (!form.description.trim()) e.description = "Description is required.";
    if (!form.audienceLevel) e.audienceLevel = "Select audience level.";
    if (!form.reason.trim()) e.reason = "Reason is required.";
    if (!form.spokenBefore) e.spokenBefore = "Select an option.";
    if (form.spokenBefore === "Yes" && !form.pastLinks.trim())
      e.pastLinks = "Enter your past event links.";
    if (!form.heardFrom) e.heardFrom = "This field is required.";
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
    setSuccess("");
    try {
      const speakerId = existingSpeaker?._id || id;
      const method = speakerId ? "PUT" : "POST";
      const url = speakerId ? `/api/speaker/${speakerId}` : "/api/speaker";

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Submission failed");

      setSuccess(speakerId ? "Your speaker application has been updated!" : "Your speaker request has been submitted!");
      if (!speakerId) {
        const result = await res.json();
        // Adjust based on your API response structure
        const data = result.speaker || result;
        if (data && data._id) setExistingSpeaker(data);
      }
    } catch (err) {
      setErrors({ submit: "Submission failed. Try again later." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white/80 dark:bg-slate-900/60 rounded-2xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Speaker Registration Form</h2>

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
            readOnly={isReadOnly}
            className={`w-full border rounded-md px-3 py-2 ${isReadOnly ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed' : 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed'}`}
            placeholder="you@email.com"
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

        {/* Designation */}
        <div>
          <label className="block mb-1 font-medium">Designation / Role *</label>
          <input
            name="designation"
            value={form.designation}
            onChange={handleChange}
            readOnly={isReadOnly}
            className={`w-full border rounded-md px-3 py-2 ${isReadOnly ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
            placeholder="Your role"
          />
          {errors.designation && (
            <p className="text-red-600 text-sm">{errors.designation}</p>
          )}
        </div>

        {/* LinkedIn */}
        <div>
          <label className="block mb-1 font-medium">LinkedIn Profile *</label>
          <input
            name="linkedin"
            value={form.linkedin}
            onChange={handleChange}
            readOnly={isReadOnly}
            className={`w-full border rounded-md px-3 py-2 ${isReadOnly ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
            placeholder="https://linkedin.com/in/your-profile"
          />
          {errors.linkedin && (
            <p className="text-red-600 text-sm">{errors.linkedin}</p>
          )}
        </div>

        {/* Topic */}
        <div>
          <label className="block mb-1 font-medium">
            Topic / Theme You Wish to Speak On *
          </label>
          <input
            name="topic"
            value={form.topic}
            onChange={handleChange}
            readOnly={isReadOnly}
            className={`w-full border rounded-md px-3 py-2 ${isReadOnly ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
            placeholder="Your session topic"
          />
          {errors.topic && (
            <p className="text-red-600 text-sm">{errors.topic}</p>
          )}
        </div>

        {/* Session Type */}
        <div>
          <label className="block mb-1 font-medium">
            Session Type Preference *
          </label>
          <select
            name="sessionType"
            value={form.sessionType}
            onChange={handleChange}
            disabled={isReadOnly}
            className={`w-full border rounded-md px-3 py-2 ${isReadOnly ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
          >
            <option value="">Select an option</option>
            {sessionTypes.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {errors.sessionType && (
            <p className="text-red-600 text-sm">{errors.sessionType}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 font-medium">
            Brief Description (100–150 words) *
          </label>
          <textarea
            name="description"
            rows={4}
            value={form.description}
            onChange={handleChange}
            disabled={isReadOnly}
            className={`w-full border rounded-md px-3 py-2 ${isReadOnly ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
            placeholder="Describe your talk"
          />
          {errors.description && (
            <p className="text-red-600 text-sm">{errors.description}</p>
          )}
        </div>

        {/* Audience Level */}
        <div>
          <label className="block mb-1 font-medium">Audience Level *</label>
          <select
            name="audienceLevel"
            value={form.audienceLevel}
            onChange={handleChange}
            disabled={isReadOnly}
            className={`w-full border rounded-md px-3 py-2 ${isReadOnly ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
          >
            <option value="">Select an option</option>
            {audienceLevels.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
          {errors.audienceLevel && (
            <p className="text-red-600 text-sm">{errors.audienceLevel}</p>
          )}
        </div>

        {/* Why speak */}
        <div>
          <label className="block mb-1 font-medium">
            Why do you want to speak at SHIFT2025? *
          </label>
          <textarea
            name="reason"
            rows={3}
            value={form.reason}
            onChange={handleChange}
            disabled={isReadOnly}
            className={`w-full border rounded-md px-3 py-2 ${isReadOnly ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
          />
          {errors.reason && (
            <p className="text-red-600 text-sm">{errors.reason}</p>
          )}
        </div>

        {/* Spoken Before */}
        <div>
          <label className="block mb-1 font-medium">
            Have you spoken at other events before? *
          </label>
          <select
            name="spokenBefore"
            value={form.spokenBefore}
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
          {errors.spokenBefore && (
            <p className="text-red-600 text-sm">{errors.spokenBefore}</p>
          )}
        </div>

        {/* Past links */}
        {form.spokenBefore === "Yes" && (
          <div>
            <label className="block mb-1 font-medium">
              Please share links or past speaking experience *
            </label>
            <textarea
              name="pastLinks"
              rows={3}
              value={form.pastLinks}
              onChange={handleChange}
              disabled={isReadOnly}
            className={`w-full border rounded-md px-3 py-2 ${isReadOnly ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
            />
            {errors.pastLinks && (
              <p className="text-red-600 text-sm">{errors.pastLinks}</p>
            )}
          </div>
        )}

        {/* How did you hear */}
        <div>
          <label className="block mb-1 font-medium">
            How did you hear about this opportunity? *
          </label>
          <select
            name="heardFrom"
            value={form.heardFrom}
            onChange={handleChange}
            disabled={isReadOnly}
            className={`w-full border rounded-md px-3 py-2 ${isReadOnly ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
          >
            <option value="">Select an option</option>
            {heardOptions.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
          {errors.heardFrom && (
            <p className="text-red-600 text-sm">{errors.heardFrom}</p>
          )}
        </div>

        {errors.submit && (
          <p className="text-red-600 text-sm">{errors.submit}</p>
        )}

        <button
          type="submit"
          disabled={submitting || (isReadOnly && !isAdmin)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
        >
          {submitting ? "Processing..." : (existingSpeaker ? "Update" : "Submit")}
        </button>

        {success && <p className="text-green-600 text-sm mt-2">{success}</p>}
      </form>
    </div>
  );
}
