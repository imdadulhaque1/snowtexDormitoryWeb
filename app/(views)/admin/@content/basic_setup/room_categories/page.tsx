"use client";
import AppURL from "@/app/_restApi/AppURL";
import { useAppContext } from "@/app/_stateManagements/contextApi";
import retrieveToken from "@/app/_utils/handler/retrieveToken";
import { tokenInterface } from "@/interface/admin/decodeToken/tokenInterface";
import axios from "axios";
import React, { FC, Suspense, useEffect, useState } from "react";
import toast from "react-hot-toast";
import jwtDecode from "jsonwebtoken";
import DeleteModal from "@/app/_components/modal/DeletedModal";
import VerticalSingleInput from "@/app/_components/inputField/VerticalSingleInput";
import { MdDeleteOutline, MdOutlineFileUpload } from "react-icons/md";
import { FaEdit, FaRegWindowClose } from "react-icons/fa";
import { COLORS } from "@/app/_utils/COLORS";

interface Props {}

const RoomCategoryPage: FC<Props> = (props) => {
  const { getDrawerStatus } = useAppContext();
  const [decodeToken, setDecodeToken] = useState<tokenInterface>({
    userId: "",
    name: "",
    email: "",
    token: "",
    expireDate: null,
  });
  const [categoriesInfo, setCategoriesInfo] = useState({
    categoryData: [],
    roomCategoryId: null,
    name: "",
    noOfPerson: 0,
    remarks: "",
    isUpdated: false,
    isDeleted: false,
    nameErrorMsg: "",
    remarksErrorMsg: "",
    noOfPersonErrorMsg: "",
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
      fetchRoomCategories(decodeToken?.token);
    }
  }, [decodeToken?.token, decodeToken?.userId]);

  const validateForm = () => {
    let isValid = true;
    const errors: Partial<typeof categoriesInfo> = {};

    if (!categoriesInfo.name.trim()) {
      isValid = false;
      errors.nameErrorMsg = "Item name is required.";
    }
    if (!categoriesInfo.remarks.trim()) {
      isValid = false;
      errors.remarksErrorMsg = "Items remarks is required.";
    }
    if (categoriesInfo.noOfPerson <= 0) {
      isValid = false;
      errors.noOfPersonErrorMsg = "Atleast one person should be inserted";
    }

    setCategoriesInfo((prev) => ({ ...prev, ...errors }));
    return isValid;
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
        setCategoriesInfo((prev) => ({ ...prev, categoryData: data?.data }));
      }
    } catch (error: any) {
      console.log("Error fetching room categories: ", error.message);
    }
  };

  const onSubmitFunc = async (
    categoryData: any,
    token: string,
    userId: any
  ) => {
    if (!validateForm()) return;

    const submittedData = await {
      name: categoryData?.name,
      noOfPerson: categoryData?.noOfPerson,
      remarks: categoryData?.remarks,
      createdBy: userId,
    };

    try {
      const { data } = await axios.post(AppURL.roomCategoryApi, submittedData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (data?.status === 201) {
        toast.success(data?.message);
        fetchRoomCategories(token);
        setCategoriesInfo((prev) => ({
          ...prev,
          roomCategoryId: null,
          noOfPerson: 0,
          name: "",
          remarks: "",
          isUpdated: false,
          isDeleted: false,
          nameErrorMsg: "",
          remarksErrorMsg: "",
        }));
      }
    } catch (error: any) {
      if (error?.status == 409) {
        toast.error("Room category already exists !");
      } else {
        toast.error("Failed to submit room category !");
      }
    }
  };
  const updateFunc = async (updatedInfo: any, token: string, userId: any) => {
    if (!validateForm()) return;

    const updateRoomCategory = await {
      name: updatedInfo?.name,
      noOfPerson: updatedInfo?.noOfPerson,
      remarks: updatedInfo?.remarks,
      updatedBy: userId,
    };

    await axios
      .put(
        `${AppURL.roomCategoryApi}/${updatedInfo.roomCategoryId}`,
        updateRoomCategory,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(({ data }) => {
        if (data?.status === 200) {
          toast.success("Successfully updated room category !");
          fetchRoomCategories(token);
          setCategoriesInfo((prev) => ({
            ...prev,
            roomCategoryId: null,
            noOfPerson: 0,
            name: "",
            remarks: "",
            isUpdated: false,
            isDeleted: false,
            nameErrorMsg: "",
            remarksErrorMsg: "",
          }));
        }
      })
      .catch((error: any) => {
        toast.error("Failed to update room category !");
      });
  };
  const deleteFunc = async () => {
    const deleteData = await {
      inactiveBy: decodeToken?.userId,
    };
    if (categoriesInfo?.roomCategoryId && decodeToken?.userId) {
      try {
        const response: any = await fetch(
          `${AppURL.roomCategoryApi}/${categoriesInfo?.roomCategoryId}`,
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
          toast.success("Room category deleted successfully !");
          setCategoriesInfo((prev) => ({
            ...prev,
            roomCategoryId: null,
            isDeleted: false,
          }));
          fetchRoomCategories(decodeToken?.token);
        } else {
          toast.error("Error to delete room category !");
        }
      } catch (error: any) {
        toast.error("Failed to delete. Please try again !");
      }
    }
  };

  const closeToUpdateFunc = async () => {
    await setCategoriesInfo((prev) => ({
      ...prev,
      roomCategoryId: null,
      noOfPerson: 0,
      name: "",
      remarks: "",
      isUpdated: false,
      isDeleted: false,
    }));
  };

  const handleCancel = () => {
    setCategoriesInfo((prev: any) => ({
      ...prev,
      roomCategoryId: null,
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
              label="Category Name"
              type="text"
              name="categoryName"
              placeholder="Enter room category name..."
              // @ts-ignore
              value={categoriesInfo?.name}
              onChange={(e: any) =>
                setCategoriesInfo((prev) => ({
                  ...prev,
                  name: e.target.value,
                  nameErrorMsg: "",
                }))
              }
              errorMsg={categoriesInfo.nameErrorMsg}
              required
            />
            <VerticalSingleInput
              label="No Of Person"
              type="number"
              name="noOfPerson"
              placeholder="Enter No Of Person..."
              // @ts-ignore
              value={categoriesInfo?.noOfPerson}
              onChange={(e: any) =>
                setCategoriesInfo((prev) => ({
                  ...prev,
                  noOfPerson: e.target.value,
                  noOfPersonErrorMsg: "",
                }))
              }
              errorMsg={categoriesInfo.noOfPersonErrorMsg}
              required
            />

            <div className="my-3">
              <VerticalSingleInput
                label="Remarks"
                type="text"
                name="categoryRemarks"
                placeholder="Enter category remarks..."
                // @ts-ignore
                value={categoriesInfo?.remarks}
                onChange={(e: any) =>
                  setCategoriesInfo((prev) => ({
                    ...prev,
                    remarks: e.target.value,
                    remarksErrorMsg: "",
                  }))
                }
                errorMsg={categoriesInfo.remarksErrorMsg}
                required
              />
            </div>

            <div className="flex justify-center items-center mt-4">
              {!categoriesInfo?.isUpdated ? (
                <button
                  className="flex bg-primary70 items-center font-workSans text-md py-2 px-4 rounded-lg text-black hover:bg-primary50 hover:text-white"
                  onClick={() => {
                    onSubmitFunc(
                      categoriesInfo,
                      decodeToken?.token,
                      decodeToken?.userId
                    );
                  }}
                >
                  <MdOutlineFileUpload
                    size={20}
                    className="cursor-pointer mr-2"
                  />
                  Submit Category
                </button>
              ) : (
                <div className="flex justify-center items-center space-x-4">
                  <button
                    className="flex items-center bg-primary70 font-workSans text-md py-2 px-4 rounded-lg text-black hover:bg-primary50 hover:text-white"
                    onClick={async () => {
                      await updateFunc(
                        categoriesInfo,
                        decodeToken?.token,
                        decodeToken?.userId
                      );
                    }}
                  >
                    <MdOutlineFileUpload
                      size={20}
                      className="cursor-pointer mr-2"
                    />
                    Update Category
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
            {/* py-2 px-2 */}
            <div className="flex w-full items-center border-2 border-slate-300  rounded-t-lg bg-slate-300">
              <div className="flex w-1/12 items-center  justify-center border-slate-50 border-r-2">
                <p className="text-md font-workSans font-medium text-center py-2 px-2 ">
                  SL
                </p>
              </div>
              <div className=" flex  w-1/4 items-center justify-center border-slate-50 border-r-2">
                <p className="text-md font-workSans font-medium text-center py-2 px-2">
                  Name
                </p>
              </div>
              <div className=" flex  w-1/6 items-center justify-center border-slate-50 border-r-2">
                <p className="text-md font-workSans font-medium text-center py-2 px-2">
                  No of person
                </p>
              </div>
              <div className="flex w-2/4 items-center justify-center border-slate-50 border-r-2">
                <p className="text-md font-workSans font-medium text-center py-2 px-2">
                  Remarks
                </p>
              </div>

              <div className="flex  w-1/5  justify-center items-center">
                <p className="text-md font-workSans font-medium text-center py-2 px-2">
                  Actions
                </p>
              </div>
            </div>

            {categoriesInfo?.categoryData &&
            categoriesInfo?.categoryData?.length > 0 ? (
              categoriesInfo?.categoryData?.map(
                (cItem: any, rcIndex: number) => {
                  const isLastItem =
                    rcIndex === categoriesInfo?.categoryData.length - 1;

                  return (
                    <div
                      key={rcIndex}
                      className={`flex w-full items-center ${
                        !isLastItem ? "border-b-2" : "border-b-0"
                      } border-slate-300   bg-slate-100`}
                    >
                      <div className="flex w-1/12 items-center  justify-center min-h-11">
                        <p className="text-md font-workSans text-center">
                          {categoriesInfo?.categoryData?.length - rcIndex}
                        </p>
                      </div>
                      <div className=" flex  w-1/4 items-center justify-center border-slate-300 border-l-2 min-h-11">
                        <p className="text-md font-workSans text-center break-words max-w-full">
                          {cItem?.name}
                        </p>
                      </div>
                      <div className=" flex  w-1/6 items-center justify-center border-slate-300 border-l-2 min-h-11">
                        <p className="text-md font-workSans text-center break-words max-w-full">
                          {cItem?.noOfPerson}
                        </p>
                      </div>
                      <div className="flex w-2/4 items-center justify-center border-slate-300 border-x-2 min-h-11">
                        <p className="text-md font-workSans text-center break-words max-w-full">
                          {cItem?.remarks}
                        </p>
                      </div>

                      <div className="flex  w-1/5  justify-center items-center min-h-11">
                        <div className="relative group mr-3">
                          <button
                            onClick={async () => {
                              await setCategoriesInfo((prev: any) => ({
                                ...prev,
                                roomCategoryId: cItem?.roomCategoryId,
                                name: cItem?.name,
                                noOfPerson: cItem?.noOfPerson,
                                remarks: cItem?.remarks,
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
                            Update room category
                          </span>
                        </div>

                        <div className="relative group ">
                          <button
                            onClick={async () => {
                              await setCategoriesInfo((prev: any) => ({
                                ...prev,
                                roomCategoryId: cItem?.roomCategoryId,
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
                            Delete room category
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
                  Room categories not found !
                </h3>
              </div>
            )}
          </div>
        </div>

        <DeleteModal
          title="Do you want to delete ?"
          description="You're going to delete this room category ."
          onConfirm={deleteFunc}
          onCancel={handleCancel}
          isVisible={categoriesInfo?.isDeleted}
        />
      </div>
    </Suspense>
  );
};

export default RoomCategoryPage;
