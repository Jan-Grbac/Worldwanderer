import React from "react";

interface Props {
  user: User;
}

function UserInfoDisplayComponent(props: Props) {
  const { user } = { ...props };

  return (
    <div className="formContainer">
      <div>
        <div>
          <strong>Username:</strong> {user.username}
        </div>
        <br />
        <div>
          <strong>Email:</strong> {user.email}
        </div>
      </div>
    </div>
  );
}

export default UserInfoDisplayComponent;
