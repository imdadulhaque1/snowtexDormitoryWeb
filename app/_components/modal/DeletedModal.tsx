import { COLORS } from "@/app/_utils/COLORS";
import React from "react";
import { MdDeleteOutline } from "react-icons/md";
interface DeleteModalProps {
  title: string;
  description: string;
  noteMsg?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isVisible: boolean;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  title,
  description,
  noteMsg,
  onConfirm,
  onCancel,
  isVisible,
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-sm text-center">
        <div className="flex justify-center items-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <MdDeleteOutline
              color={COLORS.red}
              size={35}
              className="cursor-pointer  shadow-xl shadow-white"
            />
          </div>
        </div>
        <h2 className="text-black text-lg font-workSans font-semibold mt-4">
          {title}
        </h2>
        <p className="text-sm font-workSans text-gray-700 mt-2">
          {description}
        </p>
        {noteMsg && (
          <div className="flex items-center">
            <p className="text-sm font-workSans font-semibold text-red-600 mt-2">
              Note:{" "}
            </p>
            <p className="text-sm font-workSans text-red-600 mt-2">{noteMsg}</p>
          </div>
        )}
        <div className="flex justify-between mt-6 space-x-4">
          <button
            onClick={onCancel}
            className="flex-1 py-2 text-md text-gray-700 font-workSans bg-gray-200 rounded hover:bg-gray-300"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2  text-white text-md font-workSans bg-red-500 rounded hover:bg-red-600"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
