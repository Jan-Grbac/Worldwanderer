import React from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

interface Props {
  setJwt: Function;
  setLoading: Function;
  cookies: Cookies;
}

function LogoutPage(props: Props) {
  const { setJwt, setLoading, cookies } = { ...props };
  const navigate = useNavigate();

  function handleLogoutConfirm() {
    setJwt("");
    setLoading(false);
    cookies.remove("jwt");
    navigate("/home");
    window.location.reload();
  }

  function handleLogoutCancel() {
    navigate("/home");
  }

  return (
    <>
      <p>Do you want to logout?</p>
      <button onClick={handleLogoutConfirm}>Yes</button>
      <button onClick={handleLogoutCancel}>No</button>
    </>
  );
}

export default LogoutPage;
