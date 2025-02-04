"use client";

import React, { useEffect, useState } from "react";

import AppURL from "@/app/_restApi/AppURL";
import axios from "axios";
import VerticalSingleInput from "../inputField/VerticalSingleInput";
import { IoClose } from "react-icons/io5";
import toast from "react-hot-toast";
import {
  isEmailValid,
  isValidBDTelephone,
} from "@/app/_utils/handler/validateBDTelephone ";
interface addNewPersonProps {
  isUpdate?: boolean;
  updateData: any;
  title: string;
  onCancel: () => void;
  isVisible: boolean;
  userId?: any;
  token?: string;
  onAddSuccess?: (response: any) => void;
}

const AddNewPersonModal: React.FC<addNewPersonProps> = ({
  updateData,
  isUpdate,
  title,
  // onConfirm,
  onCancel,
  isVisible,
  userId,
  token,
  onAddSuccess,
}) => {
  if (!isVisible) return null;

  const [externalUser, setExternalUser] = useState({
    personId: null,
    name: "",
    companyName: "",
    personalPhoneNo: "",
    companyPhoneNo: "",
    email: "",
    nidBirthPassport: "",
    country: "",
    address: "",
    nameErrorMsg: "",
    companyNameErrorMsg: "",
    personalPhoneNoErrorMsg: "",
    companyPhoneNoErrorMsg: "",
    emailErrorMsg: "",
    nidBirthPassportErrorMsg: "",
    countryErrorMsg: "",
    addressErrorMsg: "",
  });

  useEffect(() => {
    if (isUpdate && updateData) {
      setExternalUser((prev) => ({
        ...prev,
        personId: updateData?.personId,
        name: updateData?.name,
        companyName: updateData?.companyName,
        personalPhoneNo: updateData?.personalPhoneNo,
        companyPhoneNo: updateData?.companyPhoneNo,
        email: updateData?.email,
        nidBirthPassport: updateData?.nidBirthPassport,
        country: updateData?.countryName,
        address: updateData?.address,
      }));
    } else {
    }
  }, [isUpdate]);

  const validateForm = () => {
    let isValid = true;
    const errors: Partial<typeof externalUser> = {};

    if (!externalUser.name.trim()) {
      isValid = false;
      errors.nameErrorMsg = "Name is required.";
    }
    if (!externalUser.companyName.trim()) {
      isValid = false;
      errors.companyNameErrorMsg = "Company name is required.";
    }

    if (!externalUser.personalPhoneNo) {
      isValid = false;
      errors.personalPhoneNoErrorMsg = "Phone number is required.";
    }
    if (!externalUser.companyPhoneNo) {
      isValid = false;
      errors.companyPhoneNoErrorMsg = "Invalid official contact number";
    }
    if (!externalUser.email) {
      isValid = false;
      errors.emailErrorMsg = "Invalid email address";
    }
    if (!externalUser.nidBirthPassport) {
      isValid = false;
      errors.nidBirthPassportErrorMsg = "NID / Birth / Passwort is required";
    }
    if (!externalUser.country) {
      isValid = false;
      errors.countryErrorMsg = "Country name is required";
    }
    if (!externalUser.address) {
      isValid = false;
      errors.addressErrorMsg = "Address is required";
    }

    setExternalUser((prev) => ({ ...prev, ...errors }));
    return isValid;
  };

  const newPersonAdd = async () => {
    if (!validateForm()) return;
    const submittedData = await {
      name: externalUser?.name,
      companyName: externalUser.companyName,
      personalPhoneNo: externalUser.personalPhoneNo,
      companyPhoneNo: externalUser.companyPhoneNo,
      email: externalUser.email,
      nidBirthPassport: externalUser.nidBirthPassport,
      countryName: externalUser.country,
      address: externalUser.address,
      createdBy: parseInt(userId),
    };

    try {
      const { data }: any = await axios.post(AppURL.personApi, submittedData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (data?.status == 201) {
        // is it possible to get success or failed status from here ?
        toast.success("Successfully submitted !");
        setExternalUser((prev) => ({
          ...prev,
          name: "",
          companyName: "",
          personalPhoneNo: "",
          companyPhoneNo: "",
          email: "",
          nidBirthPassport: "",
          country: "",
          address: "",
          nameErrorMsg: "",
          companyNameErrorMsg: "",
          personalPhoneNoErrorMsg: "",
          companyPhoneNoErrorMsg: "",
          emailErrorMsg: "",
          nidBirthPassportErrorMsg: "",
          countryErrorMsg: "",
          addressErrorMsg: "",
        }));
        if (onAddSuccess) {
          onAddSuccess(externalUser.personalPhoneNo);
        }
        return true;
      }
    } catch (error: any) {
      if (error?.status == 409) {
        toast.error("Contact no or email is already exists!");
      } else {
        toast.error("Failed to add new person. Try again!");
      }

      if (onAddSuccess) {
        onAddSuccess("");
      }
    }
  };

  const updatePersonFunc = async () => {
    if (!validateForm()) return;
    const updatedData = await {
      name: externalUser?.name,
      companyName: externalUser.companyName,
      personalPhoneNo: externalUser.personalPhoneNo,
      companyPhoneNo: externalUser.companyPhoneNo,
      email: externalUser.email,
      nidBirthPassport: externalUser.nidBirthPassport,
      countryName: externalUser.country,
      address: externalUser.address,
      updatedBy: parseInt(userId),
    };

    try {
      const { data }: any = await axios.put(
        `${AppURL.personApi}/${externalUser?.personId}`,
        updatedData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data?.status == 200) {
        toast.success("Successfully updated !");
        setExternalUser((prev) => ({
          ...prev,
          name: "",
          companyName: "",
          personalPhoneNo: "",
          companyPhoneNo: "",
          email: "",
          nidBirthPassport: "",
          country: "",
          address: "",
          nameErrorMsg: "",
          companyNameErrorMsg: "",
          personalPhoneNoErrorMsg: "",
          companyPhoneNoErrorMsg: "",
          emailErrorMsg: "",
          nidBirthPassportErrorMsg: "",
          countryErrorMsg: "",
          addressErrorMsg: "",
        }));
        if (onAddSuccess) {
          onAddSuccess(externalUser.personalPhoneNo);
        }
        return true;
      }
    } catch (error: any) {
      if (error?.status == 409) {
        toast.error("Contact no or email is already exists!");
      } else {
        toast.error("Failed to add new person. Try again!");
      }

      if (onAddSuccess) {
        onAddSuccess("");
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-4xl max-h-[97%] overflow-auto my-5">
        <div className="flex w-full items-center justify-center mb-4 ">
          <h2 className="text-lg font-workSans font-semibold uppercase  text-center w-100p ">
            {title}
          </h2>

          <button
            className="flex items-end justify-end bg-slate-50 border-2 hover:border-red-700 rounded-full"
            onClick={onCancel}
          >
            <IoClose
              size={35}
              className="cursor-pointer text-errorColor shadow-xl shadow-white hover:text-red-600"
            />
          </button>
        </div>

        <div className="flex flex-col items-center justify-center xl:flex-row w-full h-90p ">
          <div className={`w-[97%]   h-80p`}>
            <div className="flex w-full mb-3">
              <div className=" w-1/2 ">
                <VerticalSingleInput
                  label="Name"
                  type="text"
                  name="name"
                  placeholder="Enter person name..."
                  // @ts-ignore
                  value={externalUser?.name}
                  onChange={(e: any) =>
                    setExternalUser((prev) => ({
                      ...prev,
                      name: e.target.value,
                      nameErrorMsg: "",
                    }))
                  }
                  errorMsg={externalUser.nameErrorMsg}
                  required
                />
              </div>
              <div className="ml-3 w-1/2">
                <VerticalSingleInput
                  label="Company Name"
                  type="text"
                  name="companyName"
                  placeholder="Enter company name..."
                  // @ts-ignore
                  value={externalUser?.companyName}
                  onChange={(e: any) =>
                    setExternalUser((prev) => ({
                      ...prev,
                      companyName: e.target.value,
                      companyNameErrorMsg: "",
                    }))
                  }
                  errorMsg={externalUser.companyNameErrorMsg}
                  required
                />
              </div>
            </div>
            <div className="flex w-full ">
              <div className="w-1/2">
                <VerticalSingleInput
                  label="Contact No"
                  type="tel"
                  name="contactNo"
                  placeholder="Enter contact no..."
                  // @ts-ignore
                  value={externalUser?.personalPhoneNo}
                  onChange={async (e: any) => {
                    await setExternalUser((prev) => ({
                      ...prev,
                      personalPhoneNo: e.target.value,
                    }));
                    if (isValidBDTelephone(e.target.value)) {
                      setExternalUser((prev) => ({
                        ...prev,
                        personalPhoneNoErrorMsg: "",
                      }));
                    } else {
                      setExternalUser((prev) => ({
                        ...prev,
                        personalPhoneNoErrorMsg: "Invalid phone number",
                      }));
                    }
                  }}
                  errorMsg={externalUser.personalPhoneNoErrorMsg}
                  required
                />
              </div>

              <div className="ml-3 w-1/2">
                <VerticalSingleInput
                  label="Official Contact No"
                  type="tel"
                  name="OfficialContactNo"
                  placeholder="Enter official contact no..."
                  // @ts-ignore
                  value={externalUser?.companyPhoneNo}
                  onChange={async (e: any) => {
                    await setExternalUser((prev) => ({
                      ...prev,
                      companyPhoneNo: e.target.value,
                    }));
                    if (isValidBDTelephone(e.target.value)) {
                      setExternalUser((prev) => ({
                        ...prev,
                        companyPhoneNoErrorMsg: "",
                      }));
                    } else {
                      setExternalUser((prev) => ({
                        ...prev,
                        companyPhoneNoErrorMsg:
                          "Invalid official contact number",
                      }));
                    }
                  }}
                  errorMsg={externalUser.companyPhoneNoErrorMsg}
                  required
                />
              </div>
            </div>
            <div className="flex w-full my-3">
              <div className="w-1/2">
                <VerticalSingleInput
                  label="Email Address"
                  type="email"
                  name="email"
                  placeholder="Enter email address..."
                  // @ts-ignore
                  value={externalUser?.email}
                  onChange={(e: any) => {
                    setExternalUser((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }));
                    if (isEmailValid(e.target.value)) {
                      setExternalUser((prev) => ({
                        ...prev,
                        emailErrorMsg: "",
                      }));
                    } else {
                      setExternalUser((prev) => ({
                        ...prev,
                        emailErrorMsg: "Invalid email address",
                      }));
                    }
                  }}
                  errorMsg={externalUser.emailErrorMsg}
                  required
                />
              </div>

              <div className="ml-3 w-1/2">
                <VerticalSingleInput
                  label="NID / Birth / Passport"
                  type="text"
                  name="nidBirthPassport"
                  placeholder="Enter person's NID / Birth / Passport..."
                  // @ts-ignore
                  value={externalUser?.nidBirthPassport}
                  onChange={(e: any) =>
                    setExternalUser((prev) => ({
                      ...prev,
                      nidBirthPassport: e.target.value,
                      nidBirthPassportErrorMsg: "",
                    }))
                  }
                  errorMsg={externalUser.nidBirthPassportErrorMsg}
                  required
                />
              </div>
            </div>

            <div className="flex w-full my-3">
              <div className="w-1/2">
                <VerticalSingleInput
                  label="Country"
                  type="text"
                  name="country"
                  placeholder="Enter country name..."
                  // @ts-ignore
                  value={externalUser?.country}
                  onChange={(e: any) =>
                    setExternalUser((prev) => ({
                      ...prev,
                      country: e.target.value,
                      countryErrorMsg: "",
                    }))
                  }
                  errorMsg={externalUser.countryErrorMsg}
                  required
                />
              </div>
              <div className="ml-3 w-1/2">
                <VerticalSingleInput
                  label="Address"
                  type="text"
                  name="address"
                  placeholder="Enter address"
                  // @ts-ignore
                  value={externalUser?.address}
                  onChange={(e: any) =>
                    setExternalUser((prev) => ({
                      ...prev,
                      address: e.target.value,
                      addressErrorMsg: "",
                    }))
                  }
                  errorMsg={externalUser.addressErrorMsg}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center mt-6 space-x-4">
          <button
            onClick={onCancel}
            className=" py-2 w-1/4 xl:w-1/6 text-md text-black font-workSans bg-errorColor rounded hover:bg-red-500 hover:text-white"
          >
            {isUpdate ? "Cancel" : "No"}
          </button>
          <button
            onClick={isUpdate ? updatePersonFunc : newPersonAdd}
            className="py-2 w-1/3 xl:w-1/4 text-black text-md font-workSans bg-primary75 hover:bg-primary45 hover:text-white rounded "
          >
            {isUpdate ? "Update" : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNewPersonModal;
