"use client";

import React, { FC, Suspense, useEffect, useState } from "react";
import { MdDeleteOutline, MdOutlineFileUpload } from "react-icons/md";
import { FaEdit, FaRegWindowClose } from "react-icons/fa";
import { COLORS } from "@/app/_utils/COLORS";
import toast from "react-hot-toast";
import { tokenInterface } from "@/interface/admin/decodeToken/tokenInterface";
import retrieveToken from "@/app/_utils/handler/retrieveToken";
import jwtDecode from "jsonwebtoken";
import ReusableFeaturesCard from "@/app/_components/card/RoomFeaturesCard";
import axios from "axios";
import AppURL from "@/app/_restApi/AppURL";
import { useWindowSize } from "@/app/_utils/handler/useWindowSize";
import DeleteModal from "@/app/_components/modal/DeletedModal";
import { useAppContext } from "@/app/_stateManagements/contextApi";

interface Props {}

const RoomGoodsEntriesPage: FC<Props> = (props) => {
  const { getDrawerStatus } = useAppContext();
  const [decodeToken, setDecodeToken] = useState<tokenInterface>({
    userId: "",
    name: "",
    email: "",
    token: "",
    expireDate: null,
  });
  const [commonFeatures, setCommonFeatures] = useState({
    data: [],
    featuresId: null,
    featuresName: "",
    featureRemarks: "",
    featuresNameErrorMsg: "",
    featureRemarksErrorMsg: "",
    isUpdated: false,
    isDeleted: false,
  });
  const [availableFurnitures, setAvailableFurnitures] = useState({
    data: [],
    furnitureId: null,
    furnitureName: "",
    furnitureRemarks: "",
    furnitureNameErrorMsg: "",
    furnitureRemarksErrorMsg: "",
    isUpdated: false,
    isDeleted: false,
  });
  const [bedSpecifications, setBedSpecifications] = useState({
    data: [],
    bedId: null,
    bedName: "",
    bedRemarks: "",
    bedNameErrorMsg: "",
    bedRemarksErrorMsg: "",
    isUpdated: false,
    isDeleted: false,
  });
  const [bathroomSpecifications, setBathroomSpecifications] = useState({
    data: [],
    bathroomId: null,
    bathroomName: "",
    bathroomRemarks: "",
    bathroomNameErrorMsg: "",
    bathroomRemarksErrorMsg: "",
    isUpdated: false,
    isDeleted: false,
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
      fetchCommonFeaturesData(decodeToken?.token);
      // fetchFloorData(decodeToken?.token);
      // getMenuDataFunc(decodeToken?.token, decodeToken?.userId);
    }
  }, [decodeToken?.token, decodeToken?.userId]);

  const validateCFForm = () => {
    let isValid = true;
    const errors: Partial<typeof commonFeatures> = {};

    if (!commonFeatures.featuresName.trim()) {
      isValid = false;
      errors.featuresNameErrorMsg = "Name is required.";
    }
    if (!commonFeatures.featureRemarks.trim()) {
      isValid = false;
      errors.featureRemarksErrorMsg = "Remarks is required.";
    }

    setCommonFeatures((prev) => ({ ...prev, ...errors }));
    return isValid;
  };
  const validateAFForm = () => {
    let isValid = true;
    const errors: Partial<typeof availableFurnitures> = {};

    if (!availableFurnitures.furnitureName.trim()) {
      isValid = false;
      errors.furnitureNameErrorMsg = "Furniture name is required.";
    }
    if (!availableFurnitures.furnitureRemarks.trim()) {
      isValid = false;
      errors.furnitureRemarksErrorMsg = "Furniture remarks is required.";
    }

    setAvailableFurnitures((prev) => ({ ...prev, ...errors }));
    return isValid;
  };

  const validateBedForm = () => {
    let isValid = true;
    const errors: Partial<typeof bedSpecifications> = {};

    if (!bedSpecifications.bedName.trim()) {
      isValid = false;
      errors.bedNameErrorMsg = "Bed name is required.";
    }
    if (!bedSpecifications.bedRemarks.trim()) {
      isValid = false;
      errors.bedRemarksErrorMsg = "Bed remarks is required.";
    }

    setBedSpecifications((prev) => ({ ...prev, ...errors }));
    return isValid;
  };

  const validateBathroomForm = () => {
    let isValid = true;
    const errors: Partial<typeof bathroomSpecifications> = {};

    if (!bathroomSpecifications.bathroomName.trim()) {
      isValid = false;
      errors.bathroomNameErrorMsg = "Bathroom name is required.";
    }
    if (!bathroomSpecifications.bathroomRemarks.trim()) {
      isValid = false;
      errors.bathroomRemarksErrorMsg = "Bathroom remarks is required.";
    }

    setBathroomSpecifications((prev) => ({ ...prev, ...errors }));
    return isValid;
  };

  const fetchCommonFeaturesData = async (token: string) => {
    try {
      const { data } = await axios.get(AppURL.roomCommonFeature, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (data?.status === 200) {
        setCommonFeatures((prev) => ({ ...prev, data: data?.data }));
      }
    } catch (error: any) {
      console.log("Error fetching floor data: ", error.message);
    }
  };

  const onSubmitCFFunc = async (data: any, token: string, userId: string) => {
    if (!validateCFForm()) return;
    const submittedData = await {
      name: data.featuresName,
      remarks: data.featureRemarks,
      createdBy: userId,
    };

    try {
      const { data } = await axios.post(
        AppURL.roomCommonFeature,
        submittedData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data?.status === 201) {
        toast.success("Common features added successfully !");
        fetchCommonFeaturesData(token);

        setCommonFeatures((prev) => ({
          ...prev,
          featuresId: null,
          featuresName: "",
          featureRemarks: "",
          featuresNameErrorMsg: "",
          featureRemarksErrorMsg: "",
        }));
      }
    } catch (error: any) {
      console.log("Error adding common features: ", error?.message);
    }
  };
  const updateCFFunc = async (
    updatedData: any,
    token: string,
    userId: string
  ) => {
    if (!validateCFForm()) return;
    const submittedUpdatedData = await {
      name: updatedData.featuresName,
      remarks: updatedData.featureRemarks,
      updatedBy: userId,
    };

    try {
      const { data } = await axios.put(
        `${AppURL.roomCommonFeature}/${updatedData.featuresId}`,
        submittedUpdatedData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data?.status === 200) {
        toast.success("Common features updated successfully !");
        fetchCommonFeaturesData(token);

        setCommonFeatures((prev) => ({
          ...prev,
          featuresId: null,
          featuresName: "",
          featureRemarks: "",
          featuresNameErrorMsg: "",
          featureRemarksErrorMsg: "",
          isUpdated: false,
          isDeleted: false,
        }));
      }
    } catch (error: any) {
      console.log("Error updating common features: ", error?.message);
    }
  };
  const closeToUpdateCFFunc = () => {
    setCommonFeatures((prev) => ({
      ...prev,
      featuresId: null,
      featuresName: "",
      featureRemarks: "",
      featuresNameErrorMsg: "",
      featureRemarksErrorMsg: "",
      isUpdated: false,
    }));
  };

  // Available Furnitures Functionalities
  const onSubmitAFFunc = async (
    furniture: any,
    token: string,
    userId: string
  ) => {
    if (!validateAFForm()) return;
  };
  const updateAFFunc = async (
    furniture: any,
    token: string,
    userId: string
  ) => {};
  const closeToUpdateAFFunc = () => {};
  const afHandleChange = (field: string, value: string) => {};

  // Bed Specifications Functionalities
  const onSubmitBedFunc = async (bed: any, token: string, userId: string) => {
    if (!validateBedForm()) return;
  };
  const updateBedFunc = async (bed: any, token: string, userId: string) => {};
  const closeToUpdateBedFunc = () => {};
  const bedHandleChange = (field: string, value: string) => {};

  // Bathroom Specifications Functionalities
  const onSubmitBroomFunc = async (
    bathroom: any,
    token: string,
    userId: string
  ) => {
    if (!validateBathroomForm()) return;
  };
  const updateBroomFunc = async (
    bathroom: any,
    token: string,
    userId: string
  ) => {};
  const closeToUpdateBroomFunc = () => {};
  const bathroomHandleChange = (field: string, value: string) => {};

  // const isRequiredCommonFeatures = true;
  // const isRequiredAvailableFurniture = false;
  // const isRequiredBedSpecifications = false;
  // const isRequiredBathroomSpecifications = false;

  const size = useWindowSize();
  const windowWidth: any = size && size?.width;

  const cfDeleteFunc = async () => {
    const deleteData = await {
      inactiveBy: decodeToken?.userId,
    };

    try {
      const deleteRes: any = await fetch(
        `${AppURL.roomCommonFeature}/${commonFeatures?.featuresId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${decodeToken?.token}`,
          },
          body: JSON.stringify(deleteData),
        }
      );

      if (deleteRes.status === 200) {
        toast.success("Common features deleted successfully !");
        fetchCommonFeaturesData(decodeToken?.token);
        setCommonFeatures((prev) => ({
          ...prev,
          commonFeatureId: null,
          isDeleted: false,
        }));
      }
    } catch (error: any) {
      console.log("Error deleting common features: ", error?.message);
      toast.error("Failed to delete. Please try again ! ");
    }
  };
  const afDeleteFunc = () => {};
  const bedDeleteFunc = () => {};
  const bathroomDeleteFunc = () => {};
  const notDeleteFunc = () => {
    toast.error("Nothing to delete !");
  };

  const isDeleteModalVisible = commonFeatures?.isDeleted
    ? commonFeatures?.isDeleted
    : availableFurnitures?.isDeleted
    ? availableFurnitures?.isDeleted
    : bedSpecifications?.isDeleted
    ? bedSpecifications?.isDeleted
    : bathroomSpecifications?.isDeleted
    ? bathroomSpecifications?.isDeleted
    : false;
  const deleteFunc = commonFeatures?.isDeleted
    ? cfDeleteFunc
    : availableFurnitures?.isDeleted
    ? afDeleteFunc
    : bedSpecifications?.isDeleted
    ? bedDeleteFunc
    : bathroomSpecifications?.isDeleted
    ? bathroomDeleteFunc
    : notDeleteFunc;
  const deleteMsg = commonFeatures?.isDeleted
    ? "You're going to delete this common features ."
    : availableFurnitures?.isDeleted
    ? "You're going to delete this available furnitures ."
    : bedSpecifications?.isDeleted
    ? "You're going to delete this bed ."
    : bathroomSpecifications?.isDeleted
    ? "You're going to delete this bathroom ."
    : "Nothing to delete !";

  const handleCancelToDelete = () => {
    setCommonFeatures((prev) => ({
      ...prev,
      commonFeatureId: null,
      isDeleted: false,
    }));
    setAvailableFurnitures((prev) => ({
      ...prev,
      availableFurnitureId: null,
      isDeleted: false,
    }));
    setBedSpecifications((prev) => ({
      ...prev,
      bedId: null,
      isDeleted: false,
    }));
    setBathroomSpecifications((prev) => ({
      ...prev,
      bathroomId: null,
      isDeleted: false,
    }));
  };

  const currentWidth = getDrawerStatus
    ? windowWidth >= 1750
      ? "w-[100%]"
      : windowWidth >= 1450 && windowWidth <= 1749
      ? "w-[95%]"
      : "w-[95%]"
    : windowWidth >= 1500
    ? "w-[100%]"
    : "w-[95%]";
  // const currentWidth = getDrawerStatus
  //   ? windowWidth >= 1750
  //     ? "w-[100%]"
  //     : windowWidth >= 1450 && windowWidth <= 1749
  //     ? "w-[95%]"
  //     : "w-[90%]"
  //   : windowWidth >= 1500
  //   ? "w-[100%]"
  //   : "w-[95%]";

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div
        className={` w-screen h-screen items-center ${
          getDrawerStatus ? "pl-[265]" : "pl-0"
        } overflow-auto h-screen pb-20`}
      >
        <div
          className={`${currentWidth} h-[95%] flex flex-col   overflow-y-auto max-h-screen`}
        >
          <div className="flex w-full max-h-[280]">
            <div className="w-1/4">
              <ReusableFeaturesCard
                title="Common Features"
                nameLabel="Name"
                nameType="text"
                nameDefinedBy="commonName"
                namePlaceholder="Enter common name..."
                remarksLabel="Remarks"
                remarksType="text"
                remarksDefinedBy="commonRemarks"
                remarksPlaceholder="Enter common remarks..."
                // featuresData={commonFeatures}
                nameValue={commonFeatures.featuresName}
                nameErrorMsg={commonFeatures.featuresNameErrorMsg}
                remarksValue={commonFeatures.featureRemarks}
                remarksErrorMsg={commonFeatures.featureRemarksErrorMsg}
                // onChange={cfHandleChange}
                nameOnChange={(e: any) =>
                  setCommonFeatures((prev) => ({
                    ...prev,
                    featuresName: e.target.value,
                  }))
                }
                remarksOnChange={(e: any) =>
                  setCommonFeatures((prev) => ({
                    ...prev,
                    featureRemarks: e.target.value,
                  }))
                }
                onSubmit={() => {
                  !commonFeatures.isUpdated
                    ? onSubmitCFFunc(
                        commonFeatures,
                        decodeToken?.token,
                        decodeToken?.userId
                      )
                    : updateCFFunc(
                        commonFeatures,
                        decodeToken?.token,
                        decodeToken?.userId
                      );
                }}
                onCancel={closeToUpdateCFFunc}
                isUpdated={commonFeatures.isUpdated}
                // isFormValid={isRequiredCommonFeatures}
              />
            </div>
            <div className="w-1/4 mx-3">
              <ReusableFeaturesCard
                title="Available Furnitures"
                nameLabel="Name"
                nameType="text"
                nameDefinedBy="furnitureName"
                namePlaceholder="Enter Furnitures name..."
                remarksLabel="Remarks"
                remarksType="text"
                remarksDefinedBy="furnitureRemarks"
                remarksPlaceholder="Enter furniture remarks..."
                nameValue={availableFurnitures.furnitureName}
                nameErrorMsg={availableFurnitures.furnitureNameErrorMsg}
                remarksValue={availableFurnitures.furnitureRemarks}
                remarksErrorMsg={availableFurnitures.furnitureRemarksErrorMsg}
                onChange={afHandleChange}
                onSubmit={() => {
                  onSubmitAFFunc(
                    availableFurnitures,
                    decodeToken?.token,
                    decodeToken?.userId
                  );
                }}
                onCancel={closeToUpdateAFFunc}
                isUpdated={availableFurnitures.isUpdated}
                // isFormValid={isRequiredAvailableFurniture}
              />
            </div>
            <div className="w-1/4">
              <ReusableFeaturesCard
                title="Bed Specifications"
                nameLabel="Name"
                nameType="text"
                nameDefinedBy="bedName"
                namePlaceholder="Enter bed name..."
                remarksLabel="Remarks"
                remarksType="text"
                remarksDefinedBy="bedRemarks"
                remarksPlaceholder="Enter bed remarks..."
                nameValue={bedSpecifications.bedName}
                nameErrorMsg={bedSpecifications.bedNameErrorMsg}
                remarksValue={bedSpecifications.bedRemarks}
                remarksErrorMsg={bedSpecifications.bedRemarksErrorMsg}
                onChange={bedHandleChange}
                onSubmit={() => {
                  onSubmitBedFunc(
                    bedSpecifications,
                    decodeToken?.token,
                    decodeToken?.userId
                  );
                }}
                onCancel={closeToUpdateBedFunc}
                isUpdated={bedSpecifications.isUpdated}
                // isFormValid={isRequiredBedSpecifications}
              />
            </div>
            <div className="w-1/5 mx-3">
              <ReusableFeaturesCard
                title="Bathroom Specifications"
                nameLabel="Name"
                nameType="text"
                nameDefinedBy="bathroomName"
                namePlaceholder="Enter bathroom name..."
                remarksLabel="Remarks"
                remarksType="text"
                remarksDefinedBy="bathroomRemarks"
                remarksPlaceholder="Enter bathroom remarks..."
                nameValue={bathroomSpecifications.bathroomName}
                nameErrorMsg={bathroomSpecifications.bathroomNameErrorMsg}
                remarksValue={bathroomSpecifications.bathroomRemarks}
                remarksErrorMsg={bathroomSpecifications.bathroomRemarksErrorMsg}
                onChange={bathroomHandleChange}
                onSubmit={() => {
                  onSubmitBroomFunc(
                    bathroomSpecifications,
                    decodeToken?.token,
                    decodeToken?.userId
                  );
                }}
                onCancel={closeToUpdateBroomFunc}
                isUpdated={bathroomSpecifications.isUpdated}
                // isFormValid={isRequiredBathroomSpecifications}
              />
            </div>
          </div>
          <div className="flex w-full">
            <div className="w-1/4">
              {commonFeatures?.data && commonFeatures?.data?.length > 0 && (
                <div
                  className={`w-[100%] h-75p bg-white p-4 my-4 mx-3 rounded-lg shadow-lg`}
                >
                  <p className=" font-workSans text-center mb-2 text-lg font-semibold truncate">
                    Room Common features
                  </p>
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
                    <div className="flex w-1/2 items-center justify-center border-slate-50 border-r-2">
                      <p className="text-md font-workSans font-medium text-center">
                        Remarks
                      </p>
                    </div>

                    <div className="flex  w-1/5  justify-end items-center ">
                      <p className="text-md font-workSans font-medium text-center">
                        Actions
                      </p>
                    </div>
                  </div>

                  {commonFeatures?.data?.map(
                    (features: any, featureIndex: number) => {
                      const isLastFeatures =
                        featureIndex === commonFeatures?.data.length - 1;
                      return (
                        <div
                          key={featureIndex}
                          className={`flex w-full items-center ${
                            !isLastFeatures ? "border-b-2" : "border-b-0"
                          } border-slate-300 py-2 px-2  bg-slate-100`}
                        >
                          <div className="flex w-1/12 items-center  justify-center border-slate-300 border-r-2">
                            <p className="text-sm font-workSans text-center">
                              {features?.commonFeatureId}
                            </p>
                          </div>
                          <div className=" flex  w-1/5 items-center justify-center border-slate-300 border-r-2">
                            <p className="text-sm font-workSans text-center break-words max-w-full ">
                              {features?.name}
                            </p>
                          </div>
                          <div className="flex w-1/2 items-center justify-center border-slate-300 border-r-2 px-2">
                            <p className="text-sm font-workSans text-center  max-w-full truncate">
                              {features?.remarks}
                            </p>
                          </div>

                          <div className="flex  w-1/5  justify-end items-center">
                            <div className="relative group mr-3 ">
                              <button
                                onClick={async () => {
                                  await setCommonFeatures((prev) => ({
                                    ...prev,
                                    featuresId: features?.commonFeatureId,
                                    featuresName: features?.name,
                                    featureRemarks: features?.remarks,
                                    isUpdated: true,
                                  }));
                                }}
                              >
                                <FaEdit
                                  color={COLORS.primary80}
                                  size={25}
                                  className="cursor-pointer  shadow-xl shadow-white"
                                />
                              </button>

                              <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full  px-2 py-1 text-xs text-black  opacity-0 transition-opacity duration-500 group-hover:opacity-100 whitespace-nowrap font-workSans">
                                Update Common features
                              </span>
                            </div>

                            <div className="relative group ">
                              <button
                                onClick={async () => {
                                  await setCommonFeatures((prev) => ({
                                    ...prev,
                                    featuresId: features?.commonFeatureId,
                                    isDeleted: true,
                                  }));
                                }}
                              >
                                <MdDeleteOutline
                                  color={COLORS.errorColor}
                                  size={28}
                                  className="cursor-pointer  shadow-xl shadow-white"
                                />
                              </button>

                              <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full  px-2 py-1 text-xs text-black  opacity-0 transition-opacity duration-500 group-hover:opacity-100 whitespace-nowrap font-workSans">
                                Delete Feature
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              )}
            </div>
            <div className="w-1/4 mx-3">
              {
                <div
                  className={`w-[100%] h-75p bg-white p-4 my-4 mx-3 rounded-lg shadow-lg`}
                >
                  <p className=" font-workSans text-center mb-2 text-lg font-semibold truncate">
                    Available Furnitures
                  </p>
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
                    <div className="flex w-1/2 items-center justify-center border-slate-50 border-r-2">
                      <p className="text-md font-workSans font-medium text-center">
                        Remarks
                      </p>
                    </div>

                    <div className="flex  w-1/5  justify-end items-center">
                      <p className="text-md font-workSans font-medium text-center">
                        Actions
                      </p>
                    </div>
                  </div>

                  {availableFurnitures?.data &&
                  availableFurnitures?.data?.length > 0 ? (
                    availableFurnitures?.data?.map(
                      (furniture: any, furnitureIndex: number) => {
                        const isLastFurniture =
                          furnitureIndex ===
                          availableFurnitures?.data.length - 1;
                        return (
                          <div
                            key={furnitureIndex}
                            className={`flex w-full items-center ${
                              !isLastFurniture ? "border-b-2" : "border-b-0"
                            } border-slate-300 py-2 px-2  bg-slate-100`}
                          >
                            <div className="flex w-1/12 items-center  justify-center border-slate-300 border-r-2">
                              <p className="text-sm font-workSans text-center">
                                {furniture?.furnitureId}
                              </p>
                            </div>
                            <div className=" flex  w-1/5 items-center justify-center border-slate-300 border-r-2">
                              <p className="text-sm font-workSans text-center break-words max-w-full">
                                {furniture?.name}
                              </p>
                            </div>
                            <div className="flex w-1/2 items-center justify-center border-slate-300 border-r-2">
                              <p className="text-sm font-workSans text-center  max-w-full">
                                {furniture?.remarks}
                              </p>
                            </div>

                            <div className="flex  w-1/5  justify-end items-center">
                              <div className="relative group mr-3 ">
                                <button
                                  onClick={async () => {
                                    await setAvailableFurnitures((prev) => ({
                                      ...prev,
                                      furnitureId: furniture?.furnitureId,
                                      furnitureName: furniture?.name,
                                      furnitureRemarks: furniture?.remarks,
                                      isUpdated: true,
                                    }));
                                  }}
                                >
                                  <FaEdit
                                    color={COLORS.primary80}
                                    size={25}
                                    className="cursor-pointer  shadow-xl shadow-white"
                                  />
                                </button>

                                <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full  px-2 py-1 text-xs text-black  opacity-0 transition-opacity duration-500 group-hover:opacity-100 whitespace-nowrap font-workSans">
                                  Update Furniture
                                </span>
                              </div>

                              <div className="relative group ">
                                <button
                                  onClick={async () => {
                                    await setAvailableFurnitures((prev) => ({
                                      ...prev,
                                      furnitureId: furniture?.furnitureId,
                                      isDeleted: true,
                                    }));
                                  }}
                                >
                                  <MdDeleteOutline
                                    color={COLORS.errorColor}
                                    size={28}
                                    className="cursor-pointer  shadow-xl shadow-white"
                                  />
                                </button>

                                <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full  px-2 py-1 text-xs text-black  opacity-0 transition-opacity duration-500 group-hover:opacity-100 whitespace-nowrap font-workSans">
                                  Delete Furniture
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    )
                  ) : (
                    <div>
                      <h3 className="text-center font-workSans text-md mt-4 text-red-500">
                        Data not found !
                      </h3>
                    </div>
                  )}
                </div>
              }
            </div>

            <div className="w-1/4 ">
              {
                <div
                  className={`w-[100%] h-75p bg-white p-4 my-4 mx-3 rounded-lg shadow-lg`}
                >
                  <p className=" font-workSans text-center mb-2 text-lg font-semibold truncate">
                    Bed Specifications
                  </p>
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
                    <div className="flex w-1/2 items-center justify-center border-slate-50 border-r-2">
                      <p className="text-md font-workSans font-medium text-center">
                        Remarks
                      </p>
                    </div>

                    <div className="flex  w-1/5  justify-end items-center">
                      <p className="text-md font-workSans font-medium text-center">
                        Actions
                      </p>
                    </div>
                  </div>

                  {bedSpecifications?.data &&
                  bedSpecifications?.data?.length > 0 ? (
                    bedSpecifications?.data?.map(
                      (bed: any, bedIndex: number) => {
                        const isLastBed =
                          bedIndex === bedSpecifications?.data.length - 1;
                        return (
                          <div
                            key={bedIndex}
                            className={`flex w-full items-center ${
                              !isLastBed ? "border-b-2" : "border-b-0"
                            } border-slate-300 py-2 px-2  bg-slate-100`}
                          >
                            <div className="flex w-1/12 items-center  justify-center border-slate-300 border-r-2">
                              <p className="text-sm font-workSans text-center">
                                {bed?.bedId}
                              </p>
                            </div>
                            <div className=" flex  w-1/5 items-center justify-center border-slate-300 border-r-2">
                              <p className="text-sm font-workSans text-center break-words max-w-full">
                                {bed?.name}
                              </p>
                            </div>
                            <div className="flex w-1/2 items-center justify-center border-slate-300 border-r-2">
                              <p className="text-sm font-workSans text-center  max-w-full">
                                {bed?.remarks}
                              </p>
                            </div>

                            <div className="flex  w-1/5  justify-end items-center">
                              <div className="relative group mr-3 ">
                                <button
                                  onClick={async () => {
                                    await setBedSpecifications((prev) => ({
                                      ...prev,
                                      bedId: bed?.bedId,
                                      bedName: bed?.name,
                                      bedRemarks: bed?.remarks,
                                      isUpdated: true,
                                    }));
                                  }}
                                >
                                  <FaEdit
                                    color={COLORS.primary80}
                                    size={25}
                                    className="cursor-pointer  shadow-xl shadow-white"
                                  />
                                </button>

                                <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full  px-2 py-1 text-xs text-black  opacity-0 transition-opacity duration-500 group-hover:opacity-100 whitespace-nowrap font-workSans">
                                  Update Bed
                                </span>
                              </div>

                              <div className="relative group ">
                                <button
                                  onClick={async () => {
                                    await setBedSpecifications((prev) => ({
                                      ...prev,
                                      bedId: bed?.bedId,
                                      isDeleted: true,
                                    }));
                                  }}
                                >
                                  <MdDeleteOutline
                                    color={COLORS.errorColor}
                                    size={28}
                                    className="cursor-pointer  shadow-xl shadow-white"
                                  />
                                </button>

                                <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full  px-2 py-1 text-xs text-black  opacity-0 transition-opacity duration-500 group-hover:opacity-100 whitespace-nowrap font-workSans">
                                  Delete Bed
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    )
                  ) : (
                    <div>
                      <h3 className="text-center font-workSans text-md mt-4 text-red-500">
                        Data not found !
                      </h3>
                    </div>
                  )}
                </div>
              }
            </div>

            <div className="w-1/5 mx-3">
              {
                <div
                  className={`w-[100%] h-75p bg-white p-4 my-4 mx-3 rounded-lg shadow-lg`}
                >
                  <p className=" font-workSans text-center mb-2 text-lg font-semibold truncate">
                    Bathroom Specifications
                  </p>
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
                    <div className="flex w-1/2 items-center justify-center border-slate-50 border-r-2">
                      <p className="text-md font-workSans font-medium text-center">
                        Remarks
                      </p>
                    </div>

                    <div className="flex  w-1/5  justify-end items-center">
                      <p className="text-md font-workSans font-medium text-center">
                        Actions
                      </p>
                    </div>
                  </div>

                  {availableFurnitures?.data &&
                  availableFurnitures?.data?.length > 0 ? (
                    availableFurnitures?.data?.map(
                      (furniture: any, furnitureIndex: number) => {
                        const isLastFurniture =
                          furnitureIndex ===
                          availableFurnitures?.data.length - 1;
                        return (
                          <div
                            key={furnitureIndex}
                            className={`flex w-full items-center ${
                              !isLastFurniture ? "border-b-2" : "border-b-0"
                            } border-slate-300 py-2 px-2  bg-slate-100`}
                          >
                            <div className="flex w-1/12 items-center  justify-center border-slate-300 border-r-2">
                              <p className="text-sm font-workSans text-center">
                                {furniture?.furnitureId}
                              </p>
                            </div>
                            <div className=" flex  w-1/5 items-center justify-center border-slate-300 border-r-2">
                              <p className="text-sm font-workSans text-center break-words max-w-full">
                                {furniture?.name}
                              </p>
                            </div>
                            <div className="flex w-1/2 items-center justify-center border-slate-300 border-r-2">
                              <p className="text-sm font-workSans text-center  max-w-full">
                                {furniture?.remarks}
                              </p>
                            </div>

                            <div className="flex  w-1/5  justify-end items-center">
                              <div className="relative group mr-3 ">
                                <button
                                  onClick={async () => {
                                    await setAvailableFurnitures((prev) => ({
                                      ...prev,
                                      furnitureId: furniture?.furnitureId,
                                      furnitureName: furniture?.name,
                                      furnitureRemarks: furniture?.remarks,
                                      isUpdated: true,
                                    }));
                                  }}
                                >
                                  <FaEdit
                                    color={COLORS.primary80}
                                    size={25}
                                    className="cursor-pointer  shadow-xl shadow-white"
                                  />
                                </button>

                                <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full  px-2 py-1 text-xs text-black  opacity-0 transition-opacity duration-500 group-hover:opacity-100 whitespace-nowrap font-workSans">
                                  Update Furniture
                                </span>
                              </div>

                              <div className="relative group ">
                                <button
                                  onClick={async () => {
                                    await setAvailableFurnitures((prev) => ({
                                      ...prev,
                                      furnitureId: furniture?.furnitureId,
                                      isDeleted: true,
                                    }));
                                  }}
                                >
                                  <MdDeleteOutline
                                    color={COLORS.errorColor}
                                    size={28}
                                    className="cursor-pointer  shadow-xl shadow-white"
                                  />
                                </button>

                                <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full  px-2 py-1 text-xs text-black  opacity-0 transition-opacity duration-500 group-hover:opacity-100 whitespace-nowrap font-workSans">
                                  Delete Furniture
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    )
                  ) : (
                    <div>
                      <h3 className="text-center font-workSans text-md mt-4 text-red-500">
                        Data not found !
                      </h3>
                    </div>
                  )}
                </div>
              }
            </div>
          </div>
        </div>
        <DeleteModal
          title="Do you want to delete ?"
          description={deleteMsg}
          onConfirm={deleteFunc}
          onCancel={handleCancelToDelete}
          isVisible={isDeleteModalVisible}
        />
      </div>
    </Suspense>
  );
};

export default RoomGoodsEntriesPage;