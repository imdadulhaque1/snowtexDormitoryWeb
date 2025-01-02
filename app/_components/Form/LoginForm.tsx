"use client";

import React, { FC, useEffect, useState } from "react";
import SubmitButton from "../button/SubmitButton";
import { useRouter } from "next/navigation";
import axios from "axios";
import VerticalSingleInput from "../inputField/VerticalSingleInput";
import toast from "react-hot-toast";
import AppURL from "@/app/_restApi/AppURL";
import Cookies from "js-cookie";
interface LoginFormProps {
  onClose: () => void;
  onSuccess: () => void;
  isFormModal: boolean;
}

const LoginForm: FC<LoginFormProps> = ({
  onClose,
  onSuccess,
  isFormModal = false,
}) => {
  const router = useRouter();

  const [loginData, setLoginData] = useState({
    emailOrPhone: "",
    password: "",
    emailPhoneErrorMsg: "",
    passwordErrorMsg: "",
  });

  const validateForm = () => {
    let isValid = true;
    const errors: Partial<typeof loginData> = {};

    if (!loginData.emailOrPhone.trim()) {
      isValid = false;
      errors.emailPhoneErrorMsg = "Email or phone number is required.";
    }

    if (!loginData.password.trim()) {
      isValid = false;
      errors.passwordErrorMsg = "Password is required.";
    }

    setLoginData((prev) => ({ ...prev, ...errors }));
    return isValid;
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if ((event.target as HTMLElement).closest("form")) return;
    onClose(); // onClose is optional so use here the ts type
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!validateForm()) return;

    try {
      const submitData = {
        email: loginData.emailOrPhone,
        password: loginData.password,
      };

      const { data } = await axios.post(AppURL.signin, submitData, {
        withCredentials: true,
      });

      console.log("Login Response: ", JSON.stringify(data, null, 2));
      if (data?.status === 200) {
        toast.success("Successfully log-in !");
        Cookies.set("authToken", data.user.token, {
          expires: 7, // Expires in 7 days
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
        isFormModal && onSuccess(); // onSuccess is optional so use here the ts type
        !isFormModal && router.push("/");
      } else {
        toast.error("Invalid credentials!");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "An error occurred");
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <form
        onSubmit={onSubmit}
        className="flex w-10/12 md:w-1/3 flex-col bg-primary96 shadow-sm justify-center items-center gap-y-4 border border-primary80 rounded-2xl p-4"
      >
        <h1 className="text-center text-black text-2xl my-4 font-workSans">
          Snowtex Dormitory
        </h1>
        <VerticalSingleInput
          label="Email"
          placeholder="Enter Email..."
          value={loginData.emailOrPhone}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setLoginData((prev) => ({
              ...prev,
              emailOrPhone: e.target.value,
              emailPhoneErrorMsg: "",
            }))
          }
          errorMsg={loginData.emailPhoneErrorMsg}
        />
        <VerticalSingleInput
          label="Password"
          type="password"
          placeholder="Your password"
          value={loginData.password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setLoginData((prev) => ({
              ...prev,
              password: e.target.value,
              passwordErrorMsg: "",
            }))
          }
          errorMsg={loginData.passwordErrorMsg}
        />
        <SubmitButton
          label="Login"
          loading="Login..."
          btnBgColor={
            loginData.emailOrPhone && loginData.password
              ? "bg-primary70"
              : "bg-primary95"
          }
        />
        <div>
          <p className="text-black font-workSans text-md mt-4">
            Don't have an account yet ?
            <a
              href="/registration"
              className="text-primary underline font-semibold ml-3"
            >
              Sign Up
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
