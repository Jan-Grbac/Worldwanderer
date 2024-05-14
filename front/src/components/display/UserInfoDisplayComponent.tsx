import React from "react";

interface Props {
  user: User;
}

function UserInfoDisplayComponent(props: Props) {
  const { user } = { ...props };

  return (
    <div className="flex flex-col border-2 border-black rounded-3xl p-10 bg-white gap-4">
      <div>
        <strong>Username:</strong> {user.username}
      </div>
      <div>
        <strong>Email:</strong> {user.email}
      </div>
    </div>
  );
}

export default UserInfoDisplayComponent;
