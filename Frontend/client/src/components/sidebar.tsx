import { Home, Compass, MapPin, Info, Phone, PlusCircle } from "lucide-react";
import { useLocation } from "wouter";

const navItems = [
  { 
    path: "/", 
    label: "Home", 
    icon: Home,
    description: "Back to homepage"
  },
  { 
    path: "/explore", 
    label: "Explore", 
    icon: Compass,
    description: "Discover communities"
  },
  { 
    path: "/about", 
    label: "About", 
    icon: Info,
    description: "Learn about us"
  },
];

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const [location, setLocation] = useLocation();

  const handleNavClick = (path: string) => {
    setLocation(path);
    setIsOpen(false);
  };

  const handleContactClick = () => {
    const contactSection = document.getElementById("contact-us");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    } else {
      setLocation("/#contact-us");
    }
    setIsOpen(false);
  };

  const handleCreateCommunityClick = () => {
    setLocation("/register");
    setIsOpen(false);
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-gray-800 text-white transition-all duration-300 z-40 ${
        isOpen ? "w-64" : "w-0"
      } overflow-hidden`}
    >
      <div className="p-5">
        <h2 className="text-2xl font-bold mb-10">Navigation</h2>
        <ul>
          {navItems.map((item) => (
            <li key={item.path} className="mb-4">
              <a
                onClick={() => handleNavClick(item.path)}
                className={`flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-700 ${
                  location === item.path ? "bg-gray-900" : ""
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.label}
              </a>
            </li>
          ))}
          <li className="mb-4">
            <a
              onClick={handleContactClick}
              className="flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-700"
            >
              <Phone className="h-5 w-5 mr-3" />
              Contact
            </a>
          </li>
          <li className="mb-4">
            <a
              onClick={handleCreateCommunityClick}
              className="flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-700"
            >
              <PlusCircle className="h-5 w-5 mr-3" />
              Create Community
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}