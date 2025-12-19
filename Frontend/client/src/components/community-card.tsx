import { Link } from "wouter";
import React from "react";
import {
  Calendar,
  BadgeCheck,
  Globe,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, ExternalLink } from "lucide-react";

export interface Member {
  name: string;
  role: string;
  isFounder?: boolean;
  linkedin?: string;
  twitter?: string;
  email?: string;
}

export interface CommunityCardProps {
  _id?: string;
  _communityAdminid?: string;
  name: string;
  description: string;
  tagline?: string;
  zone: string;
  countryState?: string;
  pincode?: string;
  banner?: string;
  domain: string;
  status?: "pending" | "approved" | "rejected" | "moderate";
  rejectionReason?: string;
  approved_by?: string;
  approved_at?: string | Date;
  moderation?: {
    flag?: boolean;
    reason?: string;
  };
  social_links?: {
    website?: string;
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
    discord?: string;
    eventLink?: string;
  };
  social_link?: {
    website?: string;
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  members?: Member[];
  numberOfMembers?: number;
  events?: number;
  eventCount?: number;
  verified?: boolean;
  socials?: string[];
  location?: string;
  created_at?: string | Date;
  updated_at?: string | Date;
  showActions?: boolean;
  onApprove?: (id: string, e: React.MouseEvent) => void;
  onReject?: (id: string, e: React.MouseEvent) => void;
  // Legacy/Alternate props
  id?: string;
  city?: string;
  state?: string;
  memberCount?: number;
  isPending?: boolean;
}

const defaultImage =
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop";

export function CommunityCard(props: CommunityCardProps) {
  // Handle both old and new prop formats
  const communityId = props._id || props.id || "";
  const name = props.name || "";
  const tagline = props.tagline || props.description || "";
  const city = props.city || "";
  const state = props.countryState || props.state || "";
  const banner = props.banner || defaultImage;
  const domain = props.domain || "";
  const memberCount =
    props.numberOfMembers ??
    (typeof props.members === "number"
      ? props.members
      : props.memberCount ?? 0);
  const eventCount = props.events ?? props.eventCount ?? 0;
  const verified = props.status === "approved" || (props.verified ?? true);
  const socialLink = props.social_links || props.social_link || {};

  if (!name) {
    return null;
  }

  const handleSocialClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Link href={`/community/${communityId}`}>
      <div className="min-w-[320px] max-w-[320px] bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-orange-200 group/card cursor-pointer transform hover:-translate-y-2">
        <div className="relative h-40 bg-gradient-to-br from-gray-200 to-gray-300">
          <img src={banner} alt={name} className="w-full h-full object-cover" />
          <div className="absolute bottom-3 left-3 ">
            <span className="bg-white/95 backdrop-blur-sm text-gray-700 px-3 py-1 rounded-full text-xs font-medium shadow-sm">
              {domain}
            </span>
          </div>
        </div>

        <div className="p-5 mt-7">
          <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover/card:text-orange-600 transition-colors">
            {name}
          </h3>
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{tagline}</p>

          <div className="flex items-center text-sm text-gray-500 mb-4">
            <MapPin className="h-4 w-4 mr-1.5 text-orange-400" />
            <span>
              {city}, {state}
            </span>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-1.5 text-gray-600">
              <Users className="h-4 w-4 text-orange-400" />
              <span className="text-sm font-medium">
                {memberCount.toLocaleString()}
              </span>
              <span className="text-xs text-gray-400">members</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-600">
              <Calendar className="h-4 w-4 text-orange-400" />
              <span className="text-sm font-medium">{eventCount}</span>
              <span className="text-xs text-gray-400">events</span>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-gray-100 mt-4">
            {socialLink.website && (
              <a
                href={socialLink.website}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleSocialClick}
                className="text-gray-400 hover:text-gray-600"
              >
                <Globe className="h-5 w-5" />
              </a>
            )}
            {socialLink.linkedin && (
              <a
                href={socialLink.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleSocialClick}
                className="text-gray-400 hover:text-gray-600"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            )}
            {socialLink.twitter && (
              <a
                href={socialLink.twitter}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleSocialClick}
                className="text-gray-400 hover:text-gray-600"
              >
                <Twitter className="h-5 w-5" />
              </a>
            )}
            {socialLink.facebook && (
              <a
                href={socialLink.facebook}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleSocialClick}
                className="text-gray-400 hover:text-gray-600"
              >
                <Facebook className="h-5 w-5" />
              </a>
            )}
            {socialLink.instagram && (
              <a
                href={socialLink.instagram}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleSocialClick}
                className="text-gray-400 hover:text-gray-600"
              >
                <Instagram className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}



