"use client";

import React, { FC, Suspense, useEffect, useState } from "react";
import jwtDecode from "jsonwebtoken";
import { useAppContext } from "@/app/_stateManagements/contextApi";
import retrieveToken from "@/app/_utils/handler/retrieveToken";
import { tokenInterface } from "@/interface/admin/decodeToken/tokenInterface";
import axios from "axios";
import AppURL from "@/app/_restApi/AppURL";
import toast from "react-hot-toast";
import { bookedRoomInterface } from "@/interface/admin/roomManagements/bookedRoomInterface";
import BookedRoomTable from "@/app/_components/card/BookedRoomTable";

interface Props {}

interface bRoomInterface {
  bookedRoom: bookedRoomInterface | [];
}

const BookedRoomPage: FC<Props> = (props) => {
  const { getDrawerStatus } = useAppContext();
  const [decodeToken, setDecodeToken] = useState<tokenInterface>({
    userId: "",
    name: "",
    email: "",
    token: "",
    expireDate: null,
  });
  const [fetchData, setFetchData] = useState<bRoomInterface>({
    bookedRoom: [],
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

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div
        className={`flex flex-col ${
          getDrawerStatus ? "pl-[265px]" : "pl-0"
        } max-h-screen  justify-center `}
      >
        {fetchData?.bookedRoom && (
          <BookedRoomTable bookedRoom={fetchData?.bookedRoom} />
        )}
      </div>
    </Suspense>
  );
};

export default BookedRoomPage;

const parseJsonFields = (data: any) => {
  return data.map((item: any) => ({
    ...item,
    personInfo: JSON.parse(item.personInfo),
    roomInfo: JSON.parse(item.roomInfo),
    paidItems: JSON.parse(item.paidItems),
    freeItems: JSON.parse(item.freeItems),
  }));
};
