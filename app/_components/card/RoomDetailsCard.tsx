"use client";

import { roomDetailsInterface } from "@/interface/admin/roomManagements/roomDetailsInterface";
import React, { FC } from "react";
import { IoClose } from "react-icons/io5";
import { RxDividerVertical } from "react-icons/rx";
import { modalStyles } from "@/app/_utils/comStyle/admin/basicSetup/room/roomStye";

interface Props {
  rDetails?: roomDetailsInterface;
  cancelFunc?: () => void;
}

const RoomDetailsCard: FC<Props> = ({ rDetails, cancelFunc }) => {
  console.log("room details: ", JSON.stringify(rDetails, null, 2));

  const roomSideTxt =
    rDetails?.roomSideId == 1
      ? "East"
      : rDetails?.roomSideId == 2
      ? "West"
      : rDetails?.roomSideId == 3
      ? "North"
      : rDetails?.roomSideId == 4
      ? "South"
      : "Unknown";
  const haveBelconiTxt =
    rDetails?.roomBelconiId == 1
      ? "Attached Belconi"
      : "Haven't Attached Belconi";
  const attatchedbathroomTxt = rDetails?.attachedBathroomId == 1 ? "Yes" : "No";

  return (
    <div className=" w-full bg-white p-4 rounded-lg shadow-lg shadow-slate-400 my-4">
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
      <div className="flex items-center justify-start my-1">
        <ComView label="Room" value={rDetails?.roomName} />
        <RxDividerVertical
          size={25}
          className="cursor-pointer text-gray-500 mx-1"
        />
        <ComView label="Floor" value={rDetails?.floorName} />

        <RxDividerVertical
          size={25}
          className="cursor-pointer text-gray-500 mx-1"
        />
        <ComView label="Building" value={rDetails?.buildingName} />
      </div>
      <ComView
        label="Room Category"
        value={rDetails?.roomCategoryName}
        valueColor="text-green-700"
      />
      <ComView
        label="Room Dimensions"
        value={rDetails?.roomDimension}
        className="my-1"
      />

      <ComView label="Room Side" value={roomSideTxt} />
      <ComView label="Belconi Status" value={haveBelconiTxt} className="my-1" />
      <ComView label="Attached Bathroom" value={attatchedbathroomTxt} />
      <ComView
        label="Common Features"
        value={
          rDetails?.commonFeatures
            ? rDetails?.commonFeatures.map((feature) => feature.name).join(", ")
            : ""
        }
        className="my-1"
      />
      <ComView
        label="Available Furniture"
        value={
          rDetails?.availableFurnitures
            ? rDetails?.availableFurnitures
                .map((feature) => feature.name)
                .join(", ")
            : ""
        }
      />
      <ComView
        label="Bathroom"
        value={
          rDetails?.bathroomSpecification
            ? rDetails?.bathroomSpecification
                .map((feature) => feature.name)
                .join(", ")
            : ""
        }
      />
    </div>
  );
};

export default RoomDetailsCard;

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
