"use client";

import { modalStyles } from "@/app/_utils/comStyle/admin/basicSetup/room/roomStye";
import { personInterface } from "@/interface/admin/roomManagements/personInterafce";
import React, { FC } from "react";
import { IoClose } from "react-icons/io5";
interface Props {
  cancelFunc?: () => void;
  personData?: personInterface | null;
}

const PersonCard: FC<Props> = ({ cancelFunc, personData }) => {
  return (
    <div className="bg-white w-full p-4 rounded-lg shadow-lg shadow-slate-400">
      {personData ? (
        <div className="w-full">
          <div className="flex w-full items-center justify-end mb-4 ">
            <button
              className="flex bg-slate-50 border-2 border-errorColor hover:border-red-700 rounded-full shadow-2xl"
              onClick={cancelFunc}
            >
              <IoClose
                size={35}
                className="cursor-pointer text-errorColor shadow-xl shadow-white hover:text-red-600"
              />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-workSans text-md text-black">
              {personData?.name}
            </p>
            <p className="font-workSans text-md text-black font-medium">
              {personData?.companyName}
            </p>
          </div>
          <ComView
            label="Contact No"
            value={personData?.personalPhoneNo}
            className="my-1"
          />
          <ComView
            label="Official Phone No"
            value={personData?.companyPhoneNo}
            className="my-1"
          />
          <ComView label="Email" value={personData?.email} className="my-1" />
          <ComView
            label="NID/Birth/Passport"
            value={personData?.nidBirthPassport}
            className="my-1"
          />
          <ComView
            label="Country Name"
            value={personData?.countryName}
            className="my-1"
          />
          <ComView
            label="Address"
            value={personData?.address}
            className="my-1"
          />
        </div>
      ) : (
        <div>
          <div className="flex w-full items-center justify-end mb-4 ">
            <button
              className="flex bg-slate-50 border-2 border-errorColor hover:border-red-700 rounded-full shadow-2xl"
              onClick={cancelFunc}
            >
              <IoClose
                size={35}
                className="cursor-pointer text-errorColor shadow-xl shadow-white hover:text-red-600"
              />
            </button>
          </div>
          <p className="font-workSans text-md text-center text-red-600 my-6">
            Person info not found !
          </p>
        </div>
      )}
    </div>
  );
};

export default PersonCard;

interface comViewInterface {
  label: string;
  value: any;
  className?: string;
  valueColor?: string;
}

const ComView: React.FC<comViewInterface> = ({
  label,
  value,
  className,
  valueColor,
}) => {
  return (
    <div className={`flex ${className}`}>
      <p className={`${modalStyles.detailsLabel} mr-2`}>{label}:</p>
      <p className={`${modalStyles.detailsTxt} ${valueColor}`}>{value}</p>
    </div>
  );
};
