"use client";
import React, { FC, Suspense, useEffect, useState } from "react";
import jwtDecode from "jsonwebtoken";
import { tokenInterface } from "@/interface/admin/decodeToken/tokenInterface";
import retrieveToken from "@/app/_utils/handler/retrieveToken";

interface Props {}

const ProfilePage: FC<Props> = (props) => {
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
  }, [decodeToken?.token, decodeToken?.userId]);
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex fixed min-h-screen justify-center items-center bg-gradient-to-b from-primary to-primary90">
        <div className="flex flex-col w-screen h-screen  items-center justify-center">
          <div className="flex flex-col">
            <h1 className="text-black font-workSans text-left text-xl">
              {`Name: ${decodeToken?.name}`}
            </h1>
            <h1 className="text-black font-workSans text-left text-xl">
              {`Email: ${decodeToken?.email}`}
            </h1>
            <h1 className="text-black font-workSans text-left text-xl">
              {`User Id: ${decodeToken?.userId}`}
            </h1>
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default ProfilePage;
