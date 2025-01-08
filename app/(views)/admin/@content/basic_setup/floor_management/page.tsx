"use client";
import React, { FC, Suspense, useEffect, useState } from "react";
import jwtDecode from "jsonwebtoken";
import { tokenInterface } from "@/interface/admin/decodeToken/tokenInterface";
import retrieveToken from "@/app/_utils/handler/retrieveToken";
import VerticalSingleInput from "@/app/_components/inputField/VerticalSingleInput";
import toast from "react-hot-toast";
import { COLORS } from "@/app/_utils/COLORS";
import { MdDelete, MdDeleteOutline, MdOutlineFileUpload } from "react-icons/md";
import { FaEdit, FaRegWindowClose } from "react-icons/fa";
import AppURL from "@/app/_restApi/AppURL";
import axios from "axios";
import SearchableDropdown from "@/app/_components/SearchableDropdown";
import DeleteModal from "@/app/_components/modal/DeletedModal";

interface Props {}

const FloorManagement: FC<Props> = (props) => {
  const [decodeToken, setDecodeToken] = useState<tokenInterface>({
    userId: "",
    name: "",
    email: "",
    token: "",
    expireDate: null,
  });
  const [buildingProps, setBuildingProps] = useState([]);
  const [searchKey, setSearchKey] = useState({
    buildingName: "",
    floorName: "",
  });

  const [floorData, setFloorData] = useState({
    data: [],
    floorId: null,
    floorName: "",
    floorDescription: "",
    buildingId: null,
    isUpdated: false,
    isDeleted: false,
    floorNameErrorMsg: "",
    floorDescriptionErrorMsg: "",
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
      // getMenuDataFunc(decodeToken?.token, decodeToken?.userId);
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
        const convertedMenu = await data?.data.map(
          ({ buildingId, buildingName }: any) => ({
            value: buildingId,
            label: buildingName,
          })
        );
        await setBuildingProps(convertedMenu);
      }
    } catch (error: any) {
      console.log("Error fetching building data: ", error.message);
    }
  };
  const validateForm = () => {
    let isValid = true;
    const errors: Partial<typeof floorData> = {};

    if (!floorData.floorName.trim()) {
      isValid = false;
      errors.floorNameErrorMsg = "Floor name is required.";
    }
    if (!floorData.floorDescription.trim()) {
      isValid = false;
      errors.floorDescriptionErrorMsg = "Floor Description is required.";
    }

    if (!floorData.buildingId) {
      isValid = false;
      errors.buildingIdErrorMsg = "Cascading building is required.";
    }

    setFloorData((prev) => ({ ...prev, ...errors }));
    return isValid;
  };

  const fetchFloorData = async (token: string) => {
    console.log(AppURL.floorInfoApi);

    try {
      const { data } = await axios.get(AppURL.floorInfoApi, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (data?.status === 200) {
        setFloorData((prev) => ({ ...prev, data: data?.data }));
      }
    } catch (error: any) {
      console.log("Error fetching floor data: ", error.message);
    }
  };

  const onSubmitFunc = async (floorData: any, token: string, userId: any) => {
    if (!validateForm()) return;

    const submitFloorData = await {
      floorName: floorData.floorName,
      floorDescription: floorData.floorDescription,
      buildingId: floorData.buildingId,
      createdBy: userId,
    };
    try {
      const { data } = await axios.post(AppURL.floorInfoApi, submitFloorData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (data?.status === 201) {
        toast.success(data?.message);
        fetchFloorData(token);
        getBuildingsFunc(token);
        setFloorData((prev) => ({
          ...prev,
          floorName: "",
          floorDescription: "",
          buildingId: null,
          isUpdated: false,
          isDeleted: false,
          floorNameErrorMsg: "",
          floorDescriptionErrorMsg: "",
          buildingIdErrorMsg: "",
        }));
      }
    } catch (error: any) {
      toast.error("Failed to submit floor data !");
      console.log("Error submitting floor data: ", error.message);
    }
  };
  const updateFunc = async (floorData: any, token: string, userId: any) => {
    if (!validateForm()) return;

    const updateFloorData = await {
      floorName: floorData.floorName,
      floorDescription: floorData.floorDescription,
      buildingId: floorData.buildingId,
      updatedBy: userId,
    };

    await axios
      .put(`${AppURL.floorInfoApi}/${floorData.floorId}`, updateFloorData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        if (data?.status === 200) {
          toast.success("Successfully updated floor data !");
          fetchFloorData(token);
          getBuildingsFunc(token);
          setFloorData((prev) => ({
            ...prev,
            floorName: "",
            floorDescription: "",
            buildingId: null,
            isUpdated: false,
            isDeleted: false,
            floorNameErrorMsg: "",
            floorDescriptionErrorMsg: "",
            buildingIdErrorMsg: "",
          }));
        }
      })
      .catch((error: any) => {
        toast.error("Failed to update floor data !");
      });
  };
  const closeToUpdateFunc = async () => {
    await setFloorData((prev) => ({
      ...prev,
      floorName: "",
      floorDescription: "",
      buildingId: null,
      isUpdated: false,
      isDeleted: false,
      floorNameErrorMsg: "",
      floorDescriptionErrorMsg: "",
      buildingIdErrorMsg: "",
    }));
    await getBuildingsFunc(decodeToken?.token);
  };

  const deleteFunc = async () => {
    const deleteData = await {
      inactiveBy: decodeToken?.userId,
    };
    if (floorData?.floorId && decodeToken?.userId) {
      try {
        const response: any = await fetch(
          `${AppURL.floorInfoApi}/${floorData.floorId}`,
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
          toast.success("Floor deleted successfully !");
          setFloorData((prev) => ({
            ...prev,
            floorId: null,
            isDeleted: false,
          }));
          fetchFloorData(decodeToken?.token);
        } else {
          toast.error("Error deleting floor !");
        }
      } catch (error: any) {
        toast.error("Failed to delete. Please try again !");
        console.log("Error deleting floor: ", error.message);
      }
    }
  };
  const handleCancel = () => {
    setFloorData((prev) => ({
      ...prev,
      floorId: null,
      isDeleted: false,
    }));
  };

  const isRequiredFloor =
    floorData?.floorName.trim() &&
    floorData?.floorDescription.trim() &&
    floorData?.buildingId;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex fixed min-h-screen justify-center bg-gradient-to-b from-primary to-primary90">
        <div className="flex w-screen h-full ">
          <div
            className={`w-[30%] h-80p bg-white p-4 m-4 rounded-lg shadow-lg`}
          >
            <VerticalSingleInput
              label="Floor Name"
              type="text"
              name="floorName"
              placeholder="Enter floor Name..."
              // @ts-ignore
              value={floorData?.floorName}
              onChange={(e: any) =>
                setFloorData((prev) => ({
                  ...prev,
                  floorName: e.target.value,
                  floorNameErrorMsg: "",
                }))
              }
              errorMsg={floorData.floorNameErrorMsg}
              required
            />
            <div className="my-3">
              <VerticalSingleInput
                label="Floor Description"
                type="text"
                name="floorDescription"
                placeholder="Enter Floor Description..."
                // @ts-ignore
                value={floorData?.floorDescription}
                onChange={(e: any) =>
                  setFloorData((prev) => ({
                    ...prev,
                    floorDescription: e.target.value,
                    floorDescriptionErrorMsg: "",
                  }))
                }
                errorMsg={floorData.floorDescriptionErrorMsg}
                required
              />
            </div>
            <div className="my-3">
              <label className=" text-black text-sm font-workSans mb-1 ">
                Select Buildings
              </label>
              <SearchableDropdown
                options={buildingProps}
                isDisable={false}
                placeholder="Select Buildiings..."
                defaultValue={buildingProps.find(
                  (option: any) =>
                    // @ts-ignore
                    option.value === parseInt(floorData?.buildingId)
                )}
                onSelect={(value: string, label: string) => {
                  setFloorData((prevItem: any) => ({
                    ...prevItem,
                    buildingId: value,
                  }));
                }}
              />
            </div>

            <div className="flex justify-center items-center mt-4">
              {!floorData?.isUpdated ? (
                <button
                  className="flex bg-primary70 items-center font-workSans text-md py-2 px-4 rounded-lg text-black hover:bg-primary50 hover:text-white"
                  onClick={() => {
                    isRequiredFloor && decodeToken?.userId
                      ? onSubmitFunc(
                          floorData,
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
                  Submit Floor
                </button>
              ) : (
                <div className="flex justify-center items-center space-x-4">
                  <button
                    className="flex items-center bg-primary70 font-workSans text-md py-2 px-4 rounded-lg text-black hover:bg-primary50 hover:text-white"
                    onClick={async () => {
                      await (isRequiredFloor && decodeToken?.userId
                        ? updateFunc(
                            floorData,
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
                    Update Floor
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
          {floorData?.data && floorData?.data?.length > 0 && (
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
                    Building Name
                  </p>
                </div>
                <div className="flex  w-1/5  justify-center items-center">
                  <p className="text-md font-workSans font-medium text-center">
                    Actions
                  </p>
                </div>
              </div>

              {floorData?.data?.map((floor: any, floorIndex: number) => {
                const isLastFloor = floorIndex === floorData?.data.length - 1;
                return (
                  <div
                    key={floorIndex}
                    className={`flex w-full items-center ${
                      !isLastFloor ? "border-b-2" : "border-b-0"
                    } border-slate-300 py-2 px-2  bg-slate-100`}
                  >
                    <div className="flex w-1/12 items-center  justify-center border-slate-300 border-r-2">
                      <p className="text-md font-workSans text-center">
                        {floor?.floorId}
                      </p>
                    </div>
                    <div className=" flex  w-1/5 items-center justify-center border-slate-300 border-r-2">
                      <p className="text-md font-workSans text-center break-words max-w-full">
                        {floor?.floorName}
                      </p>
                    </div>
                    <div className="flex w-1/3 items-center justify-center border-slate-300 border-r-2">
                      <p className="text-md font-workSans text-center break-words max-w-full">
                        {floor?.floorDescription}
                      </p>
                    </div>
                    <div className="flex  w-1/5  justify-center items-center border-slate-300 border-r-2">
                      <p className="text-md font-workSans text-center break-words max-w-full">
                        {floor?.buildingName}
                      </p>
                    </div>
                    <div className="flex  w-1/5  justify-center items-center">
                      <div className="relative group mr-3">
                        <button
                          onClick={async () => {
                            await setFloorData((prev) => ({
                              ...prev,
                              floorId: floor?.floorId,
                              floorName: floor?.floorName,
                              floorDescription: floor?.floorDescription,
                              buildingId: floor?.buildingId,
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
                            await setFloorData((prev) => ({
                              ...prev,
                              floorId: floor?.floorId,
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
        <DeleteModal
          title="Do you want to delete ?"
          description="You're going to delete this floor ."
          onConfirm={deleteFunc}
          onCancel={handleCancel}
          isVisible={floorData?.isDeleted}
        />
      </div>
    </Suspense>
  );
};

export default FloorManagement;
