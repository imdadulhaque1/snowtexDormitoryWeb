// AdminDashboardPage.js
"use client";

import { useAppContext } from "@/app/_stateManagements/contextApi";
import retrieveToken from "@/app/_utils/handler/retrieveToken";
import React, { FC, Suspense, useEffect } from "react";

interface Props {}

const AdminDashboardPage: FC<Props> = (props) => {
  const { setToken, getToken } = useAppContext();
  const token = retrieveToken(); // Retrieve the token

  useEffect(() => {
    console.log("Admin Dashboard getToken updated: ", getToken);
  }, [getToken]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex min-h-screen justify-center items-center bg-gradient-to-b from-primary to-primary90">
        <h1 className="text-zinc-500 font-sans text-center text-2xl">
          Admin Dashboard Page
        </h1>
      </div>
    </Suspense>
  );
};

export default AdminDashboardPage;
