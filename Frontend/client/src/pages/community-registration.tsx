import React from "react";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import {
  Check,
  Plus,
  Trash2,
  Globe,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  MessageSquare,
} from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";

// --- Schemas (unchanged but banner added) ---
const memberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  isFounder: z.boolean().default(false),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
});

const registrationSchema = z.object({
  name: z.string().min(3, "Community name must be at least 3 characters"),
  tagline: z.string().optional(),
  description: z.string().min(20, "Description must be at least 20 characters"),
  domain: z.string().min(1, "Please select a domain"),
  zone: z.string().min(1, "Please select a zone"),
  state: z.string().min(1, "Please select a state"),
  city: z.string().min(1, "Please select a city"),
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits"),
  website: z.string().url().optional().or(z.literal("")),
  linkedin: z.string().url().optional().or(z.literal("")),
  twitter: z.string().url().optional().or(z.literal("")),
  facebook: z.string().url().optional().or(z.literal("")),
  instagram: z.string().url().optional().or(z.literal("")),
  discord: z.string().url().optional().or(z.literal("")),
  eventLink: z.string().url().optional().or(z.literal("")),
  // banner can be a File or null — keep loose to avoid runtime issues
  banner: z.any().nullable().optional(),
});

type Member = z.infer<typeof memberSchema>;

export default function CommunityRegistrationStepper() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [members, setMembers] = useState<Member[]>([
    {
      name: "",
      role: "Founder",
      isFounder: true,
      linkedin: "",
      twitter: "",
      email: "",
    },
  ]);

  const [zonesData, setZonesData] = useState<Record<string, string[]>>({});
  const [states, setStates] = useState<string[]>([]);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationFromPincode, setLocationFromPincode] = useState(false);

  const form = useForm<z.infer<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: "",
      tagline: "",
      description: "",
      domain: "",
      zone: "",
      state: "",
      city: "",
      pincode: "",
      website: "",
      linkedin: "",
      twitter: "",
      facebook: "",
      instagram: "",
      discord: "",
      eventLink: "",
      banner: null,
    },
  });

  const zoneWatch = useWatch({
    control: form.control,
    name: "zone",
  });

  useEffect(() => {
    if (zoneWatch && zonesData[zoneWatch]) {
      if (locationFromPincode) {
        const currentState = form.getValues("state");
        if (currentState) {
          setStates([currentState]);
        }
        return;
      }
      setStates(zonesData[zoneWatch]);
      form.setValue("state", "");
      form.setValue("city", "");
    } else {
      setStates([]);
    }
  }, [zoneWatch, zonesData, form, locationFromPincode]);

  const pincode = form.watch("pincode");
  useEffect(() => {
    if (pincode && pincode.length === 6) {
      setLoadingLocation(true);

      fetch(`https://api.postalpincode.in/pincode/${pincode}`)
        .then((res) => res.json())
        .then((data) => {
          if (
            data[0]?.Status === "Success" &&
            data[0]?.PostOffice?.length > 0
          ) {
            const office = data[0].PostOffice[0];

            const state = office.Circle || office.State || "";
            const city =
              office.Block ||
              office.District ||
              office.Division ||
              office.Name ||
              "";

            const zone =
              Object.entries(zonesData).find(([_, states]) =>
                states.includes(state)
              )?.[0] || "";

            setLocationFromPincode(true);
            form.setValue("zone", zone, { shouldValidate: true });
            form.setValue("state", state, { shouldValidate: true });
            form.setValue("city", city, { shouldValidate: true });
            setStates([state]);
          } else {
            throw new Error("Invalid pincode");
          }
        })
        .catch(() => {
          toast({
            title: "Invalid Pincode",
            description: "Could not find location. Please enter manually.",
            variant: "destructive",
          });
          setLocationFromPincode(false);
        })
        .finally(() => setLoadingLocation(false));
    } else {
      setLocationFromPincode(false);
    }
  }, [pincode, zonesData, form, toast]);

  useEffect(() => {
    fetch("/data/india_5_zones.json")
      .then((res) => res.json())
      .then((data) => setZonesData(data))
      .catch(() =>
        toast({
          title: "Error",
          description: "Failed to load zones",
          variant: "destructive",
        })
      );
  }, [toast]);

  const addMember = () => {
    setMembers([
      ...members,
      {
        name: "",
        role: "",
        isFounder: false,
        linkedin: "",
        twitter: "",
        email: "",
      },
    ]);
  };

  const removeMember = (index: number) => {
    if (index === 0) return;
    setMembers(members.filter((_, i) => i !== index));
  };

  const updateMember = (
    index: number,
    field: keyof Member,
    value: string | boolean
  ) => {
    const updated = [...members];
    // @ts-ignore
    updated[index] = { ...updated[index], [field]: value };
    setMembers(updated);
  };

  const onSubmit = async (data: z.infer<typeof registrationSchema>) => {
    console.log("Submitting community data:", data);
    const adminId = sessionStorage.getItem("uid");
    if (!adminId) {
      toast({
        title: "Error",
        description: "You must be logged in to create a community.",
        variant: "destructive",
      });
      return;
    }

    let bannerData: string | null | File = null;
    if (data.banner instanceof File) {
      try {
        bannerData = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(data.banner as File);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (error) => reject(error);
        });
      } catch (error) {
        console.error("Error converting file to base64:", error);
        toast({
          title: "Error",
          description: "Failed to process banner image.",
          variant: "destructive",
        });
        return;
      }
    } else {
      bannerData = data.banner;
    }

    const communityData = {
      ...data,
      banner: bannerData,
      members,
      countryState: data.state,
      _communityAdminid: adminId,
    };

    try {
      const response = await fetch(
        "https://indian-community-beta.vercel.app/api/communities",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(communityData),
        }
      );

      if (response.ok) {
        toast({
          title: "Registration Submitted!",
          description: "Your community registration is pending approval.",
        });
        form.reset();
        setMembers([
          {
            name: "",
            role: "Founder",
            isFounder: true,
            linkedin: "",
            twitter: "",
            email: "",
          },
        ]);
        setCurrentStep(1);
      } else {
        toast({
          title: "Error",
          description: "Failed to submit registration.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting registration:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  const domains = [
    "Technology",
    "Startup",
    "Marketing",
    "Design",
    "Finance",
    "Others",
  ];

  // Validate current step before moving next
  const validateStep = async () => {
    const stepFields: Record<number, string[]> = {
      1: ["name", "description"],
      2: ["domain", "pincode", "zone", "state", "city"],
      3: ["banner"],
      4: [],
    };

    const fields = stepFields[currentStep] || [];
    const result = await form.trigger(fields as any);
    return result;
  };

  const nextStep = async () => {
    const valid = await validateStep();
    if (!valid) return;
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const steps = ["Basic Info", "Details", "Social Links", "Review & Submit"];

  const Stepper = ({ step }: { step: number }) => {
    return (
      <div className="w-full flex items-center justify-between mb-6">
        {steps.map((label, idx) => {
          const stepIndex = idx + 1;
          const isActive = stepIndex === step;
          const isDone = stepIndex < step;

          return (
            <div key={label} className="flex-1 min-w-0">
              <div className="flex items-center">
                <div
                  className={`relative z-10 flex items-center justify-center h-10 w-10 rounded-full border-2 ${
                    isDone
                      ? "border-transparent bg-purple-600 text-white"
                      : isActive
                      ? "border-purple-600 bg-white text-purple-600"
                      : "border-gray-200 bg-white text-gray-500"
                  }`}
                >
                  {isDone ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="font-medium">{stepIndex}</span>
                  )}
                </div>

                {idx !== steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 ${
                      isDone ? "bg-purple-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
              <div className="text-center mt-2 text-sm truncate">{label}</div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card className="p-6 space-y-6">
            <h2 className="text-2xl font-bold">Basic Information</h2>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Community Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Tech Innovators Mumbai"
                      {...field}
                      data-testid="input-community-name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tagline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tagline</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Building the future of technology together"
                      {...field}
                      data-testid="input-tagline"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about your community, what it does, and what makes it special..."
                      className="min-h-32"
                      {...field}
                      data-testid="input-description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Card>
        );
      case 2:
        return (
          <Card className="p-6 space-y-6">
            <h2 className="text-2xl font-bold">Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="domain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Domain *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger data-testid="select-domain">
                          <SelectValue placeholder="Select domain" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {domains.map((domain) => (
                          <SelectItem key={domain} value={domain.toLowerCase()}>
                            {domain}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="pincode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pincode *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="400001"
                      maxLength={6}
                      {...field}
                      data-testid="input-pincode"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {locationFromPincode && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="zone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zone</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={locationFromPincode}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a zone" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.keys(zonesData).map((zone) => (
                            <SelectItem key={zone} value={zone}>
                              {zone}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={!states.length || locationFromPincode}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a state" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {states.map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter city"
                          {...field}
                          disabled={locationFromPincode}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </Card>
        );
      case 3:
        return (
          <Card className="p-6 space-y-6">
            <h2 className="text-2xl font-bold">Social Presence</h2>

            {/* Banner field is required before moving forward */}
            <FormField
              control={form.control}
              name="banner"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Banner Image *</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        field.onChange(file);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com"
                        {...field}
                        data-testid="input-website"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="linkedin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://linkedin.com/company/..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="twitter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twitter</FormLabel>
                    <FormControl>
                      <Input placeholder="https://twitter.com/..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="facebook"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facebook</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://facebook.com/..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://instagram.com/..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="discord"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discord</FormLabel>
                    <FormControl>
                      <Input placeholder="https://discord.gg/..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Core Members</h3>
              {members.map((member, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4"
                >
                  <Input
                    placeholder="Name"
                    value={member.name}
                    onChange={(e) =>
                      updateMember(index, "name", e.target.value)
                    }
                  />
                  <Input
                    placeholder="Role"
                    value={member.role}
                    onChange={(e) =>
                      updateMember(index, "role", e.target.value)
                    }
                  />
                  <Input
                    placeholder="LinkedIn"
                    value={member.linkedin}
                    onChange={(e) =>
                      updateMember(index, "linkedin", e.target.value)
                    }
                  />
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={member.isFounder}
                      onCheckedChange={(checked) =>
                        updateMember(index, "isFounder", !!checked)
                      }
                    />
                    <label>Founder</label>
                    {index > 0 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeMember(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addMember}>
                <Plus className="h-4 w-4 mr-2" /> Add Member
              </Button>
            </div>
          </Card>
        );
      case 4:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left: full details */}
            <div className="lg:col-span-2">
              <Card className="p-6 space-y-6">
                <h2 className="text-2xl font-bold">Review your submission</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">Community Name:</h3>
                    <p>{form.getValues("name")}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Tagline:</h3>
                    <p>{form.getValues("tagline")}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Description:</h3>
                    <p>{form.getValues("description")}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Domain:</h3>
                    <p>{form.getValues("domain")}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Location:</h3>
                    <p>
                      {form.getValues("city")}, {form.getValues("state")},{" "}
                      {form.getValues("pincode")}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Website & Social</h3>
                    <div className="flex items-center space-x-2 mt-2">
                      {form.getValues("website") && (
                        <Globe className="h-4 w-4 text-gray-600" />
                      )}
                      {form.getValues("linkedin") && (
                        <Linkedin className="h-4 w-4 text-gray-600" />
                      )}
                      {form.getValues("twitter") && (
                        <Twitter className="h-4 w-4 text-gray-600" />
                      )}
                      {form.getValues("facebook") && (
                        <Facebook className="h-4 w-4 text-gray-600" />
                      )}
                      {form.getValues("instagram") && (
                        <Instagram className="h-4 w-4 text-gray-600" />
                      )}
                      {form.getValues("discord") && (
                        <MessageSquare className="h-4 w-4 text-gray-600" />
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold">Core Members:</h3>
                    <ul>
                      {members.map((member, index) => (
                        <li key={index}>
                          {member.name} - {member.role}{" "}
                          {member.isFounder && "(Founder)"}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right: card styled like the image */}
            <aside className="lg:col-span-1">
              <Card className="overflow-hidden rounded-lg shadow-md">
                {/* Banner preview */}
                <div className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                  {form.getValues("banner") ? (
                    <img
                      src={
                        typeof form.getValues("banner") === "string"
                          ? form.getValues("banner")
                          : form.getValues("banner") &&
                            URL.createObjectURL(form.getValues("banner"))
                      }
                      alt="banner"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-gray-400">No banner uploaded</div>
                  )}
                </div>

                {/* Avatar overlapping */}
                <div className="-mt-8 px-6">
                  <div className="relative">
                    <div className="absolute left-1/2 transform -translate-x-1/2 -top-6">
                      <div className="h-12 w-12 rounded-full border-4 border-white overflow-hidden shadow-sm bg-white">
                        {/* small avatar preview (use banner center crop fallback) */}
                        {form.getValues("banner") ? (
                          <img
                            src={
                              typeof form.getValues("banner") === "string"
                                ? form.getValues("banner")
                                : form.getValues("banner") &&
                                  URL.createObjectURL(form.getValues("banner"))
                            }
                            alt="avatar"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200" />
                        )}
                      </div>
                    </div>
                    <div className="pt-8 text-center pb-6">
                      <h3 className="text-lg font-semibold">
                        {form.getValues("name") || "Your Community"}
                      </h3>

                      <p className="font-medium mt-2">
                        {form.getValues("city")
                          ? `${form.getValues("city")}, ${form.getValues(
                              "state"
                            )}`
                          : "Location"}
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        {form.getValues("city")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t px-6 py-4">
                  {/* Social Icons Row */}
                  <div className="flex items-center justify-center space-x-4 mb-4 text-gray-600">
                    {form.getValues("website") && (
                      <a
                        href={form.getValues("website")}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Website"
                      >
                        <Globe className="h-5 w-5" />
                      </a>
                    )}
                    {form.getValues("linkedin") && (
                      <a
                        href={form.getValues("linkedin")}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                      >
                        <Linkedin className="h-5 w-5" />
                      </a>
                    )}
                    {form.getValues("twitter") && (
                      <a
                        href={form.getValues("twitter")}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Twitter"
                      >
                        <Twitter className="h-5 w-5" />
                      </a>
                    )}
                    {form.getValues("facebook") && (
                      <a
                        href={form.getValues("facebook")}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Facebook"
                      >
                        <Facebook className="h-5 w-5" />
                      </a>
                    )}
                    {form.getValues("instagram") && (
                      <a
                        href={form.getValues("instagram")}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Instagram"
                      >
                        <Instagram className="h-5 w-5" />
                      </a>
                    )}
                    {form.getValues("discord") && (
                      <a
                        href={form.getValues("discord")}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Discord"
                      >
                        <MessageSquare className="h-5 w-5" />
                      </a>
                    )}
                  </div>

                  <div className="">
                    <div className="flex items-center justify-between">
                      {/* <div> */}
                      {/* <p className="text-sm text-gray-600">Website</p> */}
                      {/* <p className="font-medium truncate max-w-xs">{form.getValues("website") || "-"}</p> */}
                      {/* </div> */}
                      <div className="text-right">
                        {/* <p className="text-sm text-gray-600">Members</p>
                        <p className="font-medium">{members.length}</p> */}
                      </div>
                    </div>

                    <div className="mt-4">
                      <Button type="submit" className="w-full">
                        Submit Community
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        className="w-full mt-2"
                        onClick={() => setCurrentStep(1)}
                      >
                        Edit from start
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </aside>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Register Your Community</h1>
            <p className="text-muted-foreground">
              Fill in the details below to list your community on Community
              Connect
            </p>
          </div>

          {/* Stepper */}
          <div className="mb-6">
            <Stepper step={currentStep} />
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {renderStep()}

              {/* Navigation buttons - when on final step buttons are inside right card but keep a fallback here for small screens */}
              <div className="flex justify-between items-center">
                {currentStep > 1 && (
                  <Button type="button" variant="ghost" onClick={prevStep}>
                    Previous
                  </Button>
                )}

                <div className="flex items-center space-x-2 ml-auto">
                  {currentStep < 4 && (
                    <Button type="button" onClick={nextStep}>
                      Next
                    </Button>
                  )}

                  {/* On small screens show submit button at bottom */}
                  {currentStep === 4 && (
                    <div className="lg:hidden w-full">
                      <Button type="submit" className="w-full">
                        Submit Community
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
}
