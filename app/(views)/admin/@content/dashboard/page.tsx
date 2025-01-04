"use client";

import React, { FC, Suspense } from "react";

interface Props {}

const AdminDashboardPage: FC<Props> = (props) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex fixed min-h-screen justify-center items-center bg-gradient-to-b from-primary to-primary90">
        <div className="flex w-screen h-screen  items-center justify-center">
          <h1 className="text-zinc-500 font-workSans text-center text-2xl">
            Welcome to Snowtex Dormitory !
          </h1>
        </div>
      </div>
    </Suspense>
  );
};

export default AdminDashboardPage;
