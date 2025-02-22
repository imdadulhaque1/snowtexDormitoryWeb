"use client";

import React, { FC } from "react";
import TableHeader from "../inputField/table/TableHeader";
import { bookedRoomInterface } from "@/interface/admin/roomManagements/bookedRoomInterface";
import { FaEdit } from "react-icons/fa";
import {
  formatDate,
  formatDateAndTime,
  isDateExpired,
} from "@/app/_utils/handler/formateDate";
import ComView from "../comView/ComView";
import toast from "react-hot-toast";

interface Props {
  className?: string;
  bookedRoom?: bookedRoomInterface[];
  onPassItems?: (updateItem: any) => void;
}

const UpdateReservationRoomCard: FC<Props> = ({
  className,
  bookedRoom,
  onPassItems,
}) => {
  return (
    <>
      <div
        className={`rounded-lg bg-white shadow-lg shadow-slate-400 ${className} p-4 `}
      >
        <p className="text-xl text-black text-center mb-4 capitalize">
          Booked room search for update
        </p>
        <div className="flex w-full items-center rounded-t-lg bg-slate-300">
          <TableHeader
            headerText="Person Name"
            containerClassName="w-[10%] border-x-2 border-slate-50"
            hasSearch={true}
            placeholder="Search by name"
          />
          <TableHeader
            headerText="Mobile No"
            containerClassName="w-[8%] "
            hasSearch={true}
            placeholder="Search by mobile"
          />
          <TableHeader
            headerText="Email"
            containerClassName="w-[13%] border-x-2 border-slate-50"
            hasSearch={true}
            placeholder="Search by email"
          />
          <TableHeader
            headerText="Price / Day (৳) "
            containerClassName="w-[10%] border-r-2 border-slate-50"
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
            containerClassName="w-[10%] border-x-2 border-slate-50"
            hasSearch={false}
          />
          <TableHeader
            headerText="To Date"
            containerClassName="w-[10%] border-r-2 border-slate-50"
            hasSearch={false}
          />
          <TableHeader
            headerText="Action"
            containerClassName="w-[7%] "
            hasSearch={false}
          />
        </div>
        <div
          className={`w-full max-h-[250px] overflow-y-auto ${
            bookedRoom && bookedRoom?.length > 0 && "border-y border-2"
          }`}
        >
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
                  <ComView
                    value={bRoom.personInfo?.name}
                    className="w-[10%] "
                  />
                  <ComView
                    value={bRoom.personInfo?.personalPhoneNo}
                    className="w-[8%] border-x-2"
                  />
                  <ComView
                    value={bRoom.personInfo?.email}
                    className="w-[13%]"
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
                    value={bRoom.startTime ? formatDate(bRoom.startTime) : ""}
                    className="w-[10%] border-x-2"
                  />
                  <ComView
                    value={bRoom.endTime ? formatDate(bRoom.endTime) : ""}
                    className="w-[10%] border-r-2"
                  />
                  <div className="flex w-[7%]  items-center justify-center p-1">
                    <FaEdit
                      size={25}
                      className={`cursor-pointer text-slate-400 ${
                        !isDateExpired(bRoom.endTime) && "hover:text-slate-600"
                      } `}
                      onClick={async () => {
                        if (!isDateExpired(bRoom.endTime)) {
                          if (onPassItems) {
                            onPassItems(bRoom);
                          }
                        } else {
                          toast.error("Unable to update!");
                        }
                      }}
                    />
                  </div>
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
    </>
  );
};

export default UpdateReservationRoomCard;
