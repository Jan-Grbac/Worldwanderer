import React from "react";

interface Props {
  user: User;
}

function UserInfoDisplayComponent(props: Props) {
  const { user } = { ...props };

  return (
    <div className="border border-black">
      User info:
      <br />
      {user.email}
      <br />
      {user.username}
    </div>
  );
}

export default UserInfoDisplayComponent;
