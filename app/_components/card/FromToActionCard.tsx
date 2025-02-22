"use client";

import React, { FC, useState } from "react";
import DateTimePicker from "../datePicker/DateTimePicker";
import { IoSearch } from "react-icons/io5";
import toast from "react-hot-toast";
import axios from "axios";
import AppURL from "@/app/_restApi/AppURL";

interface Props {
  onPassItems?: (res: { itemRess: any; startTime: any; endTime: any }) => void;
  token?: string;
}

const FromToActionCard: FC<Props> = ({ onPassItems, token }) => {
  const [startDateTime, setStartDateTime] = useState<string>();
  const [endDateTime, setEndDateTime] = useState<string>();

  const availableRoomFunc = async () => {
    if (startDateTime && endDateTime && startDateTime > endDateTime) {
      toast.error("'From Date' never be greater than 'To Date.");
    } else if (startDateTime && endDateTime && startDateTime < endDateTime) {
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
          toast.success(data?.message);
          if (onPassItems) {
            onPassItems({
              itemRess: data,
              startTime: startDateTime,
              endTime: endDateTime,
            });
          }
        }
      } catch (error: any) {
        toast.error(error.message);
      }
    } else {
      toast.error("Please complete the required fields.");
    }
  };

  return (
    <div className="flex  rounded-lg bg-white border-2 border-slate-300 p-4 items-end">
      <DateTimePicker
        label="From Date & Time"
        value={startDateTime}
        onChange={setStartDateTime}
        min="2025-01-01T00:00"
        max="2050-12-31T23:59"
      />
      <div className="mx-4">
        <DateTimePicker
          label="To Date & Time"
          value={endDateTime}
          onChange={setEndDateTime}
          min="2025-01-01T00:00"
          max="2050-12-31T23:59"
        />
      </div>
      <button
        className="flex bg-slate-400 items-center font-workSans text-md py-2 px-4 rounded-lg text-black hover:bg-slate-500 hover:text-white"
        onClick={availableRoomFunc}
      >
        <IoSearch size={20} className="cursor-pointer mr-2" />
        Available Room
      </button>
    </div>
  );
};

export default FromToActionCard;
