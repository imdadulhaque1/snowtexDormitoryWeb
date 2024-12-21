import LoginForm from "@/app/_components/Form/LoginForm";
import React, { FC } from "react";

interface Props {}

const LoginPage: FC<Props> = () => {
  return (
    <div className="flex min-h-screen justify-center items-center px-5 bg-primary">
      <LoginForm />
    </div>
  );
};

export default LoginPage;

export const metadata = {
  title: "Login | Job Bangla",
  description: "Welcome to JobsBangla",
};
