import React, { FC, Suspense, useEffect, useState } from "react";
import jwtDecode from "jsonwebtoken";
import { tokenInterface } from "@/interface/admin/decodeToken/tokenInterface";
import retrieveToken from "@/app/_utils/handler/retrieveToken";

interface Props {}

const FloorManagement: FC<Props> = (props) => {
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

    // if (decodeToken?.token && decodeToken?.userId) {
    //   getRolesFunc();
    //   getMenuDataFunc(decodeToken?.token, decodeToken?.userId);
    // }
  }, [decodeToken?.token, decodeToken?.userId]);
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex fixed min-h-screen justify-center items-center bg-gradient-to-b from-primary to-primary90">
        <div className="flex w-screen h-screen  items-center justify-center">
          <h1 className="text-zinc-500 font-workSans text-center text-2xl">
            Floor Managements
          </h1>
        </div>
      </div>
    </Suspense>
  );
};

export default FloorManagement;
