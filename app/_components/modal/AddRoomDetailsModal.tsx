"use client";
import { COLORS } from "@/app/_utils/COLORS";
import React, { useEffect, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import ImgPicker from "../imgField/ImgPicker";
import retrieveToken from "@/app/_utils/handler/retrieveToken";
import jwtDecode from "jsonwebtoken";
import { tokenInterface } from "@/interface/admin/decodeToken/tokenInterface";
import AppURL from "@/app/_restApi/AppURL";
import axios from "axios";
import VertcialRadioBtn from "../radioBtn/VertcialRadioBtn";
import VerticalSingleInput from "../inputField/VerticalSingleInput";
import SearchableInput from "../inputField/SearchableInput";
import toast from "react-hot-toast";
interface DeleteModalProps {
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
  isVisible: boolean;
}

const AddRoomDetailsModal: React.FC<DeleteModalProps> = ({
  title,
  onConfirm,
  onCancel,
  isVisible,
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
    roomImgs: [],
    roomId: null,
    roomName: "",
    roomDimension: "",
    roomSideId: 0,
    roomBelconiId: 0,
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
  const handleBelconiRadioBtnChange = (value: number) => {
    setRoomDetails((prev: any) => ({ ...prev, roomBelconiId: value }));
  };

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

  const handleManualAdd = async (name: string) => {
    // const newFeature: any = { id: Date.now(), name };
    // fetchData?.commonFeatures.push(newFeature);
    // handleDataSelect(newFeature.id);
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

  // console.log(
  //   "fetchData?.commonFeatures: ",
  //   JSON.stringify(fetchData, null, 2)
  // );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-xl">
        <h2 className="text-lg font-workSans font-semibold uppercase mb-4 text-center">
          {title}
        </h2>

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
                roomDimensionErrorMsg: "",
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

        <div className="my-3">
          <SearchableInput
            options={fetchData?.commonFeatures}
            selectedData={roomDetails?.commonFeatures}
            onDataSelect={handleDataSelect}
            onDataRemove={handleDataRemove}
            onManualAdd={handleManualAdd}
            label="Common Features"
            placeholder="Add rooms common features..."
            notMatchingMsg="Not matching common features found"
            idKey="commonFeatureId"
            nameKey="name"
          />
        </div>

        <div className="my-3">
          <label className=" text-black text-sm font-workSans mb-1">
            Room Images
          </label>
          <ImgPicker
            initialImages={[]}
            onImagesChange={(images) => {
              console.log("Images length: ", JSON.stringify(images, null, 2));
            }}
            singleSelection={false}
          />
        </div>

        <div className="flex justify-between mt-6 space-x-4">
          <button
            onClick={onCancel}
            className="flex-1 py-2 text-md text-gray-700 font-workSans bg-gray-200 rounded hover:bg-gray-300"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2  text-white text-md font-workSans bg-primary75 hover:bg-primary50 rounded "
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRoomDetailsModal;
