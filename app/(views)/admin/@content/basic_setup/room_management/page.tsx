"use client";
import React, { FC, Suspense, useEffect, useState } from "react";
import jwtDecode from "jsonwebtoken";
import { tokenInterface } from "@/interface/admin/decodeToken/tokenInterface";
import retrieveToken from "@/app/_utils/handler/retrieveToken";
import axios from "axios";
import AppURL from "@/app/_restApi/AppURL";
import VerticalSingleInput from "@/app/_components/inputField/VerticalSingleInput";
import SearchableDropdown from "@/app/_components/SearchableDropdown";
import { MdDeleteOutline, MdOutlineFileUpload } from "react-icons/md";
import { FaEdit, FaRegWindowClose } from "react-icons/fa";
import { COLORS } from "@/app/_utils/COLORS";
import toast from "react-hot-toast";
import DeleteModal from "@/app/_components/modal/DeletedModal";
import TableHeader from "@/app/_components/inputField/table/TableHeader";
import { BsEyeFill } from "react-icons/bs";
import { MdAddCircle, MdOutlineSystemUpdateAlt } from "react-icons/md";

import PaginationUI from "@/app/_components/pagination/PaginationUI";
import { useAppContext } from "@/app/_stateManagements/contextApi";
import AddRoomDetailsModal from "@/app/_components/modal/AddRoomDetailsModal";
import ViewRoomDetailsModal from "@/app/_components/modal/ViewRoomDetailsModal";

interface Props {}

const RoomManagement: FC<Props> = (props) => {
  const { getDrawerStatus } = useAppContext();
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
    building: [],
    floor: [],
    filteredFloors: [],
    roomCategories: [],
  });
  const [roomData, setRoomData] = useState({
    data: [],
    noOfRooms: null,
    roomId: null,
    roomName: "",
    roomDescription: "",
    remarks: "",
    roomCategoryId: null,
    floorId: null,
    buildingId: null,
    isUpdated: false,
    isDeleted: false,
    roomNameErrorMsg: "",
    roomDescriptionErrorMsg: "",
    floorIdErrorMsg: "",
    buildingIdErrorMsg: "",
    remarksErrorMsg: "",
    roomCategoryIdErrorMsg: "",
  });

  const [roomDetails, setRoomDetails] = useState({
    isOpenARDModal: false,
    isOpenVRDModal: false,
    roomDetailId: null,
    roomId: null,
    floorId: null,
    buildingId: null,
    selectedRoom: null,
    roomDimensions: "",
    roomSide: null,
    attachedBelconi: null,
    attachedToilet: null,
    commonfeatures: [],
    availableFurnituries: [],
    bedSpecifications: [],
    bathroomSpecifications: [],
    roomImages: [],
  });

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

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
      getBuildingsFunc(decodeToken?.token);
      fetchFloorData(decodeToken?.token);
      fetchRoomCategories(decodeToken?.token);
      fetchRoomFunc(decodeToken?.token, currentPage);
    }
  }, [decodeToken?.token, decodeToken?.userId]);

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
        await setDropdownProps((prev: any) => ({
          ...prev,
          building: convertedBuildings,
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
        await setDropdownProps((prev: any) => ({
          ...prev,
          floor: convertedFloors,
        }));
      }
    } catch (error: any) {
      console.log("Error fetching floor data: ", error.message);
    }
  };
  const fetchRoomCategories = async (token: string) => {
    try {
      const { data } = await axios.get(AppURL.roomCategoryApi, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (data?.status === 200) {
        const convertedRoomCategory = await data?.data.map(
          ({ roomCategoryId, name }: any) => ({
            value: roomCategoryId,
            label: name,
          })
        );
        await setDropdownProps((prev: any) => ({
          ...prev,
          roomCategories: convertedRoomCategory,
        }));
      }
    } catch (error: any) {
      console.log("Error fetching room categories: ", error.message);
    }
  };

  const fetchRoomFunc = async (token: string, noOfPage: number) => {
    // https://localhost:7094/api/admin/RoomInfo?name=test&buildingName=sc&floorName=c&sortOrder=asc&page=1&pageSize=10
    const getRoomApi = `${AppURL.roomInfoApi}?name=${searchKey?.roomName}&buildingName=${searchKey?.buildingName}&floorName=${searchKey?.floorName}&page=${noOfPage}&pageSize=10`;

    try {
      const { data } = await axios.get(getRoomApi, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (data?.status === 200) {
        // console.log("roomData?.data: ", JSON.stringify(data, null, 2));
        setRoomData((prev) => ({
          ...prev,
          data: data?.data,
          noOfRooms: data?.totalCount,
        }));
      }
    } catch (error: any) {
      console.log("Error fetching room data: ", error);
    }
  };

  const handleBuildingChange = (buildingId: string) => {
    setRoomData((prev: any) => ({
      ...prev,
      buildingId,
      floorId: null, // Reset the floorId when building changes
      roomCategoryIdErrorMsg: "",
    }));

    // Filter the floors based on the selected buildingId
    const filteredFloors = dropdownProps.floor.filter(
      (floor: any) => floor.buildingId === buildingId
    );
    setDropdownProps((prev) => ({
      ...prev,
      filteredFloors,
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const errors: Partial<typeof roomData> = {};

    if (!roomData.roomName.trim()) {
      isValid = false;
      errors.roomNameErrorMsg = "Floor name is required.";
    }
    if (!roomData.roomDescription.trim()) {
      isValid = false;
      errors.roomDescriptionErrorMsg = "Floor Description is required.";
    }
    if (!roomData.remarks.trim()) {
      isValid = false;
      errors.remarksErrorMsg = "Remarks is required.";
    }

    if (!roomData.roomCategoryId) {
      isValid = false;
      errors.roomCategoryIdErrorMsg = "Room category is required.";
    }
    if (!roomData.buildingId) {
      isValid = false;
      errors.buildingIdErrorMsg = "Cascading building is required.";
    }
    if (!roomData.floorId) {
      isValid = false;
      errors.floorIdErrorMsg = "Cascading floor is required.";
    }

    setRoomData((prev) => ({ ...prev, ...errors }));
    return isValid;
  };

  const onSubmitFunc = async (roomData: any, token: string, userId: any) => {
    if (!validateForm()) return;

    const submitRoomData = await {
      roomName: roomData.roomName,
      roomDescription: roomData.roomDescription,
      remarks: roomData.remarks,
      roomCategoryId: roomData.roomCategoryId,
      buildingId: roomData.buildingId,
      floorId: roomData.floorId,
      createdBy: userId,
    };

    try {
      const { data } = await axios.post(AppURL.roomInfoApi, submitRoomData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (data?.status === 201) {
        toast.success(data?.message);

        fetchRoomFunc(token, 1);
        setRoomData((prev) => ({
          ...prev,
          roomName: "",
          roomDescription: "",
          remarks: "",
          roomCategoryId: null,
          floorId: null,
          buildingId: null,
          isUpdated: false,
          isDeleted: false,
          roomNameErrorMsg: "",
          roomDescriptionErrorMsg: "",
          floorIdErrorMsg: "",
          buildingIdErrorMsg: "",
        }));
      }
    } catch (error: any) {
      toast.error("Failed to submit floor data !");
    }
  };

  const updateFunc = async (roomData: any, token: string, userId: any) => {
    if (!validateForm()) return;

    const updateRoomData = await {
      roomName: roomData.roomName,
      roomDescription: roomData.roomDescription,
      remarks: roomData.remarks,
      roomCategoryId: roomData.roomCategoryId,
      buildingId: roomData.buildingId,
      floorId: roomData.floorId,
      updatedBy: userId,
    };

    await axios
      .put(`${AppURL.roomInfoApi}/${roomData.roomId}`, updateRoomData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        if (data?.status === 200) {
          toast.success("Successfully updated room data !");
          fetchRoomFunc(token, 1);
          setRoomData((prev) => ({
            ...prev,
            roomId: null,
            roomName: "",
            roomDescription: "",
            remarks: "",
            roomCategoryId: null,
            floorId: null,
            buildingId: null,
            isUpdated: false,
            isDeleted: false,
            roomNameErrorMsg: "",
            roomDescriptionErrorMsg: "",
            floorIdErrorMsg: "",
            buildingIdErrorMsg: "",
          }));
        }
      })
      .catch((error: any) => {
        toast.error("Failed to update Room data !");
      });
  };
  const closeToUpdateFunc = async () => {
    await setRoomData((prev) => ({
      ...prev,
      roomId: null,
      roomName: "",
      roomDescription: "",
      remarks: "",
      roomCategoryId: null,
      floorId: null,
      buildingId: null,
      isUpdated: false,
      isDeleted: false,
      roomNameErrorMsg: "",
      roomDescriptionErrorMsg: "",
      floorIdErrorMsg: "",
      buildingIdErrorMsg: "",
    }));
    // await getBuildingsFunc(decodeToken?.token);
  };
  const deleteFunc = async () => {
    const deleteData = await {
      inactiveBy: decodeToken?.userId,
    };
    if (roomData?.roomId && decodeToken?.userId) {
      try {
        const response: any = await fetch(
          `${AppURL.roomInfoApi}/${roomData?.roomId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${decodeToken?.token}`,
            },
            body: JSON.stringify(deleteData),
          }
        );

        if (response?.status === 200) {
          toast.success("Room deleted successfully !");
          setRoomData((prev) => ({
            ...prev,
            roomId: null,
            isDeleted: false,
          }));
          fetchRoomFunc(decodeToken?.token, 1);
        } else {
          toast.error("Error deleting Room !");
        }
      } catch (error: any) {
        toast.error("Failed to delete. Please try again !");
      }
    }
  };
  const handleCancel = () => {
    setRoomData((prev) => ({
      ...prev,
      roomId: null,
      isDeleted: false,
    }));
  };

  const isRequiredRoom =
    roomData?.roomName &&
    roomData?.roomDescription &&
    roomData?.roomName?.trim() &&
    roomData?.roomDescription?.trim() &&
    roomData?.floorId &&
    roomData?.buildingId;

  const handlePageChange = async (newPage: number) => {
    try {
      setCurrentPage(newPage); // Update current page
    } catch (error) {
      console.error("Error updating page:", error);
    }
  };
  const totalPages = roomData.noOfRooms
    ? Math.ceil(roomData.noOfRooms / pageSize)
    : 0;

  useEffect(() => {
    fetchRoomFunc(decodeToken?.token, currentPage);
  }, [currentPage]);

  const cancelToAddRoomDetailFunc = async () => {
    await setRoomDetails((prev) => ({
      ...prev,
      isOpenARDModal: false,
      isOpenVRDModal: false,
      roomDetailId: null,
      roomId: null,
      floorId: null,
      buildingId: null,
      selectedRoom: null,
      roomDimensions: "",
      roomSide: null,
      attachedBelconi: null,
      attachedToilet: null,
      commonfeatures: [],
      availableFurnituries: [],
      bedSpecifications: [],
      bathroomSpecifications: [],
      roomImages: [],
    }));
  };

  const getRoomDetailsFunc = async (
    roomId: number,
    floorId: number,
    buildingId: number,
    userId: any,
    token: string,
    isView: boolean,
    isUpdate: boolean
  ) => {
    try {
      const { data } = await axios.get(
        `${AppURL.roomDetailsApi}?userId=${userId}&buildingId=${buildingId}&floorId=${floorId}&roomId=${roomId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data?.status === 200) {
        await setRoomDetails((prev: any) => ({
          ...prev,
          selectedRoom: data?.data,
          roomId: roomId,
          floorId: floorId,
          buildingId: buildingId,
          isOpenVRDModal: isView,
          isOpenARDModal: isUpdate,
        }));
      }
    } catch (error: any) {
      isUpdate &&
        setRoomDetails((prev: any) => ({
          ...prev,
          selectedRoom: null,
          roomId: roomId,
          floorId: floorId,
          buildingId: buildingId,
          isOpenVRDModal: isView,
          isOpenARDModal: isUpdate,
        }));
      if (!isUpdate && error?.status === 404) {
        toast.error("Room details not found !");
      } else {
        !isUpdate && toast.error("Failed to fetch room details !");
      }
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div
        className={`flex  ${"w-[100%]"} justify-center ${
          getDrawerStatus ? "pl-[265]" : "pl-0"
        } max-h-screen justify-center overflow-auto pb-52`}
      >
        <div className={`flex flex-col xl:flex-row w-full h-full`}>
          <div
            className={`w-[97%] xl:w-[25%] h-80p bg-white p-4 rounded-lg shadow-lg`}
          >
            <p className=" text-lg font-workSans text-center uppercase font-semibold">
              Room Entries
            </p>
            <VerticalSingleInput
              label="Room No"
              type="text"
              name="roomName"
              placeholder="Enter room no..."
              // @ts-ignore
              value={roomData?.roomName}
              onChange={(e: any) =>
                setRoomData((prev) => ({
                  ...prev,
                  roomName: e.target.value,
                  floorNameErrorMsg: "",
                }))
              }
              errorMsg={roomData.roomNameErrorMsg}
              required
            />
            <div className="my-3">
              <VerticalSingleInput
                label="Room Description"
                type="text"
                name="roomDescription"
                placeholder="Enter room description..."
                // @ts-ignore
                value={roomData?.roomDescription}
                onChange={(e: any) =>
                  setRoomData((prev) => ({
                    ...prev,
                    roomDescription: e.target.value,
                    floorDescriptionErrorMsg: "",
                  }))
                }
                errorMsg={roomData.roomDescriptionErrorMsg}
                required
              />
            </div>
            <div className="my-3">
              <VerticalSingleInput
                label="Remarks"
                type="text"
                name="remarks"
                placeholder="Enter remarks..."
                // @ts-ignore
                value={roomData?.remarks}
                onChange={(e: any) =>
                  setRoomData((prev) => ({
                    ...prev,
                    remarks: e.target.value,
                    remarksErrorMsg: "",
                  }))
                }
                errorMsg={roomData.remarksErrorMsg}
                required
              />
            </div>
            <div className="my-3">
              <label className=" text-black text-sm font-workSans mb-1 ">
                Select Room Categories
              </label>
              <SearchableDropdown
                options={dropdownProps?.roomCategories}
                isDisable={false}
                placeholder="Select room category..."
                defaultValue={dropdownProps?.roomCategories.find(
                  (option: any) =>
                    parseInt(option.value) ===
                    parseInt(roomData?.roomCategoryId)
                )}
                onSelect={(value) => {
                  setRoomData((prev: any) => ({
                    ...prev,
                    roomCategoryId: value,
                    roomCategoryIdErrorMsg: "",
                  }));
                }}
                txtColor={
                  roomData?.roomCategoryId ? "text-black" : "text-gray-400"
                }
                errorMsg={roomData.roomCategoryIdErrorMsg}
              />
            </div>
            <div className="my-3">
              <label className=" text-black text-sm font-workSans mb-1">
                Select Buildings
              </label>
              <SearchableDropdown
                options={dropdownProps?.building}
                isDisable={false}
                placeholder="Select Buildings..."
                defaultValue={dropdownProps?.building.find(
                  (option: any) =>
                    // @ts-ignore
                    parseInt(option.value) === parseInt(roomData?.buildingId)
                )}
                onSelect={(value) => handleBuildingChange(value)}
                txtColor={roomData?.buildingId ? "text-black" : "text-gray-400"}
                errorMsg={roomData?.buildingIdErrorMsg}
              />
            </div>
            <div className="my-3">
              <label className=" text-black text-sm font-workSans mb-1 ">
                Select Floors
              </label>
              <SearchableDropdown
                options={dropdownProps?.filteredFloors}
                isDisable={roomData?.buildingId === null}
                placeholder="Select Floors..."
                defaultValue={dropdownProps?.floor.find(
                  (option: any) =>
                    // @ts-ignore
                    parseInt(option.value) === parseInt(roomData?.floorId)
                )}
                onSelect={(value) => {
                  setRoomData((prev: any) => ({
                    ...prev,
                    floorId: value,
                    floorIdErrorMsg: "",
                  }));
                }}
                errorMsg={roomData?.floorIdErrorMsg}
              />
            </div>

            <div className="flex justify-center items-center mt-4">
              {!roomData?.isUpdated ? (
                <button
                  className="flex bg-primary70 items-center font-workSans text-md py-2 px-4 rounded-lg text-black hover:bg-primary50 hover:text-white"
                  onClick={() => {
                    decodeToken?.userId &&
                      onSubmitFunc(
                        roomData,
                        decodeToken?.token,
                        decodeToken?.userId
                      );
                  }}
                >
                  <MdOutlineFileUpload
                    size={20}
                    className="cursor-pointer mr-2"
                  />
                  Submit Room
                </button>
              ) : (
                <div className="flex justify-center items-center space-x-4">
                  <button
                    className="flex items-center bg-primary70 font-workSans text-md py-2 px-4 rounded-lg text-black hover:bg-primary50 hover:text-white"
                    onClick={async () => {
                      await (isRequiredRoom && decodeToken?.userId
                        ? updateFunc(
                            roomData,
                            decodeToken?.token,
                            decodeToken?.userId
                          )
                        : toast.error(
                            "Please complete all the required fields !"
                          ));
                    }}
                  >
                    <MdOutlineFileUpload
                      size={20}
                      className="cursor-pointer mr-2"
                    />
                    Update Room
                  </button>

                  <button
                    className="flex bg-errorColor font-workSans text-md py-2 px-4 rounded-lg text-black items-center justify-center hover:bg-red-500 hover:text-white"
                    onClick={closeToUpdateFunc}
                  >
                    <FaRegWindowClose
                      size={20}
                      className="cursor-pointer mr-2"
                    />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          <div
            className={` w-[97%] xl:w-[75%]  h-80p  p-4 xl:ml-3 mt-4 xl:mt-0 rounded-lg shadow-lg bg-white`}
          >
            <div className="flex w-full items-center  px-2 rounded-t-lg bg-slate-300">
              <TableHeader
                headerText="Details"
                containerClassName="w-1/6"
                hasSearch={false}
              />

              <TableHeader
                headerText="Name"
                placeholder="Search by name"
                containerClassName="w-1/5 border-x-2 border-slate-50"
                id="name-search"
                value={searchKey.roomName}
                onChange={(e) => {
                  setSearchKey((prev) => ({
                    ...prev,
                    roomName: e.target.value,
                  }));
                }}
                onSearch={() => fetchRoomFunc(decodeToken?.token, currentPage)}
              />
              <TableHeader
                headerText="Category"
                containerClassName="w-1/4 "
                hasSearch={false}
              />
              <TableHeader
                headerText="Remarks"
                containerClassName="w-1/4 border-x-2 border-slate-50"
                hasSearch={false}
              />
              <TableHeader
                headerText="Descriptions"
                containerClassName="w-1/4 "
                hasSearch={false}
              />
              <TableHeader
                headerText="Floor Name"
                placeholder="Search by floor name"
                containerClassName="w-1/5 border-x-2 border-slate-50"
                id="floorName-search"
                value={searchKey.floorName}
                onChange={(e) => {
                  setSearchKey((prev) => ({
                    ...prev,
                    floorName: e.target.value,
                  }));
                }}
                onSearch={() => fetchRoomFunc(decodeToken?.token, currentPage)}
              />
              <TableHeader
                headerText="Building Name"
                placeholder="Search by building name"
                containerClassName="w-1/5 border-r-2 border-slate-50 "
                id="buildingName-search"
                value={searchKey.buildingName}
                onChange={(e) => {
                  setSearchKey((prev) => ({
                    ...prev,
                    buildingName: e.target.value,
                  }));
                }}
                onSearch={() => fetchRoomFunc(decodeToken?.token, currentPage)}
              />
              <TableHeader
                headerText="Actions"
                containerClassName="w-1/5 "
                hasSearch={false}
              />
            </div>

            {/* Scrollable Rows */}
            <div className="max-h-80p overflow-y-auto">
              {roomData?.data && roomData?.data?.length > 0 ? (
                roomData?.data?.map((room: any, roomIndex: number) => {
                  const isLastRoom = roomIndex === roomData?.data.length - 1;

                  // py-2 px-3
                  return (
                    <div
                      key={roomIndex}
                      className={`flex w-full items-center ${
                        !isLastRoom ? "border-b-2" : "border-b-0"
                      } border-slate-300  bg-slate-100`}
                    >
                      <div className="flex w-1/6 items-center justify-evenly">
                        <div className="relative group mr-2 mt-1">
                          <button
                            onClick={() => {
                              decodeToken?.userId &&
                                decodeToken?.token &&
                                getRoomDetailsFunc(
                                  room?.roomId,
                                  room?.floorId,
                                  room?.buildingId,
                                  decodeToken?.userId,
                                  decodeToken?.token,
                                  true,
                                  false
                                );
                            }}
                          >
                            <BsEyeFill
                              size={28}
                              className={`cursor-pointer ${
                                room?.haveRoomDetails
                                  ? "text-slate-400 hover:text-slate-500"
                                  : "text-slate-300"
                              }  shadow-xl shadow-white`}
                            />
                          </button>
                          <span
                            className={`absolute left-1/2 transform -translate-x-1/2 bottom-full px-2 py-1 text-xs ${
                              room?.haveRoomDetails
                                ? "text-black"
                                : "text-red-800"
                            } opacity-0 transition-opacity duration-500 group-hover:opacity-100 whitespace-nowrap font-workSans`}
                          >
                            {room?.haveRoomDetails
                              ? "View details"
                              : "Empty details"}
                          </span>
                        </div>

                        <div className="relative group mr-2 mt-1">
                          <button
                            onClick={async () => {
                              decodeToken?.userId &&
                                decodeToken?.token &&
                                getRoomDetailsFunc(
                                  room?.roomId,
                                  room?.floorId,
                                  room?.buildingId,
                                  decodeToken?.userId,
                                  decodeToken?.token,
                                  false,
                                  true
                                );
                            }}
                          >
                            {room?.haveRoomDetails ? (
                              <MdOutlineSystemUpdateAlt
                                size={28}
                                className="cursor-pointer text-green-600 hover:text-green-700 shadow-xl shadow-white "
                              />
                            ) : (
                              <MdAddCircle
                                size={28}
                                className={`cursor-pointer text-primary75 hover:text-primary50  shadow-xl shadow-white `}
                              />
                            )}
                          </button>
                          <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full px-2 py-1 text-xs text-black opacity-0 transition-opacity duration-500 group-hover:opacity-100 whitespace-nowrap font-workSans">
                            {room?.haveRoomDetails
                              ? "Upadte room details"
                              : "Add room details"}
                          </span>
                        </div>
                      </div>

                      <div className="flex w-1/5 items-center justify-center border-slate-300 border-x-2">
                        <p className="text-md font-workSans text-center break-words max-w-full">
                          {room?.roomName}
                        </p>
                      </div>
                      <div className="flex w-1/4 items-center justify-center border-slate-300 border-r-2">
                        <p className="text-md font-workSans text-center break-words max-w-full">
                          {room?.roomCategoryName}
                        </p>
                      </div>
                      <div className="flex w-1/4 items-center justify-center border-slate-300">
                        <p className="text-md font-workSans text-center break-words max-w-full">
                          {room?.remarks}
                        </p>
                      </div>
                      <div className="flex w-1/4 items-center justify-center border-slate-300 border-x-2">
                        <p className="text-md font-workSans text-center break-words max-w-full">
                          {room?.roomDescription}
                        </p>
                      </div>
                      <div className="flex w-1/5 justify-center items-center border-slate-300 border-r-2">
                        <p className="text-md font-workSans text-center break-words max-w-full">
                          {room?.floorName}
                        </p>
                      </div>
                      <div className="flex w-1/5 justify-center items-center border-slate-300 border-r-2 ">
                        <p className="text-md font-workSans text-center break-words max-w-full">
                          {room?.buildingName}
                        </p>
                      </div>
                      <div className={`flex w-1/5 justify-center items-center`}>
                        <div className="relative group mr-3">
                          <button
                            onClick={async () => {
                              await setRoomData((prev) => ({
                                ...prev,
                                roomId: room?.roomId,
                                roomName: room?.roomName,
                                roomCategoryId: room?.roomCategoryId,
                                remarks: room?.remarks,
                                roomDescription: room?.roomDescription,
                                buildingId: room?.buildingId,
                                floorId: room?.floorId,
                                isUpdated: true,
                              }));
                            }}
                          >
                            <FaEdit
                              color={COLORS.primary80}
                              size={28}
                              className="cursor-pointer shadow-xl shadow-white"
                            />
                          </button>
                          <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full px-2 py-1 text-xs text-black opacity-0 transition-opacity duration-500 group-hover:opacity-100 whitespace-nowrap font-workSans">
                            Update Room
                          </span>
                        </div>
                        <div className="relative group">
                          <button
                            onClick={async () => {
                              await setRoomData((prev) => ({
                                ...prev,
                                roomId: room?.roomId,
                                isDeleted: true,
                              }));
                            }}
                          >
                            <MdDeleteOutline
                              color={COLORS.errorColor}
                              size={30}
                              className="cursor-pointer shadow-xl shadow-white"
                            />
                          </button>
                          <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full px-2 py-1 text-xs text-black opacity-0 transition-opacity duration-500 group-hover:opacity-100 whitespace-nowrap font-workSans">
                            Delete Room
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div>
                  <h3 className="text-center font-workSans text-md mt-4 text-red-500">
                    Room data not found !
                  </h3>
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <PaginationUI
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
        <DeleteModal
          title="Do you want to delete?"
          description="You're going to delete this room. "
          noteMsg="Related room details also be unavailable."
          onConfirm={deleteFunc}
          onCancel={handleCancel}
          isVisible={roomData?.isDeleted}
        />
        {roomDetails?.roomId &&
          roomDetails?.floorId &&
          roomDetails?.buildingId && (
            <AddRoomDetailsModal
              title="Add Room Details"
              onCancel={cancelToAddRoomDetailFunc}
              isVisible={roomDetails?.isOpenARDModal}
              naviagteRoomId={roomDetails?.roomId}
              navigateFloorId={roomDetails?.floorId}
              navigateBuildingId={roomDetails?.buildingId}
              updatedRoomDetails={
                roomDetails?.selectedRoom ? roomDetails?.selectedRoom[0] : null
              }
            />
          )}
        {roomDetails?.selectedRoom && (
          <ViewRoomDetailsModal
            token={decodeToken?.token}
            onCancel={cancelToAddRoomDetailFunc}
            isVisible={roomDetails?.isOpenVRDModal}
            selectedRoom={roomDetails?.selectedRoom}
          />
        )}
      </div>
    </Suspense>
  );
};

export default RoomManagement;
