"use client";

import React, { FC, useEffect, useState } from "react";
import TableHeader from "../inputField/table/TableHeader";
import { roomInterface } from "@/interface/admin/roomManagements/roomInterface";
import Checkbox from "../inputField/checkbox/Checkbox";
import VerticalSingleInput from "../inputField/VerticalSingleInput";
import toast from "react-hot-toast";

interface Props {
  roomData: roomInterface[];
  returnItems?: (selectedRooms: roomInterface[]) => void;
  className?: string;
  onPassItems?: (itemRess: any) => void;
}

const RoomTable: FC<Props> = ({
  roomData,
  returnItems,
  className,
  onPassItems,
}) => {
  const [checkedRooms, setCheckedRooms] = useState<roomInterface[]>([]);
  const [roomPersons, setRoomPersons] = useState<{
    [key: string]: {
      roomName: string;
      roomId: number;
      roomWisePerson: { name: string; email: string; phone: string }[];
    };
  }>({});
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
    if (parseInt(room?.roomWisePerson) > 0) {
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
    } else {
      toast.error("Room is not ready to use.");
    }
  };

  const filteredRoomData = roomData.filter((room) =>
    ["roomCategoryName", "roomName", "floorName", "buildingName"].every((key) =>
      room[key]
        .toLowerCase()
        .includes(searchKey[key as keyof typeof searchKey].toLowerCase())
    )
  );

  const handleAddPerson = (room: roomInterface) => {
    setRoomPersons((prev) => {
      const roomId = String(room.roomId); // Ensure roomId is a string for object key

      const updatedRoom = prev[roomId] || {
        roomName: room.roomName,
        roomId: room.roomId,
        roomWisePerson: [], // Ensure this is an array
      };

      return {
        ...prev,
        [roomId]: {
          ...updatedRoom,
          roomWisePerson: [
            ...updatedRoom.roomWisePerson,
            { name: "", email: "", phone: "" }, // New entry
          ],
        },
      };
    });
  };

  const handleRemovePerson = (roomId: number, index: number) => {
    setRoomPersons((prev) => {
      if (!prev[roomId]) return prev;

      const updatedPersons = prev[roomId].roomWisePerson.filter(
        (_, i) => i !== index
      );
      return {
        ...prev,
        [roomId]: { ...prev[roomId], roomWisePerson: updatedPersons },
      };
    });
  };

  const handlePersonChange = (
    roomId: number,
    index: number,
    field: keyof { name: string; email: string; phone: string },
    value: string
  ) => {
    setRoomPersons((prev) => {
      if (!prev[roomId]) return prev;

      const updatedPersons = [...prev[roomId].roomWisePerson];
      updatedPersons[index] = { ...updatedPersons[index], [field]: value };

      return {
        ...prev,
        [roomId]: { ...prev[roomId], roomWisePerson: updatedPersons },
      };
    });
  };

  useEffect(() => {
    if (onPassItems) {
      onPassItems(roomPersons);
    }
  }, [roomPersons]);

  // console.log(
  //   "roomPersons: ",
  //   JSON.stringify(Object.values(roomPersons), null, 2)
  // );

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
              const selectedRowBg = isChecked ? "bg-slate-200" : "bg-slate-100";

              return (
                <div
                  key={room.roomId}
                  className={`flex w-full items-center border-b-2 border-slate-300 ${selectedRowBg} `}
                >
                  <div className="flex w-[10%] items-center justify-center py-1">
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
      <div className="flex flex-wrap justify-center items-start">
        {checkedRooms.map((cRoom: any, cIndex: number) => (
          <div
            key={cIndex}
            className="flex flex-col items-center w-[48%] rounded-lg bg-white shadow-lg p-3 mt-3 mr-3"
          >
            <p className="font-workSans text-md text-center font-medium">
              {`${cRoom.roomName} (${cRoom.roomWisePerson})`}
            </p>

            {/* {roomPersons[cRoom.roomId]?.roomWisePerson?.map(
              (person: any, pIndex: number) => (
                <div
                  key={pIndex}
                  className="p-3 border-2 border-gray-300 rounded-md w-full mt-3"
                >
                  <VerticalSingleInput
                    type="text"
                    name="buildingName"
                    placeholder={`Enter Person-${pIndex + 1} name...`}
                    value={person.name}
                    onChange={(e: any) =>
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
                    value={person.email}
                    onChange={(e: any) =>
                      handlePersonChange(
                        cRoom.roomId,
                        pIndex,
                        "email",
                        e.target.value
                      )
                    }
                    required
                  />
                  <VerticalSingleInput
                    type="text"
                    name="buildingName"
                    placeholder={`Enter Person-${pIndex + 1} phone...`}
                    value={person.phone}
                    onChange={(e: any) =>
                      handlePersonChange(
                        cRoom.roomId,
                        pIndex,
                        "phone",
                        e.target.value
                      )
                    }
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
              )
            )} */}

            {roomPersons[cRoom.roomId]?.roomWisePerson?.map(
              (person: any, pIndex: number) => (
                <div
                  key={pIndex}
                  className="p-3 border-2 border-gray-300 rounded-md w-full mt-3"
                >
                  <VerticalSingleInput
                    type="text"
                    name="personName"
                    placeholder={`Enter Person-${pIndex + 1} name...`}
                    // @ts-ignore
                    value={person.name}
                    onChange={(e: any) =>
                      handlePersonChange(
                        cRoom.roomId,
                        pIndex,
                        "name",
                        e.target.value
                      )
                    }
                    required
                  />
                  <VerticalSingleInput
                    className="my-2"
                    type="text"
                    name="personEmail"
                    placeholder={`Enter Person-${pIndex + 1} email...`}
                    // @ts-ignore
                    value={person.email}
                    onChange={(e: any) =>
                      handlePersonChange(
                        cRoom.roomId,
                        pIndex,
                        "email",
                        e.target.value
                      )
                    }
                    required
                  />
                  <VerticalSingleInput
                    type="text"
                    name="personPhone"
                    placeholder={`Enter Person-${pIndex + 1} phone...`}
                    // @ts-ignore
                    value={person.phone}
                    onChange={(e: any) =>
                      handlePersonChange(
                        cRoom.roomId,
                        pIndex,
                        "phone",
                        e.target.value
                      )
                    }
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
              )
            )}

            <button
              className="font-workSans text-black border-2 border-slate-500 rounded-lg px-3 mt-3 hover:bg-slate-500 hover:text-white"
              onClick={() => {
                if (
                  cRoom?.roomId &&
                  roomPersons.hasOwnProperty(String(cRoom.roomId))
                ) {
                  if (
                    roomPersons[String(cRoom.roomId)]?.roomWisePerson?.length +
                      1 >
                    cRoom?.roomWisePerson
                  ) {
                    toast.error("Limitted person already exists !");
                  } else {
                    handleAddPerson(cRoom);
                  }
                } else {
                  handleAddPerson(cRoom);
                }
              }}
            >
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
