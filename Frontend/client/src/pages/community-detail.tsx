import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MapPin,
  Users,
  Globe,
  Linkedin,
  Twitter,
  Facebook,
  Mail,
  CheckCircle,
  Share2,
  Bell,
  BellOff,
  Building2,
  Calendar,
  Award,
  ExternalLink,
  ChevronRight,
  Clock,
  XCircle,
  Edit,
} from "lucide-react";

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

interface Community {
  _id: string;
  name: string;
  tagline: string;
  verified: boolean;
  city: string;
  countryState: string;
  zone: string;
  members: Member[];
  numberOfMembers: number;
  domain: string;
  social_links?: SocialLinks;
  description: string;
  mission: string;
  banner: string;
  status?: "pending" | "approved" | "rejected";
  _communityAdminid?: string | { _id: string };
}

interface User {
  _id: string;
  communityJoined: string[];
}

interface CommunityDetailProps {
  params: { id: string };
}

export default function CommunityDetail({ params }: CommunityDetailProps) {
  const { id } = params;
  const [, navigate] = useLocation();
  const [community, setCommunity] = useState<Community | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isMember, setIsMember] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [isFollowing, setIsFollowing] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          "https://indian-community-beta.vercel.app//api/user",
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (response.ok) {
          const userData = await response.json();
          setUser(userData.user);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        const response = await fetch(
          `https://indian-community-beta.vercel.app//api/communities/${id}`
        );
        if (!response.ok) {
          throw new Error("Community not found");
        }
        const data = await response.json();
        setCommunity(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCommunity();
  }, [id]);

  useEffect(() => {
    if (user && community && Array.isArray(user.communityJoined)) {
      setIsMember(user.communityJoined.includes(community._id));
    }
  }, [user, community]);

  // Check if user is the owner of the community
  useEffect(() => {
    if (user && community && community._communityAdminid) {
      const adminId =
        typeof community._communityAdminid === "object"
          ? community._communityAdminid._id
          : community._communityAdminid;
      setIsOwner(user._id === adminId);
    }
  }, [user, community]);

  const handleJoinCommunity = async () => {
    if (!user) {
      alert("Please log in to join a community.");
      return;
    }

    try {
      const response = await fetch(
        "https://indian-community-beta.vercel.app//api/communities/join",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ communityID: id }),
        }
      );

      if (response.ok) {
        alert("Successfully joined the community!");
        setIsMember(true);
        setCommunity((prev) =>
          prev ? { ...prev, numberOfMembers: prev.numberOfMembers + 1 } : null
        );
      } else {
        const errorData = await response.json();
        alert(`Failed to join community: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error joining community:", error);
      alert("An error occurred while trying to join the community.");
    }
  };

  const handleLeaveCommunity = async () => {
    if (!user) {
      alert("Please log in to leave a community.");
      return;
    }

    try {
      const response = await fetch(
        "https://indian-community-beta.vercel.app//api/communities/leave",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ communityID: id }),
        }
      );

      if (response.ok) {
        alert("Successfully left the community!");
        setIsMember(false);
        setCommunity((prev) =>
          prev ? { ...prev, numberOfMembers: prev.numberOfMembers - 1 } : null
        );
      } else {
        const errorData = await response.json();
        alert(`Failed to leave community: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error leaving community:", error);
      alert("An error occurred while trying to leave the community.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <div className="flex-1 flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            <p className="mt-4 text-slate-600">Loading community...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !community) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <div className="flex-1 flex items-center justify-center pt-20">
          <div className="text-center">
            <p className="text-xl text-red-600">
              {error || "Community not found"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <main className="flex-1 pt-4 top-2">
        {/* Hero Banner Section */}
        <div className="bg-white border-b border-slate-200 top-0 left-0 w-full z-50 sticky">
          <div className="max-w-6xl mx-auto">
            <div
              className="h-48 bg-cover bg-center"
              style={{
                backgroundImage: `url(${
                  community.banner ||
                  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&h=300&fit=crop"
                })`,
              }}
            />

            {/* Profile Section */}
            <div className="px-6 pb-4 mt-7">
              <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-16 md:-mt-12">
                {/* Community Logo */}
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 md:w-36 md:h-36 rounded-lg bg-white shadow-lg flex items-center justify-center border-4 border-white">
                    <div className="w-full h-full rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-4xl md:text-5xl font-bold text-white">
                      {/* Use initials or a static image for the logo */}
                      {community.name.substring(0, 2).toUpperCase()}
                      {/* Or, if you want a static image instead of initials: */}
                      {/* <img src="/image/indian_skyline.png" alt="Community Logo" className="h-20 w-20 rounded-lg" /> */}
                    </div>
                  </div>
                </div>

                {/* Community Info & Actions */}
                <div className="flex-1 md:pb-2 ">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mt-7">
                          {community.name}
                        </h1>
                        {community.verified && (
                          <CheckCircle className="h-5 w-5 text-blue-600 fill-blue-600" />
                        )}
                        {/* Status Badge */}
                        {community.status === "pending" && (
                          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300 hover:bg-yellow-100 flex items-center gap-1 mt-7">
                            <Clock className="h-3 w-3" />
                            Pending
                          </Badge>
                        )}
                        {community.status === "rejected" && (
                          <Badge className="bg-red-100 text-red-700 border-red-300 hover:bg-red-100 flex items-center gap-1 mt-7">
                            <XCircle className="h-3 w-3" />
                            Rejected
                          </Badge>
                        )}
                        {community.status === "approved" && (
                          <Badge className="bg-green-100 text-green-700 border-green-300 hover:bg-green-100 flex items-center gap-1 mt-7">
                            <CheckCircle className="h-3 w-3" />
                            Approved
                          </Badge>
                        )}
                      </div>
                      <p className="text-base text-slate-700 mb-2">
                        {community.tagline}
                      </p>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex gap-3">
                          {community.social_links?.website && (
                            <a
                              href={community.social_links.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Website"
                            >
                              <Globe className="h-5 w-5 text-slate-600 hover:text-slate-800 transition-colors" />
                            </a>
                          )}
                          {community.social_links?.facebook && (
                            <a
                              href={community.social_links.facebook}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Facebook"
                            >
                              <Facebook className="h-5 w-5 text-[#1877F3] hover:text-[#1464d8] transition-colors" />
                            </a>
                          )}
                          {community.social_links?.twitter && (
                            <a
                              href={community.social_links.twitter}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Twitter"
                            >
                              <Twitter className="h-5 w-5 text-[#1DA1F2] hover:text-[#0c8de0] transition-colors" />
                            </a>
                          )}
                          {community.social_links?.linkedin && (
                            <a
                              href={community.social_links.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="LinkedIn"
                            >
                              <Linkedin className="h-5 w-5 text-[#0A66C2] hover:text-[#094d94] transition-colors" />
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-600">
                        <span className="flex items-center gap-1">
                          <Building2 className="h-4 w-4" />
                          {community.domain}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {community.city}, {community.countryState}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {(
                            community.numberOfMembers || 0
                          ).toLocaleString()}{" "}
                          members
                        </span>
                        <span>•</span>
                        <span>
                          <p className="text-xs text-slate-500">
                            {community.zone} India
                          </p>
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-12">
                      {isMember ? (
                        <>
                          <Button
                            onClick={handleLeaveCommunity}
                            variant="outline"
                            className="border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold"
                          >
                            <Users className="h-4 w-4 mr-2" />
                            Member
                          </Button>
                          <Button
                            onClick={() => setIsFollowing(!isFollowing)}
                            className={`font-semibold transition-all ${
                              isFollowing
                                ? "bg-orange-600 hover:bg-orange-700 text-white"
                                : "bg-white border-2 border-orange-600 text-orange-600 hover:bg-orange-50"
                            }`}
                          >
                            {isFollowing ? (
                              <>
                                <Bell className="h-4 w-4 mr-2" />
                                Following
                              </>
                            ) : (
                              <>
                                <BellOff className="h-4 w-4 mr-2" />
                                Follow
                              </>
                            )}
                          </Button>
                        </>
                      ) : (
                        <Button
                          onClick={handleJoinCommunity}
                          className="relative bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 hover:from-orange-600 hover:via-orange-700 hover:to-amber-600 text-white font-bold my-3 px-8 py-1 text-base rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                          <Users className="h-5 w-5 mr-2 relative z-10" />
                          <span className="relative z-10">Join Community</span>
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="icon"
                        className="border-slate-300 hover:bg-slate-50 hover:border-orange-300 transition-colors mt-3"
                        onClick={async () => {
                          const shareData = {
                            title: community.name,
                            text: community.tagline,
                            url: window.location.href,
                          };
                          try {
                            if (navigator.share) {
                              await navigator.share(shareData);
                            } else {
                              await navigator.clipboard.writeText(window.location.href);
                              alert("Link copied to clipboard!");
                            }
                          } catch (err) {
                            console.error("Error sharing:", err);
                          }
                        }}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                      {/* Edit Button - Only show for owner */}
                      {isOwner && (
                        <Button
                          onClick={() => navigate(`/community/edit/${id}`)}
                          variant="outline"
                          className="border-orange-300 text-orange-600 hover:bg-orange-50 hover:border-orange-400 transition-colors mt-3 font-semibold"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex gap-6 mt-6 border-b border-slate-200 -mb-4">
                <button
                  onClick={() => setActiveTab("home")}
                  className={`pb-4 px-1 font-semibold text-sm transition-colors relative ${
                    activeTab === "home"
                      ? "text-orange-600"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Home
                  {activeTab === "home" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("about")}
                  className={`pb-4 px-1 font-semibold text-sm transition-colors relative ${
                    activeTab === "about"
                      ? "text-orange-600"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {/* About */}
                  {/* {activeTab === "about" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600"></div>
                  )} */}
                </button>
                <button
                  onClick={() => setActiveTab("people")}
                  className={`pb-4 px-1 font-semibold text-sm transition-colors relative ${
                    activeTab === "people"
                      ? "text-orange-600"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  People
                  {activeTab === "people" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600"></div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area - SWAPPED: Posts on left, About on right */}
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Main Content (Posts) */}
            <div className="lg:col-span-2 space-y-4">
              {activeTab === "home" && (
                <>
                  {/* Sample Post */}
                  <Card className="p-6 bg-white border border-slate-200 shadow-sm">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        {community.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">
                          {community.name}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {(community.numberOfMembers || 0).toLocaleString()}{" "}
                          members • 2d
                        </p>
                      </div>
                    </div>

                    <p className="text-slate-700 mb-4">
                      Welcome to our community! We're excited to have you here.
                      Join us to connect, learn, and grow together in the{" "}
                      {community.domain} space.
                    </p>
                  </Card>
                </>
              )}

              {activeTab === "people" && (
                <>
                  <Card className="p-6 bg-white border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-bold text-slate-900">
                        Points of Contact
                      </h2>
                      <span className="text-sm text-slate-500">
                        {community.members?.length || 0} contacts
                      </span>
                    </div>

                    <div className="space-y-4">
                      {community.members &&
                        community.members.map((poc, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-4 p-4 rounded-lg hover:bg-slate-50 transition-colors"
                          >
                            <Avatar className="w-16 h-16 border-2 border-orange-100">
                              <AvatarImage src={poc.linkedin} />
                              <AvatarFallback className="bg-gradient-to-br from-orange-400 to-amber-500 text-white font-bold text-lg">
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
                              <div className="flex gap-2">
                                {poc.linkedin && (
                                  <a
                                    href={poc.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="border-blue-300 text-blue-600 hover:bg-blue-50"
                                    >
                                      <Linkedin className="h-4 w-4 mr-1" />
                                      Connect
                                    </Button>
                                  </a>
                                )}
                                {poc.email && (
                                  <a href={`mailto:${poc.email}`}>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="border-slate-300 text-slate-600 hover:bg-slate-50"
                                    >
                                      <Mail className="h-4 w-4 mr-1" />
                                      Email
                                    </Button>
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </Card>

                  <Card className="p-6 bg-white border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-1">
                          All Members
                        </h3>
                        <p className="text-sm text-slate-600">
                          {(community.numberOfMembers || 0).toLocaleString()}{" "}
                          members in this community
                        </p>
                      </div>
                      {/* <Button
                        variant="outline"
                        size="sm"
                        className="border-orange-300 text-orange-600 hover:bg-orange-50"
                      >
                        See all
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button> */}
                    </div>
                  </Card>
                </>
              )}
            </div>

            {/* Right Sidebar (About) */}
            <div className="lg:col-span-1 space-y-4">
              {activeTab === "home" && (
                <>
                  <Card className="p-5 bg-white border border-slate-200 shadow-sm">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-2">
                          Announcement
                        </h3>
                        <p className="text-sm text-slate-600 line-clamp-3">
                          {community.description}
                        </p>
                      </div>

                      <div className="border-t border-slate-200 pt-4">
                        <Card className="p-6 bg-white border border-slate-200 shadow-sm">
                          <h3 className="font-semibold text-slate-900 mb-4">
                            Specialties
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            <Badge className="bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-100">
                              {community.domain}
                            </Badge>
                            <Badge className="bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-100">
                              Community Building
                            </Badge>
                            <Badge className="bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-100">
                              Networking
                            </Badge>
                            <Badge className="bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-100">
                              Events & Meetups
                            </Badge>
                          </div>
                        </Card>
                      </div>
                      {/* <div className="border-t border-slate-200 pt-4">
                        <div className="flex items-start gap-3 mb-3">
                          <Building2 className="h-5 w-5 text-slate-600 mt-0.5" />
                          <div>
                            <p className="text-xs text-slate-500">Industry</p>
                            <p className="text-sm font-semibold text-slate-900">
                              {community.domain}
                            </p>
                          </div>
                        </div> */}

                      {/* <div className="flex items-start gap-3 mb-3">
                          <MapPin className="h-5 w-5 text-slate-600 mt-0.5" />
                          <div>
                            <p className="text-xs text-slate-500">Location</p>
                            <p className="text-sm font-semibold text-slate-900">
                              {community.city}, {community.countryState}
                            </p>
                          </div>
                        </div> */}

                      {/* <div className="flex items-start gap-3">
                          <Users className="h-5 w-5 text-slate-600 mt-0.5" />
                          <div>
                            <p className="text-xs text-slate-500">Members</p>
                            <p className="text-sm font-semibold text-slate-900">
                              {(
                                community.numberOfMembers || 0
                              ).toLocaleString()}{" "}
                              members
                            </p>
                          </div>
                        </div>
                      </div> */}

                      {/* {(community.social_links?.website ||
                        community.social_links?.linkedin ||
                        community.social_links?.twitter ||
                        community.social_links?.facebook) && (
                        <div className="border-t border-slate-200 pt-4">
                          <div className="flex flex-wrap gap-2">
                            {community.social_links?.website && (
                              <a
                                href={community.social_links.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded hover:bg-slate-100 transition-colors"
                              >
                                <Globe className="h-5 w-5 text-slate-600" />
                              </a>
                            )}
                            {community.social_links?.linkedin && (
                              <a
                                href={community.social_links.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded hover:bg-slate-100 transition-colors"
                              > */}
                      {/* <Linkedin className="h-5 w-5 text-blue-600" />
                              </a>
                            )} */}
                      {/* {community.social_links?.twitter && (
                              <a
                                href={community.social_links.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded hover:bg-slate-100 transition-colors"
                              >
                                <Twitter className="h-5 w-5 text-sky-500" />
                              </a>
                            )}
                            {community.social_links?.facebook && (
                              <a
                                href={community.social_links.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded hover:bg-slate-100 transition-colors"
                              >
                                <Facebook className="h-5 w-5 text-blue-600" />
                              </a>
                            )}
                          </div>
                        </div>
                      )} */}
                    </div>
                  </Card>

                  {community.social_links?.eventLink && (
                    <Card className="p-5 bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 shadow-sm">
                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-orange-600 mt-0.5" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 mb-1">
                            Upcoming Events
                          </h3>
                          <p className="text-sm text-slate-600 mb-3">
                            Stay updated with community events and meetups
                          </p>
                          <a
                            href={community.social_links.eventLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button
                              size="sm"
                              className="bg-orange-600 hover:bg-orange-700 text-white w-full"
                            >
                              View Events
                              <ExternalLink className="h-3 w-3 ml-2" />
                            </Button>
                          </a>
                        </div>
                      </div>
                    </Card>
                  )}
                </>
              )}

              {/* {activeTab === "about" && (
                <Card className="p-5 bg-white border border-slate-200 shadow-sm">
                  <h3 className="font-semibold text-slate-900 mb-2">
                    Overview
                  </h3>
                  <div className="space-y-3 text-sm text-slate-600">
                    <div className="flex items-start gap-3">
                      <Building2 className="h-5 w-5 text-slate-600 mt-0.5" />
                      <div>
                        <p className="text-xs text-slate-500">Industry</p>
                        <p className="font-semibold text-slate-900">
                          {community.domain}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-slate-600 mt-0.5" />
                      <div>
                        <p className="text-xs text-slate-500">Location</p>
                        <p className="font-semibold text-slate-900">
                          {community.city}, {community.countryState}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Award className="h-5 w-5 text-slate-600 mt-0.5" />
                      <div>
                        <p className="text-xs text-slate-500">Zone</p>
                        <p className="font-semibold text-slate-900">
                          {community.zone} India
                        </p>
                      </div>
                    </div>
                  </div>
                </Card> */}
              {/* )} */}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
