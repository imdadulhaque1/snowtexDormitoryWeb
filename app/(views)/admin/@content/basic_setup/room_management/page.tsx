import React, { FC, Suspense, useEffect, useState } from "react";
import jwtDecode from "jsonwebtoken";
import { tokenInterface } from "@/interface/admin/decodeToken/tokenInterface";
import retrieveToken from "@/app/_utils/handler/retrieveToken";
import axios from "axios";
import AppURL from "@/app/_restApi/AppURL";
import VerticalSingleInput from "@/app/_components/inputField/VerticalSingleInput";
import SearchableDropdown from "@/app/_components/SearchableDropdown";
import { MdDelete, MdDeleteOutline, MdOutlineFileUpload } from "react-icons/md";
import { FaEdit, FaRegWindowClose } from "react-icons/fa";
import { COLORS } from "@/app/_utils/COLORS";
import toast from "react-hot-toast";

interface Props {}

const RoomManagement: FC<Props> = (props) => {
  const [decodeToken, setDecodeToken] = useState<tokenInterface>({
    userId: "",
    name: "",
    email: "",
    token: "",
    expireDate: null,
  });
  const [dropdownProps, setDropdownProps] = useState({
    building: [],
    floor: [],
    filteredFloors: [],
  });
  const [roomData, setRoomData] = useState({
    data: [],
    roomId: null,
    roomName: "",
    roomDescription: "",
    floorId: null,
    buildingId: null,
    isUpdated: false,
    isDeleted: false,
    roomNameErrorMsg: "",
    roomDescriptionErrorMsg: "",
    floorIdErrorMsg: "",
    buildingIdErrorMsg: "",
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
      getBuildingsFunc(decodeToken?.token);
      fetchFloorData(decodeToken?.token);
      fetchRoomFunc(decodeToken?.token);
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

  const fetchRoomFunc = async (token: string) => {
    try {
      const { data } = await axios.get(AppURL.roomInfoApi, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (data?.status === 200) {
        setRoomData((prev) => ({ ...prev, data: data?.data }));
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
      errors.floorNameErrorMsg = "Floor name is required.";
    }
    if (!roomData.roomDescription.trim()) {
      isValid = false;
      errors.floorDescriptionErrorMsg = "Floor Description is required.";
    }

    if (!roomData.buildingId) {
      isValid = false;
      errors.buildingIdErrorMsg = "Cascading building is required.";
    }

    setRoomData((prev) => ({ ...prev, ...errors }));
    return isValid;
  };

  const onSubmitFunc = async (roomData: any, token: string, userId: any) => {
    if (!validateForm()) return;

    const submitRoomData = await {
      roomName: roomData.roomName,
      roomDescription: roomData.roomDescription,
      buildingId: roomData.buildingId,
      floorId: roomData.floorId,
      createdBy: userId,
    };
    console.log("submitRoomData: ", JSON.stringify(submitRoomData, null, 2));

    try {
      const { data } = await axios.post(AppURL.roomInfoApi, submitRoomData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (data?.status === 201) {
        toast.success(data?.message);
        // fetchFloorData(token);
        // getBuildingsFunc(token);
        fetchRoomFunc(token);
        setRoomData((prev) => ({
          ...prev,
          roomName: "",
          roomDescription: "",
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
      console.log("Error submitting floor data: ", error.message);
    }
  };

  const isRequiredRoom =
    roomData?.roomName.trim() &&
    roomData?.roomDescription.trim() &&
    roomData?.floorId &&
    roomData?.buildingId;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex fixed min-h-screen justify-center  bg-gradient-to-b from-primary to-primary90">
        <div className="flex w-screen h-full ">
          <div
            className={`w-[30%] h-80p bg-white p-4 m-4 rounded-lg shadow-lg`}
          >
            <VerticalSingleInput
              label="Room Name"
              type="text"
              name="roomName"
              placeholder="Enter room Name..."
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
                placeholder="Enter Room Description..."
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
                    option.value === parseInt(roomData?.buildingId)
                )}
                onSelect={(value) => handleBuildingChange(value)}
              />
              {/* <SearchableDropdown
                options={dropdownProps?.building}
                isDisable={false}
                placeholder="Select Buildiings..."
                defaultValue={dropdownProps?.building.find(
                  (option: any) =>
                    // @ts-ignore
                    option.value === parseInt(roomData?.buildingId)
                )}
                onSelect={(value: string, label: string) => {
                  setRoomData((prevItem: any) => ({
                    ...prevItem,
                    buildingId: value,
                  }));
                }}
              /> */}
            </div>
            <div className="my-3">
              <label className=" text-black text-sm font-workSans mb-1 ">
                Select Floors
              </label>
              <SearchableDropdown
                options={dropdownProps?.filteredFloors}
                isDisable={roomData?.buildingId === null}
                placeholder="Select Floors..."
                defaultValue={dropdownProps?.filteredFloors.find(
                  // @ts-ignore
                  (option: any) => option.value === parseInt(roomData?.floorId)
                )}
                onSelect={(value) => {
                  console.log("value: ", value);

                  setRoomData((prev: any) => ({
                    ...prev,
                    floorId: value,
                  }));
                }}
              />
              {/* <SearchableDropdown
                options={dropdownProps?.floor}
                isDisable={false}
                placeholder="Select Floors..."
                defaultValue={dropdownProps?.floor.find(
                  (option: any) =>
                    // @ts-ignore
                    option.value === parseInt(roomData?.floorId)
                )}
                onSelect={(value: string, label: string) => {
                  setRoomData((prevItem: any) => ({
                    ...prevItem,
                    floorId: value,
                  }));
                }}
              /> */}
            </div>

            <div className="flex justify-center items-center mt-4">
              {!roomData?.isUpdated ? (
                <button
                  className="flex bg-primary70 items-center font-workSans text-md py-2 px-4 rounded-lg text-black hover:bg-primary50 hover:text-white"
                  onClick={() => {
                    isRequiredRoom && decodeToken?.userId
                      ? onSubmitFunc(
                          roomData,
                          decodeToken?.token,
                          decodeToken?.userId
                        )
                      : toast.error(
                          "Please complete all the required fields !"
                        );
                  }}
                >
                  <MdOutlineFileUpload
                    color={COLORS.black}
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
                      color={COLORS.black}
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
                      color={COLORS.black}
                      size={20}
                      className="cursor-pointer mr-2"
                    />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
          {roomData?.data && roomData?.data?.length > 0 && (
            <div
              className={`w-[52%] h-80p bg-white p-4 m-4 rounded-lg shadow-lg`}
            >
              <div className="flex w-full items-center border-2 border-slate-300 py-2 px-2 rounded-t-lg bg-slate-300">
                <div className="flex w-1/12 items-center  justify-center border-slate-50 border-r-2">
                  <p className="text-md font-workSans font-medium text-center ">
                    Id
                  </p>
                </div>
                <div className=" flex  w-1/5 items-center justify-center border-slate-50 border-r-2">
                  <p className="text-md font-workSans font-medium text-center">
                    Name
                  </p>
                </div>
                <div className="flex w-1/3 items-center justify-center border-slate-50 border-r-2">
                  <p className="text-md font-workSans font-medium text-center">
                    Descriptions
                  </p>
                </div>
                <div className="flex  w-1/5  justify-center items-center border-slate-50 border-r-2">
                  <p className="text-md font-workSans font-medium text-center">
                    Floor Name
                  </p>
                </div>
                <div className="flex  w-1/5  justify-center items-center border-slate-50 border-r-2">
                  <p className="text-md font-workSans font-medium text-center">
                    Building Name
                  </p>
                </div>
                <div className="flex  w-1/5  justify-center items-center">
                  <p className="text-md font-workSans font-medium text-center">
                    Actions
                  </p>
                </div>
              </div>

              {roomData?.data?.map((room: any, roomIndex: number) => {
                const isLastRoom = roomIndex === roomData?.data.length - 1;
                return (
                  <div
                    key={roomIndex}
                    className={`flex w-full items-center ${
                      !isLastRoom ? "border-b-2" : "border-b-0"
                    } border-slate-300 py-2 px-2  bg-slate-100`}
                  >
                    <div className="flex w-1/12 items-center  justify-center border-slate-300 border-r-2">
                      <p className="text-md font-workSans text-center">
                        {room?.roomId}
                      </p>
                    </div>
                    <div className=" flex  w-1/5 items-center justify-center border-slate-300 border-r-2">
                      <p className="text-md font-workSans text-center break-words max-w-full">
                        {room?.roomName}
                      </p>
                    </div>
                    <div className="flex w-1/3 items-center justify-center border-slate-300 border-r-2">
                      <p className="text-md font-workSans text-center break-words max-w-full">
                        {room?.roomDescription}
                      </p>
                    </div>
                    <div className="flex  w-1/5  justify-center items-center border-slate-300 border-r-2">
                      <p className="text-md font-workSans text-center break-words max-w-full">
                        {room?.floorName}
                      </p>
                    </div>
                    <div className="flex  w-1/5  justify-center items-center border-slate-300 border-r-2">
                      <p className="text-md font-workSans text-center break-words max-w-full">
                        {room?.buildingName}
                      </p>
                    </div>
                    <div className="flex  w-1/5  justify-center items-center">
                      <div className="relative group mr-3">
                        <button
                          onClick={async () => {
                            await setRoomData((prev) => ({
                              ...prev,
                              roomId: room?.floorId,
                              roomName: room?.floorName,
                              roomDescription: room?.floorDescription,
                              buildingId: room?.buildingId,
                              floorId: room?.floorId,
                              isUpdated: true,
                            }));
                          }}
                        >
                          <FaEdit
                            color={COLORS.primary80}
                            size={28}
                            className="cursor-pointer  shadow-xl shadow-white"
                          />
                        </button>

                        <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full  px-2 py-1 text-xs text-black  opacity-0 transition-opacity duration-500 group-hover:opacity-100 whitespace-nowrap font-workSans">
                          Update Floor
                        </span>
                      </div>

                      <div className="relative group ">
                        <button
                          onClick={async () => {
                            await setRoomData((prev) => ({
                              ...prev,
                              roomId: room?.floorId,
                              isDeleted: true,
                            }));
                          }}
                        >
                          <MdDeleteOutline
                            color={COLORS.errorColor}
                            size={30}
                            className="cursor-pointer  shadow-xl shadow-white"
                          />
                        </button>

                        <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full  px-2 py-1 text-xs text-black  opacity-0 transition-opacity duration-500 group-hover:opacity-100 whitespace-nowrap font-workSans">
                          Delete Floor
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Suspense>
  );
};

export default RoomManagement;
