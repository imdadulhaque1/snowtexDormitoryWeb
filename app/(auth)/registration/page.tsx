"use client";
import RegistrationForm from "@/app/_components/Form/RegistratioForm";
import React, { FC } from "react";

interface Props {}

const RegistrationPage: FC<Props> = () => {
  return (
    <div className="flex min-h-screen justify-center items-center px-5 bg-primary">
      <RegistrationForm />
    </div>
  );
};

export default RegistrationPage;

// export const metadata = {
//   title: "Registration | Snowtex",
//   description: "Welcome to Snowtex Dormitory Management System",
// };
