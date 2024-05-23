import React from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  jwtIsValid: boolean;
  username: string;
}

function NavbarComponent(props: Props) {
  const { jwtIsValid, username } = { ...props };

  const navigate = useNavigate();

  function home() {
    navigate("/home");
  }
  function signup() {
    navigate("/signup");
  }
  function signin() {
    navigate("/signin");
  }
  function logout() {
    navigate("/logout");
  }
  function trips() {
    navigate("/trips");
  }
  function profile() {
    navigate("/profile/" + username);
  }
  function admin() {
    navigate("/admin");
  }

  return (
    <div className="flex flex-col">
      <nav className="flex flex-grow justify-between p-4 border-0 max-h-20">
        {jwtIsValid ? (
          <>
            {username !== "admin" && (
              <div className="flex flex-grow justify-between align-middle">
                <div className="flex justify-start gap-5 ml-4">
                  <button className="basicButton" onClick={home}>
                    <h2>Main page</h2>
                  </button>
                  <button className="basicButton" onClick={trips}>
                    <h2>Your trips</h2>
                  </button>
                </div>
                <div className="flex self-end gap-5 mr-4">
                  <button className="basicButton" onClick={profile}>
                    <h2>Your profile</h2>
                  </button>
                  <button className="basicButton" onClick={logout}>
                    <h2>Logout</h2>
                  </button>
                </div>
              </div>
            )}
            {username === "admin" && (
              <div className="flex flex-grow justify-between align-middle">
                <div className="flex justify-start gap-5 ml-4">
                  <button className="basicButton" onClick={admin}>
                    <h2>Admin panel</h2>
                  </button>
                </div>
                <div className="flex self-end gap-5 mr-4">
                  <button className="basicButton" onClick={logout}>
                    <h2>Logout</h2>
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="flex flex-grow justify-between align-middle container">
              <div className="flex justify-start gap-5 ml-4">
                <button className="basicButton" onClick={signup}>
                  <h2>Sign up</h2>
                </button>
                <button className="basicButton" onClick={signin}>
                  <h2>Sign in</h2>
                </button>
              </div>
            </div>
          </>
        )}
      </nav>
      <hr className="border border-gray-400 w-full" />
    </div>
  );
}

export default NavbarComponent;
