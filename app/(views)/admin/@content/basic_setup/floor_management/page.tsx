import React, { FC, Suspense, useEffect, useState } from "react";
import jwtDecode from "jsonwebtoken";
import { tokenInterface } from "@/interface/admin/decodeToken/tokenInterface";
import retrieveToken from "@/app/_utils/handler/retrieveToken";
import VerticalSingleInput from "@/app/_components/inputField/VerticalSingleInput";
import toast from "react-hot-toast";
import { isValidBDTelephone } from "@/app/_utils/handler/validateBDTelephone ";
import { COLORS } from "@/app/_utils/COLORS";
import { MdDelete, MdDeleteOutline, MdOutlineFileUpload } from "react-icons/md";
import { FaEdit, FaRegWindowClose } from "react-icons/fa";
import AppURL from "@/app/_restApi/AppURL";
import axios from "axios";
import SearchableDropdown from "@/app/_components/SearchableDropdown";

interface Props {}

const FloorManagement: FC<Props> = (props) => {
  const [decodeToken, setDecodeToken] = useState<tokenInterface>({
    userId: "",
    name: "",
    email: "",
    token: "",
    expireDate: null,
  });
  const [buildingProps, setBuildingProps] = useState([]);

  const [floorData, setFloorData] = useState({
    floorName: "",
    floorDescription: "",
    buildingId: null,
    isUpdated: false,
    isDeleted: false,
    floorNameErrorMsg: "",
    floorDescriptionErrorMsg: "",
    buildingIdErrorMsg: "",
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
      getBuildingsFunc(decodeToken?.token);
      // getMenuDataFunc(decodeToken?.token, decodeToken?.userId);
    }
  }, [decodeToken?.token, decodeToken?.userId]);

  const getBuildingsFunc = async (token: string) => {
    try {
      const { data } = await axios.get(AppURL.buildingInfoApi, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (data?.status === 200) {
        console.log("Buildings Data: ", JSON.stringify(data?.data, null, 2));
        const convertedMenu = await data?.data.map(
          ({ buildingId, buildingName }: any) => ({
            value: buildingId,
            label: buildingName,
          })
        );
        await setBuildingProps(convertedMenu);
      }
    } catch (error: any) {
      console.log("Error fetching building data: ", error.message);
    } finally {
      console.log("Fetching Building Data Completed !");
    }
  };

  const onSubmitFunc = (floorData: any, token: string) => {};
  const updateFunc = (floorData: any, token: string, userId: any) => {};
  const closeToUpdateFunc = () => {};

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex fixed min-h-screen justify-center bg-gradient-to-b from-primary to-primary90">
        <div className="flex w-screen h-full ">
          <div
            className={`w-[30%] h-80p bg-white p-4 m-4 rounded-lg shadow-lg`}
          >
            <VerticalSingleInput
              label="Floor Name"
              type="text"
              name="floorName"
              placeholder="Enter floor Name..."
              // @ts-ignore
              value={floorData?.floorName}
              onChange={(e: any) =>
                setFloorData((prev) => ({
                  ...prev,
                  floorName: e.target.value,
                  floorNameErrorMsg: "",
                }))
              }
              errorMsg={floorData.floorNameErrorMsg}
              required
            />
            <div className="my-3">
              <VerticalSingleInput
                label="Floor Description"
                type="text"
                name="floorDescription"
                placeholder="Enter Floor Description..."
                // @ts-ignore
                value={floorData?.floorDescription}
                onChange={(e: any) =>
                  setFloorData((prev) => ({
                    ...prev,
                    floorDescription: e.target.value,
                    floorDescriptionErrorMsg: "",
                  }))
                }
                errorMsg={floorData.floorDescriptionErrorMsg}
                required
              />
            </div>
            <div className="my-3">
              <label className=" text-black text-sm font-workSans mb-1 ">
                Select Buildings
              </label>
              <SearchableDropdown
                options={buildingProps}
                isDisable={false}
                placeholder="Select Buildiins..."
                onSelect={(value: string, label: string) => {
                  setFloorData((prevItem: any) => ({
                    ...prevItem,
                    buildingId: value,
                  }));
                }}
              />
            </div>

            <div className="flex justify-center items-center mt-4">
              {!floorData?.isUpdated ? (
                <button
                  className="flex bg-primary70 items-center font-workSans text-md py-2 px-4 rounded-lg text-black hover:bg-primary50 hover:text-white"
                  onClick={() => {
                    floorData && decodeToken?.userId
                      ? onSubmitFunc(floorData, decodeToken?.token)
                      : toast.error(
                          "Please complete all the required fields !"
                        );
                  }}
                >
                  <MdOutlineFileUpload
                    color={COLORS.black}
                    size={20}
                    className="cursor-pointer mr-2"
                  />
                  Submit Floor
                </button>
              ) : (
                <div className="flex justify-center items-center space-x-4">
                  <button
                    className="flex items-center bg-primary70 font-workSans text-md py-2 px-4 rounded-lg text-black hover:bg-primary50 hover:text-white"
                    onClick={async () => {
                      await (floorData && decodeToken?.userId
                        ? updateFunc(
                            floorData,
                            decodeToken?.token,
                            decodeToken?.userId
                          )
                        : toast.error(
                            "Please complete all the required fields !"
                          ));
                    }}
                  >
                    <MdOutlineFileUpload
                      color={COLORS.black}
                      size={20}
                      className="cursor-pointer mr-2"
                    />
                    Update Floor
                  </button>

                  <button
                    className="flex bg-errorColor font-workSans text-md py-2 px-4 rounded-lg text-black items-center justify-center hover:bg-red-500 hover:text-white"
                    onClick={closeToUpdateFunc}
                  >
                    <FaRegWindowClose
                      color={COLORS.black}
                      size={20}
                      className="cursor-pointer mr-2"
                    />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default FloorManagement;
