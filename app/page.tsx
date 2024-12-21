import React, { FC } from "react";
import RootNavbar from "./_components/home/RootNavbar";
import { retrieveTokenForSSR } from "./_utils/handler/retrieveTokenForSSR";
import { isTokenExpired } from "./_utils/handler/getCurrentDate";

interface Props {}

const HomePage: FC<Props> = async (props) => {
  const token = await retrieveTokenForSSR();
  const isExpired = token ? isTokenExpired(token) : true;
  return (
    <div className=" fixed h-screen w-screen  bg-white">
      <RootNavbar isAuthenticateUser={!isExpired} passingAuthToken={token} />
      <h1 className="text-zinc-500 font-sans text-center text-2xl">
        Home Page
      </h1>
    </div>
  );
};

export default HomePage;
