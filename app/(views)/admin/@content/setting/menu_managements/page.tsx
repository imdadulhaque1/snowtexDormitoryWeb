"use client";

import React, { FC, useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";
import { useAppContext } from "@/app/_stateManagements/contextApi";
import AppURL from "@/app/_restApi/AppURL";
import { convertedMenu } from "@/app/_utils/handler/ConvertedMenu";
import retrieveToken from "@/app/_utils/handler/retrieveToken";
import jwtDecode from "jsonwebtoken";
import MenuModal from "@/app/_components/modal/MenuModal";

interface Props {}
interface tokenInterface {
  userId: string;
  name: string;
  email: string;
  token: string;
  expireDate: Date | null;
}

const MenuManagements: FC<Props> = (props) => {
  const { menuReload, setIsMenuReload } = useAppContext();
  const [menuItem, setMenuItem] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<any>(null);

  // const [retrieveData, setRetrieeveData] = useState({
  //   token: null,
  //   roles: [],
  //   menus: [],
  //   users: [],
  //   roleBasedMenu: [],
  //   roleBasedUser: [],
  // });

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

    if (decodeToken?.token && decodeToken?.userId) {
      getMenuDataFunc(decodeToken?.token, decodeToken?.userId);
    }
  }, [decodeToken?.token, decodeToken?.userId]);

  const getMenuDataFunc = async (token: string, userId: any) => {
    try {
      const fetchUserBasedMenus =
        await `${AppURL.userBasedMenuApi}?userId=${userId}`;

      const { data } = await axios.get(fetchUserBasedMenus, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const convertedMenuItems: any = convertedMenu(data?.data?.menus);
      setMenuItem(convertedMenuItems);
    } catch (error: any) {
      console.log("Error Occured to fetch menu Data: ", error?.message);
    }
  };

  const menuUpdateFunc = (menu: any) => {
    console.log("Updated Menu: ", JSON.stringify(menu, null, 2));

    setSelectedMenu(menu); // Set selected menu data
    setIsModalOpen(true); // Open modal
  };

  const menuDeleteFunc = async (menuId: string | number, userId: any) => {
    try {
      const res = await fetch(`${AppURL.menuApi}/${menuId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${decodeToken?.token}`,
        },
        body: JSON.stringify({ userId }),
      });

      if (res?.ok) {
        getMenuDataFunc(decodeToken?.token, decodeToken?.userId);
        setIsMenuReload(true);
        toast.success("Menu successfully deleted !");
      } else {
        toast.error("Failed to delete menu !");
      }
    } catch (error: any) {
      toast.error("Failed to delete menu !");
      console.log("Error deleting menu:", error?.message);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedMenu(null);
  };

  const handleModalSubmit = async (updatedMenu: any) => {
    const menuInfo = {
      banglaName: updatedMenu.banglaName?.trim(),
      englishName: updatedMenu.englishName?.trim(),
      url: updatedMenu.url ? updatedMenu.url?.trim() : "",
      parentLayerId: updatedMenu.parentLayerId?.toString(),
      menuSerialNo: parseInt(updatedMenu.menuSerialNo),
      htmlIcon: updatedMenu.htmlIcon?.toString(),
      updatedBy: decodeToken?.userId,
    };

    const response = await fetch(`${AppURL.menuApi}/${updatedMenu?.menuId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${decodeToken?.token}`,
      },
      body: JSON.stringify(menuInfo),
    });

    if (response.ok) {
      toast.success("Menu successfully updated !");
      setIsMenuReload(true);
      getMenuDataFunc(decodeToken?.token, decodeToken?.userId);
      handleModalClose();
    } else {
      const errorText = await response.json();
      toast.error(errorText?.error?.toString());

      throw new Error(errorText?.error?.toString());
    }
  };

  return (
    <div className="flex h-screen py-5 bg-gradient-to-b from-primary to-primary90 ">
      <div className="flex">
        {menuItem &&
          menuItem?.length > 0 &&
          menuItem.map((parentMenu: any, parentIndex: number) => {
            const isFirstMenu = parentIndex === 0;

            return (
              <div
                style={{
                  marginLeft: isFirstMenu ? 10 : 0,
                  marginRight: 10,
                }}
                key={parentIndex}
              >
                {parentMenu?.subItems?.length > 0 ? (
                  <div
                    className={`flex flex-col items-center w-[300]  bg-slate-400 rounded-md`}
                  >
                    <div className="flex w-full items-center justify-evenly bg-slate-400 py-2 rounded-t-md">
                      <p className="font-workSans text-xl font-medium text-black">
                        {`${parentMenu.menuSerialNo} / ${parentMenu.menuId}`}
                      </p>
                      <p className="font-workSans text-xl font-medium text-black">
                        {parentMenu.englishName}
                      </p>
                    </div>
                    {parentMenu?.subItems.map(
                      (secondLayerMenu: any, secondLayerIndex: number) => {
                        const isSecondLast =
                          secondLayerIndex === parentMenu?.subItems.length - 1;
                        return (
                          <div
                            key={secondLayerIndex}
                            className={`flex items-center justify-center bg-slate-300 mt-2 w-95p border-2 border-primary80 rounded-md ${
                              isSecondLast && "mb-3"
                            } `}
                          >
                            {secondLayerMenu?.subItems?.length > 0 ? (
                              <div
                                className={` bg-slate-300 mt-2 w-95p border-2 border-slate-300 rounded-md ${
                                  isSecondLast && "mb-3"
                                } `}
                              >
                                <div className="flex w-full items-center justify-around  bg-slate-300  rounded-t-md ">
                                  <p className="font-workSans text-xl font-medium text-black">
                                    {`${secondLayerMenu.menuSerialNo} / ${secondLayerMenu.menuId}`}
                                  </p>
                                  <p className="font-workSans text-xl font-medium text-black">
                                    {secondLayerMenu.englishName}
                                  </p>
                                </div>

                                {secondLayerMenu?.subItems.map(
                                  (
                                    thirdLayerMenu: any,
                                    thirdLayerIndex: number
                                  ) => {
                                    const isThirdLast =
                                      thirdLayerIndex ===
                                      secondLayerMenu?.subItems?.length - 1;
                                    return (
                                      <div key={thirdLayerIndex}>
                                        {thirdLayerMenu?.subItems?.length >
                                        0 ? (
                                          <div
                                            key={secondLayerIndex}
                                            className={` bg-slate-100 mt-2 w-full border-2 border-slate-300 rounded-md ${
                                              isSecondLast && "mb-3"
                                            } `}
                                          >
                                            <div className="flex w-full items-center justify-around  bg-primary90  rounded-t-md ">
                                              <p className="font-workSans text-xl font-medium text-black">
                                                {`${thirdLayerMenu.menuSerialNo} / ${thirdLayerMenu.menuId}`}
                                              </p>
                                              <p className="font-workSans text-xl font-medium text-black">
                                                {thirdLayerMenu.englishName}
                                              </p>
                                            </div>
                                            <div className="flex items-center justify-center flex-col w-full">
                                              {thirdLayerMenu?.subItems.map(
                                                (
                                                  fourthLayerMenu: any,
                                                  fourthLayerIndex: number
                                                ) => {
                                                  const isFourthLast =
                                                    fourthLayerIndex ===
                                                    thirdLayerMenu?.subItems
                                                      ?.length -
                                                      1;
                                                  return (
                                                    <div
                                                      key={fourthLayerIndex}
                                                      className={`relative bg-primary99 mt-2 w-[90%] border-2 border-primary96 rounded-md ${
                                                        isFourthLast
                                                          ? "mb-3"
                                                          : ""
                                                      } group`} // Add group to the parent container
                                                    >
                                                      {/* Main Content */}
                                                      <div className="flex w-full items-center justify-center bg-primary90 py-2 rounded-t-md group-hover:blur-sm group-hover:opacity-70 transition-all duration-300">
                                                        <p className="font-workSans text-xl font-medium text-black">
                                                          {`${fourthLayerMenu.menuSerialNo} / ${fourthLayerMenu.menuId}`}
                                                        </p>
                                                      </div>
                                                      <div className="flex flex-col items-center justify-center py-2 group-hover:blur-sm group-hover:opacity-70 transition-all duration-300">
                                                        <p className="font-workSans text-md text-black">
                                                          {
                                                            fourthLayerMenu.banglaName
                                                          }
                                                        </p>
                                                        <p className="font-workSans text-md text-black">
                                                          {
                                                            fourthLayerMenu.englishName
                                                          }
                                                        </p>
                                                      </div>

                                                      {/* Hover Actions */}
                                                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                        <FaEdit
                                                          onClick={() =>
                                                            menuUpdateFunc(
                                                              fourthLayerMenu
                                                            )
                                                          } // Ensure the correct menu is passed
                                                          size={28}
                                                          className="cursor-pointer text-primary70 hover:text-primary50 mr-3"
                                                        />
                                                        <FaTrash
                                                          onClick={() =>
                                                            decodeToken?.userId &&
                                                            menuDeleteFunc(
                                                              fourthLayerMenu?.menuId,
                                                              decodeToken?.userId
                                                            )
                                                          } // Ensure the correct menu is passed
                                                          size={25}
                                                          className="cursor-pointer text-errorColor hover:text-red-500"
                                                        />
                                                      </div>
                                                    </div>
                                                  );
                                                }
                                              )}
                                            </div>
                                          </div>
                                        ) : (
                                          <div
                                            className={`relative bg-slate-200 mt-2 w-full border-2 border-slate-200 rounded-md ${
                                              isThirdLast ? "mb-3" : ""
                                            } group hover:bg-slate-200`}
                                          >
                                            {/* Main Content */}
                                            <div className="flex w-full items-center justify-center bg-slate-300 py-2 rounded-t-md group-hover:blur-sm group-hover:opacity-70 transition-all duration-300">
                                              <p className="font-workSans text-xl font-medium text-black">
                                                {`${thirdLayerMenu.menuSerialNo} / ${thirdLayerMenu.menuId}`}
                                              </p>
                                            </div>
                                            <div className="flex flex-col items-center justify-center py-2 group-hover:blur-sm group-hover:opacity-70 transition-all duration-300">
                                              <p className="font-workSans text-md text-black">
                                                {thirdLayerMenu.banglaName}
                                              </p>
                                              <p className="font-workSans text-md text-black">
                                                {thirdLayerMenu.englishName}
                                              </p>
                                            </div>

                                            {/* Hover Actions */}
                                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                              <FaEdit
                                                onClick={() =>
                                                  menuUpdateFunc(thirdLayerMenu)
                                                }
                                                size={28}
                                                className="cursor-pointer text-primary70 hover:text-primary50 mr-3"
                                              />
                                              <FaTrash
                                                onClick={() =>
                                                  decodeToken?.userId &&
                                                  menuDeleteFunc(
                                                    thirdLayerMenu?.menuId,
                                                    decodeToken?.userId
                                                  )
                                                }
                                                size={25}
                                                className="cursor-pointer text-errorColor hover:text-red-500"
                                              />
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  }
                                )}
                              </div>
                            ) : (
                              <div
                                className={`relative bg-slate-300 w-full border-2 border-slate-300 rounded-md group hover:bg-slate-200`}
                              >
                                {/* Main Content */}
                                <div className="flex w-full items-center justify-center bg-slate-200 py-2 rounded-t-md group-hover:blur-sm group-hover:opacity-70 transition-all duration-300">
                                  <p className="font-workSans text-xl font-medium text-black">
                                    {`${secondLayerMenu.menuSerialNo} / ${secondLayerMenu.menuId}`}
                                  </p>
                                </div>
                                <div className="flex flex-col items-center justify-center py-2 group-hover:blur-sm group-hover:opacity-70 transition-all duration-300">
                                  <p className="font-workSans text-md text-black">
                                    {secondLayerMenu.banglaName}
                                  </p>
                                  <p className="font-workSans text-md text-black">
                                    {secondLayerMenu.englishName}
                                  </p>
                                </div>

                                {/* Hover Actions */}
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  <FaEdit
                                    onClick={() =>
                                      menuUpdateFunc(secondLayerMenu)
                                    }
                                    size={28}
                                    className="cursor-pointer text-primary85 hover:text-primary50 mr-3"
                                  />
                                  <FaTrash
                                    onClick={() =>
                                      decodeToken?.userId &&
                                      menuDeleteFunc(
                                        secondLayerMenu?.menuId,
                                        decodeToken?.userId
                                      )
                                    }
                                    size={25}
                                    className="cursor-pointer text-errorColor hover:text-red-500"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      }
                    )}
                  </div>
                ) : (
                  <div
                    className={`relative flex flex-col items-center w-[300px] bg-slate-300 rounded-md hover:bg-slate-300 shadow-lg group`}
                  >
                    {/* Main Content */}
                    <div className="flex w-full items-center justify-center bg-slate-400 py-2 rounded-t-md group-hover:blur-sm group-hover:opacity-70 transition-all duration-300">
                      <p className="font-workSans text-xl font-medium text-black">
                        {`${parentMenu.menuSerialNo} / ${parentMenu.menuId}`}
                      </p>
                    </div>
                    <div className="flex flex-col items-center justify-center py-2 group-hover:blur-sm group-hover:opacity-70 transition-all duration-300">
                      <p className="font-workSans text-md text-black">
                        {parentMenu.banglaName}
                      </p>
                      <p className="font-workSans text-md text-black">
                        {parentMenu.englishName}
                      </p>
                    </div>

                    {/* Hover Actions */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <FaEdit
                        onClick={() => menuUpdateFunc(parentMenu)}
                        size={28}
                        className="cursor-pointer text-primary80 hover:text-primary50 mr-3"
                      />
                      <FaTrash
                        onClick={() =>
                          decodeToken?.userId &&
                          menuDeleteFunc(
                            parentMenu?.menuId,
                            decodeToken?.userId
                          )
                        }
                        size={25}
                        className="cursor-pointer text-errorColor hover:text-red-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
      </div>
      {isModalOpen && selectedMenu && (
        <MenuModal
          menu={selectedMenu}
          onClose={handleModalClose}
          onSubmit={handleModalSubmit}
        />
      )}
    </div>
  );
};

export default MenuManagements;
