import React from "react";
import { FiEdit, FiTrash } from "react-icons/fi";

interface Props {
  person: any;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  firstStyle?: any;
  lastStyle?: any;
  notLastStyle?: any;
  isChecked?: boolean;
  handleChecked?: ((event: any) => void) | undefined;
}

const SearchPersonCard: React.FC<Props> = ({
  person,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  firstStyle,
  lastStyle,
  notLastStyle,
  isChecked,
  handleChecked,
}) => {
  return (
    <div
      className={`flex flex-col ${firstStyle} ${notLastStyle} ${lastStyle} ${
        isSelected
          ? "bg-primary96 border-primary60 border-2 shadow-md"
          : "bg-white brightness-100"
      }  p-2 border-2 border-slate-200 rounded-lg cursor-pointer w-97p xl:w-95p`}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between">
        <p className="font-workSans text-black text-sm">{person.name}</p>
        <p className="font-workSans text-primary40 text-sm">
          {person.companyName}
        </p>
      </div>
      <p className="font-workSans text-black text-sm">{person.email}</p>
      <p className="font-workSans text-black text-sm">
        {person.personalPhoneNo}
      </p>

      {/* Edit and Delete icons */}
      {isSelected && (
        <div className="flex w-full items-center justify-center mt-2">
          <div className="relative group ">
            <button onClick={onEdit}>
              <FiEdit
                size={25}
                className="cursor-pointer mr-2 text-blue-500 hover:text-blue-700"
                onClick={onEdit}
              />
            </button>

            <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full  px-2 py-1 text-xs text-black  opacity-0 transition-opacity duration-500 group-hover:opacity-100 whitespace-nowrap font-workSans">
              Update person's info ?
            </span>
          </div>

          <div className="ml-4 relative group ">
            <button onClick={onDelete}>
              <FiTrash
                size={25}
                className="cursor-pointer text-red-500 hover:text-red-700"
              />
            </button>

            <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full  px-2 py-1 text-xs text-black  opacity-0 transition-opacity duration-500 group-hover:opacity-100 whitespace-nowrap font-workSans">
              Delete person ?
            </span>
          </div>

          <div className="flex items-center ml-4 ">
            <label
              onClick={handleChecked}
              className="flex items-center gap-2 ml-2 justify-center cursor-pointer"
            >
              <input
                className="w-[19] h-[19] cursor-pointer"
                type="checkbox"
                // @ts-ignore
                checked={isChecked}
                // onChange={handleChecked}
              />
              <span className="text-gray-600 text-md">Checked</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPersonCard;
