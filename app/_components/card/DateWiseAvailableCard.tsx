"use client";

import React, { FC, useEffect, useState } from "react";
import { MdDeleteOutline, MdOutlineFileUpload } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { IoSearch } from "react-icons/io5";
import axios from "axios";
import toast from "react-hot-toast";
import DateTimePicker from "../datePicker/DateTimePicker";
import AppURL from "@/app/_restApi/AppURL";

interface Props {
  token?: string;
  userId?: string;
  onAddSuccess?: (response: any) => void;
}

const DateWiseAvailableCard: FC<Props> = ({ token, onAddSuccess, userId }) => {
  const [startDateTime, setStartDateTime] = useState<string>();
  const [endDateTime, setEndDateTime] = useState<string>();

  const [selectedDate, setSelectedDate] = useState({
    startErrorMsg: "",
    endErrorMsg: "",
    startEndErrMsg: "",
  });

  const validateForm = () => {
    let isValid = true;
    const errors: Partial<typeof selectedDate> = {};

    if (!startDateTime) {
      isValid = false;
      errors.startErrorMsg = "From date & time is required.";
    }
    if (!endDateTime) {
      isValid = false;
      errors.endErrorMsg = "To date & time is required.";
    }

    setSelectedDate((prev) => ({ ...prev, ...errors }));
    return isValid;
  };

  const availableRoomFunc = async () => {
    if (!validateForm()) return;
    if (startDateTime && endDateTime && startDateTime > endDateTime) {
      toast.error("'From Date' never be greater than 'To Date.");
    } else {
      // availableRoom?searchByStartTime=2025-02-09T10%3A10%3A00.000Z&searchByEndTime=2025-02-08T10%3A10%3A00.000Z
      try {
        const { data } = await axios.get(
          `${AppURL.availableRoomApi}?searchByStartTime=${startDateTime}&searchByEndTime=${endDateTime}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (data?.status === 200) {
          if (onAddSuccess) {
            onAddSuccess(data);
          }
        }
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className=" w-full bg-white p-4 rounded-lg shadow-lg shadow-slate-400 my-4">
      <div className=" w-full flex  justify-between">
        <div className="w-[48%]">
          <DateTimePicker
            label="From Date & Time"
            value={startDateTime}
            onChange={setStartDateTime}
            min="2025-01-01T00:00"
            max="2050-12-31T23:59"
            errorMsg={!startDateTime ? selectedDate?.startErrorMsg : ""}
          />
        </div>
        <div className="w-[48%]">
          <DateTimePicker
            label="To Date & Time"
            value={endDateTime}
            onChange={setEndDateTime}
            min="2025-01-01T00:00"
            max="2050-12-31T23:59"
            errorMsg={!endDateTime ? selectedDate?.endErrorMsg : ""}
          />
        </div>
      </div>
      <div className="flex w-full items-center justify-center mt-4">
        <button
          className="flex bg-slate-400 items-center font-workSans text-md py-2 px-4 rounded-lg text-black hover:bg-slate-500 hover:text-white"
          onClick={availableRoomFunc}
        >
          <IoSearch size={20} className="cursor-pointer mr-2" />
          Available Room
        </button>
      </div>
    </div>
  );
};

export default DateWiseAvailableCard;
