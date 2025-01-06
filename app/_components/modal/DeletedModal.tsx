import { COLORS } from "@/app/_utils/COLORS";
import React from "react";
import { MdDeleteOutline } from "react-icons/md";
interface DeleteModalProps {
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  isVisible: boolean;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  title,
  description,
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
        <h2 className="text-lg font-workSans font-semibold mt-4">{title}</h2>
        <p className="text-sm font-workSans text-gray-500 mt-2">
          {description}
        </p>
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

/*

import { useState } from 'react';
import DeleteModal from '../components/DeleteModal';

const ExamplePage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleDelete = () => {
    console.log('Item deleted!');
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <button
        onClick={() => setIsModalVisible(true)}
        className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
      >
        Delete Project
      </button>

      <DeleteModal
        title="Delete Project"
        description="You're going to delete the 'Demo' project."
        onConfirm={handleDelete}
        onCancel={handleCancel}
        isVisible={isModalVisible}
      />
    </div>
  );
};

export default ExamplePage;




*/
