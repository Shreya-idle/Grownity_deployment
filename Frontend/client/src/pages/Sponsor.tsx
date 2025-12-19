import React, { useState, useEffect } from "react";

type SponsorFormState = {
  _id?: string;
  name: string;
  email: string;
  designation: string;
  linkedin: string;
  website: string;
  sponsorshipLevel: string;
  branding: string;
  budgetRange: string;
  expectations: string;
  heardFrom: string;
  heardFromOther: string;
};

interface SponsorFormProps {
  isAdmin?: boolean;
  id?: string;
}

export default function SponsorForm({ isAdmin = false, id }: SponsorFormProps) {
  const [existingSponsor, setExistingSponsor] = useState<SponsorFormState | null>(null);
  const isReadOnly = !isAdmin && !!existingSponsor;

  const initial: SponsorFormState = {
    name: "",
    email: "",
    designation: "",
    linkedin: "",
    website: "",
    sponsorshipLevel: "",
    branding: "",
    budgetRange: "",
    expectations: "",
    heardFrom: "",
    heardFromOther: "",
  };

  const [form, setForm] = useState<SponsorFormState>(initial);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isAdmin && id) {
          const res = await fetch(`/api/sponsors/${id}`, { credentials: "include" });
          if (res.ok) {
            const data = await res.json();
            setExistingSponsor(data);
            setForm(data);
          }
          return;
        }

        const resUser = await fetch("/api/user", { credentials: "include" });
        if (resUser.ok) {
          const dataUser = await resUser.json();
          const user = dataUser.user;
          if (user?.email) {
            const resSponsor = await fetch(`/api/sponsors/user/${user.email}`, { credentials: "include" });
            if (resSponsor.ok) {
              const dataSponsor = await resSponsor.json();
              if (dataSponsor && dataSponsor._id) {
                setExistingSponsor(dataSponsor);
                setForm(dataSponsor);
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

  const sponsorshipOptions = ["Platinum", "Gold", "Silver", "Bronze", "Custom"];

  const budgetOptions = [
    "< ₹50,000",
    "₹50,000 - ₹1,00,000",
    "₹1,00,000 - ₹5,00,000",
    "> ₹5,00,000",
  ];

  const heardOptions = [
    "WhatsApp / Telegram Group",
    "LinkedIn / Instagram",
    "Partner",
    "Community",
    "Friend / Colleague",
    "Other",
  ];

  function validate(): { [key: string]: string } {
    const e: { [key: string]: string } = {};
    if (!form.name.trim()) e.name = "Your name is required.";
    if (!form.designation.trim())
      e.designation = "Designation / Role is required.";
    if (form.linkedin && !/^https?:\/\//i.test(form.linkedin))
      e.linkedin = "Enter a valid URL (include http:// or https://).";
    if (form.website && !/^https?:\/\//i.test(form.website))
      e.website = "Enter a valid URL (include http:// or https://).";
    if (!form.sponsorshipLevel)
      e.sponsorshipLevel = "Select a sponsorship level.";
    if (!form.budgetRange) e.budgetRange = "Choose a budget range.";
    if (!form.heardFrom)
      e.heardFrom = "Please tell us how you heard about this opportunity.";
    if (form.heardFrom === "Other" && !form.heardFromOther.trim())
      e.heardFromOther = "Please specify.";
    return e;
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
    setErrors((errs) => {
      const newErrors = { ...errs };
      delete newErrors[name];
      return newErrors;
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess("");
    const eobj = validate();
    if (Object.keys(eobj).length) {
      setErrors(eobj);
      return;
    }

    setSubmitting(true);
    setErrors({});
    try {
      const sponsorId = existingSponsor?._id || id;
      const method = sponsorId ? "PUT" : "POST";
      const url = sponsorId ? `/api/sponsors/${sponsorId}` : "/api/sponsors";

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });

      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      setSuccess(sponsorId ? "Your sponsorship application has been updated!" : "Thanks! Your sponsorship request has been submitted.");
      if (!sponsorId) {
        const result = await res.json();
        const data = result.sponsor || result;
        if (data && data._id) setExistingSponsor(data);
      }
    } catch (err) {
      console.error(err);
      setErrors({
        submit: "Failed to submit. Try again later or contact the team.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white/80 dark:bg-slate-900/60 rounded-2xl shadow-md">
      <h2 className="text-2xl font-semibold mb-2">Sponsorship Form</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Fill this form to express interest in sponsoring the event.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Your Name *</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            readOnly={isReadOnly}
            className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring ${
              errors.name ? "border-red-500" : "border-neutral-300"
            } ${isReadOnly ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
            placeholder="Your full name"
          />
          {errors.name && (
            <p className="text-xs text-red-600 mt-1">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1">Email *</label>
          <input
            name="email"
            type="email"
            value={form.email}
            readOnly
            className={`w-full rounded-md border px-3 py-2 ${isReadOnly ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed' : 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed'} border-neutral-300`}
            placeholder="you@example.com"
          />
        </div>

        {/* Designation */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Designation / Role ? *
          </label>
          <input
            name="designation"
            value={form.designation}
            onChange={handleChange}
            readOnly={isReadOnly}
            className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring ${
              errors.designation ? "border-red-500" : "border-neutral-300"
            } ${isReadOnly ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
            placeholder="e.g., Marketing Manager"
          />
          {errors.designation && (
            <p className="text-xs text-red-600 mt-1">{errors.designation}</p>
          )}
        </div>

        {/* LinkedIn */}
        <div>
          <label className="block text-sm font-medium mb-1">
            What is your LinkedIn profile? *
          </label>
          <input
            name="linkedin"
            value={form.linkedin}
            onChange={handleChange}
            readOnly={isReadOnly}
            className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring ${
              errors.linkedin ? "border-red-500" : "border-neutral-300"
            } ${isReadOnly ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
            placeholder="https://www.linkedin.com/in/your-profile"
          />
          {errors.linkedin && (
            <p className="text-xs text-red-600 mt-1">{errors.linkedin}</p>
          )}
        </div>

        {/* Website */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Company Website / Social Link *
          </label>
          <input
            name="website"
            value={form.website}
            onChange={handleChange}
            readOnly={isReadOnly}
            className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring ${
              errors.website ? "border-red-500" : "border-neutral-300"
            } ${isReadOnly ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
            placeholder="https://yourcompany.com"
          />
          {errors.website && (
            <p className="text-xs text-red-600 mt-1">{errors.website}</p>
          )}
        </div>

        {/* Sponsorship Level */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Sponsorship Level Interested In *
          </label>
          <select
            name="sponsorshipLevel"
            value={form.sponsorshipLevel}
            onChange={handleChange}
            disabled={isReadOnly}
            className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring ${
              errors.sponsorshipLevel ? "border-red-500" : "border-neutral-300"
            } ${isReadOnly ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
          >
            <option value="">Select a level</option>
            {sponsorshipOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {errors.sponsorshipLevel && (
            <p className="text-xs text-red-600 mt-1">
              {errors.sponsorshipLevel}
            </p>
          )}
        </div>

        {/* Branding / activation */}
        <div>
          <label className="block text-sm font-medium mb-1">
            What kind of branding or activation are you interested in? *
          </label>
          <textarea
            name="branding"
            value={form.branding}
            onChange={handleChange}
            rows={3}
            readOnly={isReadOnly}
            className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring border-neutral-300 ${isReadOnly ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
            placeholder="Describe the activation, booth, speaking slot, swag, etc."
          />
        </div>

        {/* Budget Range */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Budget Range *
          </label>
          <select
            name="budgetRange"
            value={form.budgetRange}
            onChange={handleChange}
            disabled={isReadOnly}
            className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring ${
              errors.budgetRange ? "border-red-500" : "border-neutral-300"
            } ${isReadOnly ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
          >
            <option value="">Select budget range</option>
            {budgetOptions.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          {errors.budgetRange && (
            <p className="text-xs text-red-600 mt-1">{errors.budgetRange}</p>
          )}
        </div>

        {/* Expectations */}
        <div>
          <label className="block text-sm font-medium mb-1">
            What do you expect from this sponsorship ? *
          </label>
          <textarea
            name="expectations"
            value={form.expectations}
            onChange={handleChange}
            rows={3}
            readOnly={isReadOnly}
            className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring border-neutral-300 ${isReadOnly ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
            placeholder="e.g., brand visibility, speaking slot, lead generation"
          />
        </div>

        {/* How did you hear */}
        <div>
          <label className="block text-sm font-medium mb-1">
            How did you hear about this opportunity? *
          </label>
          <select
            name="heardFrom"
            value={form.heardFrom}
            onChange={handleChange}
            disabled={isReadOnly}
            className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring ${
              errors.heardFrom ? "border-red-500" : "border-neutral-300"
            } ${isReadOnly ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
          >
            <option value="">Select</option>
            {heardOptions.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
          {form.heardFrom === "Other" && (
            <input
              name="heardFromOther"
              value={form.heardFromOther}
              onChange={handleChange}
              placeholder="Please specify"
            disabled={isReadOnly}
            className={`mt-2 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring ${
              errors.heardFromOther ? "border-red-500" : "border-neutral-300"
            } ${isReadOnly ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
            />
          )}
          {errors.heardFrom && (
            <p className="text-xs text-red-600 mt-1">{errors.heardFrom}</p>
          )}
          {errors.heardFromOther && (
            <p className="text-xs text-red-600 mt-1">{errors.heardFromOther}</p>
          )}
        </div>

        {errors.submit && (
          <p className="text-sm text-red-600">{errors.submit}</p>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting || (isReadOnly && !isAdmin)}
            className="px-4 py-2 rounded-lg bg-sky-600 text-white font-medium disabled:opacity-60"
          >
            {submitting ? "Processing..." : (existingSponsor ? "Update" : "Submit Interest")}
          </button>

          <button
            type="button"
            onClick={() => setForm(initial)}
            className="px-3 py-2 rounded-lg border"
          >
            Reset
          </button>
        </div>

        {success && <p className="text-sm text-green-600">{success}</p>}
      </form>
    </div>
  );
}
