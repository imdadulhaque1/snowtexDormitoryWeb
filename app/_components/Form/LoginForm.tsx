"use client";

import React, { FC, useEffect, useState } from "react";
import SubmitButton from "../button/SubmitButton";
import { useRouter } from "next/navigation";
import axios from "axios";
import VerticalSingleInput from "../inputField/VerticalSingleInput";
import toast from "react-hot-toast";
import AppURL from "@/app/_restApi/AppURL";

// interface Props {}

// const LoginForm: FC<Props> = (props) => {
//   const router = useRouter();

//   const [loginData, setLoginData] = useState({
//     emailOrPhone: "",
//     password: "",
//     emailPhoneErrorMsg: "",
//     passwordErrorMsg: "",
//   });

//   const validateForm = () => {
//     let isValid = true;
//     const errors: Partial<typeof loginData> = {};

//     if (!loginData?.emailOrPhone.trim()) {
//       isValid = false;
//       errors.emailPhoneErrorMsg = "Email or phone number is required.";
//     }

//     if (!loginData?.password.trim()) {
//       isValid = false;
//       errors.passwordErrorMsg = "Password is required.";
//     }

//     setLoginData((prev) => ({ ...prev, ...errors }));
//     return isValid;
//   };

//   async function onSubmit(event: any) {
//     event.preventDefault();

//     if (!validateForm()) return;

//     try {
//       const submitData = {
//         emailOrPhone: loginData?.emailOrPhone,
//         password: loginData?.password,
//       };

//       console.log("submitData: ", JSON.stringify(submitData, null, 2));

//       const { data } = await axios.post(AppURL.signin, submitData, {
//         withCredentials: true,
//       });

//       if (data?.status === 200) {
//         router.push("/");
//         toast.success("Successfully logged in!");
//       } else {
//         toast.error("Invalid credentials!");
//       }
//     } catch (err: any) {
//       toast.error(err.response?.data?.message || "An error occurred");
//     }
//   }

//   // fixed inset-0 flex items-center justify-center bg-black bg-opacity-50
//   // flex w-11/12 md:w-1/2 flex-col bg-primary96 shadow-sm justify-center gap-y-4 border border-primary80 rounded-2xl p-4

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//       <form
//         onSubmit={onSubmit}
//         className="flex w-10/12 md:w-1/3 flex-col bg-primary96 shadow-sm justify-center gap-y-4 border border-primary80 rounded-2xl p-4"
//       >
//         <div className="flex flex-col ">
//           <h1 className="text-center text-black text-2xl my-4 font-workSans">
//             Snowtex Dormitory
//           </h1>
//           <div className="mb-5">
//             <VerticalSingleInput
//               label="Email / Phone"
//               placeholder="Enter Email / Phone..."
//               name="emailOrPhone"
//               // @ts-ignore
//               value={loginData.emailOrPhone}
//               onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//                 setLoginData((prev) => ({
//                   ...prev,
//                   emailOrPhone: e.target.value,
//                   emailPhoneErrorMsg: "",
//                 }))
//               }
//               errorMsg={loginData.emailPhoneErrorMsg}
//             />
//           </div>
//           <VerticalSingleInput
//             label="Password"
//             type="password"
//             placeholder="Your password"
//             // @ts-ignore
//             value={loginData.password}
//             onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//               setLoginData((prev) => ({
//                 ...prev,
//                 password: e.target.value,
//                 passwordErrorMsg: "",
//               }))
//             }
//             errorMsg={loginData.passwordErrorMsg}
//           />

//           <div
//             className="flex w-full items-center mt-5"
//             style={{ alignItems: "center", justifyContent: "center" }}
//           >
//             <SubmitButton
//               label="Login"
//               loading="Login..."
//               btnBgColor={
//                 loginData?.emailOrPhone && loginData?.password
//                   ? "bg-primary70"
//                   : "bg-primary95"
//               }
//             />
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default LoginForm;

interface LoginFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const LoginForm: FC<LoginFormProps> = ({ onClose, onSuccess }) => {
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
    onClose();
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
        emailOrPhone: loginData.emailOrPhone,
        password: loginData.password,
      };

      const { data } = await axios.post(AppURL.signin, submitData, {
        withCredentials: true,
      });

      if (data?.status === 200) {
        toast.success("Successfully logged in!");
        onSuccess(); // Notify success
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
          label="Email / Phone"
          placeholder="Enter Email / Phone..."
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
      </form>
    </div>
  );
};

export default LoginForm;
