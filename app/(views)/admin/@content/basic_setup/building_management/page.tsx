"use client";
import VerticalSingleInput from "@/app/_components/inputField/VerticalSingleInput";
import retrieveToken from "@/app/_utils/handler/retrieveToken";
import React, { FC, Suspense, useEffect, useState } from "react";
import toast from "react-hot-toast";
import jwtDecode from "jsonwebtoken";
import { tokenInterface } from "@/interface/admin/decodeToken/tokenInterface";
import { useWindowSize } from "@/app/_utils/handler/useWindowSize";
import axios from "axios";
import AppURL from "@/app/_restApi/AppURL";
import { buildingsInterface } from "@/interface/admin/basicSetup/buildingsInterface";
import { MdDelete, MdDeleteOutline, MdOutlineFileUpload } from "react-icons/md";
import { FaEdit, FaRegWindowClose } from "react-icons/fa";
import { COLORS } from "@/app/_utils/COLORS";
import { isValidBDTelephone } from "@/app/_utils/handler/validateBDTelephone ";
import DeleteModal from "@/app/_components/modal/DeletedModal";
import { useAppContext } from "@/app/_stateManagements/contextApi";

interface Props {}

const BuildingManagements: FC<Props> = (props) => {
  const { getDrawerStatus } = useAppContext();
  const [fetchBuildings, setFetchBuildings] = useState<buildingsInterface[]>(
    []
  );

  const [buildingData, setBuildingData] = useState({
    buildingName: "",
    address: "",
    contactNo: "",
    isUpdated: false,
    isDeleted: false,
    buildingId: null,
    buildingNameErrorMsg: "",
    addressErrorMsg: "",
    contactNoErrorMsg: "",
  });

  const [decodeToken, setDecodeToken] = useState<tokenInterface>({
    userId: "",
    name: "",
    email: "",
    token: "",
    expireDate: null,
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
        setFetchBuildings(data?.data);
      } else {
        toast.error("Error fetching building data !");
      }
    } catch (error: any) {
      console.log("Error fetching building data: ", error.message);
    } finally {
      console.log("Fetching Building Data Completed !");
    }
  };

  const validateForm = () => {
    let isValid = true;
    const errors: Partial<typeof buildingData> = {};

    if (!buildingData.buildingName.trim()) {
      isValid = false;
      errors.buildingNameErrorMsg = "Building name is required.";
    }
    if (!buildingData.address.trim()) {
      isValid = false;
      errors.addressErrorMsg = "Building address is required.";
    }

    if (!buildingData.contactNo) {
      isValid = false;
      errors.contactNoErrorMsg = "Phone number is required.";
    }

    setBuildingData((prev) => ({ ...prev, ...errors }));
    return isValid;
  };

  const onSubmitFunc = async (data: any, token: string) => {
    if (!validateForm()) return;

    const submittedData = await {
      buildingName: data?.buildingName,
      buildingAddress: data?.address,
      contactNo: data?.contactNo,
      createdBy: decodeToken?.userId,
    };
    try {
      const { data: responseData } = await axios.post(
        AppURL.buildingInfoApi,
        submittedData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (responseData?.status === 201) {
        toast.success("Building added successfully !");
        setBuildingData((prev) => ({
          ...prev,
          buildingName: "",
          address: "",
          contactNo: "",
          isUpdated: false,
        }));
        getBuildingsFunc(token);
      } else {
        toast.error("Error adding building !");
      }
    } catch (error: any) {
      if (error?.status === 409) {
        toast.error("Building already exists !");
      } else {
        toast.error("Failed to add. Please try again !");
      }
      console.log("Error adding building: ", error.message);
    }
  };

  // console.log("fetchBuildings: ", JSON.stringify(fetchBuildings, null, 2));

  const updateFunc = async (buildingsData: any, token: string, userId: any) => {
    if (!validateForm()) return;

    const updatedData = {
      buildingName: buildingsData?.buildingName,
      buildingAddress: buildingsData?.address,
      contactNo: buildingsData?.contactNo,
      updatedBy: userId,
    };

    try {
      const { data: responseData } = await axios.put(
        `${AppURL.buildingInfoApi}/${buildingsData?.buildingId}`,
        updatedData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (responseData?.status === 200) {
        toast.success("Building updated successfully !");
        setBuildingData((prev) => ({
          ...prev,
          buildingName: "",
          address: "",
          contactNo: "",
          isUpdated: false,
        }));
        getBuildingsFunc(token);
      } else {
        toast.error("Error updating building !");
      }
    } catch (error: any) {
      toast.error("Failed to update. Please try again !");
      console.log("Error updating building: ", JSON.stringify(error, null, 2));
    }
  };
  const closeToUpdateFunc = () => {
    setBuildingData((prev) => ({
      ...prev,
      buildingName: "",
      address: "",
      contactNo: "",
      isUpdated: false,
    }));
  };

  const deleteFunc = async () => {
    const deleteData = await {
      inactiveBy: decodeToken?.userId,
    };
    if (buildingData?.buildingId && decodeToken?.userId) {
      try {
        const response: any = await fetch(
          `${AppURL.buildingInfoApi}/${buildingData?.buildingId}`,
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
          toast.success("Building deleted successfully !");
          setBuildingData((prev) => ({
            ...prev,
            buildingId: null,
            isDeleted: false,
          }));
          getBuildingsFunc(decodeToken?.token);
        } else {
          toast.error("Error deleting building !");
        }
      } catch (error: any) {
        toast.error("Failed to delete. Please try again !");
        console.log("Error deleting building: ", error.message);
      }
    }
  };
  const handleCancel = () => {
    setBuildingData((prev) => ({
      ...prev,
      buildingId: null,
      isDeleted: false,
    }));
  };

  const size = useWindowSize();
  const windowWidth: any = size && size?.width;
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div
        className={`flex ${
          getDrawerStatus ? "pl-[265px]" : "pl-0"
        }  max-h-screen justify-center overflow-auto pb-52`}
      >
        <div className="flex flex-col xl:flex-row w-full h-full ">
          <div
            className={`w-[97%] xl:w-[30%]  h-80p bg-white p-4 rounded-lg shadow-lg`}
          >
            <VerticalSingleInput
              label="Building Name"
              type="text"
              name="buildingName"
              placeholder="Enter Building Name..."
              // @ts-ignore
              value={buildingData?.buildingName}
              onChange={(e: any) =>
                setBuildingData((prev) => ({
                  ...prev,
                  buildingName: e.target.value,
                  buildingNameErrorMsg: "",
                }))
              }
              errorMsg={buildingData.buildingNameErrorMsg}
              required
            />
            <div className="my-3">
              <VerticalSingleInput
                label="Building Address"
                type="text"
                name="address"
                placeholder="Enter Building Address..."
                // @ts-ignore
                value={buildingData?.address}
                onChange={(e: any) =>
                  setBuildingData((prev) => ({
                    ...prev,
                    address: e.target.value,
                    addressErrorMsg: "",
                  }))
                }
                errorMsg={buildingData.addressErrorMsg}
                required
              />
            </div>
            <VerticalSingleInput
              label="Contact No"
              type="tel"
              name="contactNo"
              placeholder="Enter Contact No..."
              // @ts-ignore
              value={buildingData?.contactNo}
              onChange={async (e: any) => {
                await setBuildingData((prev) => ({
                  ...prev,
                  contactNo: e.target.value,
                }));
                if (isValidBDTelephone(e.target.value)) {
                  setBuildingData((prev) => ({
                    ...prev,
                    contactNoErrorMsg: "",
                  }));
                } else {
                  setBuildingData((prev) => ({
                    ...prev,
                    contactNoErrorMsg: "Invalid Phone Number",
                  }));
                }
              }}
              errorMsg={buildingData.contactNoErrorMsg}
              required
            />

            <div className="flex justify-center items-center mt-4">
              {!buildingData?.isUpdated ? (
                <button
                  className="flex items-center bg-primary70 font-workSans text-md py-2 px-8 rounded-lg text-black hover:bg-primary50 hover:text-white"
                  onClick={() => {
                    // buildingData &&
                    // decodeToken?.userId &&
                    // isValidBDTelephone(buildingData?.contactNo)
                    onSubmitFunc(buildingData, decodeToken?.token);
                    // : toast.error(
                    //     "Please complete all the required fields !"
                    //   );
                  }}
                >
                  <MdOutlineFileUpload
                    size={20}
                    className="cursor-pointer mr-2"
                  />
                  Add Building
                </button>
              ) : (
                <div className="flex justify-center items-center space-x-4">
                  <button
                    className=" flex items-center bg-primary70 font-workSans text-md py-2 px-4 rounded-lg text-black hover:bg-primary50 hover:text-white"
                    onClick={async () => {
                      await (buildingData &&
                      decodeToken?.userId &&
                      isValidBDTelephone(buildingData?.contactNo)
                        ? updateFunc(
                            buildingData,
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
                    Update Building
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
            className={`w-[97%] xl:w-[70%] h-80p bg-white p-4 xl:ml-3 mt-4 xl:mt-0 rounded-lg shadow-lg`}
          >
            <div className="flex w-full items-center border-2 border-slate-300 py-2 px-2 rounded-t-lg bg-slate-300">
              <div className="flex w-1/12 items-center  justify-center border-slate-50 border-r-2">
                <p className="text-black text-md font-workSans font-medium text-center ">
                  Id
                </p>
              </div>
              <div className=" flex  w-1/5 items-center justify-center border-slate-50 border-r-2">
                <p className="text-black text-md font-workSans font-medium text-center">
                  Name
                </p>
              </div>
              <div className="flex w-1/3 items-center justify-center border-slate-50 border-r-2">
                <p className="text-black text-md font-workSans font-medium text-center">
                  Address
                </p>
              </div>
              <div className="flex  w-1/5  justify-center items-center border-slate-50 border-r-2">
                <p className="text-black text-md font-workSans font-medium text-center">
                  Contact No
                </p>
              </div>
              <div className="flex  w-1/5  justify-center items-center">
                <p className="text-black text-md font-workSans font-medium text-center">
                  Actions
                </p>
              </div>
            </div>

            {fetchBuildings && fetchBuildings?.length > 0 ? (
              fetchBuildings?.map((building: any, buildingsIndex: number) => {
                const isLastBuilding =
                  buildingsIndex === fetchBuildings.length - 1;
                return (
                  <div
                    key={buildingsIndex}
                    className={`flex w-full items-center ${
                      !isLastBuilding ? "border-b-2" : "border-b-0"
                    } border-slate-300 py-2 px-2  bg-slate-100`}
                  >
                    <div className="flex w-1/12 items-center  justify-center border-slate-300 border-r-2">
                      <p className="text-black text-md font-workSans text-center">
                        {building?.buildingId}
                      </p>
                    </div>
                    <div className=" flex  w-1/5 items-center justify-center border-slate-300 border-r-2">
                      <p className="text-black text-md font-workSans text-center break-words max-w-full">
                        {building?.buildingName}
                      </p>
                    </div>
                    <div className="flex w-1/3 items-center justify-center border-slate-300 border-r-2">
                      <p className="text-black text-md font-workSans text-center break-words max-w-full">
                        {building?.buildingAddress}
                      </p>
                    </div>
                    <div className="flex  w-1/5  justify-center items-center border-slate-300 border-r-2">
                      <p className="text-black text-md font-workSans text-center break-words max-w-full">
                        {building?.contactNo}
                      </p>
                    </div>
                    <div className="flex  w-1/5  justify-center items-center">
                      <div className="relative group mr-3">
                        <button
                          onClick={async () => {
                            await setBuildingData((prev) => ({
                              ...prev,
                              buildingName: building?.buildingName,
                              address: building?.buildingAddress,
                              contactNo: building?.contactNo,
                              buildingId: building?.buildingId,
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
                          Update Buildings
                        </span>
                      </div>

                      <div className="relative group ">
                        <button
                          onClick={async () => {
                            await setBuildingData((prev) => ({
                              ...prev,
                              buildingId: building?.buildingId,
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
                          Delete Buildings
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div>
                <h3 className="text-center font-workSans text-md mt-4 text-red-500">
                  Buildings data not found !
                </h3>
              </div>
            )}
          </div>
        </div>

        <DeleteModal
          title="Do you want to delete ?"
          description="You're going to delete this buildings ."
          onConfirm={deleteFunc}
          onCancel={handleCancel}
          isVisible={buildingData?.isDeleted}
        />
      </div>
    </Suspense>
  );
};

export default BuildingManagements;
