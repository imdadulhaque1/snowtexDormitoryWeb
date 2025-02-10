"use client";
import React, { FC, Suspense, useEffect, useState } from "react";
import { useAppContext } from "@/app/_stateManagements/contextApi";
import retrieveToken from "@/app/_utils/handler/retrieveToken";
import { tokenInterface } from "@/interface/admin/decodeToken/tokenInterface";
import jwtDecode from "jsonwebtoken";
import VerticalSingleInput from "@/app/_components/inputField/VerticalSingleInput";
import toast from "react-hot-toast";
import { MdOutlineFileUpload } from "react-icons/md";
import { COLORS } from "@/app/_utils/COLORS";
import AppURL from "@/app/_restApi/AppURL";
import axios from "axios";
import VertcialRadioBtn from "@/app/_components/radioBtn/VertcialRadioBtn";
import { MdDelete, MdDeleteOutline } from "react-icons/md";
import { FaEdit, FaRegWindowClose } from "react-icons/fa";
import DeleteModal from "@/app/_components/modal/DeletedModal";

interface Props {}

const PaidItemsPage: FC<Props> = (props) => {
  const { getDrawerStatus } = useAppContext();
  const [decodeToken, setDecodeToken] = useState<tokenInterface>({
    userId: "",
    name: "",
    email: "",
    token: "",
    expireDate: null,
  });
  const [paidItemsData, setPaidItemsData] = useState({
    paidData: [],
    itemId: null,
    itemName: "",
    itemPrice: "",
    paidOrFree: null,
    itemRemarks: "",
    isUpdated: false,
    isDeleted: false,
    itemNameErrorMsg: "",
    itemRemarksErrorMsg: "",
    itemPriceErrorMsg: "",
    paidOrFreeErrorMsg: "",
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
      // getBuildingsFunc(decodeToken?.token);
      fetchPaidItems(decodeToken?.token);
    }
  }, [decodeToken?.token, decodeToken?.userId]);

  const validateForm = () => {
    let isValid = true;
    const errors: Partial<typeof paidItemsData> = {};

    if (!paidItemsData.itemName.trim()) {
      isValid = false;
      errors.itemNameErrorMsg = "Item name is required.";
    }
    if (!paidItemsData.itemRemarks.trim()) {
      isValid = false;
      errors.itemRemarksErrorMsg = "Items remarks is required.";
    }
    if (!paidItemsData.itemPrice) {
      isValid = false;
      errors.itemPriceErrorMsg = "Items price is required.";
    }
    if (!paidItemsData.paidOrFree) {
      isValid = false;
      errors.paidOrFreeErrorMsg = "Required to initilize item status.";
    }

    setPaidItemsData((prev) => ({ ...prev, ...errors }));
    return isValid;
  };

  const fetchPaidItems = async (token: string) => {
    try {
      const { data } = await axios.get(AppURL.paidItemApi, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (data?.status === 200) {
        console.log("data: ", JSON.stringify(data?.data, null, 2));

        setPaidItemsData((prev) => ({ ...prev, paidData: data?.data }));
      }
    } catch (error: any) {
      console.log("Error fetching floor data: ", error.message);
    }
  };

  const onSubmitFunc = async (itemsData: any, token: string, userId: any) => {
    if (!validateForm()) return;

    const submittedData = await {
      name: itemsData?.itemName,
      price: itemsData?.itemPrice,
      paidOrFree: itemsData?.paidOrFree,
      remarks: itemsData?.itemRemarks,
      createdBy: userId,
    };
    try {
      const { data } = await axios.post(AppURL.paidItemApi, submittedData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log(JSON.stringify);

      if (data?.status === 201) {
        toast.success(data?.message);
        fetchPaidItems(token);
        setPaidItemsData((prev) => ({
          ...prev,
          itemId: null,
          itemName: "",
          itemPrice: "",
          paidOrFree: null,
          itemRemarks: "",
          isUpdated: false,
          isDeleted: false,
          itemNameErrorMsg: "",
          itemRemarksErrorMsg: "",
          itemPriceErrorMsg: "",
          paidOrFreeErrorMsg: "",
        }));
      }
    } catch (error: any) {
      toast.error("Failed to submit floor data !");
      console.log("Error submitting floor data: ", error.message);
    }
  };
  const updateFunc = async (updatedInfo: any, token: string, userId: any) => {
    if (!validateForm()) return;

    const updatePaidItemsData = await {
      name: updatedInfo?.itemName,
      price: updatedInfo?.itemPrice,
      paidOrFree: updatedInfo?.paidOrFree,
      remarks: updatedInfo?.itemRemarks,
      updatedBy: userId,
    };

    await axios
      .put(`${AppURL.paidItemApi}/${updatedInfo.itemId}`, updatePaidItemsData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        if (data?.status === 200) {
          toast.success("Successfully updated paid items !");
          fetchPaidItems(token);
          setPaidItemsData((prev) => ({
            ...prev,
            itemId: null,
            itemName: "",
            itemPrice: "",
            paidOrFree: null,
            itemRemarks: "",
            isUpdated: false,
            isDeleted: false,
            itemNameErrorMsg: "",
            itemRemarksErrorMsg: "",
            itemPriceErrorMsg: "",
            paidOrFreeErrorMsg: "",
          }));
        }
      })
      .catch((error: any) => {
        toast.error("Failed to update paid items !");
      });
  };
  const deleteFunc = async () => {
    const deleteData = await {
      inactiveBy: decodeToken?.userId,
    };
    if (paidItemsData?.itemId && decodeToken?.userId) {
      try {
        const response: any = await fetch(
          `${AppURL.paidItemApi}/${paidItemsData?.itemId}`,
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
          toast.success("Paid items deleted successfully !");
          setPaidItemsData((prev) => ({
            ...prev,
            itemId: null,
            isDeleted: false,
          }));
          fetchPaidItems(decodeToken?.token);
        } else {
          toast.error("Error deleting building !");
        }
      } catch (error: any) {
        toast.error("Failed to delete. Please try again !");
        console.log("Error deleting building: ", error.message);
      }
    }
  };

  const closeToUpdateFunc = async () => {
    await setPaidItemsData((prev) => ({
      ...prev,
      itemId: null,
      itemName: "",
      itemPrice: "",
      paidOrFree: null,
      itemRemarks: "",
      isUpdated: false,
      isDeleted: false,
    }));
  };

  const handlePCByRadioBtnChange = (value: number) => {
    setPaidItemsData((prev: any) => ({ ...prev, paidOrFree: value }));
  };

  const handleCancel = () => {
    setPaidItemsData((prev: any) => ({
      ...prev,
      itemId: null,
      isDeleted: false,
    }));
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div
        className={`flex ${
          getDrawerStatus ? "pl-[265]" : "pl-0"
        } max-h-screen justify-center overflow-auto pb-52`}
      >
        <div className="flex flex-col xl:flex-row w-full h-full">
          <div
            className={`w-[97%] xl:w-[30%] h-80p bg-white p-4 rounded-lg shadow-lg`}
          >
            <VerticalSingleInput
              label="Item Name"
              type="text"
              name="itemName"
              placeholder="Enter Paid Item Name..."
              // @ts-ignore
              value={paidItemsData?.itemName}
              onChange={(e: any) =>
                setPaidItemsData((prev) => ({
                  ...prev,
                  itemName: e.target.value,
                  itemNameErrorMsg: "",
                }))
              }
              errorMsg={paidItemsData.itemNameErrorMsg}
              required
            />
            <div className="flex items-center w-full mt-3">
              <VerticalSingleInput
                className="w-[95%]"
                label="Item Price"
                type="number"
                name="itemName"
                placeholder="Enter Item Price..."
                // @ts-ignore
                value={paidItemsData?.itemPrice}
                onChange={(e: any) =>
                  setPaidItemsData((prev) => ({
                    ...prev,
                    itemPrice: e.target.value,
                    itemPriceErrorMsg: "",
                  }))
                }
                errorMsg={paidItemsData.itemPriceErrorMsg}
                required
              />
              <div className="flex flex-col w-[95%] ml-3">
                <label className=" text-black text-sm font-workSans mb-1">
                  Item paid or free
                </label>
                <div className="flex  bg-primary95 border-2 border-slate-200 rounded-lg px-2 py-2">
                  <VertcialRadioBtn
                    className="py-[2.5]"
                    label="Paid"
                    value={1}
                    name="paidOrFree"
                    checked={paidItemsData?.paidOrFree == 1}
                    onChange={handlePCByRadioBtnChange}
                  />
                  <VertcialRadioBtn
                    label="Free"
                    value={2}
                    name="paidOrFree"
                    checked={paidItemsData?.paidOrFree == 2}
                    onChange={handlePCByRadioBtnChange}
                    className="mx-5"
                  />
                </div>
                {paidItemsData?.paidOrFreeErrorMsg && (
                  <p className="text-errorColor text-f11 md:text-f13 font-workSans pl-1 mt-1">
                    {paidItemsData?.paidOrFreeErrorMsg}
                  </p>
                )}
              </div>
            </div>
            <div className="my-3">
              <VerticalSingleInput
                label="Item Remarks"
                type="text"
                name="itemRemarks"
                placeholder="Enter Item remarks..."
                // @ts-ignore
                value={paidItemsData?.itemRemarks}
                onChange={(e: any) =>
                  setPaidItemsData((prev) => ({
                    ...prev,
                    itemRemarks: e.target.value,
                    itemRemarksErrorMsg: "",
                  }))
                }
                errorMsg={paidItemsData.itemRemarksErrorMsg}
                required
              />
            </div>

            <div className="flex justify-center items-center mt-4">
              {!paidItemsData?.isUpdated ? (
                <button
                  className="flex bg-primary70 items-center font-workSans text-md py-2 px-4 rounded-lg text-black hover:bg-primary50 hover:text-white"
                  onClick={() => {
                    onSubmitFunc(
                      paidItemsData,
                      decodeToken?.token,
                      decodeToken?.userId
                    );
                  }}
                >
                  <MdOutlineFileUpload
                    size={20}
                    className="cursor-pointer mr-2"
                  />
                  Submit Items
                </button>
              ) : (
                <div className="flex justify-center items-center space-x-4">
                  <button
                    className="flex items-center bg-primary70 font-workSans text-md py-2 px-4 rounded-lg text-black hover:bg-primary50 hover:text-white"
                    onClick={async () => {
                      await updateFunc(
                        paidItemsData,
                        decodeToken?.token,
                        decodeToken?.userId
                      );
                    }}
                  >
                    <MdOutlineFileUpload
                      size={20}
                      className="cursor-pointer mr-2"
                    />
                    Update Paid Items
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
                <p className="text-md font-workSans font-medium text-center ">
                  SL
                </p>
              </div>
              <div className=" flex  w-1/5 items-center justify-center border-slate-50 border-r-2">
                <p className="text-md font-workSans font-medium text-center">
                  Name
                </p>
              </div>
              <div className="flex w-1/3 items-center justify-center border-slate-50 border-r-2">
                <p className="text-md font-workSans font-medium text-center">
                  Remarks
                </p>
              </div>
              <div className="flex  w-1/5  justify-center items-center border-slate-50 border-r-2">
                <p className="text-md font-workSans font-medium text-center">
                  Price
                </p>
              </div>
              <div className="flex  w-1/5  justify-center items-center border-slate-50 border-r-2">
                <p className="text-md font-workSans font-medium text-center">
                  Paid / Free
                </p>
              </div>
              <div className="flex  w-1/5  justify-center items-center">
                <p className="text-md font-workSans font-medium text-center">
                  Actions
                </p>
              </div>
            </div>

            {paidItemsData?.paidData && paidItemsData?.paidData?.length > 0 ? (
              paidItemsData?.paidData?.map((pItem: any, piIndex: number) => {
                const isLastItem =
                  piIndex === paidItemsData?.paidData.length - 1;
                console.log(pItem?.paidOrFree);
                const pCalculateByTxt =
                  parseInt(pItem?.paidOrFree) == 1
                    ? "Paid"
                    : parseInt(pItem?.paidOrFree) == 2
                    ? "Free"
                    : "Unknown";

                return (
                  <div
                    key={piIndex}
                    className={`flex w-full items-center ${
                      !isLastItem ? "border-b-2" : "border-b-0"
                    } border-slate-300 py-2 px-2  bg-slate-100`}
                  >
                    <div className="flex w-1/12 items-center  justify-center border-slate-300 border-r-2">
                      <p className="text-md font-workSans text-center">
                        {paidItemsData?.paidData?.length - piIndex}
                      </p>
                    </div>
                    <div className=" flex  w-1/5 items-center justify-center border-slate-300 border-r-2">
                      <p className="text-md font-workSans text-center break-words max-w-full">
                        {pItem?.name}
                      </p>
                    </div>
                    <div className="flex w-1/3 items-center justify-center border-slate-300 border-r-2">
                      <p className="text-md font-workSans text-center break-words max-w-full">
                        {pItem?.remarks}
                      </p>
                    </div>
                    <div className="flex  w-1/5  justify-center items-center border-slate-300 border-r-2">
                      <p className="text-md font-workSans text-center break-words max-w-full">
                        {pItem?.price}
                      </p>
                    </div>
                    <div className="flex  w-1/5  justify-center items-center border-slate-300 border-r-2">
                      <p
                        className={`text-md ${
                          pItem?.paidOrFree == 1
                            ? "text-black"
                            : "text-green-700"
                        } font-workSans text-center break-words max-w-full`}
                      >
                        {pCalculateByTxt}
                      </p>
                    </div>
                    <div className="flex  w-1/5  justify-center items-center">
                      <div className="relative group mr-3">
                        <button
                          onClick={async () => {
                            await setPaidItemsData((prev: any) => ({
                              ...prev,
                              itemId: pItem?.itemId,
                              itemName: pItem?.name,
                              itemPrice: pItem?.price,
                              paidOrFree: pItem?.paidOrFree,
                              itemRemarks: pItem?.remarks,
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
                          Update Paid Items
                        </span>
                      </div>

                      <div className="relative group ">
                        <button
                          onClick={async () => {
                            await setPaidItemsData((prev: any) => ({
                              ...prev,
                              itemId: pItem?.itemId,
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
                          Delete Paid Items
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div>
                <h3 className="text-center font-workSans text-md mt-4 text-red-500">
                  Paid items data not found !
                </h3>
              </div>
            )}
          </div>
        </div>

        <DeleteModal
          title="Do you want to delete ?"
          description="You're going to delete this paid items ."
          onConfirm={deleteFunc}
          onCancel={handleCancel}
          isVisible={paidItemsData?.isDeleted}
        />
      </div>
    </Suspense>
  );
};

export default PaidItemsPage;
