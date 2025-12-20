import React, { useEffect, useState } from "react";
import { Redirect, Route, RouteProps } from "wouter";
interface PrivateRouteProps extends RouteProps {
  allowedRoles: string[];
  checkCommunityAdmin?: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  allowedRoles,
  checkCommunityAdmin = false,
  ...props
}) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const authorize = async () => {
      const userRole = localStorage.getItem("cc_role");
      const baseAuth = userRole ? allowedRoles.includes(userRole) : false;

      if (checkCommunityAdmin && !baseAuth) {
        try {
          const response = await fetch(
            "https://indian-community-beta.vercel.app/api/communities/user-communities",
            {
              credentials: "include",
            }
          );
          if (response.ok) {
            const communities = await response.json();
            setIsAuthorized(communities.length > 0);
          } else {
            setIsAuthorized(false);
          }
        } catch (error) {
          console.error("Authorization check failed:", error);
          setIsAuthorized(false);
        }
      } else {
        setIsAuthorized(baseAuth);
      }
    };

    authorize();
  }, [allowedRoles, checkCommunityAdmin]);

  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }

  if (!isAuthorized) {
    return <Redirect to="/" />;
  }

  return <Route {...props} />;
};

export default PrivateRoute;
