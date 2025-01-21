"use client";

import AppURL from "@/app/_restApi/AppURL";
import { modalStyles } from "@/app/_utils/comStyle/admin/basicSetup/room/roomStye";
import React, { FC, useEffect, useState } from "react";

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

  return (
    <div className={modalStyles.overlay}>
      <div className={`${modalStyles.container} w-screen`}>
        <h2 className={modalStyles.title}>View Room Details</h2>
        <div className="flex space-x-4">
          {/* Image Wrapper with Relative Positioning */}
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
          <div className="flex flex-col mt-4 w-full">
            <div className="flex items-stretch">
              <ComView
                label="Room Name"
                value={room?.roomName}
                className="border-r-2 border-gray-700 pr-4"
              />
              <ComView label="Floor Name" value={room?.floorName} />
              <ComView label="Building Name" value={room?.buildingName} />
            </div>
          </div>
        </div>

        {/* Image Selection for Zoom */}
        <div className="flex items-stretch mt-4">
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
                  className={`w-28 h-20 object-fill border-2 ${
                    `${AppURL.imgURL}${imgURL}` == zoomStyle?.activeImgURL
                      ? "border-primary65 shadow-xl shadow-primary90"
                      : "border-gray-300"
                  } rounded-md cursor-pointer ${isLast ? "" : "mr-3"}`}
                />
              );
            })}
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
