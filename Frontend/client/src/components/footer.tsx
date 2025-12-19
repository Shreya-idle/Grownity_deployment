import { useState } from "react";
import { Link } from "wouter";
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram, 
  Youtube,
  Mail,
  MapPin,
  Phone,
  Shield,
  Heart,
  ArrowRight,
} from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export function Footer() {
  const [email, setEmail] = useState("");

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle the form submission, e.g., send to an API
    console.log("Feedback submitted:", email);
    alert("Thank you for your feedback!");
    setEmail("");
  };

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-12 gap-y-16">
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 shadow-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <span className="font-bold text-xl font-samarkan">
                  Community Connect
                </span>
              </div>

              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Connecting communities across India. Find your tribe, share your
                passion, and grow together with like-minded individuals.
              </p>
              <h3 className="font-bold text-lg mb-4">Follow us on</h3>
              <div className="flex gap-3">
                {[
                  // { Icon: Facebook, href: "#", label: "Facebook" },
                  {
                    Icon: Twitter,
                    href: "https://t.me/CommunityMeetups",
                    label: "Twitter",
                  },
                  {
                    Icon: Linkedin,
                    href: "https://www.linkedin.com/company/communitymeetups/",
                    label: "LinkedIn",
                  },
                  {
                    Icon: Instagram,
                    href: "https://www.instagram.com/community.meetups",
                    label: "Instagram",
                  },
                  // { Icon: Youtube, href: "#", label: "YouTube" },
                  // { Icon: Telegram, href: "https://t.me/CommunityMeetups", label: "Telegram" },
                ].map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="p-2.5 rounded-full bg-white/5 hover:bg-orange-500/20 border border-white/10 hover:border-orange-500/50 transition-all duration-300 group"
                  >
                    <Icon className="h-4 w-4 text-gray-400 group-hover:text-orange-400 transition-colors" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-6 text-sm uppercase tracking-wider">
                Quick Links
              </h3>
              <ul className="space-y-3">
                {[
                  { label: "Explore Communities", href: "/explore" },
                  { label: "Browse by Zone", href: "/zones" },
                  { label: "About Us", href: "/about" },
                  { label: "Contact", href: "#contact-us" },
                ].map((link) => (
                  <li key={link.label}>
                    <Link href={link.href}>
                      <span className="text-gray-400 hover:text-orange-400 transition-colors text-sm cursor-pointer flex items-center gap-2 group">
                        <ArrowRight className="h-3 w-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Domains */}
            <div>
              <h3 className="font-semibold text-white mb-6 text-sm uppercase tracking-wider">
                Domains
              </h3>
              <ul className="space-y-3">
                {[
                  "Technology",
                  "Startup",
                  "Marketing",
                  "Design",
                  "Education",
                ].map((domain) => (
                  <li key={domain}>
                    <Link href={`/explore?domain=${domain.toLowerCase()}`}>
                      <span className="text-gray-400 hover:text-orange-400 transition-colors text-sm cursor-pointer flex items-center gap-2 group">
                        <ArrowRight className="h-3 w-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                        {domain}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* forms*/}
            <div>
              <h3 className="font-semibold text-white mb-6 text-sm uppercase tracking-wider">
                Get Involved
              </h3>
              <ul className="space-y-3">
                {[
                  {label: "Volunteer", href: "/volunteer"},
                  {label: "Sponsor", href: "/sponsor"},
                  {label: "Speaker", href: "/speaker"},
                  {label: "Showcase Zone", href: "/showcase"},
                  {label: "Community Partner", href: "/community-partner"},
                ].map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href}>
                      <span className="text-gray-400 hover:text-orange-400 transition-colors text-sm cursor-pointer flex items-center gap-2 group">
                        <ArrowRight className="h-3 w-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                        {label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-6 text-sm uppercase tracking-wider">
                Stay Updated
              </h3>
              <p className="mt-4 text-gray-400">
                Get the latest updates and news from CommunityConnect.
              </p>
              <form onSubmit={handleFeedbackSubmit} className="mt-4 space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full h-14 pl-10 pr-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center h-9 px-3 text-xs font-medium rounded-md border border-blue-500/50 text-blue-400 bg-blue-500/10 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-300 cursor-pointer"
                >
                  Submit
                </button>
              </form>

              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-3 text-gray-400 text-sm">
                  <MapPin className="h-4 w-4 text-orange-400 flex-shrink-0" />
                  <span>India</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400 text-sm">
                  <Mail className="h-4 w-4 text-orange-400 flex-shrink-0" />
                  <span>info@grownity.tech</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm flex items-center gap-1">
              © 2025 Community Connect.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <a
                href="#"
                className="text-gray-500 hover:text-orange-400 transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-orange-400 transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="/code-of-conduct"
                className="text-gray-500 hover:text-orange-400 transition-colors"
              >
                Code of Conduct
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-orange-400 transition-colors"
              >
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
