import React, { FC } from "react";

interface Props {}

const UserPage: FC<Props> = (props) => {
  return (
    <div className="flex min-h-screen justify-center items-center bg-white">
      <h1 className="text-zinc-500 font-sans text-center text-2xl">
        User Page
      </h1>
    </div>
  );
};

export default UserPage;
