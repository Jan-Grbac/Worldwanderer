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
      <nav className="flex flex-grow justify-between p-4 bg-white shadow-md max-h-20 border-b-2 border-orange-500">
        {jwtIsValid ? (
          <>
            {username !== "admin" && (
              <div className="flex flex-grow justify-between items-center w-full pl-32 pr-32">
                <div className="flex justify-start gap-10 ml-4">
                  <button className="basicButton" onClick={home}>
                    <h2 className="text-lg font-medium text-black hover:text-orange-500">
                      Main page
                    </h2>
                  </button>
                  <button className="basicButton" onClick={trips}>
                    <h2 className="text-lg font-medium text-black hover:text-orange-500">
                      Your trips
                    </h2>
                  </button>
                </div>
                <div className="flex items-center gap-10 mr-4">
                  <button className="basicButton" onClick={profile}>
                    <h2 className="text-lg font-medium text-black hover:text-orange-500">
                      Your profile
                    </h2>
                  </button>
                  <button className="basicButton" onClick={logout}>
                    <h2 className="text-lg font-medium text-black hover:text-orange-500">
                      Logout
                    </h2>
                  </button>
                </div>
              </div>
            )}
            {username === "admin" && (
              <div className="flex flex-grow justify-between items-center w-full pl-32 pr-32">
                <div className="flex justify-start gap-5 ml-4">
                  <button className="basicButton" onClick={admin}>
                    <h2 className="text-lg font-medium text-black hover:text-orange-500">
                      Admin panel
                    </h2>
                  </button>
                </div>
                <div className="flex items-center gap-5 mr-4">
                  <button className="basicButton" onClick={logout}>
                    <h2 className="text-lg font-medium text-black hover:text-orange-500">
                      Logout
                    </h2>
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-grow justify-between items-center w-full pl-32 pr-32">
            <div className="flex justify-start gap-5 ml-4">
              <button className="basicButton" onClick={home}>
                <h2 className="text-lg font-medium text-black hover:text-orange-500">
                  Main page
                </h2>
              </button>
            </div>
            <div className="flex justify-end gap-10 ml-4">
              <button className="basicButton" onClick={signup}>
                <h2 className="text-lg font-medium text-black hover:text-orange-500">
                  Sign up
                </h2>
              </button>
              <button className="basicButton" onClick={signin}>
                <h2 className="text-lg font-medium text-black hover:text-orange-500">
                  Sign in
                </h2>
              </button>
            </div>
          </div>
        )}
      </nav>
      <hr className="border-t border-gray-300 w-full" />
    </div>
  );
}

export default NavbarComponent;
