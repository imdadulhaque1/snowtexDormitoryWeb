"use client";

import React, { FC, useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import SearchableDropdown from "../SearchableDropdown";
import axios from "axios";
import AppURL from "@/app/_restApi/AppURL";
import toast from "react-hot-toast";

interface Props {
  token?: string;
  userId?: string;
  onAddSuccess?: (response: any) => void;
}

const RoomInfoSelectCard: FC<Props> = ({ token, onAddSuccess, userId }) => {
  const [fetchData, setFetchData] = useState({
    buildingData: [],
    floorData: [],
    roomData: [],
    filteredFloor: [],
    filteredRoom: [],
  });

  const [roomInfo, setRoomInfo] = useState({
    roomId: null,
    floorId: null,
    buildingId: null,
    roomName: "",
    floorName: "",
    buildingName: "",
    roomIdErrMsg: "",
    floorIdErrMsg: "",
    buildingIdErrMsg: "",
  });

  const getBuildingsFunc = async (token: string) => {
    try {
      const { data } = await axios.get(AppURL.buildingInfoApi, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (data?.status === 200) {
        const convertedBuildings = await data?.data.map(
          ({ buildingId, buildingName }: any) => ({
            value: buildingId,
            label: buildingName,
          })
        );

        await setFetchData((prev: any) => ({
          ...prev,
          buildingData: convertedBuildings,
        }));
      }
    } catch (error: any) {
      console.log("Error fetching building data: ", error.message);
    }
  };

  const fetchFloorData = async (token: string) => {
    try {
      const { data } = await axios.get(AppURL.floorInfoApi, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (data?.status === 200) {
        const convertedFloors = await data?.data.map(
          ({ buildingId, floorId, floorName }: any) => ({
            value: floorId,
            label: floorName,
            buildingId: buildingId,
          })
        );
        await setFetchData((prev: any) => ({
          ...prev,
          floorData: convertedFloors,
        }));
      }
    } catch (error: any) {
      console.log("Error fetching floor data: ", error.message);
    }
  };
  const fetchRoomData = async (token: string) => {
    try {
      const { data } = await axios.get(AppURL.roomInfoApi, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (data?.status === 200) {
        const convertedRooms = await data?.data.map(
          ({ buildingId, floorId, roomId, roomName }: any) => ({
            value: roomId,
            label: roomName,
            floorId: floorId,
            buildingId: buildingId,
          })
        );
        await setFetchData((prev: any) => ({
          ...prev,
          roomData: convertedRooms,
        }));
      }
    } catch (error: any) {
      console.log("Error fetching floor data: ", error.message);
    }
  };

  const changeBuildingFunc = async (buildingId: string) => {
    await setRoomInfo((prev: any) => ({
      ...prev,
      buildingId,
      floorId: null, // Reset the floorId when building changes
      roomId: null,
      buildingIdErrMsg: "",
    }));

    const filteredFloors = await fetchData?.floorData.filter(
      (floor: any) => floor.buildingId == buildingId
    );

    setFetchData((prev) => ({
      ...prev,
      filteredFloor: filteredFloors,
    }));
  };
  const changeFloorFunc = async (floorId: string) => {
    await setRoomInfo((prev: any) => ({
      ...prev,
      floorId,
      roomId: null,
      floorIdErrMsg: "",
    }));

    const filteredRoom = await fetchData?.roomData.filter(
      (room: any) => room.floorId == floorId
    );

    setFetchData((prev) => ({
      ...prev,
      filteredRoom: filteredRoom,
    }));
  };

  useEffect(() => {
    if (token) {
      getBuildingsFunc(token);
      fetchFloorData(token);
      fetchRoomData(token);
    }
  }, [token]);

  const validateForm = () => {
    let isValid = true;
    const errors: Partial<typeof roomInfo> = {};

    if (!roomInfo.buildingId) {
      isValid = false;
      errors.buildingIdErrMsg = "Building is required.";
    }
    if (!roomInfo.floorId) {
      isValid = false;
      errors.floorIdErrMsg = "Floor is required.";
    }
    if (!roomInfo.roomId) {
      isValid = false;
      errors.roomIdErrMsg = "Room is required.";
    }

    setRoomInfo((prev) => ({ ...prev, ...errors }));
    return isValid;
  };

  const roomSelectFunc = async () => {
    if (!validateForm()) return;

    try {
      const { data } = await axios.get(
        `${AppURL.roomDetailsApi}?userId=${userId}&buildingId=${roomInfo?.buildingId}&floorId=${roomInfo?.floorId}&roomId=${roomInfo?.roomId}`,
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
  };

  return (
    <div className=" w-full bg-white p-4 rounded-lg shadow-lg shadow-slate-400 my-4">
      <div className="my-3">
        <label className=" text-black text-sm font-workSans mb-1">
          Select Buildings
        </label>
        <SearchableDropdown
          options={fetchData?.buildingData}
          isDisable={false}
          placeholder="Select Buildings..."
          defaultValue={fetchData.buildingData.find(
            (option: any) => option.value == roomInfo?.buildingId
          )}
          onSelect={(value) => changeBuildingFunc(value)}
          txtColor={roomInfo?.buildingId ? "text-black" : "text-gray-400"}
          errorMsg={roomInfo?.buildingIdErrMsg}
        />
      </div>
      <div className="my-3">
        <label className=" text-black text-sm font-workSans mb-1 ">
          Select Floors
        </label>
        <SearchableDropdown
          options={fetchData?.filteredFloor}
          isDisable={roomInfo?.buildingId === null}
          placeholder={!roomInfo?.floorId && "Select Floors..."}
          defaultValue={fetchData?.floorData?.find(
            (option: any) => option.value === roomInfo?.floorId
          )}
          onSelect={(value) => changeFloorFunc(value)}
          errorMsg={roomInfo?.floorIdErrMsg}
        />
      </div>
      <div className="mb-4">
        <label className=" text-black text-sm font-workSans mb-1 ">
          Select Room
        </label>
        <SearchableDropdown
          options={fetchData?.filteredRoom}
          isDisable={roomInfo?.floorId === null}
          placeholder="Select Room..."
          defaultValue={fetchData?.roomData?.find(
            (option: any) => option.value === roomInfo?.roomId
          )}
          onSelect={(value) => {
            setRoomInfo((prev: any) => ({
              ...prev,
              roomId: value,
              roomIdErrMsg: "",
            }));
          }}
          errorMsg={roomInfo?.roomIdErrMsg}
        />
      </div>

      <div className="flex w-full items-center justify-center mt-2">
        <button
          className="flex bg-primary70 items-center font-workSans text-md py-2 px-4 rounded-lg text-black hover:bg-primary50 hover:text-white"
          onClick={roomSelectFunc}
        >
          <FaCheck size={20} className="cursor-pointer mr-2" />
          Select Room
        </button>
      </div>
    </div>
  );
};

export default RoomInfoSelectCard;
