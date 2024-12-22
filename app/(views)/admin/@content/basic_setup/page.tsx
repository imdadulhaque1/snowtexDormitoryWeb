import React, { FC } from "react";

interface Props {}

const BasicSetupPage: FC<Props> = (props) => {
  return (
    <div className="flex min-h-screen justify-center items-center bg-gradient-to-b from-primary to-primary90">
      <h1 className="text-zinc-500 font-sans text-center text-2xl">
        Basic Setup Page
      </h1>
    </div>
  );
};

export default BasicSetupPage;
