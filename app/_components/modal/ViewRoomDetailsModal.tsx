import { modalStyles } from "@/app/_utils/comStyle/admin/basicSetup/room/roomStye";
import React, { FC } from "react";

interface Props {
  selectedRoom: any;
  onCancel: () => void;
  isVisible?: boolean;
}

const ViewRoomDetailsModal: FC<Props> = (props) => {
  if (!props?.isVisible) return null;
  const room = props.selectedRoom[0];
  console.log("selectedRoom", JSON.stringify(props.selectedRoom, null, 2));
  console.log(room?.roomName);

  return (
    <div className={modalStyles.overlay}>
      <div className={`${modalStyles.container} w-screen`}>
        <h2 className={modalStyles.title}>Room Details View</h2>
        <div className="flex flex-col items-stretch">
          <ComView
            label="Room Name"
            value={room?.roomName}
            className="border-r-2 broder-gray-700 pr-4"
          />
          <ComView label="Floor Name" value={room?.floorName} />
          <ComView label="Building Name" value={room?.buildingName} />
        </div>
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
