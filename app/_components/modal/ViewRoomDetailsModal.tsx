"use client";

import AppURL from "@/app/_restApi/AppURL";
import { modalStyles } from "@/app/_utils/comStyle/admin/basicSetup/room/roomStye";
import React, { FC, useState } from "react";

interface Props {
  selectedRoom: any;
  onCancel: () => void;
  isVisible?: boolean;
}

const ViewRoomDetailsModal: FC<Props> = (props) => {
  if (!props?.isVisible) return null;

  const room = props.selectedRoom[0];
  const [zoomStyle, setZoomStyle] = useState({
    backgroundPosition: "center",
    backgroundImage: "",
    isVisible: false,
  });

  // Handle the mouse move event to adjust the zoom position
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const container = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - container.left) / container.width) * 100;
    const y = ((e.clientY - container.top) / container.height) * 100;

    // Set the zoom style dynamically
    setZoomStyle({
      backgroundPosition: `${x}% ${y}%`,
      backgroundImage: `url(${AppURL.imgURL}${room?.roomImages[2]})`,
      isVisible: true,
    });
  };

  // Handle mouse leave event to hide the zoom area
  const handleMouseLeave = () => {
    setZoomStyle({
      backgroundPosition: "center",
      backgroundImage: "",
      isVisible: false,
    });
  };

  return (
    <div className={modalStyles.overlay}>
      <div className={`${modalStyles.container} w-screen`}>
        <h2 className={modalStyles.title}>Room Details View</h2>
        <div className="flex space-x-4">
          {/* Original Image */}
          <div
            className="relative w-80 h-80 overflow-hidden border border-gray-300 rounded-xl cursor-pointer"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {room?.roomImages[0] && (
              <img
                src={`${AppURL.imgURL}${room?.roomImages[2]}`}
                alt="Picture of the room"
                className="w-full h-full object-contain"
              />
            )}
          </div>
          {/* Zoomed View */}
          {zoomStyle.isVisible && (
            <div
              className="relative w-80 h-80 border border-gray-300 overflow-hidden rounded-xl"
              style={{
                backgroundSize: "150%", // Increase the zoom level
                backgroundImage: zoomStyle.backgroundImage,
                backgroundPosition: zoomStyle.backgroundPosition,
                transition: "background-position 0.1s ease-out", // Smooth transition
              }}
            ></div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col items-stretch mt-4">
          <ComView
            label="Room Name"
            value={room?.roomName}
            className="border-r-2 border-gray-700 pr-4"
          />
          <ComView label="Floor Name" value={room?.floorName} />
          <ComView label="Building Name" value={room?.buildingName} />
        </div>

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

const ComView: React.FC<comViewInterface> = ({ label, value, className }) => {
  return (
    <div className={`flex ${className}`}>
      <p className={`${modalStyles.detailsLabel} mr-2`}>{label}:</p>
      <p className={modalStyles.detailsTxt}>{value}</p>
    </div>
  );
};
