"use client";

import React, { FC, useState } from "react";
import TableHeader from "../inputField/table/TableHeader";
import { roomInterface } from "@/interface/admin/roomManagements/roomInterface";
import VertcialRadioBtn from "../radioBtn/VertcialRadioBtn";

interface Props {
  roomData: roomInterface[];
}

const RoomTable: FC<Props> = ({ roomData }) => {
  const [checkedRoom, setCheckedRoom] = useState(null);
  const [searchKey, setSearchKey] = useState({
    roomCategoryName: "",
    roomName: "",
    floorName: "",
    buildingName: "",
  });

  const handleInputChange = (key: string, value: string) => {
    setSearchKey({ ...searchKey, [key]: value });
  };

  const filteredRoomData = roomData.filter((room) => {
    return (
      room.roomCategoryName
        .toLowerCase()
        .includes(searchKey.roomCategoryName.toLowerCase()) &&
      room.roomName.toLowerCase().includes(searchKey.roomName.toLowerCase()) &&
      room.floorName
        .toLowerCase()
        .includes(searchKey.floorName.toLowerCase()) &&
      room.buildingName
        .toLowerCase()
        .includes(searchKey.buildingName.toLowerCase())
    );
  });

  return (
    <div className={` w-full  h-80p  p-4  rounded-lg  bg-white`}>
      <p className="text-xl text-black text-center mb-4">Available Room</p>
      <div className="flex w-full items-center rounded-t-lg bg-slate-300">
        <TableHeader
          headerText="Action"
          containerClassName="w-[10%]"
          hasSearch={false}
        />
        <TableHeader
          headerText="Category"
          placeholder="Search by category"
          containerClassName="w-1/4 border-x-2 border-slate-50"
          hasSearch={true}
          apiOnSearch={false}
          value={searchKey.roomCategoryName}
          onChange={(e) =>
            handleInputChange("roomCategoryName", e.target.value)
          }
          onClear={() =>
            setSearchKey((prev) => ({ ...prev, roomCategoryName: "" }))
          }
        />
        <TableHeader
          headerText="Room No"
          placeholder="Search by room no"
          containerClassName="w-1/5"
          id="name-search"
          hasSearch={true}
          apiOnSearch={false}
          value={searchKey.roomName}
          onChange={(e) => handleInputChange("roomName", e.target.value)}
          onClear={() => setSearchKey((prev) => ({ ...prev, roomName: "" }))}
        />
        <TableHeader
          headerText="Floor No"
          placeholder="Search by floor name"
          containerClassName="w-1/5 border-x-2 border-slate-50"
          id="floorName-search"
          hasSearch={true}
          apiOnSearch={false}
          value={searchKey.floorName}
          onChange={(e) => handleInputChange("floorName", e.target.value)}
          onClear={() => setSearchKey((prev) => ({ ...prev, floorName: "" }))}
        />
        <TableHeader
          headerText="Building No"
          placeholder="Search by building name"
          containerClassName="w-1/5 border-r-2 border-slate-50"
          id="buildingName-search"
          hasSearch={true}
          apiOnSearch={false}
          value={searchKey.buildingName}
          onChange={(e) => handleInputChange("buildingName", e.target.value)}
          onClear={() =>
            setSearchKey((prev) => ({ ...prev, buildingName: "" }))
          }
        />

        <TableHeader
          headerText="Remarks"
          containerClassName="w-1/4"
          hasSearch={false}
        />
      </div>

      {/* Scrollable Rows */}
      <div className="w-full max-h-80p overflow-y-auto">
        {filteredRoomData && filteredRoomData?.length > 0 ? (
          filteredRoomData?.map((room: any, roomIndex: number) => {
            const isLastRoom = roomIndex === filteredRoomData.length - 1;
            const selectedRowBg =
              // @ts-ignore
              checkedRoom?.roomId == room?.roomId
                ? "bg-primary95"
                : "bg-slate-100";

            return (
              <div
                key={roomIndex}
                className={`flex w-full items-center ${
                  !isLastRoom ? "border-b-2" : "border-b-0"
                } border-slate-300  ${selectedRowBg}`}
              >
                <div className="flex w-[10%] items-center justify-center ">
                  <VertcialRadioBtn
                    className="py-[4]"
                    value={room?.roomId}
                    name="selectedRow"
                    // @ts-ignore
                    checked={checkedRoom?.roomId == room?.roomId}
                    onChange={() => {
                      setCheckedRoom(room);
                    }}
                  />
                </div>
                <ComView
                  value={room?.roomCategoryName}
                  className="w-1/4 border-x-2"
                />
                <ComView value={room?.roomName} className="w-1/5 " />
                <ComView value={room?.floorName} className="w-1/5 border-x-2" />
                <ComView
                  value={room?.buildingName}
                  className="w-1/5 border-r-2"
                />
                <ComView value={room?.remarks} className="w-1/4" />
              </div>
            );
          })
        ) : (
          <div>
            <h3 className="text-center font-workSans text-md mt-4 text-red-500">
              No available rooms.
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomTable;

interface comInterface {
  value?: any;
  className?: string;
}

const ComView: FC<comInterface> = ({ value, className }) => {
  return (
    <div
      className={`flex  items-center justify-center border-slate-300 ${className}`}
    >
      <p className="text-sm font-workSans text-center break-words max-w-full">
        {value}
      </p>
    </div>
  );
};
