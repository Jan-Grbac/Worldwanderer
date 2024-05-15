import React from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import NavbarComponent from "../components/NavbarComponent";

interface Props {
  setJwt: Function;
  setJwtIsValid: Function;
  setLoading: Function;
  cookies: Cookies;
}

function LogoutPage(props: Props) {
  const { setJwt, setJwtIsValid, setLoading, cookies } = { ...props };
  const navigate = useNavigate();

  function handleLogoutConfirm() {
    setJwt("");
    setJwtIsValid(false);
    setLoading(false);
    cookies.remove("jwt");
    navigate("/home");
    window.location.reload();
  }

  function handleLogoutCancel() {
    navigate("/home");
  }

  return (
    <div className="flex flex-row justify-center mt-20 align-middle">
      <div className="formContainer">
        <strong className="mb-4 self-center">
          Are you sure you want to logout?
        </strong>
        <div className="flex flex-row gap-20 justify-center self-center">
          <button className="confirmButton" onClick={handleLogoutConfirm}>
            Yes
          </button>
          <button className="declineButton" onClick={handleLogoutCancel}>
            No
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogoutPage;
