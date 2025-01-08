"use client";
import React, { FC, Suspense, useEffect, useState } from "react";
import SearchableDropdown from "@/app/_components/SearchableDropdown";
import retrieveToken from "@/app/_utils/handler/retrieveToken";
import { tokenInterface } from "@/interface/admin/decodeToken/tokenInterface";
import jwtDecode from "jsonwebtoken";
import AppURL from "@/app/_restApi/AppURL";
import axios from "axios";

interface Props {}

const RoomDetailsPage: FC<Props> = (props) => {
  const [decodeToken, setDecodeToken] = useState<tokenInterface>({
    userId: "",
    name: "",
    email: "",
    token: "",
    expireDate: null,
  });
  const [searchKey, setSearchKey] = useState({
    roomName: "",
    buildingName: "",
    floorName: "",
  });
  const [dropdownProps, setDropdownProps] = useState({
    rooms: [],
  });
  const [roomDetails, setRoomDetails] = useState<any>({
    detailsData: [],
    roomId: null,
    roomName: "",
  });
  useEffect(() => {
    const fetchAndDecodeToken = async () => {
      const token = await retrieveToken();

      if (token) {
        try {
          const decoded: any = jwtDecode.decode(token);

          setDecodeToken({
            userId: decoded?.userId,
            name: decoded?.name,
            email: decoded?.email,
            token: token,
            expireDate: decoded?.exp,
          });
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      }
    };

    fetchAndDecodeToken();

    if (decodeToken?.token && decodeToken?.userId) {
      fetchRoomFunc(decodeToken?.token, 1);
    }
  }, [decodeToken?.token, decodeToken?.userId]);

  const fetchRoomFunc = async (token: string, noOfPage: number) => {
    const getRoomApi = `${AppURL.roomInfoApi}?name=${searchKey?.roomName}&page=${noOfPage}&pageSize=10`;

    try {
      const { data } = await axios.get(getRoomApi, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (data?.status === 200) {
        const convertedRooms = await data?.data.map(
          ({ roomId, roomName }: any) => ({
            value: roomId,
            label: roomName,
          })
        );
        await setDropdownProps((prev: any) => ({
          ...prev,
          rooms: convertedRooms,
        }));
        // console.log("Room Data: ", JSON.stringify(data?.data, null, 2));
      }
    } catch (error: any) {
      console.log("Error fetching room data: ", error);
    }
  };

  const handleRoomChange = (roomId: string) => {
    setRoomDetails((prev: any) => ({
      ...prev,
      roomId,
    }));

    // Filter the Rooms based on the selected roomId
    const filteredFloors = dropdownProps.rooms.filter(
      (floor: any) => floor.roomId === roomId
    );
    setDropdownProps((prev) => ({
      ...prev,
      filteredFloors,
    }));
  };
  console.log(
    "Room Dropdown Values: ",
    JSON.stringify(dropdownProps.rooms, null, 2)
  );

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex fixed min-h-screen justify-center  bg-gradient-to-b from-primary to-primary90">
        <div className="flex w-screen h-full ">
          <div
            className={`w-[25%] h-80p bg-white p-4 m-4 rounded-lg shadow-lg`}
          >
            <p className=" text-lg font-workSans text-center uppercase font-semibold">
              Room Details Entries
            </p>
            <div className="my-3">
              <label className=" text-black text-sm font-workSans mb-1">
                Select Buildings
              </label>
              <SearchableDropdown
                options={dropdownProps?.rooms}
                isDisable={false}
                placeholder="Select Buildings..."
                defaultValue={dropdownProps?.rooms.find(
                  (option: any) =>
                    // @ts-ignore
                    parseInt(option.value) === parseInt(roomDetails?.roomId)
                )}
                onSelect={(value) => handleRoomChange(value)}
              />
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default RoomDetailsPage;
