"use client";

import React, { FC, useState } from "react";
import TableHeader from "../inputField/table/TableHeader";
import { roomInterface } from "@/interface/admin/roomManagements/roomInterface";
import Checkbox from "../inputField/checkbox/Checkbox";
import VerticalSingleInput from "../inputField/VerticalSingleInput";

interface Props {
  roomData: roomInterface[];
  returnItems?: (selectedRooms: roomInterface[]) => void;
  className?: string;
}

const RoomTable: FC<Props> = ({ roomData, returnItems, className }) => {
  const [checkedRooms, setCheckedRooms] = useState<roomInterface[]>([]);
  const [roomPersons, setRoomPersons] = useState<{ [key: string]: any[] }>({});
  const [searchKey, setSearchKey] = useState({
    roomCategoryName: "",
    roomName: "",
    floorName: "",
    buildingName: "",
  });

  const handleInputChange = (key: string, value: string) => {
    setSearchKey({ ...searchKey, [key]: value });
  };

  const handleCheckboxChange = (room: roomInterface) => {
    setCheckedRooms((prevChecked) => {
      const isChecked = prevChecked.some((r) => r.roomId === room.roomId);
      let updatedCheckedRooms;

      if (isChecked) {
        updatedCheckedRooms = prevChecked.filter(
          (r) => r.roomId !== room.roomId
        );
      } else {
        updatedCheckedRooms = [...prevChecked, room];
      }

      if (returnItems) returnItems(updatedCheckedRooms); // Send selected rooms to parent
      return updatedCheckedRooms;
    });
  };

  const filteredRoomData = roomData.filter((room) =>
    ["roomCategoryName", "roomName", "floorName", "buildingName"].every((key) =>
      room[key]
        .toLowerCase()
        .includes(searchKey[key as keyof typeof searchKey].toLowerCase())
    )
  );

  const handleAddPerson = (roomId: string) => {
    setRoomPersons((prev) => ({
      ...prev,
      [roomId]: [...(prev[roomId] || []), { name: "", email: "", phone: "" }],
    }));
  };

  const handleRemovePerson = (roomId: string, index: number) => {
    setRoomPersons((prev) => {
      const updatedPersons = prev[roomId].filter((_, i) => i !== index);
      return { ...prev, [roomId]: updatedPersons };
    });
  };

  const handlePersonChange = (
    roomId: string,
    index: number,
    field: string,
    value: string
  ) => {
    setRoomPersons((prev) => {
      const updatedPersons = [...prev[roomId]];
      updatedPersons[index] = { ...updatedPersons[index], [field]: value };
      return { ...prev, [roomId]: updatedPersons };
    });
  };
  console.log("room Persons: ", JSON.stringify(roomPersons, null, 2));

  return (
    <>
      <div
        className={`rounded-lg bg-white shadow-lg shadow-slate-400 ${className}`}
      >
        <p className="text-xl text-black text-center mb-4">Available Room</p>
        <div className="flex w-full items-center rounded-t-lg bg-slate-300 ">
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
            headerText="No of Person"
            containerClassName="w-[10%]"
            hasSearch={false}
          />
          <TableHeader
            headerText="Room No"
            placeholder="Search by room no"
            containerClassName="w-1/5 border-x-2 border-slate-50"
            hasSearch={true}
            apiOnSearch={false}
            value={searchKey.roomName}
            onChange={(e) => handleInputChange("roomName", e.target.value)}
            onClear={() => setSearchKey((prev) => ({ ...prev, roomName: "" }))}
          />
          <TableHeader
            headerText="Floor No"
            placeholder="Search by floor name"
            containerClassName="w-1/5 border-r-2 border-slate-50"
            hasSearch={true}
            apiOnSearch={false}
            value={searchKey.floorName}
            onChange={(e) => handleInputChange("floorName", e.target.value)}
            onClear={() => setSearchKey((prev) => ({ ...prev, floorName: "" }))}
          />
          <TableHeader
            headerText="Building No"
            placeholder="Search by building name"
            containerClassName="w-1/5 "
            hasSearch={true}
            apiOnSearch={false}
            value={searchKey.buildingName}
            onChange={(e) => handleInputChange("buildingName", e.target.value)}
            onClear={() =>
              setSearchKey((prev) => ({ ...prev, buildingName: "" }))
            }
          />
        </div>

        {/* Scrollable Rows */}
        <div className="w-full max-h-[300px] overflow-y-auto">
          {filteredRoomData.length > 0 ? (
            filteredRoomData.map((room, roomIndex) => {
              const isChecked = checkedRooms.some(
                (r) => r.roomId === room.roomId
              );
              const selectedRowBg = isChecked ? "bg-slate-300" : "bg-slate-100";

              return (
                <div
                  key={room.roomId}
                  className={`flex w-full items-center border-b-2 border-slate-300 ${selectedRowBg} `}
                >
                  <div className="flex w-[10%] items-center justify-center ">
                    <Checkbox
                      checked={isChecked}
                      onChange={() => handleCheckboxChange(room)}
                    />
                  </div>
                  <ComView
                    value={room.roomCategoryName}
                    className="w-1/4 border-x-2"
                  />
                  <ComView value={room.roomWisePerson} className="w-[10%]" />
                  <ComView value={room.roomName} className="w-1/5 border-x-2" />
                  <ComView
                    value={room.floorName}
                    className="w-1/5 border-r-2"
                  />
                  <ComView value={room.buildingName} className="w-1/5 " />
                </div>
              );
            })
          ) : (
            <h3 className="text-center font-workSans text-md mt-4 text-red-500">
              No available rooms.
            </h3>
          )}
        </div>
      </div>
      <div className="flex flex-wrap justify-center">
        {checkedRooms.map((cRoom) => (
          <div
            key={cRoom.roomId}
            className="flex flex-col items-center w-[48%] rounded-lg bg-white shadow-lg p-3 mt-3 mr-3"
          >
            <p className="font-workSans text-md text-center font-medium">
              {`${cRoom.roomName} (${cRoom.roomWisePerson})`}
            </p>

            {roomPersons[cRoom.roomId]?.map((person, pIndex) => (
              <div className="p-3 border-2 border-gray-300 rounded-md w-full mt-3">
                <VerticalSingleInput
                  type="text"
                  name="buildingName"
                  placeholder={`Enter Person-${pIndex + 1} name...`}
                  // @ts-ignore
                  value={person.name}
                  onChange={(e) =>
                    handlePersonChange(
                      cRoom.roomId,
                      pIndex,
                      "personName",
                      e.target.value
                    )
                  }
                  required
                />
                <VerticalSingleInput
                  className="my-2"
                  type="text"
                  name="buildingName"
                  placeholder={`Enter Person-${pIndex + 1} email...`}
                  // @ts-ignore
                  value={person.email}
                  onChange={(e) =>
                    handlePersonChange(
                      cRoom.roomId,
                      pIndex,
                      "email",
                      e.target.value
                    )
                  }
                  // errorMsg={buildingData.buildingNameErrorMsg}
                  required
                />
                <VerticalSingleInput
                  type="text"
                  name="buildingName"
                  placeholder={`Enter Person-${pIndex + 1} phone...`}
                  // @ts-ignore
                  value={person.phone}
                  onChange={(e) =>
                    handlePersonChange(
                      cRoom.roomId,
                      pIndex,
                      "phone",
                      e.target.value
                    )
                  }
                  // errorMsg={buildingData.buildingNameErrorMsg}
                  required
                />
                <div className="flex items-center justify-center">
                  <p
                    onClick={() => handleRemovePerson(cRoom.roomId, pIndex)}
                    className="font-workSans font-medium text-errorColor text-center text-sm cursor-pointer border-2 border-errorColor mt-3 px-5 py-1 rounded-md"
                  >
                    Remove
                  </p>
                </div>
              </div>
            ))}

            <button onClick={() => handleAddPerson(cRoom.roomId)}>
              Add More
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default RoomTable;

interface ComViewProps {
  value?: any;
  className?: string;
}

const ComView: FC<ComViewProps> = ({ value, className }) => {
  return (
    <div
      className={`flex items-center justify-center border-slate-300 ${className}`}
    >
      <p className="text-sm font-workSans text-center break-words max-w-full">
        {value}
      </p>
    </div>
  );
};
