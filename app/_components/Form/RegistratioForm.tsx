"use client";
import React, { FC, useState } from "react";

import SubmitButton from "../button/SubmitButton";
import { useRouter } from "next/navigation";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import axios from "axios";
import VerticalSingleInput from "../inputField/VerticalSingleInput";
import AppURL from "@/app/_restApi/AppURL";
import toast from "react-hot-toast";

interface Props {}

const RegistrationForm: FC<Props> = () => {
  const [passwords, setPasswords] = useState({
    password: "",
    confirmPassword: "",
  });

  const [formRegiData, setFormRegiData] = useState({
    name: "",
    companyName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    nameErrorMsg: "",
    companyNameErrorMsg: "",
    emailErrorMsg: "",
    phoneErrorMsg: "",
    passwordErrorMsg: "",
    confirmPasswordErrorMsg: "",
  });

  const router = useRouter();

  const handlePasswordChange = (
    field: "password" | "confirmPassword",
    value: string
  ) => {
    setPasswords((prev) => ({ ...prev, [field]: value }));

    if (field === "confirmPassword" && value !== passwords.password) {
      setFormRegiData((prev) => ({
        ...prev,
        confirmPasswordErrorMsg: "Passwords do not match.",
      }));
    } else {
      setFormRegiData((prev) => ({ ...prev, confirmPasswordErrorMsg: "" }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const errors: Partial<typeof formRegiData> = {};

    if (!formRegiData.name.trim()) {
      isValid = false;
      errors.nameErrorMsg = "Name is required.";
    }
    if (!formRegiData.companyName.trim()) {
      isValid = false;
      errors.companyNameErrorMsg = "Company name is required.";
    }

    if (!formRegiData.email.trim()) {
      isValid = false;
      errors.emailErrorMsg = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formRegiData.email)) {
      isValid = false;
      errors.emailErrorMsg = "Invalid email format.";
    }

    if (!formRegiData?.phone) {
      isValid = false;
      errors.phoneErrorMsg = "Phone number is required.";
    }

    if (!passwords.password.trim()) {
      isValid = false;
      errors.passwordErrorMsg = "Password is required.";
    } else if (passwords.password.length < 4) {
      isValid = false;
      errors.passwordErrorMsg = "Password must be at least 4 characters.";
    }

    if (!passwords.confirmPassword.trim()) {
      isValid = false;
      errors.confirmPasswordErrorMsg = "Please confirm your password.";
    } else if (passwords.password !== passwords.confirmPassword) {
      isValid = false;
      errors.confirmPasswordErrorMsg = "Passwords do not match.";
    }

    setFormRegiData((prev) => ({ ...prev, ...errors }));
    return isValid;
  };

  const submitFunc = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) return;

    try {
      const formDataObj = {
        name: formRegiData.name,
        companyName: formRegiData.companyName,
        email: formRegiData.email,
        phone: formRegiData.phone,
        password: formRegiData.password,
        accountType: 1,
      };

      const res = await axios.post(AppURL.signup, formDataObj);

      if (res.status === 201) {
        router.push("/login");
      } else {
        toast.error("Failed to registration !");
      }
    } catch (error: any) {
      if (error?.status === 409) {
        toast.error("Email / Phone already exists !");
      } else {
        toast.error("Failed to registration !");
      }
    }
  };

  return (
    <>
      <form
        onSubmit={submitFunc}
        className="flex w-full md:w-9/12 flex-col bg-primary96 shadow-sm justify-center gap-y-4 border border-primary80 rounded-2xl p-4"
      >
        <div className="flex flex-col">
          <h1 className="text-center text-black text-3xl my-4 font-workSans">
            Registration Form
          </h1>

          {/* Name and Company Name Fields */}
          <div className="flex flex-col lg:flex-row gap-y-4 lg:gap-x-4">
            <VerticalSingleInput
              label="Name"
              name="name"
              placeholder="Your Name"
              // @ts-ignore
              value={formRegiData.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormRegiData((prev) => ({
                  ...prev,
                  name: e.target.value,
                  nameErrorMsg: "",
                }))
              }
              errorMsg={formRegiData.nameErrorMsg}
            />

            <VerticalSingleInput
              label="Company Name"
              name="companyName"
              // @ts-ignore
              value={formRegiData.companyName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormRegiData((prev) => ({
                  ...prev,
                  companyName: e.target.value,
                }))
              }
              placeholder="Company Name - SSL / SOL / SCO "
              errorMsg={formRegiData.companyNameErrorMsg}
            />
          </div>

          {/* Email and Phone Fields */}
          <div className="flex flex-col lg:flex-row gap-y-4 lg:gap-x-4 mt-4">
            <VerticalSingleInput
              label="Email"
              name="email"
              type="email"
              // @ts-ignore
              value={formRegiData.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormRegiData((prev) => ({
                  ...prev,
                  email: e.target.value,
                  emailErrorMsg: "",
                }))
              }
              errorMsg={formRegiData.emailErrorMsg}
              placeholder="Your email"
            />

            <div className="flex flex-col items-center w-full mb-4">
              <label className="w-full block font-workSans text-sm text-black">
                Phone Number
              </label>

              <div className="w-full relative">
                <PhoneInput
                  name="phone"
                  defaultCountry="BD"
                  value={formRegiData?.phone}
                  onChange={(phoneNumber: any) => {
                    setFormRegiData((prev) => ({
                      ...prev,
                      phone: phoneNumber,
                      phoneErrorMsg: "",
                    }));
                  }}
                  // onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  //   setFormRegiData((prev) => ({
                  //     ...prev,
                  //     phone: e.target.value,
                  //     phoneErrorMsg: "",
                  //   }))
                  // }
                  className="peer block w-full rounded-md border border-gray-300 bg-primary95 pl-3"
                />
                <style jsx global>{`
                  .peer input {
                    height: 40px !important;
                    padding: 1rem;
                    font-size: 1rem;
                    background-color: #e6eeff;
                  }
                `}</style>
                {formRegiData.phoneErrorMsg && (
                  <span className="text-errorColor text-f11 md:text-f13 font-workSans pl-1 mt-1">
                    {formRegiData.phoneErrorMsg}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Password and Confirm Password Fields */}
          <div className="flex flex-col lg:flex-row gap-y-4 lg:gap-x-4">
            <div className="w-full">
              <VerticalSingleInput
                label="Password"
                name="password"
                type="password"
                placeholder="Your password"
                value={passwords.password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handlePasswordChange("password", e.target.value);
                  setFormRegiData((prev) => ({
                    ...prev,
                    password: e.target.value,
                    passwordErrorMsg: "",
                  }));
                }}
                errorMsg={formRegiData.passwordErrorMsg}
              />
            </div>
            <div className="w-full">
              <VerticalSingleInput
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="Confirm password"
                value={passwords.confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handlePasswordChange("confirmPassword", e.target.value)
                }
                errorMsg={formRegiData.confirmPasswordErrorMsg}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col w-full items-center justify-center mt-5">
            <SubmitButton label="Register" loading="Registering Account..." />
            <div>
              <p className="text-black font-workSans text-md mt-4">
                Already have an account ?{" "}
                <a
                  href="/login"
                  className="text-primary underline font-semibold"
                >
                  Login
                </a>
              </p>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default RegistrationForm;
