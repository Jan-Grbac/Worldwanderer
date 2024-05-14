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
    navigate("/profile");
  }

  return (
    <>
      <nav className="flex justify-between p-4 border-0 max-h-20">
        {jwtIsValid ? (
          <>
            <div className="flex flex-grow justify-between align-middle container">
              <div className="flex justify-start gap-5 ml-4">
                <button className="basicButton" onClick={home}>
                  Main page
                </button>
                <button className="basicButton" onClick={trips}>
                  Your trips
                </button>
              </div>
              <div className="flex justify-items-end gap-5 mr-4">
                <button className="basicButton" onClick={profile}>
                  Your profile
                </button>
                <button className="basicButton" onClick={logout}>
                  Logout
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-grow justify-between align-middle container">
              <div className="flex justify-start gap-5 ml-4">
                <button className="basicButton" onClick={signup}>
                  Sign up
                </button>
                <button className="basicButton" onClick={signin}>
                  Sign in
                </button>
              </div>
            </div>
          </>
        )}
      </nav>
      <hr style={{ borderColor: "black" }} />
    </>
  );
}

export default NavbarComponent;
