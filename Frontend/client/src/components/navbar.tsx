import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import LoginModal from "./login-modal";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import UserProfile from "./user-profile";
import {
  Shield,
  Menu,
  X,
  ChevronDown,
  Home,
  Compass,
  MapPin,
  Info,
  Phone,
} from "lucide-react";
import { NotificationBell } from "./notification";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
// import FormField from "./forms/";
import { HomeIcon, UserIcon } from "@heroicons/react/24/outline"; // Example icon imports

interface User {
  name: string;
  role: string;
  profileImage?: string;
  isSuperUser?: boolean;
  rolesHaving?: string[];
}

const navItems = [
  {
    label: "Home",
    path: "/",
    description: "Go to homepage",
    icon: HomeIcon,
  },
  {
    label: "Profile",
    path: "/profile",
    description: "View your profile",
    icon: UserIcon,
  },
  { label: "About", path: "/about", description: "Learn more about us" },
  { label: "Contact", path: "/contact", description: "Get in touch" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const form = useForm();

  const fetchUser = useCallback(async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/user",
        {
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        if (data.user.isSuperUser) {
          localStorage.setItem("cc_role", "superuser");
        } else {
          localStorage.setItem("cc_role", data.user.rolesHaving);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogin = () => {
    fetchUser();
    setIsLoginModalOpen(false);
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      localStorage.removeItem("cc_role");
      setLocation("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleContactClick = () => {
    const contactSection = document.getElementById("contact-us");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    } else {
      setLocation("/#contact-us");
    }
    setIsMenuOpen(false);
  };

  const handleNavClick = (path: string) => {
    setLocation(path);
    setIsMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-gradient-to-r from-orange-900/95 via-amber-900/95 to-orange-800/95 backdrop-blur-md shadow-lg border-b border-orange-700/30"
          : "bg-gradient-to-r from-orange-900/70 via-amber-900/60 to-transparent backdrop-blur-sm"
      }`}
    >
      <nav className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 text-white md:px-6 lg:px-8">
        {/* Logo */}
        <div
          className="flex items-center space-x-2 group cursor-pointer"
          onClick={() => setLocation("/")}
        >
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 shadow-md group-hover:shadow-orange-500/30 transition-shadow">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-wide font-samarkan drop-shadow-md">
            Community Connect
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="text-white/90 hover:text-white hover:bg-white/10 rounded-full px-4 transition-all flex items-center gap-1"
              >
                Navigate
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-64 bg-gradient-to-br from-orange-950/95 to-amber-950/95 backdrop-blur-xl border-orange-700/30 shadow-2xl"
              align="center"
            >
              {navItems.map((item) => (
                <DropdownMenuItem
                  key={item.path}
                  onClick={() => setLocation(item.path)}
                  className={`flex items-center gap-3 px-4 py-3 cursor-pointer text-white/90 hover:text-white hover:bg-white/10 focus:bg-white/10 focus:text-white transition-colors ${
                    location === item.path ? "bg-white/15 text-white" : ""
                  }`}
                >
                  {/* <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500/20 to-amber-500/20">
                    <item.icon className="h-4 w-4 text-orange-400" />
                  </div> */}
                  <div className="flex flex-col">
                    <span className="font-medium">{item.label}</span>
                    <span className="text-xs text-white/60">
                      {item.description}
                    </span>
                  </div>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator className="bg-orange-700/30" />
              <DropdownMenuItem
                onClick={handleContactClick}
                className="flex items-center gap-3 px-4 py-3 cursor-pointer text-white/90 hover:text-white hover:bg-white/10 focus:bg-white/10 focus:text-white transition-colors"
              >
                <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500/20 to-amber-500/20">
                  <Phone className="h-4 w-4 text-orange-400" />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">Contact</span>
                  <span className="text-xs text-white/60">
                    Get in touch with us
                  </span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {navItems.slice(0, 4).map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              onClick={() => setLocation(item.path)}
              className={`text-white/90 hover:text-white hover:bg-white/10 rounded-full px-4 transition-all ${
                location === item.path ? "bg-white/15 text-white" : ""
              }`}
            >
              {item.label}
            </Button>
          ))}
          <Button
            variant="ghost"
            onClick={handleContactClick}
            className="text-white/90 hover:text-white hover:bg-white/10 rounded-full px-4"
          >
            Contact
          </Button>
        </div>

        {/* Right Side Items */}
        <div className="flex items-center space-x-2 md:space-x-3">
          <NotificationBell />

          {user ? (
            <UserProfile user={user} onLogout={handleLogout} />
          ) : (
            <Button
              onClick={() => setIsLoginModalOpen(true)}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-full shadow-lg hover:shadow-orange-500/30 transition-all border-0 px-4 md:px-5"
            >
              Get Started
            </Button>
          )}

          {/* Mobile Menu Toggle */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="lg:hidden text-white hover:bg-white/10 rounded-full p-2"
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </SheetTrigger>

            {/* Side Sliding Menu */}
            <SheetContent
              side="left"
              className="w-80 bg-gradient-to-b from-orange-950/98 to-amber-950/98 backdrop-blur-xl border-r border-orange-700/30 p-0"
            >
              <SheetHeader className="border-b border-orange-700/30 px-6 py-6">
                <SheetTitle className="flex items-center gap-3 text-white">
                  <div className="p-1.5 rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 shadow-md">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-bold text-lg">Community Connect</span>
                </SheetTitle>
              </SheetHeader>

              {/* Navigation Items */}
              <div className="px-6 py-6 space-y-2">
                {navItems.map((item) => (
                  <SheetClose asChild key={item.path}>
                    <button
                      onClick={() => handleNavClick(item.path)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        location === item.path
                          ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg"
                          : "text-white/80 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg ${
                          location === item.path
                            ? "bg-white/20"
                            : "bg-gradient-to-br from-orange-500/20 to-amber-500/20"
                        }`}
                      >
                        {item.icon && (
                          <item.icon className="h-4 w-4 text-orange-400" />
                        )}
                      </div>
                      <div className="text-left">
                        <div className="font-semibold">{item.label}</div>
                        <div className="text-xs opacity-70">
                          {item.description}
                        </div>
                      </div>
                    </button>
                  </SheetClose>
                ))}

                {/* Contact Button */}
                <SheetClose asChild>
                  <button
                    onClick={handleContactClick}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500/20 to-amber-500/20">
                      <Phone className="h-4 w-4 text-orange-400" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">Contact</div>
                      <div className="text-xs opacity-70">
                        Get in touch with us
                      </div>
                    </div>
                  </button>
                </SheetClose>
              </div>

              {/* Divider */}
              <div className="border-t border-orange-700/30 mx-6" />

              {/* Footer Info */}
              <div className="px-6 py-6 space-y-3">
                <div className="bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-xl p-4">
                  <p className="text-sm text-white/80">
                    Discover and connect with amazing communities across India
                  </p>
                </div>
                <p className="text-xs text-white/50 text-center">
                  © 2025 Community Connect. All rights reserved.
                </p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
        <LoginModal
          onLoginSuccess={handleLogin}
          onClose={() => setIsLoginModalOpen(false)}
        />
      </Dialog>
    </header>
  );
}
{
  /* <>
  <FormField
    control={form.control}
    // ...other props...
  />
  <FormField
    control={form.control}
    // ...other props...
  />
</>; */
}
