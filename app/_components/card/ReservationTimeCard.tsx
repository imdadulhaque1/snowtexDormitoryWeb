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

const ReservationTimeCard: FC<Props> = ({ token, onAddSuccess, userId }) => {
  const [startDateTime, setStartDateTime] = useState<string>();
  const [endDateTime, setEndDateTime] = useState<string>();

  return (
    <div className=" w-full bg-white p-4 rounded-lg shadow-lg shadow-slate-400 my-4">
      <p className="text-xl text-black text-center mb-4">Reservation Time</p>
      <div className=" w-full flex  justify-between">
        <div className="w-[48%]">
          <DateTimePicker
            label="From Date & Time"
            value={startDateTime}
            onChange={setStartDateTime}
            min="2025-01-01T00:00"
            max="2050-12-31T23:59"
            // errorMsg={!startDateTime ? selectedDate?.startErrorMsg : ""}
          />
        </div>
        <div className="w-[48%]">
          <DateTimePicker
            label="To Date & Time"
            value={endDateTime}
            onChange={setEndDateTime}
            min="2025-01-01T00:00"
            max="2050-12-31T23:59"
            // errorMsg={!endDateTime ? selectedDate?.endErrorMsg : ""}
          />
        </div>
      </div>
    </div>
  );
};

export default ReservationTimeCard;
