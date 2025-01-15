import { COLORS } from "@/app/_utils/COLORS";
import React from "react";
import { MdDeleteOutline } from "react-icons/md";
import ImgPicker from "../imgField/ImgPicker";
interface DeleteModalProps {
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
  isVisible: boolean;
}

const AddRoomDetailsModal: React.FC<DeleteModalProps> = ({
  title,
  onConfirm,
  onCancel,
  isVisible,
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-xl text-center">
        <h2 className="text-lg font-workSans font-semibold uppercase mt-4">
          {title}
        </h2>

        <ImgPicker
          initialImages={[]}
          onImagesChange={(images) => console.log("Selected images:", images)}
          singleSelection={false}
        />

        <div className="flex justify-between mt-6 space-x-4">
          <button
            onClick={onCancel}
            className="flex-1 py-2 text-md text-gray-700 font-workSans bg-gray-200 rounded hover:bg-gray-300"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2  text-white text-md font-workSans bg-primary75 hover:bg-primary50 rounded "
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRoomDetailsModal;
