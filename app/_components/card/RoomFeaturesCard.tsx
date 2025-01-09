import React, { FC } from "react";
import { MdOutlineFileUpload } from "react-icons/md";
import { FaRegWindowClose } from "react-icons/fa";
import VerticalSingleInput from "../inputField/VerticalSingleInput";
import Card from "./Card";

interface ReusableFeaturesCardProps {
  title: string;
  // onChange: (field: string, value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  nameOnChange: (e: any) => void;
  remarksOnChange: (e: any) => void;
  nameLabel?: string;
  nameType?: string;
  nameDefinedBy?: string;
  namePlaceholder?: string;
  nameValue?: any;
  nameErrorMsg?: string;
  remarksLabel?: string;
  remarksType?: string;
  remarksDefinedBy?: string;
  remarksPlaceholder?: string;
  remarksValue?: any;
  remarksErrorMsg?: string;
  isUpdated: boolean;
  // isFormValid: boolean;
}

const ReusableFeaturesCard: FC<ReusableFeaturesCardProps> = ({
  title,
  // onChange,
  onSubmit,
  onCancel,
  isUpdated,
  // isFormValid,
  nameLabel,
  nameType,
  nameDefinedBy,
  namePlaceholder,
  nameValue,
  nameErrorMsg,
  remarksLabel,
  remarksType,
  remarksDefinedBy,
  remarksPlaceholder,
  remarksValue,
  remarksErrorMsg,
  nameOnChange,
  remarksOnChange,
}) => {
  return (
    <Card title={title} className="w-1/5">
      <VerticalSingleInput
        label={nameLabel}
        type={nameType}
        name={nameDefinedBy}
        placeholder={namePlaceholder}
        value={nameValue}
        onChange={nameOnChange}
        errorMsg={nameErrorMsg}
        required
      />
      <VerticalSingleInput
        label={remarksLabel}
        type={remarksType}
        name={remarksDefinedBy}
        placeholder={remarksPlaceholder}
        value={remarksValue}
        onChange={remarksOnChange}
        errorMsg={remarksErrorMsg}
        required
      />
      <div className="flex justify-center items-center mt-4">
        {!isUpdated ? (
          <button
            className="flex cursor-pointer bg-primary70 items-center font-workSans text-md py-2 px-4 rounded-lg text-black hover:bg-primary50 hover:text-white"
            onClick={onSubmit}
            // disabled={!isFormValid}
          >
            <MdOutlineFileUpload size={20} className="cursor-pointer mr-2" />
            Submit
          </button>
        ) : (
          <div className="flex space-x-4">
            <button
              className="flex cursor-pointer bg-primary70 items-center font-workSans text-md py-2 px-4 rounded-lg text-black hover:bg-primary50 hover:text-white"
              onClick={onSubmit}
              // disabled={!isFormValid}
            >
              <MdOutlineFileUpload size={20} className="cursor-pointer mr-2" />
              Update
            </button>
            <button
              className="flex bg-errorColor font-workSans text-md py-2 px-4 rounded-lg text-black hover:bg-red-500 hover:text-white"
              onClick={onCancel}
            >
              <FaRegWindowClose size={20} className="cursor-pointer mr-2" />
              Cancel
            </button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ReusableFeaturesCard;
