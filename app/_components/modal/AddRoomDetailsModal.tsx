"use client";

import React, { useEffect, useState } from "react";
import ImgPicker from "../imgField/ImgPicker";
import retrieveToken from "@/app/_utils/handler/retrieveToken";
import jwtDecode from "jsonwebtoken";
import { tokenInterface } from "@/interface/admin/decodeToken/tokenInterface";
import AppURL from "@/app/_restApi/AppURL";
import axios from "axios";
import VertcialRadioBtn from "../radioBtn/VertcialRadioBtn";
import VerticalSingleInput from "../inputField/VerticalSingleInput";
import SearchableInput from "../inputField/SearchableInput";
import { MdClear } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import toast from "react-hot-toast";
import { COLORS } from "@/app/_utils/COLORS";
interface DeleteModalProps {
  title: string;
  naviagteRoomId: number;
  navigateFloorId: number;
  navigateBuildingId: number;
  // onConfirm: () => void;
  onCancel: () => void;
  isVisible: boolean;
  updatedRoomDetails?: any;
}

const AddRoomDetailsModal: React.FC<DeleteModalProps> = ({
  title,
  // onConfirm,
  onCancel,
  isVisible,
  naviagteRoomId,
  navigateFloorId,
  navigateBuildingId,
  updatedRoomDetails,
}) => {
  if (!isVisible) return null;
  const [decodeToken, setDecodeToken] = useState<tokenInterface>({
    userId: "",
    name: "",
    email: "",
    token: "",
    expireDate: null,
  });

  const [fetchData, setFetchData] = useState({
    commonFeatures: [],
    availableFurnitures: [],
    bedSpecification: [],
    bathroomSpecification: [],
    roomImages: [],
  });

  const [roomDetails, setRoomDetails] = useState<any>({
    detailsData: [],
    roomDetailsId: null,
    roomId: null,
    floorId: null,
    buildingId: null,
    roomName: "",
    roomDimension: "",
    roomSideId: 0,
    bedSpecificationId: null,
    roomBelconiId: 0,
    attachedBathroomId: 0,
    commonFeatures: [],
    availableFurnitures: [],
    bedSpecification: [],
    bathroomSpecification: [],
    roomImages: [],
    isUpdated: false,
    isDeleted: false,
    roomIdErrorMsg: "",
    roomDimensionErrorMsg: "",
    roomSideIdErrorMsg: "",
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
      fetchFurnitureData(decodeToken?.token);
      fetchBedData(decodeToken?.token);
      fetchBathroomData(decodeToken?.token);
    }
  }, [decodeToken?.token, decodeToken?.userId]);

  console.log(
    "updatedRoomDetails: ",
    JSON.stringify(updatedRoomDetails, null, 2)
  );

  useEffect(() => {
    if (updatedRoomDetails) {
      setRoomDetails((prev: any) => ({
        ...prev,
        roomDetailsId: updatedRoomDetails?.roomDetailsId,
        roomId: updatedRoomDetails?.roomId,
        floorId: updatedRoomDetails?.floorId,
        bedSpecificationId: updatedRoomDetails?.bedSpecificationId,
        buildingId: updatedRoomDetails?.buildingId,
        roomName: updatedRoomDetails?.roomName,
        roomDimension: updatedRoomDetails?.roomDimension,
        roomSideId: updatedRoomDetails?.roomSideId,
        roomBelconiId: updatedRoomDetails?.roomBelconiId,
        attachedBathroomId: updatedRoomDetails?.attachedBathroomId,
        commonFeatures:
          updatedRoomDetails?.commonFeatures?.length > 0
            ? updatedRoomDetails?.commonFeatures.map(
                (feature: any) => feature.commonFeaturesId
              )
            : [],
        availableFurnitures:
          updatedRoomDetails?.availableFurnitures?.length > 0
            ? updatedRoomDetails?.availableFurnitures.map(
                (furniture: any) => furniture.availableFurnitureId
              )
            : [],
        bedSpecification:
          updatedRoomDetails?.bedSpecification?.length > 0
            ? updatedRoomDetails?.bedSpecification.map((bed: any) => bed.bedId)
            : [],
        bathroomSpecification:
          updatedRoomDetails?.bathroomSpecification?.length > 0
            ? updatedRoomDetails?.bathroomSpecification.map(
                (bathroom: any) => bathroom.bathroomId
              )
            : [],
        roomImages:
          updatedRoomDetails?.roomImages?.length > 0
            ? updatedRoomDetails?.roomImages
            : [],
      }));
    }
  }, [updatedRoomDetails]);

  const fetchCommonFeaturesData = async (token: string) => {
    try {
      const { data } = await axios.get(AppURL.roomCommonFeature, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (data?.status === 200) {
        setFetchData((prev: any) => ({ ...prev, commonFeatures: data?.data }));
      }
    } catch (error: any) {
      console.log("Error fetching floor data: ", error.message);
    }
  };
  const fetchFurnitureData = async (token: string) => {
    try {
      const { data } = await axios.get(AppURL.furnitureApi, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (data?.status === 200) {
        setFetchData((prev) => ({ ...prev, availableFurnitures: data?.data }));
      }
    } catch (error: any) {
      console.log("Error fetching furniture data: ", error.message);
    }
  };
  const fetchBedData = async (token: string) => {
    try {
      const { data } = await axios.get(AppURL.bedApi, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (data?.status === 200) {
        setFetchData((prev) => ({ ...prev, bedSpecification: data?.data }));
      }
    } catch (error: any) {
      console.log("Error fetching bed data: ", error.message);
    }
  };
  const fetchBathroomData = async (token: string) => {
    try {
      const { data } = await axios.get(AppURL.bathroomApi, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (data?.status === 200) {
        setFetchData((prev) => ({
          ...prev,
          bathroomSpecification: data?.data,
        }));
      }
    } catch (error: any) {
      console.log("Error fetching bathroom data: ", error.message);
    }
  };

  const handleCFRadioBtnChange = (value: number) => {
    setRoomDetails((prev: any) => ({ ...prev, roomSideId: value }));
  };
  const handleBedRadioBtnChange = (value: number) => {
    setRoomDetails((prev: any) => ({ ...prev, bedSpecificationId: value }));
  };
  const handleBelconiRadioBtnChange = (value: number) => {
    setRoomDetails((prev: any) => ({ ...prev, roomBelconiId: value }));
  };
  const handleABRadioBtnChange = (value: number) => {
    setRoomDetails((prev: any) => ({ ...prev, attachedBathroomId: value }));
  };

  // Common features
  const handleDataSelect = (id: number | string) => {
    setRoomDetails((prev: any) => ({
      ...prev,
      commonFeatures: [...new Set([...prev.commonFeatures, id])],
    }));
  };
  const handleDataRemove = (id: number | string) => {
    setRoomDetails((prev: any) => ({
      ...prev,
      commonFeatures: prev.commonFeatures.filter(
        (featureId: any) => featureId !== id
      ),
    }));
  };
  const handleManualfeatureAdd = async (name: string) => {
    try {
      const submittedData = {
        name,
        remarks: "Manually added",
        createdBy: decodeToken?.userId,
      };
      const { data } = await axios.post(
        AppURL.roomCommonFeature,
        submittedData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${decodeToken?.token}`,
          },
        }
      );

      if (data?.status === 201) {
        toast.success("Features Manually added successfully!");
        fetchCommonFeaturesData(decodeToken?.token);
        // const newFeature = { id: data.id, name: data.name };
        // setCommonFeatures((prev) => [...prev, newFeature]);
        // handleDataSelect(newFeature);
      }
    } catch (error: any) {
      console.error("Error adding feature: ", error.message);
    }
  };

  // Available Furnitures functionality
  const furnitureDataSelect = (id: number | string) => {
    setRoomDetails((prev: any) => ({
      ...prev,
      availableFurnitures: [...new Set([...prev.availableFurnitures, id])],
    }));
  };
  const furnitureDataRemove = (id: number | string) => {
    setRoomDetails((prev: any) => ({
      ...prev,
      availableFurnitures: prev.availableFurnitures.filter(
        (furnitureId: any) => furnitureId !== id
      ),
    }));
  };
  const manualFurnitureAdd = async (name: string) => {
    try {
      const submittedData = {
        name,
        remarks: "Manually furniture added",
        createdBy: decodeToken?.userId,
      };
      const { data } = await axios.post(AppURL.furnitureApi, submittedData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${decodeToken?.token}`,
        },
      });

      if (data?.status === 201) {
        toast.success("Furniture manually added successfully!");
        fetchFurnitureData(decodeToken?.token);
      }
    } catch (error: any) {
      console.error("Error adding furniture: ", error.message);
    }
  };

  // Bed Specifications functionality
  const bedDataSelect = (id: number | string) => {
    setRoomDetails((prev: any) => ({
      ...prev,
      bedSpecification: [...new Set([...prev.bedSpecification, id])],
    }));
  };
  const bedDataRemove = (id: number | string) => {
    setRoomDetails((prev: any) => ({
      ...prev,
      bedSpecification: prev.bedSpecification.filter(
        (bedId: any) => bedId !== id
      ),
    }));
  };
  const manualBedAdd = async (name: string) => {
    try {
      const submittedData = {
        name,
        remarks: "Manually bed added",
        createdBy: decodeToken?.userId,
      };
      const { data } = await axios.post(AppURL.bedApi, submittedData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${decodeToken?.token}`,
        },
      });

      if (data?.status === 201) {
        toast.success("Bed manually added successfully!");
        fetchBedData(decodeToken?.token);
      }
    } catch (error: any) {
      console.error("Error adding bed: ", error.message);
    }
  };

  // Bathroom Specifications functionality
  const bathroomDataSelect = (id: number | string) => {
    setRoomDetails((prev: any) => ({
      ...prev,
      bathroomSpecification: [...new Set([...prev.bathroomSpecification, id])],
    }));
  };
  const bathroomDataRemove = (id: number | string) => {
    setRoomDetails((prev: any) => ({
      ...prev,
      bathroomSpecification: prev.bathroomSpecification.filter(
        (bedId: any) => bedId !== id
      ),
    }));
  };
  const manualBathroomAdd = async (name: string) => {
    try {
      const submittedData = {
        name,
        remarks: "Manually bed added",
        createdBy: decodeToken?.userId,
      };
      const { data } = await axios.post(AppURL.bathroomApi, submittedData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${decodeToken?.token}`,
        },
      });

      if (data?.status === 201) {
        toast.success("Bathroom manually added successfully!");
        fetchBathroomData(decodeToken?.token);
      }
    } catch (error: any) {
      console.error("Error adding bathroom: ", error.message);
    }
  };

  const onRoomDetailsSubmitFunc = async (
    roomData: any,
    userId: any,
    token: string
  ) => {
    try {
      const submittedData = {
        roomId: roomData?.roomId,
        floorId: roomData?.floorId,
        buildingId: roomData?.buildingId,
        roomDimension: roomData?.roomDimension,
        roomSideId: roomData?.roomSideId,
        bedSpecificationId: roomData?.bedSpecificationId,
        roomBelconiId: roomData?.roomBelconiId,
        attachedBathroomId: roomData?.attachedBathroomId,
        commonFeatures: roomData?.commonFeatures,
        availableFurnitures: roomData?.availableFurnitures,
        bathroomSpecification: roomData?.bathroomSpecification,
        roomImages:
          roomData?.roomImages?.length > 0
            ? roomData?.roomImages
                ?.filter((img: any) => img !== null && img !== "")
                .map((img: any) => img)
            : [],
        createdBy: userId,
      };

      console.log("submittedData: ", JSON.stringify(submittedData, null, 2));

      const { data } = await axios.post(AppURL.roomDetailsApi, submittedData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (data?.status === 201) {
        toast.success("Room details added successfully!");
        setRoomDetails((prev: any) => ({
          ...prev,
          roomDimension: "",
          roomSideId: 0,
          roomBelconiId: 0,
          attachedBathroomId: 0,
          commonFeatures: [],
          availableFurnitures: [],
          bedSpecification: [],
          bathroomSpecification: [],
          roomImages: [],
          roomIdErrorMsg: "",
          roomDimensionErrorMsg: "",
          roomSideIdErrorMsg: "",
        }));
      } else if (data?.status === 409) {
        toast.error("Room details already exist");
      }
    } catch (error: any) {
      if (error?.status === 409) {
        toast.error("Room details already exist");
      } else {
        toast.error("Failed to add room details. Please try again.");
      }
      console.log("Error adding room details: ", error.message);
    }
  };

  const onRoomDetailsUpdateFunc = async (
    roomData: any,
    userId: any,
    token: string,
    roomDetailsId: any
  ) => {
    try {
      const submittedData = {
        roomDimension: roomData?.roomDimension,
        roomSideId: roomData?.roomSideId,
        bedSpecificationId: roomData?.bedSpecificationId,
        roomBelconiId: roomData?.roomBelconiId,
        attachedBathroomId: roomData?.attachedBathroomId,
        commonFeatures: roomData?.commonFeatures,
        availableFurnitures: roomData?.availableFurnitures,
        bathroomSpecification: roomData?.bathroomSpecification,
        roomImages:
          roomData?.roomImages?.length > 0
            ? roomData?.roomImages
                ?.filter((img: any) => img !== null && img !== "")
                .map((img: any) => {
                  if (img.startsWith("data:image/")) {
                    return img;
                  }
                  return img.split("images/").pop();
                })
            : [],

        updatedBy: userId,
      };

      const { data } = await axios.put(
        `${AppURL.roomDetailsApi}/${roomDetailsId}`,
        submittedData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data?.status === 200) {
        toast.success("Room details updated successfully!");
        setRoomDetails((prev: any) => ({
          ...prev,
          roomDimension: "",
          roomSideId: 0,
          bedSpecificationId: 0,
          roomBelconiId: 0,
          attachedBathroomId: 0,
          commonFeatures: [],
          availableFurnitures: [],
          bedSpecification: [],
          bathroomSpecification: [],
          roomImages: [],
          roomIdErrorMsg: "",
          roomDimensionErrorMsg: "",
          roomSideIdErrorMsg: "",
        }));
      }
    } catch (error: any) {
      toast.error("Failed to updated room details. Please try again.");
    }
  };

  const roomDetailsDeleteFunc = async (
    userId: any,
    token: string,
    roomDetailsId: any
  ) => {
    const deleteData = await {
      inactiveBy: userId,
    };
    try {
      const deleteRes = await fetch(
        `${AppURL.roomDetailsApi}/${roomDetailsId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(deleteData),
        }
      );

      if (deleteRes?.status === 200) {
        toast.success("Room details deleted successfully!");
        setRoomDetails((prev: any) => ({
          ...prev,
          roomDimension: "",
          roomSideId: 0,
          roomBelconiId: 0,
          attachedBathroomId: 0,
          commonFeatures: [],
          availableFurnitures: [],
          bedSpecification: [],
          bathroomSpecification: [],
          roomImages: [],
          roomIdErrorMsg: "",
          roomDimensionErrorMsg: "",
          roomSideIdErrorMsg: "",
        }));
      } else if (deleteRes?.status === 404) {
        toast.error("Room details not found");
      }
    } catch (error: any) {
      toast.error("Failed to delete room details. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-xl max-h-[97%] overflow-auto my-5">
        <div className="flex w-full items-center justify-center mb-4 ">
          <h2 className="text-lg font-workSans font-semibold uppercase  text-center w-100p ">
            {title}
          </h2>

          <button
            className="flex items-end justify-end bg-slate-50 border-2 hover:border-red-700 rounded-full"
            onClick={onCancel}
          >
            <IoClose
              size={35}
              className="cursor-pointer text-errorColor shadow-xl shadow-white hover:text-red-600"
            />
          </button>
        </div>
        <div className="my-3">
          <VerticalSingleInput
            label="Room Dimensions"
            type="text"
            name="roomDimensions"
            placeholder="Enter Room Dimensions(12 ft x 16 ft room)"
            // @ts-ignore
            value={roomDetails?.roomDimension}
            onChange={(e: any) =>
              setRoomDetails((prev: any) => ({
                ...prev,
                roomDimension: e.target.value,
                roomId: naviagteRoomId,
                floorId: navigateFloorId,
                buildingId: navigateBuildingId,
                roomDimensionErrorMsg: "",
              }))
            }
            errorMsg={roomDetails.roomDimensionErrorMsg}
            required
          />
        </div>
        <div>
          <label className=" text-black text-sm font-workSans mb-1">
            Room Side
          </label>
          <div className="flex  bg-primary95 border-2 border-slate-200 rounded-lg p-2">
            <VertcialRadioBtn
              label="East"
              value={1}
              name="roomSide"
              checked={roomDetails?.roomSideId === 1}
              onChange={handleCFRadioBtnChange}
            />
            <VertcialRadioBtn
              label="West"
              value={2}
              name="roomSide"
              checked={roomDetails?.roomSideId === 2}
              onChange={handleCFRadioBtnChange}
              className="mx-5"
            />
            <VertcialRadioBtn
              label="North"
              value={3}
              name="roomSide"
              checked={roomDetails?.roomSideId === 3}
              onChange={handleCFRadioBtnChange}
              className="mr-5"
            />
            <VertcialRadioBtn
              label="South"
              value={4}
              name="roomSide"
              checked={roomDetails?.roomSideId === 4}
              onChange={handleCFRadioBtnChange}
            />
          </div>
        </div>

        <div className="mt-3">
          <label className=" text-black text-sm font-workSans mb-1">
            Bed Specifications
          </label>
          <div className="flex items-center justify-between flex-wrap bg-primary95 border-2 border-slate-200 rounded-lg p-2 gap-y-4">
            {fetchData?.bedSpecification &&
              fetchData?.bedSpecification?.length > 0 &&
              fetchData?.bedSpecification?.map((bed: any, bedIndex: number) => {
                return (
                  <div key={bedIndex} className="relative group">
                    <VertcialRadioBtn
                      label={bed?.name}
                      value={bed?.bedId}
                      name="bedSpecificationId"
                      checked={roomDetails?.bedSpecificationId === bed?.bedId}
                      onChange={handleBedRadioBtnChange}
                      className="z-10"
                    />
                    {/* Tooltip */}
                    {bed?.remarks && (
                      <div className="absolute hidden group-hover:block bg-gray-500 text-white font-workSans text-xs rounded-lg px-2 py-1 shadow-lg w-max z-20 -top-8 left-1/2 transform -translate-x-1/2">
                        {bed?.remarks}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>

        <div className="my-3">
          <label className=" text-black text-sm font-workSans mb-1">
            Have Belconi
          </label>
          <div className="flex  bg-primary95 border-2 border-slate-200 rounded-lg p-2">
            <VertcialRadioBtn
              label="Attached Belconi"
              value={1}
              name="roomBelconi"
              checked={roomDetails?.roomBelconiId === 1}
              onChange={handleBelconiRadioBtnChange}
            />
            <VertcialRadioBtn
              label="Haven't Belconi"
              value={2}
              name="roomBelconi"
              checked={roomDetails?.roomBelconiId === 2}
              onChange={handleBelconiRadioBtnChange}
              className="mx-5"
            />
          </div>
        </div>
        <div>
          <label className=" text-black text-sm font-workSans mb-1">
            Attached Bathroom
          </label>
          <div className="flex  bg-primary95 border-2 border-slate-200 rounded-lg p-2">
            <VertcialRadioBtn
              label="Yes"
              value={1}
              name="attachedBathroom"
              checked={roomDetails?.attachedBathroomId === 1}
              onChange={handleABRadioBtnChange}
            />
            <VertcialRadioBtn
              label="No"
              value={2}
              name="attachedBathroom"
              checked={roomDetails?.attachedBathroomId === 2}
              onChange={handleABRadioBtnChange}
              className="mx-5"
            />
          </div>
        </div>

        <div className="my-3">
          <SearchableInput
            options={fetchData?.commonFeatures}
            selectedData={roomDetails?.commonFeatures}
            onDataSelect={handleDataSelect}
            onDataRemove={handleDataRemove}
            onManualAdd={handleManualfeatureAdd}
            label="Common Features"
            placeholder="Add rooms common features..."
            notMatchingMsg="Not matching common features found"
            idKey="commonFeatureId"
            nameKey="name"
          />
        </div>

        <div>
          <SearchableInput
            options={fetchData?.availableFurnitures}
            selectedData={roomDetails?.availableFurnitures}
            onDataSelect={furnitureDataSelect}
            onDataRemove={furnitureDataRemove}
            onManualAdd={manualFurnitureAdd}
            label="Available Furniture"
            placeholder="Add room's available furniture..."
            notMatchingMsg="Not matching available furniture found"
            idKey="availableFurnitureId"
            nameKey="name"
          />
        </div>

        {/* <div className="my-3">
          <SearchableInput
            options={fetchData?.bedSpecification}
            selectedData={roomDetails?.bedSpecification}
            onDataSelect={bedDataSelect}
            onDataRemove={bedDataRemove}
            onManualAdd={manualBedAdd}
            label="Bed Specifications"
            placeholder="Add bed specifications..."
            notMatchingMsg="Not matching bed specifications found"
            idKey="bedId"
            nameKey="name"
          />
        </div> */}

        <div>
          <SearchableInput
            options={fetchData?.bathroomSpecification}
            selectedData={roomDetails?.bathroomSpecification}
            onDataSelect={bathroomDataSelect}
            onDataRemove={bathroomDataRemove}
            onManualAdd={manualBathroomAdd}
            label="Bathroom Specifications"
            placeholder="Add bathroom specifications..."
            notMatchingMsg="Not matching bathroom specifications found"
            idKey="bathroomId"
            nameKey="name"
          />
        </div>

        <div className="my-3">
          <label className=" text-black text-sm font-workSans mb-1">
            Room Images
          </label>
          <ImgPicker
            initialImages={
              updatedRoomDetails?.roomImages?.length > 0
                ? updatedRoomDetails?.roomImages
                : []
            }
            onImagesChange={async (images) => {
              console.log("images: ", images);

              await setRoomDetails((prev: any) => ({
                ...prev,
                roomImages: images,
              }));
            }}
            singleSelection={false}
          />
        </div>

        <div className="flex justify-between mt-6 space-x-4">
          <button
            onClick={onCancel}
            className="flex-1 py-2 text-md text-gray-700 font-workSans bg-gray-200 rounded hover:bg-gray-300"
          >
            {updatedRoomDetails ? "Cancel" : "No"}
          </button>
          <button
            onClick={() => {
              if (decodeToken?.userId && decodeToken?.token) {
                updatedRoomDetails && roomDetails?.roomDetailsId
                  ? onRoomDetailsUpdateFunc(
                      roomDetails,
                      decodeToken?.userId,
                      decodeToken?.token,
                      roomDetails?.roomDetailsId
                    )
                  : onRoomDetailsSubmitFunc(
                      roomDetails,
                      decodeToken?.userId,
                      decodeToken?.token
                    );
              }
            }}
            className="flex-1 py-2  text-gray-700 text-md font-workSans bg-primary75 hover:bg-primary50 rounded "
          >
            {updatedRoomDetails ? "Update" : "Submit"}
          </button>
          {updatedRoomDetails && roomDetails?.roomDetailsId && (
            <button
              onClick={() => {
                if (decodeToken?.userId && decodeToken?.token) {
                  updatedRoomDetails && roomDetails?.roomDetailsId
                    ? roomDetailsDeleteFunc(
                        decodeToken?.userId,
                        decodeToken?.token,
                        roomDetails?.roomDetailsId
                      )
                    : toast.error(
                        "Failed to delete room details. Please try again."
                      );
                }
              }}
              className="flex-1 py-2  text-gray-700 text-md font-workSans bg-errorLight85 hover:bg-errorColor rounded "
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddRoomDetailsModal;
