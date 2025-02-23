"use client";

import { modalStyles } from "@/app/_utils/comStyle/admin/basicSetup/room/roomStye";
import React, { FC } from "react";
import { IoClose } from "react-icons/io5";
import TableHeader from "../inputField/table/TableHeader";
import {
  formatDate,
  formatDateAndTime,
  noOfDays,
} from "@/app/_utils/handler/formateDate";
import VerticalView from "../comView/VerticalView";
import ComView from "../comView/ComView";

interface Props {
  bookedRoom: any;
  onCancel: () => void;
  isVisible?: boolean;
}

const BookedRoomDetailsCard: FC<Props> = ({
  bookedRoom,
  onCancel,
  isVisible,
}) => {
  if (!isVisible) return null;

  const totalPaidItemAmount =
    bookedRoom?.paidItems &&
    bookedRoom?.paidItems.length > 0 &&
    bookedRoom?.paidItems.reduce(
      (sum: any, item: any) => sum + Number(item.price),
      0
    );

  const totalFreeItemAmount =
    bookedRoom?.freeItems &&
    bookedRoom?.freeItems.length > 0 &&
    bookedRoom?.freeItems.reduce(
      (sum: any, item: any) => sum + Number(item.price),
      0
    );

  return (
    <div className={modalStyles.overlay}>
      <div className={`${modalStyles.bookedRoomcontainer} w-[80%]`}>
        <div className="flex w-full items-center justify-center mb-4 ">
          <h2 className={`w-100p text-center ${modalStyles.title}`}>
            Booked Room Details
          </h2>

          <button
            className="flex items-end justify-end bg-slate-50 border-2 hover:border-red-700 rounded-full"
            onClick={onCancel}
          >
            <IoClose
              size={35}
              className="cursor-pointer text-errorColor shadow-xl shadow-white hover:text-red-600"
            />
          </button>
        </div>

        <div className="flex  justify-between items-center">
          <div>
            <VerticalView
              label="Name"
              value={bookedRoom?.personInfo?.name}
              className="my-1"
            />
            <VerticalView
              label="Contact No"
              value={bookedRoom?.personInfo?.personalPhoneNo}
              className="my-1"
            />
            <VerticalView
              label="Official Phone No"
              value={bookedRoom?.personInfo?.companyPhoneNo}
              className="my-1"
            />
            <VerticalView
              label="Email"
              value={bookedRoom?.personInfo?.email}
              className="my-1"
            />
            <VerticalView
              label="NID/Birth/Passport"
              value={bookedRoom?.personInfo?.nidBirthPassport}
              className="my-1"
            />
            <VerticalView
              label="Country Name"
              value={bookedRoom?.personInfo?.countryName}
              className="my-1"
            />
            <VerticalView
              label="Address"
              value={bookedRoom?.personInfo?.address}
              className="my-1"
            />
          </div>
          <div className="flex flex-col justify-end items-end mb-4">
            <div className="flex p-3  flex-col justify-end items-end">
              <p className="text-black font-workSans text-xl font-medium">
                Price Calculations
              </p>
              <VerticalView
                label="Paid Item's Price"
                value={bookedRoom?.totalPaidItemsPrice}
                className="my-1"
              />
              <VerticalView
                label="Total Room's Price Per Day"
                value={bookedRoom?.totalRoomPrice}
                className="my-1"
              />
              <VerticalView
                label="Total Days"
                value={bookedRoom?.totalDays}
                className="my-1"
              />
              <VerticalView
                label="Grand Total"
                value={bookedRoom?.grandTotal}
                className="my-1 border-2 p-2 rounded-lg border-slate-500"
              />
            </div>
          </div>
        </div>

        {/* <div className="flex items-center mb-4">
          <p className={`${modalStyles.detailsLabel} mr-2`}>
            Reservation Time:
          </p>
          <p className={`${modalStyles.detailsTxt}`}>
            {formatDateAndTime(bookedRoom?.startTime)} -{" "}
            {formatDateAndTime(bookedRoom?.endTime)}
          </p>
        </div> */}

        <div className="flex w-full items-center rounded-t-lg bg-slate-300">
          <TableHeader
            headerText="Room No"
            containerClassName="w-[8%]"
            hasSearch={false}
          />
          <TableHeader
            headerText="Floor No"
            containerClassName="w-[8%] border-x-2 border-slate-50"
            hasSearch={false}
          />
          <TableHeader
            headerText="Building No"
            containerClassName="w-[10%] "
            hasSearch={false}
          />
          <TableHeader
            headerText="Category Name"
            containerClassName="w-[16%] border-x-2 border-slate-50"
            hasSearch={false}
          />
          <TableHeader
            headerText="Price"
            containerClassName="w-[8%] "
            hasSearch={false}
          />
          <div className="w-[32%] border-x-2 border-slate-50 ">
            <p className="text-black text-center font-workSans text-md py-1">
              Room Wise Person
            </p>
            <div className="flex items-center w-full text-sm border-t-2">
              <TableHeader
                headerText="Name"
                containerClassName="w-[40%] "
                hasSearch={false}
              />
              <TableHeader
                headerText="Phone"
                containerClassName="w-[30%] border-x-2 border-slate-50"
                hasSearch={false}
              />
              <TableHeader
                headerText="NID / Birth"
                containerClassName="w-[30%]"
                hasSearch={false}
              />
            </div>
          </div>
          <TableHeader
            headerText="From Date"
            containerClassName="w-[9%] "
            hasSearch={false}
          />
          <TableHeader
            headerText="To Date"
            containerClassName="w-[9%] border-l-2 border-slate-50 "
            hasSearch={false}
          />
        </div>
        <div className="w-full max-h-[300px] overflow-y-auto border-y border-2">
          {bookedRoom?.roomInfo && bookedRoom?.roomInfo?.length > 0 ? (
            bookedRoom.roomInfo.map((room: any, rIndex: number) => {
              return (
                <div
                  className={`flex w-full items-center border-b-2 border-slate-300  `}
                >
                  <ComView value={room.roomName} className="w-[8%]" />
                  <ComView
                    value={room.floorName}
                    className={`w-[8%] border-x-2`} // set here dynamically  height which is calculate dynamically
                  />
                  <ComView value={room?.buildingName} className="w-[10%]" />
                  <ComView
                    value={room?.roomCategoryName}
                    className="w-[16%] border-x-2 "
                  />
                  <ComView value={room.roomPrice} className="w-[8%] " />

                  <div className="w-[32%] border-x-2 border-slate-300">
                    {room?.roomWisePersonInfo &&
                    room?.roomWisePersonInfo?.length > 0 ? (
                      room.roomWisePersonInfo.map(
                        (person: any, pIndex: number) => {
                          const isLast =
                            pIndex == room.roomWisePersonInfo?.length - 1;
                          return (
                            <div
                              key={pIndex}
                              className={`flex items-center w-full ${
                                !isLast && "border-b-2"
                              } border-slate-300 py-1`}
                            >
                              <ComView
                                value={person.name}
                                className="w-[40%]"
                              />
                              <ComView
                                value={person?.phone}
                                className="w-[30%] border-x-2"
                              />
                              <ComView
                                value={person?.nidBirth}
                                className="w-[30%] "
                              />
                            </div>
                          );
                        }
                      )
                    ) : (
                      <p>No person founds!</p>
                    )}
                  </div>
                  <ComView
                    value={room?.startTime ? formatDate(room?.startTime) : ""}
                    className="w-[9%]  border-r-2"
                  />
                  <ComView
                    value={room?.endTime ? formatDate(room?.endTime) : ""}
                    className="w-[9%] "
                  />
                </div>
              );
            })
          ) : (
            <p>Room not founds !</p>
          )}
        </div>

        <div className="flex w-full  justify-between items-start mt-4">
          <div className="flex flex-col items-center w-[49.5%] rounded-lg bg-white shadow-lg p-3 mr-3 border-2 border-slate-300">
            <p className="text-black font-workSans text-md text-center font-medium">
              Paid items
            </p>
            <div className="flex w-full items-center rounded-t-lg bg-slate-200 mt-2">
              <TableHeader
                headerText="SL"
                containerClassName="w-1/6"
                hasSearch={false}
              />
              <TableHeader
                headerText="Item Name"
                containerClassName="w-1/2 border-x-2 border-slate-50"
                hasSearch={false}
              />
              <TableHeader
                headerText="Price"
                containerClassName="w-1/6 border-r-2 border-slate-50"
                hasSearch={false}
              />
              <TableHeader
                headerText="Qty"
                containerClassName="w-1/6"
                hasSearch={false}
              />
            </div>
            {bookedRoom?.paidItems && bookedRoom?.paidItems.length > 0 ? (
              bookedRoom?.paidItems?.map((pItem: any, pIndex: number) => {
                const isLast = pIndex == bookedRoom?.paidItems.length - 1;

                return (
                  <div
                    key={pIndex}
                    className={`flex w-full items-center  border border-slate-300 ${
                      isLast && "rounded-b-md"
                    } `}
                  >
                    <ComView
                      value={pIndex + 1}
                      className={`w-1/6 border-x-2 text-black`}
                    />
                    <ComView
                      value={pItem.name}
                      className={`w-1/2 border-r-2 text-black `}
                    />
                    <ComView
                      value={pItem.price}
                      className={`w-1/6 border-r-2 text-black`}
                    />
                    <ComView
                      value={pItem.itemQty}
                      className={`w-1/6 text-black`}
                    />
                  </div>
                );
              })
            ) : (
              <p className="font-workSans text-sm text-errorColor my-2">
                No paid items founds !
              </p>
            )}
            {/* {bookedRoom?.paidItems && bookedRoom?.paidItems.length > 0 && (
              <div className="flex w-full items-end justify-end">
                <div className="flex w-1/3 items-center justify-center py-1">
                  <p className="font-workSans text-black text-md font-medium">
                    {`Total: ${totalPaidItemAmount}`}
                  </p>
                </div>
              </div>
            )} */}
          </div>
          <div className="flex flex-col items-center w-[49.5%] rounded-lg bg-white shadow-lg p-3 border-2 border-slate-300">
            <p className="text-black font-workSans text-md text-center font-medium">
              Free items
            </p>
            <div className="flex w-full items-center rounded-t-lg bg-slate-200 mt-2">
              <TableHeader
                headerText="SL"
                containerClassName="w-1/6 "
                hasSearch={false}
              />
              <TableHeader
                headerText="Item Name"
                containerClassName="w-1/2 border-x-2 border-slate-50"
                hasSearch={false}
              />
              <TableHeader
                headerText="Price"
                containerClassName="w-1/6 border-r-2 border-slate-50"
                hasSearch={false}
              />
              <TableHeader
                headerText="Qty"
                containerClassName="w-1/6"
                hasSearch={false}
              />
            </div>
            {bookedRoom?.freeItems && bookedRoom?.freeItems.length > 0 ? (
              bookedRoom?.freeItems?.map((fItem: any, fIndex: number) => {
                const isLast = fIndex == bookedRoom?.freeItems.length - 1;
                return (
                  <div
                    key={fIndex}
                    className={`flex w-full items-center  border border-slate-300 ${
                      isLast && "rounded-b-md"
                    } `}
                  >
                    <ComView
                      value={fIndex + 1}
                      className={`w-1/6 border-x-2 text-black`}
                    />
                    <ComView
                      value={fItem.name}
                      className={`w-1/2 border-r-2 text-black `}
                    />
                    <ComView
                      value={fItem.price}
                      className={`w-1/6 border-r-2 text-black`}
                    />
                    <ComView
                      value={fItem.itemQty}
                      className={`w-1/6 text-black`}
                    />
                  </div>
                );
              })
            ) : (
              <p className="font-workSans text-sm text-errorColor my-2">
                No free items founds !
              </p>
            )}
            {/* {bookedRoom?.freeItems && bookedRoom?.freeItems.length > 0 && (
              <div className="flex w-full items-end justify-end">
                <div className="flex w-1/3 items-center justify-center py-1">
                  <p className="font-workSans text-gray-400 text-md font-medium">
                    {`Total: ${totalFreeItemAmount}`}
                  </p>
                </div>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookedRoomDetailsCard;
