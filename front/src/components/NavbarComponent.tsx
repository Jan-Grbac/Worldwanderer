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
                  <h2>Main page</h2>
                </button>
                <button className="basicButton" onClick={trips}>
                  <h2>Your trips</h2>
                </button>
              </div>
              <div className="flex justify-items-end gap-5 mr-4">
                <button className="basicButton" onClick={profile}>
                  <h2>Your profile</h2>
                </button>
                <button className="basicButton" onClick={logout}>
                  <h2>Logout</h2>
                </button>
              </div>
            </div>
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
      <hr style={{ borderColor: "black" }} />
    </>
  );
}

export default NavbarComponent;
