import { useState } from "react";
import AdminDashboard from "./AdminDashboard";
import AdminLogin from "./AdminLogin";

const SESSION_KEY = "matibari-admin-demo-session";
const NAME_KEY = "matibari-admin-demo-name";

export default function AdminPortal() {
  const [authenticated, setAuthenticated] = useState(
    () => window.sessionStorage.getItem(SESSION_KEY) === "active"
  );
  const [adminName, setAdminName] = useState(
    () => window.sessionStorage.getItem(NAME_KEY) || "Admin"
  );

  const signIn = (name: string) => {
    window.sessionStorage.setItem(SESSION_KEY, "active");
    window.sessionStorage.setItem(NAME_KEY, name);
    setAdminName(name);
    setAuthenticated(true);
  };

  const signOut = () => {
    window.sessionStorage.removeItem(SESSION_KEY);
    window.sessionStorage.removeItem(NAME_KEY);
    setAuthenticated(false);
  };

  return authenticated ? (
    <AdminDashboard onLogout={signOut} adminName={adminName} />
  ) : (
    <AdminLogin onLogin={signIn} />
  );
}
