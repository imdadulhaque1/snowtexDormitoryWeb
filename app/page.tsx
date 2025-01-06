import React from "react";
import RootNavbar from "./_components/home/RootNavbar";
import { cookies } from "next/headers";
import { isTokenExpired } from "./_utils/handler/getCurrentDate";

const DormitoryPage = async () => {
  // Access cookies on the server
  const cookieStore = await cookies();
  const aspToken: any = await (cookieStore.get("authToken")?.value || null);

  // Check token validity
  const isExpired = await (aspToken ? isTokenExpired(aspToken) : true);

  return (
    <div className="fixed h-screen w-screen bg-white">
      <RootNavbar isAuthenticateUser={!isExpired} passingAuthToken={aspToken} />
      <h1 className="text-zinc-500 font-sans text-center text-2xl mt-10">
        Welcome to Snowtex Dormitory !
      </h1>
    </div>
  );
};

export default DormitoryPage;
