"use client";

import AppURL from "@/app/_restApi/AppURL";
import { modalStyles } from "@/app/_utils/comStyle/admin/basicSetup/room/roomStye";
import React, { FC, useEffect, useState } from "react";
import Typical from "react-typical";
import TypingAnimation from "../animatedTxt/TypingAnimation";
import toast from "react-hot-toast";

interface Props {
  selectedRoom: any;
  onCancel: () => void;
  isVisible?: boolean;
}

const ViewRoomDetailsModal: FC<Props> = (props) => {
  if (!props?.isVisible) return null;

  const room = props.selectedRoom[0];
  const [zoomStyle, setZoomStyle] = useState({
    activeImgURL: "",
    backgroundPosition: "center",
    backgroundImage: "",
    isVisible: false,
  });
  const [activeFeature, setActiveFeature] = useState({
    isCommonFeature: true,
    isFurniture: false,
    isBed: false,
    isBathroom: false,
  });

  useEffect(() => {
    setZoomStyle((prev) => ({
      ...prev,
      activeImgURL: `${AppURL.imgURL}${room?.roomImages[0]}`,
    }));
  }, []);

  // Handle the mouse move event to adjust the zoom position
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const container = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - container.left) / container.width) * 100;
    const y = ((e.clientY - container.top) / container.height) * 100;

    setZoomStyle((prev) => ({
      ...prev,
      backgroundPosition: `${x}% ${y}%`,
      backgroundImage: `url(${zoomStyle?.activeImgURL})`,
      isVisible: true,
    }));
  };

  // Handle mouse leave event to hide the zoom area
  const handleMouseLeave = () => {
    setZoomStyle((prev) => ({
      ...prev,
      backgroundPosition: "center",
      backgroundImage: "",
      isVisible: false,
    }));
  };

  const isAvailable = true;
  const roomSideTxt =
    room?.roomSideId == 1
      ? "East"
      : room?.roomSideId == 2
      ? "West"
      : room?.roomSideId == 3
      ? "North"
      : room?.roomSideId == 4
      ? "South"
      : "Unknown";
  const haveBelconiTxt =
    room?.roomBelconiId == 1 ? "Attached Belconi" : "Haven't Attached Belconi";
  const attatchedbathroomTxt = room?.attachedBathroomId == 1 ? "Yes" : "No";

  return (
    <div className={modalStyles.overlay}>
      <div className={`${modalStyles.container} w-screen`}>
        <h2 className={modalStyles.title}>{room?.roomName} Details</h2>
        <div className="flex space-x-4">
          <div className="relative w-[250] h-80">
            <div
              className="relative w-[250] h-full overflow-hidden border border-gray-300 rounded-xl cursor-pointer"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {zoomStyle?.activeImgURL && (
                <img
                  src={`${zoomStyle?.activeImgURL}`}
                  alt="Picture of the room"
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            {/* Zoomed Image */}
            {zoomStyle.isVisible && (
              <div
                className="absolute top-0 left-[260] w-80 h-80 border border-gray-300 overflow-hidden rounded-xl"
                style={{
                  backgroundSize: "150%",
                  backgroundImage: zoomStyle.backgroundImage,
                  backgroundPosition: zoomStyle.backgroundPosition,
                  transition: "background-position 0.1s ease-out",
                }}
              />
            )}
          </div>

          {/* ComView Section */}
          <div className="flex flex-col w-full">
            <div className="flex items-stretch">
              <ComView
                label="Room"
                value={room?.roomName}
                className="border-r-2 border-gray-700 pr-4"
              />
              <ComView
                label="Floor"
                value={room?.floorName}
                className="border-r-2 border-gray-700 px-4"
              />
              <ComView
                label="Building"
                value={room?.buildingName}
                className=" pl-4"
              />
            </div>
            <div className="flex flex-col   ">
              <TypingAnimation
                text={
                  isAvailable
                    ? "Room is available....!  "
                    : "Room is not available....!  "
                }
                status={isAvailable}
                availableColor="text-primary50"
                notAvailableColor="text-red-500"
                className="mb-3"
              />
              <ComView label="Room Dimensions" value={room?.roomDimension} />
              <ComView label="Room Side" value={roomSideTxt} />
              <ComView label="Belconi Status" value={haveBelconiTxt} />
              <ComView label="Attached Bathroom" value={attatchedbathroomTxt} />
            </div>
          </div>
        </div>

        {/* Image Selection for Zoom */}
        <div className="flex items-stretch my-3">
          {room?.roomImages &&
            room?.roomImages?.length > 0 &&
            room?.roomImages?.map((imgURL: any, imgIndex: number) => {
              const isLast = imgIndex === room?.roomImages.length - 1;
              return (
                <img
                  onClick={() => {
                    setZoomStyle((prev) => ({
                      ...prev,
                      activeImgURL: `${AppURL.imgURL}${imgURL}`,
                    }));
                  }}
                  key={imgIndex}
                  src={`${AppURL.imgURL}${imgURL}`}
                  alt="Picture of the room"
                  className={`w-20 h-16 object-fill border-2 ${
                    `${AppURL.imgURL}${imgURL}` == zoomStyle?.activeImgURL
                      ? "border-primary65 shadow-xl shadow-primary90"
                      : "border-gray-300"
                  } rounded-md cursor-pointer ${isLast ? "" : "mr-3"}`}
                />
              );
            })}
        </div>

        <div className="flex items-center my-4">
          <ClickBtn
            label="Room Common Features"
            onClick={() => {
              setActiveFeature({
                isCommonFeature: true,
                isFurniture: false,
                isBed: false,
                isBathroom: false,
              });
            }}
            className={`${
              activeFeature?.isCommonFeature
                ? "bg-slate-400 text-white"
                : "bg-slate-200"
            } hover:bg-slate-400 hover:border-slate-400 hover:text-white  mr-4 `}
          />
          <ClickBtn
            label="Available Furnitures"
            onClick={() => {
              setActiveFeature({
                isCommonFeature: false,
                isFurniture: true,
                isBed: false,
                isBathroom: false,
              });
            }}
            className={`${
              activeFeature?.isFurniture
                ? "bg-slate-400 text-white"
                : "bg-slate-200"
            }  hover:bg-slate-400 hover:border-slate-400 hover:text-white mr-4`}
          />
          <ClickBtn
            label="Bed Specification"
            onClick={() => {
              setActiveFeature({
                isCommonFeature: false,
                isFurniture: false,
                isBed: true,
                isBathroom: false,
              });
            }}
            className={`${
              activeFeature?.isBed ? "bg-slate-400 text-white" : "bg-slate-200"
            } hover:bg-slate-400 hover:border-slate-400 hover:text-white mr-4`}
          />
          <ClickBtn
            label="Bathroom Specification"
            onClick={() => {
              setActiveFeature({
                isCommonFeature: false,
                isFurniture: false,
                isBed: false,
                isBathroom: true,
              });
            }}
            className={` ${
              activeFeature?.isBathroom
                ? "bg-slate-400 text-white"
                : "bg-slate-200"
            } hover:bg-slate-400 hover:border-slate-400 hover:text-white mr-4`}
          />
        </div>
        {activeFeature?.isCommonFeature && (
          <div>
            {room?.commonFeatures && room?.commonFeatures?.length > 0 ? (
              <div className="border border-gray-300 rounded-md p-4">
                {room?.commonFeatures.map((feature: any, index: number) => {
                  return (
                    <ul
                      key={index}
                      className="flex items-center list-disc ml-4"
                    >
                      <li className="font-workSans text-black">
                        {feature?.name}
                      </li>
                    </ul>
                  );
                })}
              </div>
            ) : (
              <p className="font-workSans text-errorColor">No data founds !</p>
            )}
          </div>
        )}
        {activeFeature?.isFurniture && (
          <div>
            {room?.availableFurnitures &&
            room?.availableFurnitures?.length > 0 ? (
              <div className="border border-gray-300 rounded-md p-4">
                {room?.availableFurnitures.map(
                  (furniture: any, index: number) => {
                    return (
                      <ul
                        key={index}
                        className="flex items-center list-disc ml-4"
                      >
                        <li className="font-workSans text-black">
                          {furniture?.name}
                        </li>
                      </ul>
                    );
                  }
                )}
              </div>
            ) : (
              <p className="font-workSans text-errorColor">
                No furniture founds !
              </p>
            )}
          </div>
        )}
        {activeFeature?.isBed && (
          <div>
            {room?.bedSpecification && room?.bedSpecification?.length > 0 ? (
              <div className="border border-gray-300 rounded-md p-4">
                {room?.bedSpecification.map((bed: any, bedIndex: number) => {
                  return (
                    <ul
                      key={bedIndex}
                      className="flex items-center list-disc ml-4"
                    >
                      <li className="font-workSans text-black">{bed?.name}</li>
                    </ul>
                  );
                })}
              </div>
            ) : (
              <p className="font-workSans text-errorColor">No bed founds !</p>
            )}
          </div>
        )}
        {activeFeature?.isBathroom && (
          <div>
            {room?.bathroomSpecification &&
            room?.bathroomSpecification?.length > 0 ? (
              <div className="border border-gray-300 rounded-md p-4">
                {room?.bathroomSpecification.map(
                  (bathroom: any, bathroomIndex: number) => {
                    return (
                      <ul
                        key={bathroomIndex}
                        className="flex items-center list-disc ml-4"
                      >
                        <li className="font-workSans text-black">
                          {bathroom?.name}
                        </li>
                      </ul>
                    );
                  }
                )}
              </div>
            ) : (
              <p className="font-workSans text-errorColor">
                No bathroom founds !
              </p>
            )}
          </div>
        )}

        {/* Close Button */}
        <div className="flex justify-center mt-6 space-x-4">
          <button
            onClick={props.onCancel}
            className="px-10 py-2 text-md text-red-500 font-workSans bg-errorLight90 rounded-full hover:bg-errorColor hover:text-red-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewRoomDetailsModal;

interface comViewInterface {
  label: string;
  value: any;
  className?: string;
}
interface clickBtnInterface {
  label: string;
  onClick?: () => void;
  className?: string;
}

const ComView: React.FC<comViewInterface> = ({ label, value, className }) => {
  return (
    <div className={`flex ${className}`}>
      <p className={`${modalStyles.detailsLabel} mr-2`}>{label}:</p>
      <p className={modalStyles.detailsTxt}>{value}</p>
    </div>
  );
};

const ClickBtn: React.FC<clickBtnInterface> = ({
  label,
  onClick,
  className,
}) => {
  return (
    <p
      onClick={onClick}
      className={`font-workSans text-black bg-slate-200 cursor-pointer border-2 border-slate-200 rounded-md px-3 py-2 ${className} shadow-lg shadow-slate-300`}
    >
      {label}
    </p>
  );
};
