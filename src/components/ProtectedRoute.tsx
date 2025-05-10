import React from "react";
import { Navigate } from "react-router";
import { getCookie } from "../utils/helper";

const ProtectedRoute: React.FC<any> = ({ children }) => {
  const [loading, setLoading] = React.useState(true);
  const [token, setToken] = React.useState<string | null>(null);
  React.useEffect(() => {
    const token = getCookie("token");
    if (token) {
      setToken(token);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);
  if (loading) {
    return <div>Loading...</div>;
  }

  return token ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
