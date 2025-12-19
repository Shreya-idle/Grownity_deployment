import React, { useEffect, useState } from "react";
import { useRoute, Redirect } from "wouter";

interface ProtectedRouteProps {
  component: React.ComponentType<any>;
  path: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  component: Component,
  ...rest
}) => {
  const [match, params] = useRoute("/community/edit/:id");
  const communityId = match ? params.id : null;

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          "https://indian-community-beta.vercel.app//api/user",
          {
            credentials: "include",
          }
        );
        if (response.ok) {
          const data = await response.json();
          setUid(data.user.firebaseUid);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const checkAuthorization = async () => {
      if (!uid || !communityId) {
        if (!communityId) setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://indian-community-beta.vercel.app//api/communities/${communityId}`
        );
        if (response.ok) {
          const community = await response.json();
          if (community?._communityAdminid?.firebaseUid === uid) {
            setIsAuthorized(true);
          }
        }
      } catch (error) {
        console.error("Authorization check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (uid) {
      checkAuthorization();
    }
  }, [communityId, uid]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthorized) {
    return <Redirect to="/unauthorized" />;
  }

  return <Component {...rest} params={params} />;
};

export default ProtectedRoute;
