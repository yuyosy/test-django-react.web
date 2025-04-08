import { useEffect, useState } from "react";
import { getSessions, logout } from "../../../utilities/django/allauth";

interface Props {
  message: string;
}

const App = (props: Props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");

  const handleLogout = () => {
    logout()
      .then((response) => {
        if (response.status === 200) {
          console.log("Logout successful:", response.data);
          setIsAuthenticated(false);
          setUsername("");
          window.location.href = "/";
        } else {
          console.error("Logout failed:", response.data);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsAuthenticated(false);
        setUsername("");
      });
  };

  useEffect(() => {
    getSessions()
      .then((response) => {
        if (response.meta?.is_authenticated) {
          setIsAuthenticated(true);
          setUsername(response.data?.user?.username || "");
        } else {
          setIsAuthenticated(false);
          setUsername("");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsAuthenticated(false);
        setUsername("");
      });
  }, []);

  return (
    <div>
      <h1>Welcome to the Top Page!</h1>
      <h2>{props.message}</h2>
      {isAuthenticated ? (
        <>
          <p>Welcome, {username}!</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <button onClick={() => (window.location.href = "/users/login")}>
          Login
        </button>
      )}
    </div>
  );
};

export default App;
