import React, { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

type FormData = {
  [key: string]: string;
};

interface FormField {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  options?: string[];
  dependsOn?: string;
  dependsValue?: string;
}

const sponsorFields = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "email", label: "Email", type: "email", required: true },
];

const communityPartnerFields = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "email", label: "Email", type: "email", required: true },
];

const speakerFields = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "email", label: "Email", type: "email", required: true },
];
const ProposalForm = () => {
  const [location, setLocation] = useLocation();
  const query = new URLSearchParams(window.location.search);
  const type = query.get("type");
  const [isSuperUser, setIsSuperUser] = useState(false);
  const [postAsDefault, setPostAsDefault] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    location: "",
    organization: "",
    reach: "",
    focus: "",
    value: "",
    expectations: "",
    website: "",
    referral: "",
  });

  // useEffect(() => {
  //   const userRole = localStorage.getItem("cc_role");
  //   setIsSuperUser(userRole === "superuser");
  // }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ type, ...formData });
    alert(`Thank you for your ${type} proposal!`);
  };

  let fields: FormField[] = [];
  let title = "";

  switch (type) {
    case "sponsor":
      fields = sponsorFields;
      title = "Sponsor Proposal";
      break;
    case "community-partner":
      fields = communityPartnerFields;
      title = "Community Partner Proposal";
      break;
    case "guest-speaker":
      fields = speakerFields;
      title = "Guest Speaker Proposal";
      break;
    default:
      return <div>Invalid proposal type.</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
        {isSuperUser && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id="postAsDefault"
              checked={postAsDefault}
              onCheckedChange={() => setPostAsDefault(!postAsDefault)}
            />
            <label
              htmlFor="postAsDefault"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Post as default
            </label>
          </div>
        )}
        {fields.map((field) => {
          if (
            field.dependsOn &&
            formData[field.dependsOn] !== field.dependsValue
          ) {
            return null;
          }
          return (
            <div key={field.name}>
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-700"
              >
                {field.label} {field.required && "*"}
              </label>
              {field.type === "textarea" ? (
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  required={field.required}
                />
              ) : field.type === "select" ? (
                <Select
                  name={field.name}
                  onValueChange={(value) =>
                    handleSelectChange(field.name, value)
                  }
                  required={field.required}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={`Select ${field.label.toLowerCase()}`}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  required={field.required}
                  disabled={!isSuperUser}
                />
              )}
            </div>
          );
        })}
        
        <div className="flex items-center">
          <p className="text-sm text-gray-700">
            Luma Calendar Link 🗓️ Subscribe:{" "}
            <a
              href="https://luma.com/CommunityMeetups"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500"
            >
              https://luma.com/CommunityMeetups
            </a>{" "}
            *
          </p>
        </div>
        <Button type="submit" disabled={!isSuperUser}>
          Submit Proposal
        </Button>
      </form>
    </div>
  );
};

export default ProposalForm;
