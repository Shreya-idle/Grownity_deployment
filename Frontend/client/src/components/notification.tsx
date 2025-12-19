import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface Notification {
  id: string;
  message: string;
  read: boolean;
}

// Dummy notifications for demonstration
const dummyNotifications: Notification[] = [
  {
    id: "1",
    message: "Your community 'Tech Innovators' has been approved.",
    read: false,
  },
  {
    id: "2",
    message: "Your request for 'Design Thinkers' was rejected.",
    read: true,
  },
];

export function NotificationBell() {
  const [notifications, setNotifications] =
    useState<Notification[]>(dummyNotifications);
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    setHasUnread(notifications.some((n) => !n.read));
  }, [notifications]);

  const handleMarkAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className={`h-5 w-5 ${hasUnread ? "fill-current" : ""}`} />
          {hasUnread && (
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="p-2 font-semibold">Notifications</div>
        {notifications.length === 0 ? (
          <div className="p-4 text-sm text-muted-foreground">
            No new notifications.
          </div>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className={`flex items-start gap-3 p-3 ${
                !notification.read ? "bg-primary/5" : ""
              }`}
              onSelect={() => handleMarkAsRead(notification.id)}
            >
              <div
                className={`h-2 w-2 rounded-full mt-1.5 ${
                  !notification.read ? "bg-primary" : "bg-transparent"
                }`}
              />
              <div className="flex-1">
                <p className="text-sm">{notification.message}</p>
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
