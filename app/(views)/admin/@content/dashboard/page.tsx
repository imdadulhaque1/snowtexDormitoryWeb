"use client";

import React, { FC, Suspense } from "react";

interface Props {}

const AdminDashboardPage: FC<Props> = (props) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex min-h-screen justify-center items-center bg-gradient-to-b from-primary to-primary90">
        <h1 className="text-zinc-500 font-sans text-center text-2xl">
          Profile Page
        </h1>
      </div>
    </Suspense>
  );
};

export default AdminDashboardPage;
