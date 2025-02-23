"use client";

import React, { FC, Suspense, useEffect, useState } from "react";
import jwtDecode from "jsonwebtoken";
import { useAppContext } from "@/app/_stateManagements/contextApi";
import retrieveToken from "@/app/_utils/handler/retrieveToken";
import { tokenInterface } from "@/interface/admin/decodeToken/tokenInterface";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa";
import AddNewPersonModal from "@/app/_components/modal/AddNewPersonModal";
import axios from "axios";
import AppURL from "@/app/_restApi/AppURL";
import { useWindowSize } from "@/app/_utils/handler/useWindowSize";
import SearchPersonCard from "@/app/_components/card/SearchPersonCard";
import DeleteModal from "@/app/_components/modal/DeletedModal";
import { personInterface } from "@/interface/admin/roomManagements/personInterafce";
import PersonCard from "@/app/_components/card/PersonCard";
import RoomDetailsCard from "@/app/_components/card/RoomDetailsCard";
import DateWiseAvailableCard from "@/app/_components/card/DateWiseAvailableCard";
import { roomDetailsInterface } from "@/interface/admin/roomManagements/roomDetailsInterface";
import { roomInterface } from "@/interface/admin/roomManagements/roomInterface";
import RoomTable from "@/app/_components/card/RoomTable";
import AvailableRoomItemCard from "@/app/_components/card/AvailableRoomItemCard";
import VerticalView from "@/app/_components/comView/VerticalView";
import { calculateDate, noOfDays } from "@/app/_utils/handler/formateDate";

interface Props {}

interface PersonInfoState {
  personId: number | null;
  searchKey: string;
  searchData: personInterface[];
  selectedPerson: personInterface | null;
  checkedData: personInterface | null;
}

interface fetchInterface {
  roomDetails: roomDetailsInterface[];
  availableRoom: roomInterface[];
  selectedRoom: roomInterface | null;
}
interface bookingInterface {
  personInfo: any | null;
  roomInfo: any | [];
  paidItems: [];
  freeItems: [];
  totalPaidItemsPrice: number;
  totalFreeItemsPrice: number;
  startTime: string;
  endTime: string;
  totalDays: number;
}

const RoomAssignmentsPage: FC<Props> = (props) => {
  const { getDrawerStatus } = useAppContext();
  const [decodeToken, setDecodeToken] = useState<tokenInterface>({
    userId: "",
    name: "",
    email: "",
    token: "",
    expireDate: null,
  });

  const [userType, setUserType] = useState({
    internal: true,
    external: false,
  });

  const [boolStatus, setBoolStatus] = useState({
    isAddNew: false,
    isViewDetails: false,
    isUpdate: false,
    isDelete: false,
    checkedStatus: false,
    isRoomSelected: false,
  });

  const [fetchData, setFetchData] = useState<fetchInterface>({
    roomDetails: [],
    availableRoom: [],
    selectedRoom: null,
  });

  const [bookingInfo, setBookingInfo] = useState<bookingInterface>({
    personInfo: null,
    roomInfo: [],
    paidItems: [],
    freeItems: [],
    totalPaidItemsPrice: 0,
    totalFreeItemsPrice: 0,
    startTime: "",
    endTime: "",
    totalDays: 0,
  });

  const [personInfo, setPersonInfo] = useState<PersonInfoState>({
    personId: null,
    searchKey: "",
    searchData: [],
    selectedPerson: null,
    checkedData: null,
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

    // if (decodeToken?.token && decodeToken?.userId) {
    //   getBuildingsFunc(decodeToken?.token);
    //   fetchFloorData(decodeToken?.token);
    //   fetchRoomData(decodeToken?.token);
    // }
  }, [decodeToken?.token, decodeToken?.userId]);

  const fetchPersonInfo = async (key: any) => {
    try {
      const { data } = await axios.get(`${AppURL.personApi}?search=${key}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${decodeToken?.token}`,
        },
      });
      if (data?.status === 200) {
        setPersonInfo((prev) => ({ ...prev, searchData: data?.data }));
      }
    } catch (error: any) {
      console.log("Error fetching person info: ", error?.message);
    }
  };

  useEffect(() => {
    if (personInfo?.searchKey?.trim()) {
      fetchPersonInfo(personInfo?.searchKey);
    }
  }, [personInfo?.searchKey]);

  const handlePersonSelect = async (selectedPerson: any) => {
    if (
      selectedPerson?.personalPhoneNo !==
      personInfo?.selectedPerson?.personalPhoneNo
    ) {
      await setBoolStatus((prev) => ({
        ...prev,
        checkedStatus: false,
      }));
      await setPersonInfo((prev: any) => ({
        ...prev,
        selectedPerson: selectedPerson,
      }));
      await setBookingInfo((prev) => ({
        ...prev,
        personInfo: null,
      }));
    }
  };

  const personInfoDeleteFunc = async () => {
    const deleteData = await {
      inactiveBy: decodeToken?.userId,
    };
    if (personInfo?.personId && decodeToken?.userId) {
      try {
        const response: any = await fetch(
          `${AppURL.personApi}/${personInfo?.personId}`,
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
          toast.success("Person info deleted successfully !");
          setPersonInfo((prev) => ({ ...prev, personId: null }));
          setBoolStatus((prev) => ({ ...prev, isDelete: false }));
          personInfo?.searchKey?.trim() &&
            fetchPersonInfo(personInfo?.searchKey);
        } else {
          toast.error("Error deleting building !");
        }
      } catch (error: any) {
        toast.error("Failed to delete. Please try again !");
        console.log("Error deleting person info: ", error.message);
      }
    }
  };

  const roomBookingFunc = async () => {
    if (isRequiredToBookingRoom) {
      const convertedRoomData = await bookingInfo?.roomInfo.map(
        ({ roomInfo, roomWisePersonInfo }: any) => ({
          ...roomInfo,
          roomWisePersonInfo,
        })
      );

      // personInfo: bookingInfo?.personInfo,
      // roomInfo: convertedRoomData,
      // paidItems: bookingInfo?.paidItems,
      // freeItems: bookingInfo?.freeItems,
      const submittedData = await {
        personInfo: JSON.stringify(bookingInfo?.personInfo),
        roomInfo: JSON.stringify(convertedRoomData),
        paidItems: JSON.stringify(bookingInfo?.paidItems),
        freeItems: JSON.stringify(bookingInfo?.freeItems),
        totalPaidItemsPrice: bookingInfo?.totalPaidItemsPrice,
        totalFreeItemsPrice: bookingInfo?.totalFreeItemsPrice,
        totalRoomPrice: totalRoomPrice,
        grandTotal: grandTotal,
        totalDays: bookingInfo?.totalDays,
        startTime: bookingInfo?.startTime,
        endTime: bookingInfo?.endTime,
        createdBy: decodeToken?.userId,
      };

      try {
        const { data } = await axios.post(
          AppURL.roomBookingApi,
          submittedData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${decodeToken?.token}`,
            },
          }
        );

        if (data?.status === 201) {
          toast.success(data?.message);
          setBoolStatus((prev) => ({
            ...prev,
            checkedStatus: false,
          }));
          setBookingInfo((prev) => ({
            ...prev,
            personInfo: null,
            totalDays: 0,
          }));
          setFetchData((prev) => ({
            ...prev,
            availableRoom: [],
          }));
        }
      } catch (error: any) {
        toast.error("Failed to booking room !");
      }
    } else {
      toast.error("Please complete the required fields !");
    }
  };

  const size = useWindowSize();
  const windowHeight: any = size && size?.height;

  const totalRoomPrice =
    bookingInfo.roomInfo && bookingInfo.roomInfo?.length > 0
      ? bookingInfo.roomInfo.reduce(
          (sum: any, { roomInfo }: any) => sum + parseFloat(roomInfo.roomPrice),
          0
        )
      : 0;

  const grandTotal =
    // @ts-ignore
    parseFloat(totalRoomPrice) * parseInt(bookingInfo?.totalDays) +
    (bookingInfo?.totalPaidItemsPrice
      ? // @ts-ignore
        parseFloat(bookingInfo?.totalPaidItemsPrice)
      : 0);

  const isRequiredToBookingRoom =
    bookingInfo?.personInfo &&
    bookingInfo?.roomInfo &&
    bookingInfo?.roomInfo?.length > 0 &&
    bookingInfo?.startTime &&
    bookingInfo?.endTime;

  // console.log(bookingInfo?.startTime, bookingInfo?.endTime);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div
        className={`flex flex-col ${
          getDrawerStatus ? "pl-[265px]" : "pl-0"
        } max-h-screen  justify-center `}
      >
        <div className="flex items-center justify-center w-100p h-10 mb-4">
          <ComBtn
            className={
              userType?.internal
                ? "bg-primary50 text-white"
                : "bg-primary80 text-black"
            }
            onClick={() => {
              setUserType({
                internal: true,
                external: false,
              });
            }}
            label="Internal Employee"
          />
          <ComBtn
            className={
              userType?.external
                ? "bg-primary50 text-white"
                : "bg-primary80 text-black"
            }
            onClick={() => {
              setUserType({
                internal: false,
                external: true,
              });
            }}
            label="External"
          />
        </div>
        <div className="flex flex-col min-h-[70%] overflow-y-auto pb-20">
          {userType?.internal && (
            <div>
              <h1>
                Internal user informations added searching by Employee Id &
                Employee Name
              </h1>
            </div>
          )}
          {userType?.external && (
            <div className="flex flex-col xl:flex-row w-full h-80p">
              <div className="flex flex-col w-full xl:w-1/3 h-100p">
                {!boolStatus?.checkedStatus ? (
                  <div className="flex flex-col w-full  ">
                    <div
                      className={`flex w-full bg-white items-center  justify-between p-2 ${
                        !boolStatus?.checkedStatus
                          ? "rounded-lg"
                          : "rounded-t-lg"
                      }`}
                    >
                      <input
                        className="w-2/3 font-workSans text-black bg-primary95 mr-3 p-2 border-2 border-slate-300 rounded-lg outline-none focus:outline-none"
                        placeholder="Search by name / contact no / email"
                        value={personInfo?.searchKey}
                        onChange={(e) =>
                          setPersonInfo((prev: any) => ({
                            ...prev,
                            searchKey: e.target.value,
                          }))
                        }
                      />
                      <button
                        className="flex bg-primary70  w-1/3 items-center justify-center font-workSans text-sm py-2 px-2 rounded-lg text-black hover:bg-primary40 hover:text-white"
                        onClick={() => {
                          setBoolStatus((prev) => ({
                            ...prev,
                            isAddNew: true,
                            isUpdate: false,
                          }));
                        }}
                      >
                        <FaPlus size={18} className="cursor-pointer mr-2" />
                        Add New Person
                      </button>
                    </div>
                    <div
                      className={`flex flex-col items-center bg-gray-100 h-96  ${
                        windowHeight > 750 ? "xl:h-90p" : "xl:h-70p"
                      } overflow-y-auto rounded-b-lg `}
                    >
                      {personInfo?.searchData &&
                        personInfo?.searchData?.length > 0 &&
                        personInfo.searchData?.map(
                          (person: any, personIndex: number) => {
                            const isFirst = personIndex === 0;
                            const isLast =
                              personIndex ===
                              personInfo?.searchData?.length - 1;

                            const firstStyle = isFirst && "mt-4";
                            const lastStyle = isLast && "mb-4";
                            const notLastStyle = !isLast && "mb-2";
                            const isSelected =
                              (personInfo.selectedPerson &&
                                personInfo.selectedPerson.personalPhoneNo ===
                                  person.personalPhoneNo &&
                                personInfo.selectedPerson.email ===
                                  person.email) ||
                              false;

                            return (
                              <SearchPersonCard
                                key={personIndex}
                                person={person}
                                isSelected={isSelected}
                                onSelect={() => handlePersonSelect(person)}
                                firstStyle={firstStyle}
                                lastStyle={lastStyle}
                                notLastStyle={notLastStyle}
                                onEdit={() => {
                                  setBoolStatus((prev) => ({
                                    ...prev,
                                    isUpdate: true,
                                  }));
                                }}
                                onDelete={() => {
                                  setBoolStatus((prev) => ({
                                    ...prev,
                                    isDelete: true,
                                  }));
                                  setPersonInfo((prev) => ({
                                    ...prev,
                                    personId: person?.personId,
                                  }));
                                }}
                                isChecked={boolStatus?.checkedStatus}
                                handleChecked={async (event: any) => {
                                  await setBoolStatus((prev) => ({
                                    ...prev,
                                    checkedStatus: event.target.checked,
                                  }));
                                  const isChecked = await event.target.checked;

                                  if (isChecked) {
                                    setBookingInfo((prev) => ({
                                      ...prev,
                                      personInfo: person,
                                    }));
                                  } else {
                                    setBookingInfo((prev) => ({
                                      ...prev,
                                      personInfo: null,
                                      totalDays: 0,
                                    }));
                                  }
                                }}
                              />
                            );
                          }
                        )}

                      {personInfo?.searchKey?.trim() &&
                        personInfo?.searchData?.length <= 0 && (
                          <div className="flex flex-col my-5 items-center justify-center ">
                            <p className="font-workSans text-red-500 text-md">
                              No person founds !
                            </p>
                          </div>
                        )}
                    </div>
                  </div>
                ) : (
                  <PersonCard
                    personData={bookingInfo?.personInfo}
                    cancelFunc={() => {
                      if (boolStatus?.isViewDetails) {
                        toast.error("Please close room details, first !");
                      } else {
                        setBoolStatus((prev) => ({
                          ...prev,
                          checkedStatus: false,
                        }));
                        setBookingInfo((prev) => ({
                          ...prev,
                          personInfo: null,
                          totalDays: 0,
                        }));
                        setFetchData((prev) => ({
                          ...prev,
                          availableRoom: [],
                        }));
                      }
                    }}
                  />
                )}
                {boolStatus?.checkedStatus && !boolStatus?.isViewDetails && (
                  <div className="w-full ">
                    <DateWiseAvailableCard
                      token={decodeToken?.token}
                      userId={decodeToken?.userId}
                      onAddSuccess={(response) => {
                        if (response?.status == 200) {
                          toast.success(response.message);
                          setFetchData((prev) => ({
                            ...prev,
                            availableRoom: response?.data,
                          }));
                          setBookingInfo((prev: any) => ({
                            ...prev,
                            totalDays: noOfDays(
                              bookingInfo?.startTime,
                              bookingInfo?.endTime
                            ),
                          }));
                        }
                      }}
                      onPassItems={(resTime) => {
                        setBookingInfo((prev) => ({
                          ...prev,
                          startTime: resTime?.startTime,
                          endTime: resTime?.endTime,
                        }));
                      }}
                    />
                  </div>
                )}
                {boolStatus?.checkedStatus &&
                  boolStatus?.isViewDetails &&
                  fetchData?.roomDetails?.length > 0 && (
                    <RoomDetailsCard
                      rDetails={fetchData?.roomDetails[0]}
                      cancelFunc={() => {
                        setBoolStatus((prev) => ({
                          ...prev,
                          isViewDetails: false,
                        }));
                      }}
                    />
                  )}
              </div>
              {boolStatus?.checkedStatus && (
                <div className="flex flex-col w-full xl:w-2/3 xl:ml-4  overflow-y-auto pb-28">
                  <RoomTable
                    className="w-full p-4"
                    roomData={fetchData?.availableRoom}
                    onPassItems={async (itemRess: any) => {
                      const convertedRoom = await itemRess.map((room: any) => ({
                        ...room,
                        roomInfo: {
                          ...room.roomInfo,
                          startTime: bookingInfo?.startTime,
                          endTime: bookingInfo?.endTime,
                        },
                      }));

                      await setBookingInfo((prev) => ({
                        ...prev,
                        roomInfo: convertedRoom,
                      }));
                    }}
                  />
                  <AvailableRoomItemCard
                    onPassItems={(itemRes) => {
                      setBookingInfo((prev) => ({
                        ...prev,
                        paidItems: itemRes?.paidItems,
                        freeItems: itemRes?.freeItems,
                        totalPaidItemsPrice: itemRes?.totalPaidItemAmount,
                        totalFreeItemsPrice: itemRes?.totalFreeItemAmount,
                      }));
                    }}
                    className="w-full p-4 my-3"
                    token={decodeToken?.token}
                    userId={decodeToken?.userId}
                  />

                  <div className="flex flex-col items-start w-[100%]  rounded-lg bg-white shadow-lg p-3 my-4">
                    <div className="flex flex-col items-end">
                      <VerticalView
                        label="Total Reservation Days"
                        value={bookingInfo?.totalDays}
                      />
                      <VerticalView
                        label="Total Room Price Per Day (৳)"
                        value={totalRoomPrice}
                        className="my-1"
                      />
                      <VerticalView
                        label="Total Paid Items Price (৳)"
                        value={
                          bookingInfo?.totalPaidItemsPrice
                            ? bookingInfo?.totalPaidItemsPrice
                            : "0"
                        }
                        className="my-1"
                      />
                      <VerticalView
                        label="Grand Total (৳) "
                        value={grandTotal}
                        className="my-1"
                      />
                    </div>
                    <div
                      className="flex items-center justify-center mt-4 w-full"
                      onClick={() => {
                        roomBookingFunc();
                      }}
                    >
                      <button className="font-workSans text-black bg-primary80 rounded-md py-2 px-5 shadow-lg ">
                        Room Booking
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <AddNewPersonModal
            title={
              boolStatus?.isUpdate
                ? "Updated Person informations"
                : "Entrry New Persons Details"
            }
            isVisible={
              boolStatus?.isAddNew
                ? boolStatus?.isAddNew
                : boolStatus?.isUpdate
                ? boolStatus?.isUpdate
                : false
            }
            onCancel={() => {
              setBoolStatus((prev) => ({
                ...prev,
                isAddNew: false,
                isUpdate: false,
              }));
            }}
            userId={decodeToken?.userId}
            token={decodeToken?.token}
            onAddSuccess={(response: any) => {
              if (response.trim()) {
                setBoolStatus((prev) => ({
                  ...prev,
                  isAddNew: false,
                  isUpdate: false,
                }));
                setPersonInfo((prev) => ({ ...prev, searchKey: response }));
              }
            }}
            updateData={
              boolStatus?.isUpdate ? personInfo?.selectedPerson : null
            }
            isUpdate={boolStatus?.isUpdate}
          />
          <DeleteModal
            title="Do you want to delete ?"
            description="You're going to delete this person info ."
            onConfirm={personInfoDeleteFunc}
            onCancel={() => {
              setBoolStatus((prev) => ({ ...prev, isDelete: false }));
            }}
            isVisible={boolStatus?.isDelete}
          />
        </div>
      </div>
    </Suspense>
  );
};

export default RoomAssignmentsPage;

interface comBtnInterface {
  className?: string;
  onClick?: () => void;
  label?: string;
}

const ComBtn: FC<comBtnInterface> = ({ className, onClick, label }) => {
  return (
    <button
      className={`${className} font-workSans text-md py-2 px-8 rounded-lg  mr-5`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

/*

submittedData = {
  "personInfo": {
    "personId": 1,
    "name": "Imdadul Haque",
    "companyName": "Snowtex Group",
    "personalPhoneNo": "01773964101",
    "companyPhoneNo": "01773964101",
    "email": "imddulhaque1440@gmail.com",
    "nidBirthPassport": "5552902107",
    "countryName": "Bangladesh",
    "address": "Dhamrai, Savar, Dhaka, Bangladesh",
    "isApprove": false,
    "approvedBy": null,
    "isActive": true,
    "inactiveBy": null,
    "inactiveTime": null,
    "createdBy": 6,
    "createdTime": "2025-02-03T09:02:08.253",
    "updatedBy": null,
    "updatedTime": null
  },
  "roomInfo": [
    {
      "roomInfo": {
        "roomId": 1005,
        "roomName": "Test - Room - one",
        "roomDescription": "Testing purpose room created - Test - Room - one",
        "remarks": "Demo Remarks",
        "roomCategoryId": 6,
        "floorId": 4,
        "buildingId": 2,
        "isRoomAvailable": true,
        "haveRoomDetails": false,
        "isApprove": false,
        "isActive": true,
        "inactiveBy": null,
        "createdBy": 6,
        "createdTime": "2025-01-07T10:49:10.693",
        "updatedBy": 6,
        "updatedTime": "2025-01-07T13:39:22.333",
        "floorName": "Floor - BB",
        "buildingName": "SOL",
        "roomCategoryName": "Double room",
        "roomWisePerson": 2,
        "roomPrice": "255",
        "startTime": "2025-02-26T03:29:00.000Z",
        "endTime": "2025-02-27T03:30:00.000Z"
      },
      "roomWisePerson": [
        {
          "name": "wefsdgfd dfgdfgdfgfdg",
          "phone": "01773964101",
          "email": "imdadulhaque@gmail.com",
          "nidBirth": "3424234234",
          "age": "453"
        },
        {
          "name": "eggdfg fhfghfgbfghfghb fdfg",
          "phone": "01773964101",
          "email": "imdad1440@gmail.com",
          "nidBirth": "3424234234",
          "age": "345"
        }
      ]
    },
    {
      "roomInfo": {
        "roomId": 1006,
        "roomName": "Test - Room",
        "roomDescription": "Testing purpose room created",
        "remarks": "Demo Remarks",
        "roomCategoryId": 1,
        "floorId": 2,
        "buildingId": 2,
        "isRoomAvailable": true,
        "haveRoomDetails": true,
        "isApprove": false,
        "isActive": true,
        "inactiveBy": null,
        "createdBy": 6,
        "createdTime": "2025-01-07T16:02:13.157",
        "updatedBy": null,
        "updatedTime": null,
        "floorName": "Floor - B",
        "buildingName": "SOL",
        "roomCategoryName": "Single room",
        "roomWisePerson": 1,
        "roomPrice": "100",
        "startTime": "2025-02-26T03:29:00.000Z",
        "endTime": "2025-02-27T03:30:00.000Z"
      },
      "roomWisePerson": [
        {
          "name": "qweqweqwe",
          "phone": "01773964101",
          "email": "imdad@gmail.com",
          "nidBirth": "3424234234",
          "age": "123"
        }
      ]
    }
  ],
  "paidItems": [
    {
      "itemId": 1003,
      "name": "Gamcha",
      "price": "150",
      "actualPrice": "150",
      "paidOrFree": 1,
      "itemQty": 1,
      "remarks": "Permanently......"
    },
    {
      "itemId": 1006,
      "name": "New Brush",
      "price": "55",
      "actualPrice": "55",
      "paidOrFree": 1,
      "itemQty": 1,
      "remarks": "Permanently...."
    }
  ],
  "freeItems": [
    {
      "itemId": 1,
      "name": "Tawel",
      "price": "50",
      "actualPrice": "50",
      "paidOrFree": 2,
      "itemQty": 1,
      "remarks": "Only for using purpose"
    },
    {
      "itemId": 1002,
      "name": "Tissue",
      "price": "30",
      "actualPrice": "30",
      "paidOrFree": 2,
      "itemQty": 1,
      "remarks": "Only for  using perpose."
    },
    {
      "itemId": 1004,
      "name": "Soap",
      "price": "100",
      "actualPrice": "100",
      "paidOrFree": 2,
      "itemQty": 1,
      "remarks": "Permanently...."
    },
    {
      "itemId": 1005,
      "name": "Shampo",
      "price": "5",
      "actualPrice": "5",
      "paidOrFree": 2,
      "itemQty": 1,
      "remarks": "Only for using perpose."
    }
  ],
  "totalPaidItemsPrice": 205,
  "totalFreeItemsPrice": 185,
  "totalRoomPrice": 355,
  "grandTotal": 560,
  "totalDays": 1,
  "startTime": "2025-02-26T03:29:00.000Z",
  "endTime": "2025-02-27T03:30:00.000Z",
  "createdBy": "6"
}




*/

const convertedData = {
  personInfo: {
    personId: 1,
    name: "Imdadul Haque",
    companyName: "Snowtex Group",
    personalPhoneNo: "01773964101",
    companyPhoneNo: "01773964101",
    email: "imddulhaque1440@gmail.com",
    nidBirthPassport: "5552902107",
    countryName: "Bangladesh",
    address: "Dhamrai, Savar, Dhaka, Bangladesh",
    isApprove: false,
    approvedBy: null,
    isActive: true,
    inactiveBy: null,
    inactiveTime: null,
    createdBy: 6,
    createdTime: "2025-02-03T09:02:08.253",
    updatedBy: null,
    updatedTime: null,
  },
  roomInfo: [
    {
      roomId: 1005,
      roomName: "Test - Room - one",
      roomDescription: "Testing purpose room created - Test - Room - one",
      remarks: "Demo Remarks",
      roomCategoryId: 6,
      floorId: 4,
      buildingId: 2,
      isRoomAvailable: true,
      haveRoomDetails: false,
      isApprove: false,
      isActive: true,
      inactiveBy: null,
      createdBy: 6,
      createdTime: "2025-01-07T10:49:10.693",
      updatedBy: 6,
      updatedTime: "2025-01-07T13:39:22.333",
      floorName: "Floor - BB",
      buildingName: "SOL",
      roomCategoryName: "Double room",
      noOfRoomWisePerson: 2,
      roomPrice: "255",
      startTime: "2025-02-26T03:29:00.000Z",
      endTime: "2025-02-27T03:30:00.000Z",
      roomWisePerson: [
        {
          name: "wefsdgfd dfgdfgdfgfdg",
          phone: "01773964101",
          email: "imdadulhaque@gmail.com",
          nidBirth: "3424234234",
          age: "453",
        },
        {
          name: "eggdfg fhfghfgbfghfghb fdfg",
          phone: "01773964101",
          email: "imdad1440@gmail.com",
          nidBirth: "3424234234",
          age: "345",
        },
      ],
    },
    {
      roomId: 1006,
      roomName: "Test - Room",
      roomDescription: "Testing purpose room created",
      remarks: "Demo Remarks",
      roomCategoryId: 1,
      floorId: 2,
      buildingId: 2,
      isRoomAvailable: true,
      haveRoomDetails: true,
      isApprove: false,
      isActive: true,
      inactiveBy: null,
      createdBy: 6,
      createdTime: "2025-01-07T16:02:13.157",
      updatedBy: null,
      updatedTime: null,
      floorName: "Floor - B",
      buildingName: "SOL",
      roomCategoryName: "Single room",
      noOfRoomWisePerson: 1,
      roomPrice: "100",
      startTime: "2025-02-26T03:29:00.000Z",
      endTime: "2025-02-27T03:30:00.000Z",
      roomWisePerson: [
        {
          name: "qweqweqwe",
          phone: "01773964101",
          email: "imdad@gmail.com",
          nidBirth: "3424234234",
          age: "123",
        },
      ],
    },
  ],
  paidItems: [
    {
      itemId: 1003,
      name: "Gamcha",
      price: "150",
      actualPrice: "150",
      paidOrFree: 1,
      itemQty: 1,
      remarks: "Permanently......",
    },
    {
      itemId: 1006,
      name: "New Brush",
      price: "55",
      actualPrice: "55",
      paidOrFree: 1,
      itemQty: 1,
      remarks: "Permanently....",
    },
  ],
  freeItems: [
    {
      itemId: 1,
      name: "Tawel",
      price: "50",
      actualPrice: "50",
      paidOrFree: 2,
      itemQty: 1,
      remarks: "Only for using purpose",
    },
    {
      itemId: 1002,
      name: "Tissue",
      price: "30",
      actualPrice: "30",
      paidOrFree: 2,
      itemQty: 1,
      remarks: "Only for  using perpose.",
    },
    {
      itemId: 1004,
      name: "Soap",
      price: "100",
      actualPrice: "100",
      paidOrFree: 2,
      itemQty: 1,
      remarks: "Permanently....",
    },
    {
      itemId: 1005,
      name: "Shampo",
      price: "5",
      actualPrice: "5",
      paidOrFree: 2,
      itemQty: 1,
      remarks: "Only for using perpose.",
    },
  ],
  totalPaidItemsPrice: 205,
  totalFreeItemsPrice: 185,
  totalRoomPrice: 355,
  grandTotal: 560,
  totalDays: 1,
  startTime: "2025-02-26T03:29:00.000Z",
  endTime: "2025-02-27T03:30:00.000Z",
  createdBy: "6",
};

const roomData = [
  {
    roomInfo: {
      // remove this
      roomId: 1005,
      roomName: "Test - Room - one",
      roomDescription: "Testing purpose room created - Test - Room - one",
      remarks: "Demo Remarks",
      roomCategoryId: 6,
      floorId: 4,
      buildingId: 2,
      isRoomAvailable: true,
      haveRoomDetails: false,
      isApprove: false,
      isActive: true,
      inactiveBy: null,
      createdBy: 6,
      createdTime: "2025-01-07T10:49:10.693",
      updatedBy: 6,
      updatedTime: "2025-01-07T13:39:22.333",
      floorName: "Floor - BB",
      buildingName: "SOL",
      roomCategoryName: "Double room",
      roomWisePerson: 2,
      roomPrice: "255",
      startTime: "2025-02-26T03:45:00.000Z",
      endTime: "2025-02-27T03:45:00.000Z",
    },
    roomWisePersonInfo: [
      {
        name: "Person - 02",
        phone: "01773964101",
        email: "imdadulhaque@gmail.com",
        nidBirth: "3424234234",
        age: "234",
      },
      {
        name: "Person - 03",
        phone: "01773964101",
        email: "imdad1440@gmail.com",
        nidBirth: "3424234234",
        age: "456",
      },
    ],
  },
  {
    roomInfo: {
      // remove this
      roomId: 1006,
      roomName: "Test - Room",
      roomDescription: "Testing purpose room created",
      remarks: "Demo Remarks",
      roomCategoryId: 1,
      floorId: 2,
      buildingId: 2,
      isRoomAvailable: true,
      haveRoomDetails: true,
      isApprove: false,
      isActive: true,
      inactiveBy: null,
      createdBy: 6,
      createdTime: "2025-01-07T16:02:13.157",
      updatedBy: null,
      updatedTime: null,
      floorName: "Floor - B",
      buildingName: "SOL",
      roomCategoryName: "Single room",
      roomWisePerson: 1,
      roomPrice: "100",
      startTime: "2025-02-26T03:45:00.000Z",
      endTime: "2025-02-27T03:45:00.000Z",
    },
    roomWisePersonInfo: [
      {
        name: "Person - 01",
        phone: "01773964101",
        email: "imdad@gmail.com",
        nidBirth: "3424234234",
        age: "12",
      },
    ],
  },
];

// converted roomData like below format using JS in optimized way:

const convertedRoomData = [
  {
    roomId: 1005,
    roomName: "Test - Room - one",
    roomDescription: "Testing purpose room created - Test - Room - one",
    remarks: "Demo Remarks",
    roomCategoryId: 6,
    floorId: 4,
    buildingId: 2,
    isRoomAvailable: true,
    haveRoomDetails: false,
    isApprove: false,
    isActive: true,
    inactiveBy: null,
    createdBy: 6,
    createdTime: "2025-01-07T10:49:10.693",
    updatedBy: 6,
    updatedTime: "2025-01-07T13:39:22.333",
    floorName: "Floor - BB",
    buildingName: "SOL",
    roomCategoryName: "Double room",
    roomWisePerson: 2,
    roomPrice: "255",
    startTime: "2025-02-26T03:45:00.000Z",
    endTime: "2025-02-27T03:45:00.000Z",
    roomWisePersonInfo: [
      {
        name: "Person - 02",
        phone: "01773964101",
        email: "imdadulhaque@gmail.com",
        nidBirth: "3424234234",
        age: "234",
      },
      {
        name: "Person - 03",
        phone: "01773964101",
        email: "imdad1440@gmail.com",
        nidBirth: "3424234234",
        age: "456",
      },
    ],
  },
  {
    roomId: 1006,
    roomName: "Test - Room",
    roomDescription: "Testing purpose room created",
    remarks: "Demo Remarks",
    roomCategoryId: 1,
    floorId: 2,
    buildingId: 2,
    isRoomAvailable: true,
    haveRoomDetails: true,
    isApprove: false,
    isActive: true,
    inactiveBy: null,
    createdBy: 6,
    createdTime: "2025-01-07T16:02:13.157",
    updatedBy: null,
    updatedTime: null,
    floorName: "Floor - B",
    buildingName: "SOL",
    roomCategoryName: "Single room",
    roomWisePerson: 1,
    roomPrice: "100",
    startTime: "2025-02-26T03:45:00.000Z",
    endTime: "2025-02-27T03:45:00.000Z",
    roomWisePersonInfo: [
      {
        name: "Person - 01",
        phone: "01773964101",
        email: "imdad@gmail.com",
        nidBirth: "3424234234",
        age: "12",
      },
    ],
  },
];
