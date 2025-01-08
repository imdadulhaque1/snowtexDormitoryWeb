"use client";
import React, { FC, Suspense, useEffect, useState } from "react";
import SearchableDropdown from "@/app/_components/SearchableDropdown";
import retrieveToken from "@/app/_utils/handler/retrieveToken";
import { tokenInterface } from "@/interface/admin/decodeToken/tokenInterface";
import jwtDecode from "jsonwebtoken";
import AppURL from "@/app/_restApi/AppURL";
import axios from "axios";
import VerticalSingleInput from "@/app/_components/inputField/VerticalSingleInput";
import VertcialRadioBtn from "@/app/_components/radioBtn/VertcialRadioBtn";

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
    roomDetailsId: null,
    roomImgs: [],
    roomId: null,
    roomName: "",
    roomDimension: "",
    roomSideId: 0,
    commonFeatures: [],
    availableFurnitures: [],
    safetyFeatures: [],
    bedSpecification: [],
    bathroomSpecification: [],
    others: [],
    isUpdated: false,
    isDeleted: false,
    roomIdErrorMsg: "",
    roomDimensionErrorMsg: "",
    roomSideIdErrorMsg: "",
  });
  const [defaultData, setDefaultData] = useState({
    commonFeatures: [
      "WiFi",
      "TV",
      "AC",
      "Fan",
      "Heater",
      "Refrigerator",
      "Microwave",
      "Washing Machine",
      "Coffee Maker",
      "Kettle",
      "Iron",
      "Hair Dryer",
      "Vacuum Cleaner",
      "Shampoo",
      "Hangers",
      "Hair Dryer",
      "Free Parking",
      "Hot Tub",
      "Elevator",
    ],
    availableFurnitures: [
      "chair - 2",
      "chair - 3",
      "chair - 4",
      "Nightstand Table",
      "Small Table",
      "Sofa",
    ],
    safetyFeatures: ["Smoke Detector", "Fire Alarm", "Emergency exits nearby"],
    bedSpecification: [
      "Single Bed",
      "Double Bed",
      "Queen Bed",
      "King Bed",
      "2 - Bed",
      "3 - Bed",
    ],
    bathroomSpecification: [
      "Attached Bathroom",
      "Common Bathroom",
      "Shower",
      "Soap",
      "Handwash",
      "Toilet Tissues",
    ],
    others: [],
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

  const handleRadioBtnChange = (value: number) => {
    setRoomDetails((prev: any) => ({ ...prev, roomSideId: value }));
  };
  //   console.log(
  //     "Room Dropdown Values: ",
  //     JSON.stringify(dropdownProps.rooms, null, 2)
  //   );

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
                Select rooms
              </label>
              <SearchableDropdown
                options={dropdownProps?.rooms}
                isDisable={false}
                placeholder="Select Rooms..."
                defaultValue={dropdownProps?.rooms.find(
                  (option: any) =>
                    // @ts-ignore
                    parseInt(option.value) === parseInt(roomDetails?.roomId)
                )}
                onSelect={(value) => handleRoomChange(value)}
              />
            </div>
            <div className="my-3">
              <VerticalSingleInput
                label="Room Dimensions"
                type="text"
                name="roomDimensions"
                placeholder="Enter Room Dimensions(12 ft x 16 ft room)"
                // @ts-ignore
                value={roomDetails?.roomDescription}
                onChange={(e: any) =>
                  setRoomDetails((prev: any) => ({
                    ...prev,
                    roomDimension: e.target.value,
                    floorDescriptionErrorMsg: "",
                  }))
                }
                errorMsg={roomDetails.roomDimensionErrorMsg}
                required
              />
            </div>
            <div className="my-3">
              <label className=" text-black text-sm font-workSans mb-1">
                Room Side
              </label>
              <div className="flex">
                <VertcialRadioBtn
                  label="East"
                  value={1}
                  name="roomSide"
                  checked={roomDetails?.roomSideId === 1}
                  onChange={handleRadioBtnChange}
                />
                <VertcialRadioBtn
                  label="West"
                  value={2}
                  name="roomSide"
                  checked={roomDetails?.roomSideId === 2}
                  onChange={handleRadioBtnChange}
                  className="mx-5"
                />
                <VertcialRadioBtn
                  label="North"
                  value={3}
                  name="roomSide"
                  checked={roomDetails?.roomSideId === 3}
                  onChange={handleRadioBtnChange}
                  className="mr-5"
                />
                <VertcialRadioBtn
                  label="South"
                  value={4}
                  name="roomSide"
                  checked={roomDetails?.roomSideId === 4}
                  onChange={handleRadioBtnChange}
                />
              </div>
            </div>
            <div className="my-3">
              <label className=" text-black text-sm font-workSans mb-1">
                Common Features
              </label>
              <div className="flex flex-wrap">
                {defaultData.commonFeatures &&
                  defaultData.commonFeatures.map((feature: any, index) => (
                    <div key={index} className="w-1/3 items-center ">
                      <input
                        type="checkbox"
                        checked={roomDetails?.commonFeatures.includes(feature)}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setRoomDetails((prev: any) => ({
                            ...prev,
                            commonFeatures: checked
                              ? [...prev.commonFeatures, feature]
                              : prev.commonFeatures.filter(
                                  (item: string) => item !== feature
                                ),
                          }));
                        }}
                        className="w-4 h-4 cursor-pointer bg-slate-500 rounded-lg"
                      />
                      <span className="font-workSans text-black text-center text-sm">
                        {feature}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default RoomDetailsPage;
