import React, { useState, useEffect } from "react";

type CommunityPartnerFormState = {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  communityName: string;
  communitySize: string;
  targetAudience: string;
  valueProposition: string;
  expectedBenefits: string;
  communityWebsite: string;
  heardFrom: string;
};

type CommunityPartnerFormErrors = Partial<Record<keyof CommunityPartnerFormState, string>> & {
  submit?: string;
};

interface CommunityPartnerFormProps {
  isAdmin?: boolean;
  id?: string;
}

export default function CommunityPartnerForm({ isAdmin = false, id }: CommunityPartnerFormProps) {
  const [existingPartner, setExistingPartner] = useState<CommunityPartnerFormState | null>(null);
  const isReadOnly = !isAdmin && !!existingPartner;

  const initial: CommunityPartnerFormState = {
    name: "",
    email: "",
    phone: "",
    city: "",
    communityName: "",
    communitySize: "",
    targetAudience: "",
    valueProposition: "",
    expectedBenefits: "",
    communityWebsite: "",
    heardFrom: "",
  };

  const [form, setForm] = useState<CommunityPartnerFormState>(initial);
  const [errors, setErrors] = useState<CommunityPartnerFormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isAdmin && id) {
          const res = await fetch(`/api/community-partner/${id}`, { credentials: "include" });
          if (res.ok) {
            const data = await res.json();
            setExistingPartner(data);
            setForm(data);
          }
          return;
        }

        const resUser = await fetch("/api/user", { credentials: "include" });
        if (resUser.ok) {
          const dataUser = await resUser.json();
          const user = dataUser.user;
          if (user?.email) {
            const resPartner = await fetch(`/api/community-partner/user/${user.email}`, { credentials: "include" });
            if (resPartner.ok) {
              const dataPartner = await resPartner.json();
              if (dataPartner && dataPartner._id) {
                setExistingPartner(dataPartner);
                setForm(dataPartner);
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

  const cityOptions = [
    "Delhi NCR",
    "Mumbai",
    "Bangalore",
    "Hyderabad",
    "Chennai",
    "Kolkata",
    "Pune",
    "Ahmedabad",
    "Jaipur",
    "Lucknow",
    "Other",
  ];

  const targetAudienceOptions = [
    "Students",
    "Developers",
    "Startups",
    "Professionals",
    "Designers",
    "Product Managers",
    "Data Scientists",
    "DevOps Engineers",
    "Mixed Audience",
    "Other",
  ];

  const heardOptions = [
    "WhatsApp / Telegram Group",
    "LinkedIn / Instagram",
    "Partner Community",
    "Friend / Colleague",
    "Other",
  ];

  function validate(): CommunityPartnerFormErrors {
    const e: CommunityPartnerFormErrors = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    if (!form.phone.trim()) e.phone = "Phone number is required.";
    if (!form.city) e.city = "Please select a city.";
    if (!form.communityName.trim()) e.communityName = "Community name is required.";
    if (!form.communitySize.trim()) e.communitySize = "Community size is required.";
    if (!form.targetAudience) e.targetAudience = "Please select target audience.";
    if (!form.valueProposition.trim()) e.valueProposition = "This field is required.";
    if (!form.expectedBenefits.trim()) e.expectedBenefits = "This field is required.";
    if (!form.communityWebsite.trim()) e.communityWebsite = "Community website/link is required.";
    if (!form.heardFrom) e.heardFrom = "Please tell us how you heard about us.";
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
      const partnerId = existingPartner?._id || id;
      const method = partnerId ? "PUT" : "POST";
      const url = partnerId ? `/api/community-partner/${partnerId}` : "/api/community-partner";

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Submission failed");

      setSuccess(partnerId ? "Your community partnership application has been updated!" : "Your community partnership application has been submitted successfully!");
      if (!partnerId) {
        const result = await res.json();
        const data = result.partner || result;
        if (data && data._id) setExistingPartner(data);
      }
    } catch (err) {
      setErrors({ submit: "Submission failed. Try again later." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white/80 dark:bg-slate-900/60 rounded-2xl shadow-md">
      <h2 className="text-2xl font-semibold mb-2">Community Partner Application</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Apply to become a community partner for SHIFT2025.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section: Your Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 border-b pb-2">Your Info</h3>
          
          {/* Name */}
          <div>
            <label className="block mb-1 font-medium">Name *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              disabled={isReadOnly}
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
              readOnly
              disabled={isReadOnly}
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
              disabled={isReadOnly}
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
            <select
              name="city"
              value={form.city}
              onChange={handleChange}
              disabled={isReadOnly}
            className={`w-full border rounded-md px-3 py-2 ${isReadOnly ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
            >
              <option value="">Select an option</option>
              {cityOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.city && <p className="text-red-600 text-sm">{errors.city}</p>}
          </div>
        </div>

        {/* Community / Organization Name */}
        <div>
          <label className="block mb-1 font-medium">
            Community / Organization Name ? *
          </label>
          <input
            name="communityName"
            value={form.communityName}
            onChange={handleChange}
            disabled={isReadOnly}
            className={`w-full border rounded-md px-3 py-2 ${isReadOnly ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
            placeholder="Your community or organization name"
          />
          {errors.communityName && (
            <p className="text-red-600 text-sm">{errors.communityName}</p>
          )}
        </div>

        {/* Community Size */}
        <div>
          <label className="block mb-1 font-medium">Community Size / Reach ? *</label>
          <input
            name="communitySize"
            value={form.communitySize}
            onChange={handleChange}
            disabled={isReadOnly}
            className={`w-full border rounded-md px-3 py-2 ${isReadOnly ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
            placeholder="e.g., 1000 members"
          />
          {errors.communitySize && (
            <p className="text-red-600 text-sm">{errors.communitySize}</p>
          )}
        </div>

        {/* Target Audience */}
        <div>
          <label className="block mb-1 font-medium">Target Audience / Focus Area ? *</label>
          <select
            name="targetAudience"
            value={form.targetAudience}
            onChange={handleChange}
            disabled={isReadOnly}
            className={`w-full border rounded-md px-3 py-2 ${isReadOnly ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
          >
            <option value="">Select an option</option>
            {targetAudienceOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {errors.targetAudience && (
            <p className="text-red-600 text-sm">{errors.targetAudience}</p>
          )}
        </div>

        {/* Value Proposition */}
        <div>
          <label className="block mb-1 font-medium">
            What value can your community bring to SHIFT2025? *
          </label>
          <textarea
            name="valueProposition"
            rows={4}
            value={form.valueProposition}
            onChange={handleChange}
            disabled={isReadOnly}
            className={`w-full border rounded-md px-3 py-2 ${isReadOnly ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
            placeholder="Describe the value your community can bring"
          />
          {errors.valueProposition && (
            <p className="text-red-600 text-sm">{errors.valueProposition}</p>
          )}
        </div>

        {/* Expected Benefits */}
        <div>
          <label className="block mb-1 font-medium">
            What kind of visibility or partnership benefits would you expect? *
          </label>
          <textarea
            name="expectedBenefits"
            rows={3}
            value={form.expectedBenefits}
            onChange={handleChange}
            readOnly={isReadOnly}
            className={`w-full border rounded-md px-3 py-2 ${isReadOnly ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
            placeholder="e.g., Booth, Speaking Slot, etc."
          />
          {errors.expectedBenefits && (
            <p className="text-red-600 text-sm">{errors.expectedBenefits}</p>
          )}
        </div>

        {/* Community Website */}
        <div>
          <label className="block mb-1 font-medium">
            Community Website / Social Link ? *
          </label>
          <input
            name="communityWebsite"
            value={form.communityWebsite}
            onChange={handleChange}
            readOnly={isReadOnly}
            className={`w-full border rounded-md px-3 py-2 ${isReadOnly ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
            placeholder="https://example.com"
          />
          {errors.communityWebsite && (
            <p className="text-red-600 text-sm">{errors.communityWebsite}</p>
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
          {submitting ? "Processing..." : (existingPartner ? "Update" : "Submit Application")}
        </button>

        {success && <p className="text-green-600 text-sm mt-2">{success}</p>}
      </form>
    </div>
  );
}
