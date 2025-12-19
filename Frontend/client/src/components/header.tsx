import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import LoginModal from "./login-modal";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import UserProfile from "./user-profile";
import { Shield, Menu, X } from "lucide-react";
import { NotificationBell } from "./notification";

interface User {
  name: string;
  role: string;
  profileImage?: string;
  isSuperUser?: boolean;
  rolesHaving?: string[];
}

interface HeaderProps {
  toggleSidebar: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
  const [location, setLocation] = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const fetchUser = useCallback(async () => {
    try {
      const response = await fetch(
        "https://indian-community-beta.vercel.app//api/user",
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

  const handleLoginSuccess = (role: string) => {
    fetchUser();
    setIsLoginModalOpen(false);
  };

  const handleLogout = async () => {
    try {
      await fetch(
        "https://indian-community-beta.vercel.app//api/auth/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );
      setUser(null);
      localStorage.removeItem("cc_role");
      setLocation("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-gradient-to-r from-orange-900/95 via-amber-900/95 to-orange-800/95 backdrop-blur-md shadow-lg border-b border-orange-700/30"
          : "bg-gradient-to-r from-orange-900/70 via-amber-900/60 to-transparent backdrop-blur-sm"
      }`}
    >
      <nav className="flex h-16 items-center justify-between px-4 text-white md:px-6 lg:px-8">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10 rounded-full p-2"
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
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
        </div>

        {/* Right Side Items */}
        <div className="flex items-center space-x-2 md:space-x-3">
          <NotificationBell />

          {user ? (
            <UserProfile user={user} onLogout={handleLogout} />
          ) : (
            <Button
              onClick={() => setIsLoginModalOpen(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full shadow-lg hover:shadow-orange-500/30 transition-all border-0 px-4 md:px-5"
            >
              Get Started
            </Button>
          )}
        </div>
      </nav>
      <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
        <LoginModal
          onLoginSuccess={handleLoginSuccess}
          onClose={() => setIsLoginModalOpen(false)}
        />
      </Dialog>
    </header>
  );
}
