"use client";

import React, { FC, useState } from "react";
import TableHeader from "../inputField/table/TableHeader";
import { bookedRoomInterface } from "@/interface/admin/roomManagements/bookedRoomInterface";
import { IoEyeOutline } from "react-icons/io5";
import BookedRoomDetailsCard from "./BookedRoomDetailsCard";
import {
  formatDateAndTime,
  isDateExpired,
} from "@/app/_utils/handler/formateDate";
import ComView from "../comView/ComView";

interface Props {
  className?: string;
  bookedRoom?: bookedRoomInterface[];
}

interface roomDetailsInterface {
  isDetailsVisible?: boolean;
  selectedBookedRoom?: bookedRoomInterface[] | any;
}

const BookedRoomTable: FC<Props> = ({ className, bookedRoom }) => {
  const [room, setRoom] = useState<roomDetailsInterface>({
    isDetailsVisible: false,
    selectedBookedRoom: [],
  });

  const detailViewCancel = () => {
    setRoom({
      isDetailsVisible: false,
      selectedBookedRoom: [],
    });
  };
  return (
    <>
      <div
        className={`rounded-lg bg-white shadow-lg shadow-slate-400 ${className} p-4 `}
      >
        <p className="text-xl text-black text-center mb-4">All Booked Room</p>
        <div className="flex w-full items-center rounded-t-lg bg-slate-300">
          <TableHeader
            headerText="Details"
            containerClassName="w-[8%]"
            hasSearch={false}
          />
          <TableHeader
            headerText="Person Name"
            containerClassName="w-[12%] border-x-2 border-slate-50"
            hasSearch={false}
          />
          <TableHeader
            headerText="Mobile No"
            containerClassName="w-[11%] "
            hasSearch={false}
          />
          <TableHeader
            headerText="Price / Day (৳) "
            containerClassName="w-[10%] border-x-2 border-slate-50"
            hasSearch={false}
          />
          <TableHeader
            headerText="Paid Item Price (৳)"
            containerClassName="w-[11%]"
            hasSearch={false}
          />
          <TableHeader
            headerText="Free Item Price (৳)"
            containerClassName="w-[11%] border-x-2 border-slate-50"
            hasSearch={false}
          />
          <TableHeader
            headerText="Grand Total Price (৳)"
            containerClassName="w-[11%] "
            hasSearch={false}
          />
          <TableHeader
            headerText="From Date"
            containerClassName="w-[13%] border-x-2 border-slate-50"
            hasSearch={false}
          />
          <TableHeader
            headerText="To Date"
            containerClassName="w-[13%] "
            hasSearch={false}
          />
        </div>
        <div className="w-full max-h-[500px] overflow-y-auto border-y border-2">
          {bookedRoom && bookedRoom?.length > 0 ? (
            bookedRoom.map((bRoom, bRoomIndex) => {
              const expireDate = isDateExpired(bRoom.endTime)
                ? "bg-red-50"
                : "bg-white";
              return (
                <div
                  key={bRoomIndex}
                  className={`flex w-full items-center border-b-2 border-slate-300 ${expireDate} `}
                >
                  <div className="flex w-[8%] items-center justify-center">
                    <IoEyeOutline
                      size={25}
                      className="cursor-pointer mr-2 text-primary50 hover:text-primary40"
                      onClick={async () => {
                        await setRoom({
                          isDetailsVisible: true,
                          selectedBookedRoom: bRoom,
                        });
                      }}
                    />
                  </div>
                  <ComView
                    value={bRoom.personInfo?.name}
                    className="w-[12%] border-x-2"
                  />
                  <ComView
                    value={bRoom.personInfo?.personalPhoneNo}
                    className="w-[11%]"
                  />
                  <ComView
                    value={bRoom?.totalRoomPrice}
                    className="w-[10%] border-x-2"
                  />
                  <ComView
                    value={bRoom?.totalPaidItemsPrice}
                    className="w-[11%] "
                  />
                  <ComView
                    value={bRoom.totalFreeItemsPrice}
                    className="w-[11%] border-x-2"
                  />
                  <ComView value={bRoom.grandTotal} className="w-[11%] " />
                  <ComView
                    value={
                      bRoom.startTime ? formatDateAndTime(bRoom.startTime) : ""
                    }
                    className="w-[13%] border-x-2"
                  />
                  <ComView
                    value={
                      bRoom.endTime ? formatDateAndTime(bRoom.endTime) : ""
                    }
                    className="w-[13%] "
                  />
                </div>
              );
            })
          ) : (
            <h3 className="text-center font-workSans text-md my-4 text-red-500">
              No booked room found.
            </h3>
          )}
        </div>
      </div>
      {room?.isDetailsVisible && room?.selectedBookedRoom && (
        <BookedRoomDetailsCard
          bookedRoom={room?.selectedBookedRoom}
          onCancel={detailViewCancel}
          isVisible={room?.isDetailsVisible}
        />
      )}
    </>
  );
};

export default BookedRoomTable;
