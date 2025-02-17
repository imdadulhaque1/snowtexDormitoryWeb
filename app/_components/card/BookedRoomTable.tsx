"use client";

import React, { FC, useState } from "react";
import TableHeader from "../inputField/table/TableHeader";
import { bookedRoomInterface } from "@/interface/admin/roomManagements/bookedRoomInterface";
import { IoEyeOutline } from "react-icons/io5";
import toast from "react-hot-toast";
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
        <div className="w-full max-h-[300px] overflow-y-auto border-y border-2">
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
                        const convertedData = await {
                          ...bRoom,
                          roomInfo:
                            bRoom.roomInfo && bRoom.roomInfo?.length > 0
                              ? bRoom.roomInfo.map((room) => ({
                                  ...room.roomInfo,
                                  roomWisePerson: room.roomWisePerson,
                                }))
                              : [],
                        };

                        await setRoom({
                          isDetailsVisible: true,
                          selectedBookedRoom: convertedData,
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

/*

Select Booked Room:  {
  "roomBookingId": 2,
  "personInfo": {
    "personId": 1,
    "name": "Imdadul Haque",
    "companyName": "Snowtex Group",
    "personalPhoneNo": "01773964101",
    "companyPhoneNo": "01773964101",
    "email": "imddulhaque1440@gmail.com",
    "nidBirthPassport": "5552902107",
    "countryName": "Bangladesh",
    "address": "Dhamrai, Savar, Dhaka, Bangladesh",
    "isApprove": false,
    "approvedBy": null,
    "isActive": true,
    "inactiveBy": null,
    "inactiveTime": null,
    "createdBy": 6,
    "createdTime": "2025-02-03T09:02:08.253",
    "updatedBy": null,
    "updatedTime": null
  },
  "roomInfo": [
    {
      "roomInfo": {
        "roomId": 1002,
        "roomName": "Room - II",
        "roomDescription": "Testing purpose Room - II",
        "remarks": "Demo Remarks",
        "roomCategoryId": 4,
        "floorId": 2,
        "buildingId": 2,
        "isRoomAvailable": true,
        "haveRoomDetails": true,
        "isApprove": false,
        "isActive": true,
        "inactiveBy": null,
        "createdBy": 6,
        "createdTime": "2025-01-07T09:20:00.333",
        "updatedBy": 6,
        "updatedTime": "2025-01-07T10:09:34.58",
        "floorName": "Floor - B",
        "buildingName": "SOL",
        "roomCategoryName": "Deluxe Room",
        "roomWisePerson": 3,
        "roomPrice": "333"
      },
      "roomWisePerson": [
        {
          "name": "wefsd",
          "phone": "01773964101",
          "email": "imdad@gmail.com",
          "nidBirth": "3424234234",
          "age": "23"
        },
        {
          "name": "fgbcvbc",
          "phone": "01773964101",
          "email": "imdad@gmail.com",
          "nidBirth": "234234234",
          "age": "23"
        },
        {
          "name": "vbcvb",
          "phone": "01773964101",
          "email": "imdad@gmail.com",
          "nidBirth": "2342342342",
          "age": "23"
        }
      ]
    },
    {
      "roomInfo": {
        "roomId": 1006,
        "roomName": "Test - Room",
        "roomDescription": "Testing purpose room created",
        "remarks": "Demo Remarks",
        "roomCategoryId": 1,
        "floorId": 2,
        "buildingId": 2,
        "isRoomAvailable": true,
        "haveRoomDetails": true,
        "isApprove": false,
        "isActive": true,
        "inactiveBy": null,
        "createdBy": 6,
        "createdTime": "2025-01-07T16:02:13.157",
        "updatedBy": null,
        "updatedTime": null,
        "floorName": "Floor - B",
        "buildingName": "SOL",
        "roomCategoryName": "Single room",
        "roomWisePerson": 1,
        "roomPrice": "100"
      },
      "roomWisePerson": [
        {
          "name": "sdgsd",
          "phone": "01773964101",
          "email": "imdadulhaque@gmail.com",
          "nidBirth": "345353",
          "age": "34"
        }
      ]
    },
    {
      "roomInfo": {
        "roomId": 1008,
        "roomName": "Test - Room",
        "roomDescription": "Testing purpose room created",
        "remarks": "Demo Remarks",
        "roomCategoryId": 5,
        "floorId": 1004,
        "buildingId": 6,
        "isRoomAvailable": true,
        "haveRoomDetails": false,
        "isApprove": false,
        "isActive": true,
        "inactiveBy": null,
        "createdBy": 6,
        "createdTime": "2025-01-07T16:02:41.603",
        "updatedBy": null,
        "updatedTime": null,
        "floorName": "Updated Floor",
        "buildingName": "New Buildings",
        "roomCategoryName": "Standard room",
        "roomWisePerson": 2,
        "roomPrice": "199"
      },
      "roomWisePerson": [
        {
          "name": "Imdadul Haque",
          "phone": "01773964101",
          "email": "imdad@gmail.com",
          "nidBirth": "345345",
          "age": "123"
        },
        {
          "name": "Imdadul Haque Imdad",
          "phone": "01773964101",
          "email": "imdad1440@gmail.com",
          "nidBirth": "235425",
          "age": "234"
        }
      ]
    }
  ],
  "paidItems": [
    {
      "itemId": 1003,
      "name": "Gamcha",
      "price": "150",
      "paidOrFree": 1,
      "remarks": "Permanently......"
    },
    {
      "itemId": 1006,
      "name": "dgbdfg",
      "price": "23",
      "paidOrFree": 1,
      "remarks": "sgdfgdf"
    }
  ],
  "freeItems": [
    {
      "itemId": 1,
      "name": "Tawel",
      "price": "50",
      "paidOrFree": 2,
      "remarks": "Only for using purpose"
    },
    {
      "itemId": 1002,
      "name": "Tissue",
      "price": "30",
      "paidOrFree": 2,
      "remarks": "Only for  using perpose."
    },
    {
      "itemId": 1004,
      "name": "Soap",
      "price": "100",
      "paidOrFree": 2,
      "remarks": "Permanently...."
    },
    {
      "itemId": 1005,
      "name": "Shampo",
      "price": "5",
      "paidOrFree": 2,
      "remarks": "Only for using perpose."
    }
  ],
  "totalPaidItemsPrice": 173,
  "totalFreeItemsPrice": 185,
  "totalRoomPrice": 632,
  "grandTotal": 805,
  "startTime": "2025-02-06T19:06:00",
  "endTime": "2025-02-15T01:06:00",
  "remarks": null,
  "isApprove": false,
  "approvedBy": null,
  "approvedTime": null,
  "isActive": true,
  "inactiveBy": null,
  "inactiveTime": null,
  "createdBy": 6,
  "createdTime": "2025-02-13T07:23:14.013",
  "updatedBy": null,
  "updatedTime": null
}



function isExpireDate(endTime: string): boolean {
    const endDateTime = new Date(endTime);
    const currentDateTime = new Date();

    // Compare the endDateTime with the currentDateTime
    if (endDateTime > currentDateTime) {
        return false; // If endTime is in the future, return false
    } else {
        return true; // If endTime has passed or is now, return true
    }
}

// Example usage:
const endTime = "2025-02-15T01:06:00";
const isPassed = isEndTimePassed(endTime);
console.log("Has endTime passed?", isPassed); // Output: Has endTime passed? false (assuming current date is before February 15, 2025)


*/
