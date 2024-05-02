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

  return (
    <>
      {jwtIsValid ? (
        <div>
          <p>Hello {username}!</p>
          <button
            className="text-white rounded-3xl hover:text-cyan-400"
            onClick={home}
          >
            Main page
          </button>
          <button
            className="text-white rounded-3xl hover:text-cyan-400"
            onClick={trips}
          >
            Your trips
          </button>
          <button
            className="text-white rounded-3xl hover:text-cyan-400"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      ) : (
        <div>
          <button
            className="text-white rounded-3xl hover:text-cyan-400"
            onClick={signup}
          >
            Sign up
          </button>
          <button
            className="text-white rounded-3xl hover:text-cyan-400"
            onClick={signin}
          >
            Sign in
          </button>
        </div>
      )}
    </>
  );
}

export default NavbarComponent;
