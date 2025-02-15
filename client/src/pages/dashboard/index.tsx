import Cookies from "js-cookie";

export default function Dashboard() {
  const userRole = Cookies.get("user_role");
  return (
    <div className="flex h-[90vh] items-center justify-center">
      <h1>
        Welcome to{" "}
        {userRole && `${userRole.charAt(0).toUpperCase()}${userRole.slice(1)}`}{" "}
        Dashboard
      </h1>
    </div>
  );
}
