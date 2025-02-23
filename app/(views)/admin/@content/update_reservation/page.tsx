"use client";

import React, { FC, Suspense, useEffect, useState } from "react";
import jwtDecode from "jsonwebtoken";
import { useAppContext } from "@/app/_stateManagements/contextApi";
import retrieveToken from "@/app/_utils/handler/retrieveToken";
import { tokenInterface } from "@/interface/admin/decodeToken/tokenInterface";
import UpdateReservationRoomCard from "@/app/_components/card/UpdateReservationRoomCard";
import axios from "axios";
import AppURL from "@/app/_restApi/AppURL";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import { IoIosAddCircle } from "react-icons/io";
import { PiMinusCircleFill } from "react-icons/pi";
import VerticalView from "@/app/_components/comView/VerticalView";
import TableHeader from "@/app/_components/inputField/table/TableHeader";
import ComView from "@/app/_components/comView/ComView";
import { formatDate, isToday } from "@/app/_utils/handler/formateDate";

import FromToActionCard from "@/app/_components/card/FromToActionCard";
import ComInputView from "@/app/_components/inputField/ComInputView";
import VertcialRadioBtn from "@/app/_components/radioBtn/VertcialRadioBtn";
import Checkbox from "@/app/_components/inputField/checkbox/Checkbox";
import UpdateRoomItemCard from "@/app/_components/card/UpdateRoomItemCard";

interface Props {}
interface fetchInterface {
  bookedRoom: any;
  updatedRoom: any;
  availableRoom: any;
}

const RoomReservationUpdatePage: FC<Props> = (props) => {
  const { getDrawerStatus } = useAppContext();
  const [decodeToken, setDecodeToken] = useState<tokenInterface>({
    userId: "",
    name: "",
    email: "",
    token: "",
    expireDate: null,
  });

  const [boolStatus, setBoolStatus] = useState({
    haveBookedRoom: false,
    haveAvailableRoom: false,
  });

  const [fetchData, setFetchData] = useState<fetchInterface>({
    bookedRoom: [],
    updatedRoom: null,
    availableRoom: [],
  });

  const [updateInfo, setUpdateInfo] = useState({
    startTime: "",
    endTime: "",
    updatedRoomId: null,
    checkedUpdatedRoom: [] as any[],
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
      fetchBookedRoom(decodeToken?.token);
    }
  }, [decodeToken?.token, decodeToken?.userId]);

  const fetchBookedRoom = async (token: string) => {
    try {
      const { data } = await axios.get(`${AppURL.roomBookingApi}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (data?.status == 200) {
        const formattedData = parseJsonFields(data?.data);
        setFetchData((prev) => ({ ...prev, bookedRoom: formattedData }));
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const cancelFunc = () => {
    setFetchData((prev: any) => ({
      ...prev,
      updatedRoom: null,
    }));
    setBoolStatus((prev) => ({ ...prev, haveBookedRoom: false }));
  };

  const [roomPersons, setRoomPersons] = useState<{
    [key: string]: {
      roomInfo: any;
      roomWisePersonInfo: {
        name: string;
        phone: string;
        email: string;
        nidBirth: string;
        age: string;
      }[];
    };
  }>({});

  const handleAddPerson = (roomInfo: any) => {
    const noOfPerson: number = roomPersons[roomInfo?.roomId]?.roomWisePersonInfo
      ? roomPersons[roomInfo?.roomId]?.roomWisePersonInfo?.length
      : 0;

    if (noOfPerson < roomInfo?.roomWisePerson) {
      setRoomPersons((prev) => {
        const updatedRoom = prev[roomInfo?.roomId] || {
          roomInfo:
            fetchData?.availableRoom.find(
              (room: any) => room.roomId === roomInfo?.roomId
            ) || {},
          roomWisePersonInfo: [],
        };

        return {
          ...prev,
          [roomInfo?.roomId]: {
            ...updatedRoom,
            roomWisePersonInfo: [
              ...updatedRoom.roomWisePersonInfo,
              { name: "", phone: "", email: "", nidBirth: "", age: "" },
            ],
          },
        };
      });
    } else {
      toast.error("Limitted person already exists !");
    }
  };

  const handleRemovePerson = (roomId: string, index: number) => {
    setRoomPersons((prev) => {
      if (!prev[roomId]) return prev;

      const updatedPersons = prev[roomId].roomWisePersonInfo.filter(
        (_, i) => i !== index
      );
      return {
        ...prev,
        [roomId]: { ...prev[roomId], roomWisePersonInfo: updatedPersons },
      };
    });
  };

  // const addToBookedRoomFunc = async (pRoomInfo: any) => {
  //   await setUpdateInfo((prev: any) => {
  //     const isChecked = prev.checkedUpdatedRoom.some(
  //       (room: any) => room.roomId === pRoomInfo.roomId
  //     );

  //     return {
  //       ...prev,
  //       checkedUpdatedRoom: isChecked
  //         ? prev.checkedUpdatedRoom.filter(
  //             (room: any) => room.roomId !== pRoomInfo.roomId
  //           ) // Remove if already checked
  //         : [...prev.checkedUpdatedRoom, pRoomInfo], // it makes the nested array as mentioned below, solve it
  //     };
  //   });
  // };

  const addToBookedRoomFunc = (pRoomInfo: any) => {
    setUpdateInfo((prev) => {
      const isChecked = prev.checkedUpdatedRoom.some(
        (room) => room.roomId === pRoomInfo.roomId
      );

      const updatedCheckedRooms = isChecked
        ? prev.checkedUpdatedRoom.filter(
            (room) => room.roomId !== pRoomInfo.roomId
          )
        : [...prev.checkedUpdatedRoom, pRoomInfo];

      setFetchData((fetchPrev) => {
        const updatedRoomList = fetchPrev.updatedRoom.roomInfo.filter(
          (room: any) => room.roomId !== pRoomInfo.roomId
        );

        return {
          ...fetchPrev,
          updatedRoom: {
            ...fetchPrev.updatedRoom,
            roomInfo: isChecked
              ? updatedRoomList
              : [...updatedRoomList, pRoomInfo], // Ensures uniqueness
          },
        };
      });

      return { ...prev, checkedUpdatedRoom: updatedCheckedRooms };
    });
  };

  // console.log(
  //   "roomPersons: ",
  //   JSON.stringify(Object.values(roomPersons), null, 2)
  // );
  // console.log(
  //   "room Persons: ",
  //   JSON.stringify(Object.values(roomPersons), null, 2)
  // );

  console.log(
    "updated Room: ",
    JSON.stringify(fetchData?.updatedRoom, null, 2)
  );

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div
        className={`flex flex-col ${
          getDrawerStatus ? "pl-[265px]" : "pl-0"
        } max-h-screen  justify-center `}
      >
        <div className="overflow-y-auto pb-28">
          {!boolStatus?.haveBookedRoom ? (
            <UpdateReservationRoomCard
              bookedRoom={fetchData?.bookedRoom}
              onPassItems={async (updateItem: any) => {
                if (updateItem) {
                  await setFetchData((prev: any) => ({
                    ...prev,
                    updatedRoom: updateItem,
                  }));
                  await setBoolStatus((prev) => ({
                    ...prev,
                    haveBookedRoom: true,
                  }));
                }
              }}
            />
          ) : (
            <>
              <div className="w-full bg-white p-4 shadow-lg shadow-slate-400 rounded-lg">
                <div className="flex w-full items-center justify-end mb-4 ">
                  <button
                    className="flex bg-slate-50 border-2 border-errorColor hover:border-red-700 rounded-full shadow-2xl"
                    onClick={cancelFunc}
                  >
                    <IoClose
                      size={35}
                      className="cursor-pointer text-errorColor shadow-xl shadow-white hover:text-red-600"
                    />
                  </button>
                </div>

                <div className="flex  justify-between items-center">
                  <div>
                    <VerticalView
                      label="Name"
                      value={fetchData?.updatedRoom?.personInfo?.name}
                      className="my-1"
                    />
                    <VerticalView
                      label="Contact No"
                      value={
                        fetchData?.updatedRoom?.personInfo?.personalPhoneNo
                      }
                      className="my-1"
                    />
                    <VerticalView
                      label="Official Phone No"
                      value={fetchData?.updatedRoom?.personInfo?.companyPhoneNo}
                      className="my-1"
                    />
                    <VerticalView
                      label="Email"
                      value={fetchData?.updatedRoom?.personInfo?.email}
                      className="my-1"
                    />
                    <VerticalView
                      label="NID/Birth/Passport"
                      value={
                        fetchData?.updatedRoom?.personInfo?.nidBirthPassport
                      }
                      className="my-1"
                    />
                    <VerticalView
                      label="Country Name"
                      value={fetchData?.updatedRoom?.personInfo?.countryName}
                      className="my-1"
                    />
                    <VerticalView
                      label="Address"
                      value={fetchData?.updatedRoom?.personInfo?.address}
                      className="my-1"
                    />
                  </div>
                  <div className="flex flex-col justify-end items-end mb-4">
                    <div className="flex p-3  flex-col justify-end items-end">
                      <p className="text-black font-workSans text-xl font-medium">
                        Price Calculations
                      </p>
                      <VerticalView
                        label="Paid Item's Price"
                        value={fetchData?.updatedRoom?.totalPaidItemsPrice}
                        className="my-1"
                      />
                      <VerticalView
                        label="Total Room's Price Per Day"
                        value={fetchData?.updatedRoom?.totalRoomPrice}
                        className="my-1"
                      />
                      <VerticalView
                        label="Total Days"
                        value={fetchData?.updatedRoom?.totalDays}
                        className="my-1"
                      />
                      <VerticalView
                        label="Grand Total"
                        value={fetchData?.updatedRoom?.grandTotal}
                        className="my-1 border-2 p-2 rounded-lg border-slate-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex w-full items-center rounded-t-lg bg-slate-300">
                  <TableHeader
                    headerText="Room No"
                    containerClassName="w-[8%]"
                    hasSearch={false}
                  />
                  <TableHeader
                    headerText="Floor No"
                    containerClassName="w-[8%] border-x-2 border-slate-50"
                    hasSearch={false}
                  />
                  <TableHeader
                    headerText="Building No"
                    containerClassName="w-[10%] "
                    hasSearch={false}
                  />
                  <TableHeader
                    headerText="Category Name"
                    containerClassName="w-[16%] border-x-2 border-slate-50"
                    hasSearch={false}
                  />
                  <TableHeader
                    headerText="Price"
                    containerClassName="w-[8%] "
                    hasSearch={false}
                  />
                  <div className="w-[32%] border-x-2 border-slate-50 ">
                    <p className="text-black text-center font-workSans text-md py-1">
                      Room Wise Person
                    </p>
                    <div className="flex items-center w-full text-sm border-t-2">
                      <TableHeader
                        headerText="Name"
                        containerClassName="w-[40%] "
                        hasSearch={false}
                      />
                      <TableHeader
                        headerText="Phone"
                        containerClassName="w-[30%] border-x-2 border-slate-50"
                        hasSearch={false}
                      />
                      <TableHeader
                        headerText="NID / Birth"
                        containerClassName="w-[30%]"
                        hasSearch={false}
                      />
                    </div>
                  </div>
                  <TableHeader
                    headerText="From Date"
                    containerClassName="w-[9%] "
                    hasSearch={false}
                  />
                  <TableHeader
                    headerText="To Date"
                    containerClassName="w-[9%] border-l-2 border-slate-50 "
                    hasSearch={false}
                  />
                </div>
                <div className="w-full max-h-[300px] overflow-y-auto border-y border-2">
                  {fetchData?.updatedRoom?.roomInfo &&
                  fetchData?.updatedRoom?.roomInfo?.length > 0 ? (
                    fetchData?.updatedRoom.roomInfo.map(
                      (room: any, rIndex: number) => {
                        const isNewRoom = updateInfo?.checkedUpdatedRoom.some(
                          (newRoom: any) => newRoom?.roomId == room?.roomId
                        );
                        return (
                          <div
                            key={rIndex}
                            className={`flex w-full items-center border-b-2 border-slate-300 ${
                              isNewRoom && "bg-green-50"
                            } `}
                          >
                            <ComView value={room.roomName} className="w-[8%]" />
                            <ComView
                              value={room.floorName}
                              className={`w-[8%] border-x-2`} // set here dynamically  height which is calculate dynamically
                            />
                            <ComView
                              value={room?.buildingName}
                              className="w-[10%]"
                            />
                            <ComView
                              value={room?.roomCategoryName}
                              className="w-[16%] border-x-2 "
                            />
                            <ComView
                              value={room.roomPrice}
                              className="w-[8%] "
                            />

                            <div className="w-[32%] border-x-2 border-slate-300">
                              {room?.roomWisePersonInfo &&
                              room?.roomWisePersonInfo?.length > 0 ? (
                                room.roomWisePersonInfo.map(
                                  (person: any, pIndex: number) => {
                                    const isLast =
                                      pIndex ==
                                      room.roomWisePersonInfo?.length - 1;
                                    return (
                                      <div
                                        key={pIndex}
                                        className={`flex items-center w-full ${
                                          !isLast && "border-b-2"
                                        } border-slate-300 py-1`}
                                      >
                                        <ComView
                                          value={person.name}
                                          className="w-[40%]"
                                        />
                                        <ComView
                                          value={person?.phone}
                                          className="w-[30%] border-x-2"
                                        />
                                        <ComView
                                          value={person?.nidBirth}
                                          className="w-[30%] "
                                        />
                                      </div>
                                    );
                                  }
                                )
                              ) : (
                                <p>No person founds!</p>
                              )}
                            </div>
                            <ComView
                              value={
                                room?.startTime
                                  ? formatDate(room?.startTime)
                                  : ""
                              }
                              className="w-[9%]  border-r-2"
                            />
                            <ComView
                              value={
                                room?.endTime ? formatDate(room?.endTime) : ""
                              }
                              className="w-[9%] "
                            />
                          </div>
                        );
                      }
                    )
                  ) : (
                    <p>Room not founds !</p>
                  )}
                </div>
                <div className="flex w-full items-end justify-end mt-3">
                  <FromToActionCard
                    token={decodeToken.token}
                    onPassItems={async (res: any) => {
                      if (res?.itemRess) {
                        await setFetchData((prev) => ({
                          ...prev,
                          availableRoom: res?.itemRess?.data,
                        }));
                        await setUpdateInfo((prev) => ({
                          ...prev,
                          startTime: res?.startTime,
                          endTime: res?.endTime,
                        }));
                        await setBoolStatus((prev) => ({
                          ...prev,
                          haveAvailableRoom: true,
                        }));
                      }
                    }}
                  />
                </div>
              </div>
              {boolStatus?.haveAvailableRoom && (
                <div className="w-full bg-white p-4 shadow-lg shadow-slate-400 rounded-lg my-4">
                  {fetchData?.availableRoom &&
                  fetchData?.availableRoom?.length > 0 ? (
                    <>
                      <div className="flex w-full items-center rounded-t-lg bg-slate-300">
                        <TableHeader
                          headerText="Room No"
                          containerClassName="w-[8%]"
                          hasSearch={false}
                        />
                        <TableHeader
                          headerText="Floor No"
                          containerClassName="w-[8%] border-x-2 border-slate-50"
                          hasSearch={false}
                        />
                        <TableHeader
                          headerText="Building No"
                          containerClassName="w-[8%] "
                          hasSearch={false}
                        />
                        <TableHeader
                          headerText="Category Name"
                          containerClassName="w-[16%] border-x-2 border-slate-50"
                          hasSearch={false}
                        />
                        <TableHeader
                          headerText="Price"
                          containerClassName="w-[6%]"
                          hasSearch={false}
                        />
                        <div className="w-[32%] border-x-2 border-slate-50 ">
                          <p className="text-black text-center font-workSans text-md py-1">
                            Room Wise Person
                          </p>
                          <div className="flex items-center w-full text-sm border-t-2">
                            <TableHeader
                              headerText="Name"
                              containerClassName="w-[30%] "
                              hasSearch={false}
                            />
                            <TableHeader
                              headerText="Phone"
                              containerClassName="w-[25%] border-x-2 border-slate-50"
                              hasSearch={false}
                            />
                            <TableHeader
                              headerText="NID / Birth"
                              containerClassName="w-[30%] border-r-2 border-slate-50"
                              hasSearch={false}
                            />
                            <TableHeader
                              headerText="Action"
                              containerClassName="w-[15%]"
                              hasSearch={false}
                            />
                          </div>
                        </div>
                        <TableHeader
                          headerText="From Date"
                          containerClassName="w-[9%] "
                          hasSearch={false}
                        />
                        <TableHeader
                          headerText="To Date"
                          containerClassName="w-[8%] border-x-2 border-slate-50"
                          hasSearch={false}
                        />
                        <TableHeader
                          headerText="Check"
                          containerClassName="w-[5%] "
                          hasSearch={false}
                        />
                      </div>
                      <div className="w-full max-h-[300px] overflow-y-auto border-y border-2 bg-slate-100">
                        {fetchData?.availableRoom.map(
                          (room: any, rIndex: number) => {
                            const isAbleToAddPerson =
                              parseInt(room?.roomWisePerson) > 0;

                            const isChecked =
                              updateInfo?.checkedUpdatedRoom.some(
                                (checkedRoom: any) =>
                                  checkedRoom?.roomId == room?.roomId
                              );

                            return (
                              <div
                                key={rIndex}
                                className={`flex w-full items-center border-b-2 border-slate-300  `}
                              >
                                <ComView
                                  value={room.roomName}
                                  className="w-[8%]"
                                />
                                <ComView
                                  value={room.floorName}
                                  className={`w-[8%] border-x-2`}
                                />
                                <ComView
                                  value={room?.buildingName}
                                  className="w-[8%]"
                                />
                                <ComView
                                  value={room?.roomCategoryName}
                                  className="w-[16%] border-x-2 "
                                />
                                <ComView
                                  value={room.roomPrice}
                                  className="w-[6%] "
                                />
                                <div className="flex flex-col  w-[32%] border-x-2 border-slate-300 ">
                                  {roomPersons[room.roomId]
                                    ?.roomWisePersonInfo &&
                                  roomPersons[room.roomId]?.roomWisePersonInfo
                                    ?.length > 0 ? (
                                    <>
                                      {roomPersons[
                                        room.roomId
                                      ]?.roomWisePersonInfo.map(
                                        (person, pIndex) => {
                                          const isLastPerson =
                                            pIndex ==
                                            roomPersons[room.roomId]
                                              ?.roomWisePersonInfo?.length -
                                              1;

                                          return (
                                            <div
                                              key={pIndex}
                                              className={`flex items-center ${
                                                !isLastPerson &&
                                                "border-b-2 border-slate-300"
                                              }`}
                                            >
                                              <ComInputView
                                                placeholder="Enter name"
                                                className="w-[30%] py-1"
                                                type="text"
                                                name="personInfo"
                                                // @ts-ignore
                                                value={person.name}
                                                onChange={(
                                                  e: React.ChangeEvent<HTMLInputElement>
                                                ) => {
                                                  const newName =
                                                    e.target.value;
                                                  setRoomPersons((prev) => ({
                                                    ...prev,
                                                    [room.roomId]: {
                                                      ...prev[room.roomId],
                                                      roomWisePersonInfo: prev[
                                                        room.roomId
                                                      ].roomWisePersonInfo.map(
                                                        (p, idx) =>
                                                          idx === pIndex
                                                            ? {
                                                                ...p,
                                                                name: newName,
                                                              }
                                                            : p
                                                      ),
                                                    },
                                                  }));
                                                }}
                                              />
                                              <ComInputView
                                                placeholder="Enter mobile"
                                                className="w-[25%] border-x-2 py-1"
                                                type="tel"
                                                name="personInfo"
                                                // @ts-ignore
                                                value={person.phone}
                                                onChange={(
                                                  e: React.ChangeEvent<HTMLInputElement>
                                                ) => {
                                                  const newPhone =
                                                    e.target.value;
                                                  setRoomPersons((prev) => ({
                                                    ...prev,
                                                    [room.roomId]: {
                                                      ...prev[room.roomId],
                                                      roomWisePersonInfo: prev[
                                                        room.roomId
                                                      ].roomWisePersonInfo.map(
                                                        (p, idx) =>
                                                          idx === pIndex
                                                            ? {
                                                                ...p,
                                                                phone: newPhone,
                                                              }
                                                            : p
                                                      ),
                                                    },
                                                  }));
                                                }}
                                              />
                                              <ComInputView
                                                placeholder="Enter NID / Birthday"
                                                className="w-[30%] border-r-2 py-1"
                                                type="text"
                                                name="personInfo"
                                                // @ts-ignore
                                                value={person.nidBirth}
                                                onChange={(
                                                  e: React.ChangeEvent<HTMLInputElement>
                                                ) => {
                                                  const newNidBirth =
                                                    e.target.value;
                                                  setRoomPersons((prev) => ({
                                                    ...prev,
                                                    [room.roomId]: {
                                                      ...prev[room.roomId],
                                                      roomWisePersonInfo: prev[
                                                        room.roomId
                                                      ].roomWisePersonInfo.map(
                                                        (p, idx) =>
                                                          idx === pIndex
                                                            ? {
                                                                ...p,
                                                                nidBirth:
                                                                  newNidBirth,
                                                              }
                                                            : p
                                                      ),
                                                    },
                                                  }));
                                                }}
                                              />

                                              <div className="flex items-center justify-center w-[15%]">
                                                <PiMinusCircleFill
                                                  onClick={() =>
                                                    handleRemovePerson(
                                                      room.roomId,
                                                      pIndex
                                                    )
                                                  }
                                                  size={20}
                                                  className="cursor-pointer text-errorColor shadow-xl shadow-white hover:text-red-600 mr-2"
                                                />
                                                {pIndex == 0 && (
                                                  <IoIosAddCircle
                                                    onClick={() =>
                                                      handleAddPerson(room)
                                                    }
                                                    size={20}
                                                    className="cursor-pointer text-primary70 shadow-xl shadow-white hover:text-primary45"
                                                  />
                                                )}
                                              </div>
                                            </div>
                                          );
                                        }
                                      )}
                                    </>
                                  ) : (
                                    <div className="flex w-full items-center justify-center">
                                      <p
                                        onClick={() =>
                                          isAbleToAddPerson
                                            ? handleAddPerson(room)
                                            : toast.error(
                                                "This room is not ready to use."
                                              )
                                        }
                                        className={`text-sm  font-workSans text-center  p-1 my-2 rounded-full bg-slate-200 ${
                                          isAbleToAddPerson
                                            ? "text-black hover:bg-slate-300 hover:font-medium cursor-pointer"
                                            : "text-slate-500"
                                        }  px-4`}
                                      >
                                        {`Add additional person's info (max ${room?.roomWisePerson} person)`}
                                      </p>
                                    </div>
                                  )}
                                </div>

                                <ComView
                                  value={
                                    updateInfo?.startTime
                                      ? formatDate(updateInfo?.startTime)
                                      : ""
                                  }
                                  className="w-[9%]"
                                />
                                <ComView
                                  value={
                                    updateInfo?.endTime
                                      ? formatDate(updateInfo?.endTime)
                                      : ""
                                  }
                                  className="w-[8%] border-x-2"
                                />
                                <div className="flex w-[5%] items-center justify-center">
                                  <Checkbox
                                    checked={isChecked}
                                    onChange={async () => {
                                      const convertedRoomData =
                                        await Object.values(roomPersons).map(
                                          ({
                                            roomInfo,
                                            roomWisePersonInfo,
                                          }: any) => ({
                                            ...roomInfo,
                                            startTime: updateInfo?.startTime,
                                            endTime: updateInfo?.endTime,
                                            roomWisePersonInfo,
                                          })
                                        );

                                      const filteredRoomInfo =
                                        await (convertedRoomData &&
                                          convertedRoomData?.length > 0 &&
                                          convertedRoomData?.find(
                                            (rItem) =>
                                              rItem?.roomId == room?.roomId
                                          ));

                                      console.log(
                                        "filteredRoomInfo: ",
                                        JSON.stringify(
                                          filteredRoomInfo,
                                          null,
                                          2
                                        )
                                      );

                                      if (filteredRoomInfo) {
                                        await addToBookedRoomFunc(
                                          filteredRoomInfo
                                        );
                                      } else {
                                        toast.error(
                                          "Please, enter room wise person."
                                        );
                                      }
                                    }}
                                  />
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center">
                      <p className="font-workSans text-md text-errorColor my-2">
                        No available room founds !
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div
                className={`${boolStatus?.haveAvailableRoom ? "mb-4" : "my-4"}`}
              >
                <UpdateRoomItemCard
                  className="p-4"
                  paidItems={fetchData?.updatedRoom?.paidItems}
                  freeItems={fetchData?.updatedRoom?.freeItems}
                  token={decodeToken?.token}
                  userId={decodeToken?.userId}
                  onPassItems={async (res: any) => {
                    if (res?.paidItems) {
                      const paidItems = await (res?.paidItems &&
                        res?.paidItems.map((item: any) => ({
                          itemId: item.itemId,
                          name: item.name,
                          price: item.price,
                          actualPrice: item.actualPrice,
                          paidOrFree: item.paidOrFree,
                          itemQty: item.itemQty,
                          remarks: item.remarks,
                        })));
                      console.log(
                        "Paid Items: ",
                        JSON.stringify(paidItems, null, 2)
                      );
                    }
                    console.log("Response: ", JSON.stringify(res, null, 2));
                  }}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </Suspense>
  );
};

export default RoomReservationUpdatePage;

const parseJsonFields = (data: any) => {
  return data.map((item: any) => ({
    ...item,
    personInfo: JSON.parse(item.personInfo),
    roomInfo: JSON.parse(item.roomInfo),
    paidItems: JSON.parse(item.paidItems),
    freeItems: JSON.parse(item.freeItems),
  }));
};

/*

<Checkbox
  checked={isChecked}
  onChange={async () => {
  const convertedRoomData =
    await Object.values(roomPersons).map(
      ({
        roomInfo,
        roomWisePersonInfo,
      }: any) => ({
        ...roomInfo,
        roomWisePersonInfo,
      })
    );

  const filteredRoomInfo =
    await (convertedRoomData &&
      convertedRoomData?.length > 0 &&
      convertedRoomData?.find(
        (rItem) =>
          rItem?.roomId == room?.roomId
      ));

  console.log(
    "filteredRoomInfo: ",
    JSON.stringify(
      filteredRoomInfo,
      null,
      2
    )
  );

  if (filteredRoomInfo) {
    await addToBookedRoomFunc(
      filteredRoomInfo
    );
  } else {
    toast.error(
      "Please, enter room wise person."
    );
  }
  }}
  />



*/
