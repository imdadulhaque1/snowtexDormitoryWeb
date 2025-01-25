import React, { FC, Suspense, useEffect, useState } from "react";
import { useAppContext } from "@/app/_stateManagements/contextApi";
import retrieveToken from "@/app/_utils/handler/retrieveToken";
import { tokenInterface } from "@/interface/admin/decodeToken/tokenInterface";
import jwtDecode from "jsonwebtoken";

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
    // }
  }, [decodeToken?.token, decodeToken?.userId]);
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div
        className={`flex ${
          getDrawerStatus ? "pl-[265]" : "pl-0"
        } max-h-screen justify-center overflow-auto pb-52`}
      >
        <div className="w-full">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Paid Items</h1>
          </div>
          <div className="mt-8">
            <div className="bg-white p-4 rounded-md shadow-md">
              <h1 className="text-xl font-bold">Paid Items</h1>
              <p className="text-gray-500 mt-2">This page is for paid items</p>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default PaidItemsPage;
