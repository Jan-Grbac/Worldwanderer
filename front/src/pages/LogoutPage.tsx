import React from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  doLogout: Function;
}

function LogoutPage(props: Props) {
  const { doLogout } = { ...props };
  const navigate = useNavigate();

  function handleLogoutConfirm() {
    doLogout();
    navigate("/home");
  }

  function handleLogoutCancel() {
    navigate("/home");
  }

  return (
    <>
      <p>Do you want to logout?</p>
      <button onClick={(event) => handleLogoutConfirm()}>Yes</button>
      <button onClick={(event) => handleLogoutCancel()}>No</button>
    </>
  );
}

export default LogoutPage;
