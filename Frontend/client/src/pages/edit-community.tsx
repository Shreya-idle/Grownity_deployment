import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  MapPin,
  Users,
  Globe,
  Linkedin,
  Twitter,
  Facebook,
  Mail,
  CheckCircle,
  Upload,
  Save,
  X,
  Trash2,
  Plus,
  Edit3,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Footer } from "@/components/footer";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  tagline: z.string().optional(),
  description: z.string().optional(),
  mission: z.string().optional(),
  city: z.string().optional(),
  countryState: z.string().optional(),
  zone: z.string().optional(),
  domain: z.string().optional(),
  numberOfMembers: z.number().int().optional(),
  social_links: z
    .object({
      website: z.string().url().optional().or(z.literal("")),
      linkedin: z.string().url().optional().or(z.literal("")),
      twitter: z.string().url().optional().or(z.literal("")),
      facebook: z.string().url().optional().or(z.literal("")),
      eventLink: z.string().url().optional().or(z.literal("")),
    })
    .optional(),
  members: z
    .array(
      z.object({
        name: z.string(),
        role: z.string(),
        linkedin: z.string().url().optional().or(z.literal("")),
        email: z.string().email().optional().or(z.literal("")),
      })
    )
    .optional(),
  banner: z.string().optional(),
});

interface Member {
  name: string;
  role: string;
  linkedin?: string;
  email?: string;
}

interface SocialLinks {
  website?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  eventLink?: string;
}

export default function EditCommunityPage() {
  const { id } = useParams<{ id: string }>();
  const [community, setCommunity] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(true);
  const [saving, setSaving] = useState(false);

  // <-- move useToast inside the component
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
  });

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        const response = await fetch(
          `https://indian-community-beta.vercel.app//api/communities/${id}`
        );
        if (response.ok) {
          const data = await response.json();
          setCommunity(data);
          form.reset(data);
        }
      } catch (error) {
        console.error("Failed to fetch community:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchCommunity();
    }
  }, [id, form]);

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCommunity({
          ...community,
          banner: event.target?.result as string,
        });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleChange = (field: string, value: any) => {
    setCommunity({ ...community, [field]: value });
  };

  const handleSocialChange = (platform: string, value: string) => {
    setCommunity({
      ...community,
      social_links: { ...community.social_links, [platform]: value },
    });
  };

  const addMember = () => {
    setCommunity({
      ...community,
      members: [
        ...(community.members || []),
        { name: "", role: "Member", linkedin: "", email: "" },
      ],
    });
  };

  const updateMember = (index: number, field: string, value: string) => {
    const updated = [...(community.members || [])];
    updated[index] = { ...updated[index], [field]: value };
    setCommunity({ ...community, members: updated });
  };

  const removeMember = (index: number) => {
    setCommunity({
      ...community,
      members: (community.members || []).filter(
        (_: any, i: number) => i !== index
      ),
    });
  };

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setSaving(true);
    try {
      const response = await fetch(
        `https://indian-community-beta.vercel.app//api/communities/update/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
          credentials: "include",
        }
      );

      if (response.ok) {
        toast({
          title: "Success",
          description: "Community updated successfully.",
        });
        setIsEditMode(false);
      } else {
        toast({
          title: "Error",
          description: "Failed to update community.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to update community:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!community) {
    return (
      <div className="flex justify-center items-center h-screen">
        Community not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <main className="flex-1 pt-4">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
            <div
              className={`h-48 bg-cover bg-center rounded-lg overflow-hidden ${
                isEditMode ? "relative group cursor-pointer" : ""
              }`}
              style={{
                backgroundImage: `url(${community.banner})`,
              }}
            >
              {isEditMode && (
                <label className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center cursor-pointer transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBannerUpload}
                    className="hidden"
                  />
                  <div className="text-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Upload className="h-8 w-8 text-white mx-auto mb-2" />
                    <p className="text-white font-medium text-sm">
                      Click to upload
                    </p>
                  </div>
                </label>
              )}
            </div>

            <div className="px-6 pb-4">
              <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-16 md:-mt-12">
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 md:w-36 md:h-36 rounded-lg bg-white shadow-lg flex items-center justify-center border-4 border-white">
                    <div className="w-full h-full rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-4xl md:text-5xl font-bold text-white">
                      {community.name?.substring(0, 2).toUpperCase()}
                    </div>
                  </div>
                </div>

                <div className="flex-1 md:pb-2">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {isEditMode ? (
                          <Input
                            {...form.register("name")}
                            defaultValue={community.name}
                            className="text-2xl md:text-3xl font-bold border-orange-300 focus:border-orange-500"
                          />
                        ) : (
                          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                            {community.name}
                          </h1>
                        )}
                        {community.verified && (
                          <CheckCircle className="h-5 w-5 text-blue-600 fill-blue-600" />
                        )}
                      </div>

                      {isEditMode ? (
                        <Input
                          {...form.register("tagline")}
                          defaultValue={community.tagline}
                          className="text-base text-slate-700 border-orange-300 focus:border-orange-500 mb-2"
                        />
                      ) : (
                        <p className="text-base text-slate-700 mb-2">
                          {community.tagline}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-600">
                        <span className="flex items-center gap-1">
                          <Globe className="h-4 w-4" />
                          {isEditMode ? (
                            <Input
                              {...form.register("domain")}
                              defaultValue={community.domain}
                              className="text-sm border-orange-300 focus:border-orange-500 h-auto p-0 w-28"
                            />
                          ) : (
                            community.domain
                          )}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {isEditMode ? (
                            <>
                              <Input
                                {...form.register("city")}
                                defaultValue={community.city}
                                className="text-sm border-orange-300 focus:border-orange-500 h-auto p-0 w-24"
                              />
                              <span>,</span>
                              <Input
                                {...form.register("countryState")}
                                defaultValue={community.countryState}
                                className="text-sm border-orange-300 focus:border-orange-500 h-auto p-0 w-28"
                              />
                            </>
                          ) : (
                            <span>
                              {community.city}, {community.countryState}
                            </span>
                          )}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {isEditMode ? (
                            <Input
                              type="number"
                              {...form.register("numberOfMembers", {
                                valueAsNumber: true,
                              })}
                              defaultValue={community.numberOfMembers}
                              className="text-sm border-orange-300 focus:border-orange-500 h-auto p-0 w-20"
                            />
                          ) : (
                            <span>
                              {(
                                community.numberOfMembers || 0
                              ).toLocaleString()}{" "}
                              members
                            </span>
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {isEditMode ? (
                        <>
                          <Button
                            onClick={form.handleSubmit(onSubmit)}
                            disabled={saving}
                            className="bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 text-white font-bold px-4 py-1 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 relative top-2"
                          >
                            {saving ? (
                              "Saving..."
                            ) : (
                              <>
                                <Save className="h-4 w-4 mr-2" />
                                Save
                              </>
                            )}
                          </Button>
                          <Button
                            onClick={() => setIsEditMode(false)}
                            variant="outline"
                            className="border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold relative top-2"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            onClick={() => setIsEditMode(true)}
                            className="bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 text-white font-bold px-4 py-1 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 relative top-2"
                          >
                            <Edit3 className="h-4 w-4 mr-2" />
                            Edit Community
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-6 border-t border-slate-200 pt-4">
                {isEditMode ? (
                  <>
                    {[
                      "website",
                      "linkedin",
                      "twitter",
                      "facebook",
                      "eventLink",
                    ].map((key) => (
                      <div
                        key={key}
                        className="flex items-center gap-2 w-full md:w-auto"
                      >
                        <label className="text-xs font-medium text-slate-700 w-16">
                          {key === "eventLink" ? "Events" : key}:
                        </label>
                        <Input
                          {...form.register(`social_links.${key}` as const)}
                          defaultValue={
                            community.social_links?.[
                              key as keyof SocialLinks
                            ] || ""
                          }
                          placeholder={`${key} URL`}
                          className="text-xs border-orange-300 focus:border-orange-500 flex-1"
                        />
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    {community.social_links?.website && (
                      <a
                        href={community.social_links.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-slate-300 hover:bg-slate-100"
                        >
                          <Globe className="h-5 w-5 mr-2" />
                          Website
                        </Button>
                      </a>
                    )}
                    {community.social_links?.linkedin && (
                      <a
                        href={community.social_links.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-slate-300 hover:bg-slate-100"
                        >
                          <Linkedin className="h-5 w-5 mr-2" />
                          LinkedIn
                        </Button>
                      </a>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-8">
            <div className="lg:col-span-2 space-y-4">
              <Card className="p-6 bg-white border border-slate-200 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  About Community
                </h2>
                {isEditMode ? (
                  <Textarea
                    {...form.register("description")}
                    defaultValue={community.description}
                    rows={4}
                    className="border-orange-300 focus:border-orange-500"
                  />
                ) : (
                  <p className="text-slate-600 leading-relaxed text-justify">
                    {community.description}
                  </p>
                )}
              </Card>

              <Card className="p-6 bg-white border border-slate-200 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  Our Mission
                </h2>
                {isEditMode ? (
                  <Textarea
                    {...form.register("mission")}
                    defaultValue={community.mission}
                    rows={3}
                    className="border-orange-300 focus:border-orange-500"
                  />
                ) : (
                  <p className="text-slate-600 leading-relaxed text-justify">
                    {community.mission}
                  </p>
                )}
              </Card>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-slate-900">
                    Points of Contact
                  </h2>
                  {isEditMode && (
                    <Button
                      onClick={addMember}
                      size="sm"
                      className="bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {community.members &&
                    community.members.map((poc: Member, index: number) => (
                      <Card
                        key={index}
                        className="p-6 bg-white border border-slate-200 shadow-sm hover:shadow-lg transition-all"
                      >
                        {isEditMode ? (
                          <div className="space-y-3">
                            <div className="flex items-start justify-between">
                              <Avatar className="w-14 h-14 border-2 border-orange-100">
                                <AvatarImage src={poc.linkedin} />
                                <AvatarFallback className="bg-gradient-to-br from-orange-400 to-amber-500 text-white font-bold">
                                  {poc.name?.substring(0, 2).toUpperCase() ||
                                    "?"}
                                </AvatarFallback>
                              </Avatar>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeMember(index)}
                                className="text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="space-y-2">
                              <div>
                                <Label className="text-xs">Name</Label>
                                <Input
                                  defaultValue={poc.name}
                                  onChange={(e) =>
                                    updateMember(index, "name", e.target.value)
                                  }
                                  className="text-sm border-orange-300 focus:border-orange-500"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Role</Label>
                                <select
                                  value={poc.role}
                                  onChange={(e) =>
                                    updateMember(index, "role", e.target.value)
                                  }
                                  className="w-full text-sm border border-orange-300 rounded px-2 py-1"
                                >
                                  <option value="Founder">Founder</option>
                                  <option value="Co-Founder">Co-Founder</option>
                                  <option value="Manager">Manager</option>
                                  <option value="Member">Member</option>
                                </select>
                              </div>
                              <div>
                                <Label className="text-xs">LinkedIn</Label>
                                <Input
                                  defaultValue={poc.linkedin || ""}
                                  onChange={(e) =>
                                    updateMember(
                                      index,
                                      "linkedin",
                                      e.target.value
                                    )
                                  }
                                  className="text-sm border-orange-300 focus:border-orange-500"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Email</Label>
                                <Input
                                  type="email"
                                  defaultValue={poc.email || ""}
                                  onChange={(e) =>
                                    updateMember(index, "email", e.target.value)
                                  }
                                  className="text-sm border-orange-300 focus:border-orange-500"
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start gap-4">
                            <Avatar className="w-14 h-14 border-2 border-orange-100">
                              <AvatarImage src={poc.linkedin} />
                              <AvatarFallback className="bg-gradient-to-br from-orange-400 to-amber-500 text-white font-bold">
                                {poc.name.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h3 className="font-semibold text-slate-900">
                                {poc.name}
                              </h3>
                              <p className="text-sm text-slate-600 mb-3">
                                {poc.role}
                              </p>
                              <div className="flex gap-2 flex-wrap">
                                {poc.linkedin && (
                                  <a
                                    href={poc.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="border-blue-300 text-blue-600 hover:bg-blue-50 text-xs"
                                    >
                                      <Linkedin className="h-3 w-3 mr-1" />
                                      LinkedIn
                                    </Button>
                                  </a>
                                )}
                                {poc.email && (
                                  <a href={`mailto:${poc.email}`}>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="border-orange-300 text-orange-600 hover:bg-orange-50 text-xs"
                                    >
                                      <Mail className="h-3 w-3 mr-1" />
                                      Email
                                    </Button>
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </Card>
                    ))}
                </div>
              </div>
            </div>

            <div>
              <Card className="p-5 bg-white border border-slate-200 shadow-sm sticky top-24 space-y-3">
                <div className="space-y-1">
                  <p className="text-sm text-slate-700 font-medium">
                    Community Members
                  </p>
                  <p className="text-3xl font-bold text-slate-900">
                    {(community.numberOfMembers || 0).toLocaleString()}
                  </p>
                </div>
                <div className="border-t border-slate-200 pt-3">
                  <p className="text-sm text-slate-700 font-medium mb-2">
                    Zone
                  </p>
                  <Badge className="bg-slate-100 text-slate-800 border-slate-200">
                    {community.zone} India
                  </Badge>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
