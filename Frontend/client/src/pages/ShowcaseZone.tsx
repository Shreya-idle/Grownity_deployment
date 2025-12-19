import React, { useState, useEffect } from "react";

type ShowcaseFormState = {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  organization: string;
  designation: string;
  linkedin: string;
  startupName: string;
  tagline: string;
  description: string;
  website: string;
  category: string;
  stage: string;
  showcaseDetails: string;
  supportNeeded: string[];
  heardFrom: string;
};

type ShowcaseFormErrors = Partial<Record<keyof ShowcaseFormState, string>> & {
  submit?: string;
};

interface ShowcaseFormProps {
  isAdmin?: boolean;
  id?: string;
}

export default function ShowcaseZone({ isAdmin = false, id }: ShowcaseFormProps) {
  const [existingShowcase, setExistingShowcase] = useState<ShowcaseFormState | null>(null);
  const isReadOnly = !isAdmin && !!existingShowcase;

  const initial: ShowcaseFormState = {
    name: "",
    email: "",
    phone: "",
    city: "",
    organization: "",
    designation: "",
    linkedin: "",
    startupName: "",
    tagline: "",
    description: "",
    website: "",
    category: "",
    stage: "",
    showcaseDetails: "",
    supportNeeded: [],
    heardFrom: "",
  };

  const [form, setForm] = useState<ShowcaseFormState>(initial);
  const [errors, setErrors] = useState<ShowcaseFormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isAdmin && id) {
          const res = await fetch(`/api/showcase/${id}`, { credentials: "include" });
          if (res.ok) {
            const data = await res.json();
            setExistingShowcase(data);
            setForm(data);
          }
          return;
        }

        const resUser = await fetch("/api/user", { credentials: "include" });
        if (resUser.ok) {
          const dataUser = await resUser.json();
          const user = dataUser.user;
          if (user?.email) {
            const resShowcase = await fetch(`/api/showcase/user/${user.email}`, { credentials: "include" });
            if (resShowcase.ok) {
              const dataShowcase = await resShowcase.json();
              if (dataShowcase && dataShowcase._id) {
                setExistingShowcase(dataShowcase);
                setForm(dataShowcase);
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

  const categories = [
    "Blockchain",
    "Cloud",
    "Cybersecurity",
    "Marketing Tech",
    "Generative AI",
  ];

  const stages = ["Prototype", "MVP", "Launched"];

  const supportOptions = [
    "Booth / Exhibition Space",
    "Pitch Opportunity",
    "Collaboration Opportunities",
  ];

  const heardOptions = [
    "WhatsApp / Telegram Group",
    "LinkedIn / Instagram",
    "Partner Community",
    "Friend / Colleague",
    "Other",
  ];

  function validate(): ShowcaseFormErrors {
    const e: ShowcaseFormErrors = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    if (!form.phone.trim()) e.phone = "Phone number is required.";
    if (!form.city.trim()) e.city = "City / Location is required.";
    if (!form.organization.trim()) e.organization = "Organization is required.";
    if (!form.designation.trim()) e.designation = "Designation is required.";
    if (!form.linkedin.trim()) e.linkedin = "LinkedIn profile is required.";
    if (!form.startupName.trim()) e.startupName = "Startup / Project name is required.";
    if (!form.tagline.trim()) e.tagline = "Tagline / Problem statement is required.";
    if (!form.description.trim()) e.description = "Brief description is required.";
    if (!form.category) e.category = "Select a category / domain.";
    if (!form.stage) e.stage = "Select a stage.";
    if (!form.showcaseDetails.trim()) e.showcaseDetails = "This field is required.";
    if (form.supportNeeded.length === 0) e.supportNeeded = "Select at least one option.";
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

  const handleCheckboxChange = (option: string) => {
    setForm((prev) => {
      const newSupport = prev.supportNeeded.includes(option)
        ? prev.supportNeeded.filter((s) => s !== option)
        : [...prev.supportNeeded, option];
      return { ...prev, supportNeeded: newSupport };
    });
    setErrors((prev) => ({ ...prev, supportNeeded: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const eobj = validate();
    if (Object.keys(eobj).length) return setErrors(eobj);

    setSubmitting(true);
    setSuccess("");
    try {
      const showcaseId = existingShowcase?._id || id;
      const method = showcaseId ? "PUT" : "POST";
      const url = showcaseId ? `/api/showcase/${showcaseId}` : "/api/showcase";

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Submission failed");
      
      setSuccess(showcaseId ? "Your showcase application has been updated!" : "Your showcase application has been submitted successfully!");
      if (!showcaseId) {
        const result = await res.json();
        const data = result.showcase || result;
        if (data && data._id) setExistingShowcase(data);
      }
    } catch (err) {
      setErrors({ submit: "Submission failed. Try again later." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white/80 dark:bg-slate-900/60 rounded-2xl shadow-md">
      <h2 className="text-2xl font-semibold mb-2">Showcase Zone Application</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Apply to showcase your startup or project at SHIFT2025.
      </p>

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
            placeholder="Your Name"
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
            placeholder="+91 81234 56789"
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

        {/* Organization */}
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
          <label className="block mb-1 font-medium">
            What is your LinkedIn profile? *
          </label>
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

        {/* Startup / Project Name */}
        <div>
          <label className="block mb-1 font-medium">
            Startup / Project Name *
          </label>
          <input
            name="startupName"
            value={form.startupName}
            onChange={handleChange}
            readOnly={isReadOnly}
            className={`w-full border rounded-md px-3 py-2 ${isReadOnly ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
            placeholder="Your startup or project name"
          />
          {errors.startupName && (
            <p className="text-red-600 text-sm">{errors.startupName}</p>
          )}
        </div>

        {/* Tagline */}
        <div>
          <label className="block mb-1 font-medium">
            One-line Tagline / Problem Statement *
          </label>
          <input
            name="tagline"
            value={form.tagline}
            onChange={handleChange}
            readOnly={isReadOnly}
            className={`w-full border rounded-md px-3 py-2 ${isReadOnly ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
            placeholder="A short tagline or problem statement"
          />
          {errors.tagline && (
            <p className="text-red-600 text-sm">{errors.tagline}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 font-medium">
            Brief Description (100 words) *
          </label>
          <textarea
            name="description"
            rows={4}
            value={form.description}
            onChange={handleChange}
            readOnly={isReadOnly}
            className={`w-full border rounded-md px-3 py-2 ${isReadOnly ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
            placeholder="Describe your startup or project in about 100 words"
          />
          {errors.description && (
            <p className="text-red-600 text-sm">{errors.description}</p>
          )}
        </div>

        {/* Website */}
        <div>
          <label className="block mb-1 font-medium">
            Website / Product Link (if available)
          </label>
          <input
            name="website"
            value={form.website}
            onChange={handleChange}
            readOnly={isReadOnly}
            className={`w-full border rounded-md px-3 py-2 ${isReadOnly ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
            placeholder="https://yourproduct.com"
          />
        </div>

        {/* Category / Domain */}
        <div>
          <label className="block mb-1 font-medium">Category / Domain *</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            disabled={isReadOnly}
            className={`w-full border rounded-md px-3 py-2 ${isReadOnly ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
          >
            <option value="">Select an option</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-red-600 text-sm">{errors.category}</p>
          )}
        </div>

        {/* Stage */}
        <div>
          <label className="block mb-1 font-medium">Stage *</label>
          <select
            name="stage"
            value={form.stage}
            onChange={handleChange}
            disabled={isReadOnly}
            className={`w-full border rounded-md px-3 py-2 ${isReadOnly ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
          >
            <option value="">Select an option</option>
            {stages.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {errors.stage && (
            <p className="text-red-600 text-sm">{errors.stage}</p>
          )}
        </div>

        {/* What to showcase */}
        <div>
          <label className="block mb-1 font-medium">
            What would you like to showcase at SHIFT2025? *
          </label>
          <textarea
            name="showcaseDetails"
            rows={3}
            value={form.showcaseDetails}
            onChange={handleChange}
            disabled={isReadOnly}
            className={`w-full border rounded-md px-3 py-2 ${isReadOnly ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
            placeholder="Describe what you'd like to showcase"
          />
          {errors.showcaseDetails && (
            <p className="text-red-600 text-sm">{errors.showcaseDetails}</p>
          )}
        </div>

        {/* Support Needed */}
        <div>
          <label className="block mb-1 font-medium">
            What support or visibility are you looking for? *
          </label>
          <p className="text-sm text-gray-500 mb-2">Select one or more</p>
          <div className="space-y-2">
            {supportOptions.map((option) => (
              <label key={option} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.supportNeeded.includes(option)}
                  onChange={() => handleCheckboxChange(option)}
                  disabled={isReadOnly}
                  className="rounded border-gray-300"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
          {errors.supportNeeded && (
            <p className="text-red-600 text-sm">{errors.supportNeeded}</p>
          )}
        </div>

        {/* How did you hear */}
        <div>
          <label className="block mb-1 font-medium">
            How did you hear about this opportunity? *
          </label>
          <select
            name="heardFrom"
            value={form.heardFrom}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2"
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
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 rounded-md font-semibold disabled:opacity-50 hover:from-blue-600 hover:to-blue-700 transition-all"
        >
          {submitting ? "Processing..." : (existingShowcase ? "Update" : "Submit Application")}
        </button>

        {success && <p className="text-green-600 text-sm mt-2">{success}</p>}
      </form>
    </div>
  );
}
