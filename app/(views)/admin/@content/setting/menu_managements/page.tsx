"use client";

import React, { FC, useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";
import { useAppContext } from "@/app/_stateManagements/contextApi";
import { decodeToken } from "@/app/_utils/handler/decodeToken";
import AppURL from "@/app/_restApi/AppURL";
import { convertedMenu } from "@/app/_utils/handler/ConvertedMenu";

interface Props {}

const MenuManagements: FC<Props> = (props) => {
  const { menuReload, setIsMenuReload } = useAppContext();
  const [menuItem, setMenuItem] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<any>(null);

  const [retrieveData, setRetrieeveData] = useState({
    token: null,
    roles: [],
    menus: [],
    users: [],
    roleBasedMenu: [],
    roleBasedUser: [],
  });

  const decodeUserId = retrieveData?.token
    ? decodeToken(retrieveData?.token)
    : null;

  const retrieveToken = async () => {
    try {
      const response = await fetch(AppURL.retrieveCookieToken, {
        credentials: "include", // Include cookies in the request
      });

      const data = await response.json();
      if (response.ok) {
        setRetrieeveData((prev) => ({ ...prev, token: data.token }));
      } else {
        console.log("Error retrieving token:", data.message);
        // return data.message;
      }
    } catch (error: any) {
      console.log("Fetch failed:", error);
      // return error?.message;
    }
  };

  useEffect(() => {
    if (!retrieveData?.token) {
      retrieveToken();
    }
    if (retrieveData?.token) {
      getMenuDataFunc(decodeUserId, retrieveData?.token);
    }
  }, [retrieveData?.token]);

  const getMenuDataFunc = async (userId?: any, token?: any) => {
    try {
      const fetchUserBasedMenus =
        await `${AppURL.userBasedMenuApi}?userId=${userId}`;

      const { data } = await axios.get(fetchUserBasedMenus, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const convertedMenuItems: any = convertedMenu(data?.data?.menuData);
      setMenuItem(convertedMenuItems);
    } catch (error: any) {
      console.log("Error Occured to fetch menu Data: ", error?.message);
    }
  };

  const menuUpdateFunc = (menu: any) => {
    setSelectedMenu(menu); // Set selected menu data
    setIsModalOpen(true); // Open modal
  };

  const menuDeleteFunc = async (menuId: string | number, userId: any) => {
    try {
      const res = await fetch(`${AppURL.menuApi}?id=${menuId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${retrieveData?.token}`,
        },
        body: JSON.stringify({ userId }),
      });

      if (res?.ok) {
        getMenuDataFunc(decodeUserId, retrieveData?.token);
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
      selfLayerId: updatedMenu.selfLayerId,
      banglaName: updatedMenu.banglaName?.trim(),
      englishName: updatedMenu.englishName?.trim(),
      url: updatedMenu.url ? updatedMenu.url?.trim() : null,

      parentLayerId: updatedMenu.parentLayerId?.toString(),
      htmlIcon: updatedMenu.htmlIcon?.toString(),
      userId: decodeUserId,
    };

    const response = await fetch(
      `${AppURL.menuApi}?id=${updatedMenu?.menuId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${retrieveData?.token}`,
        },
        body: JSON.stringify(menuInfo),
      }
    );

    if (response.ok) {
      toast.success("Menu successfully updated !");
      setIsMenuReload(true);
      getMenuDataFunc(decodeUserId, retrieveData?.token);
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
                    className={`flex flex-col items-center w-[300]  bg-primary70 rounded-md`}
                  >
                    <div className="flex w-full items-center justify-evenly bg-primary70 py-2 rounded-t-md">
                      <p className="font-workSans text-xl font-medium text-black">
                        {parentMenu.menuId}
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
                            className={`flex items-center justify-center bg-primary80 mt-2 w-95p border-2 border-primary80 rounded-md ${
                              isSecondLast && "mb-3"
                            } `}
                          >
                            {secondLayerMenu?.subItems?.length > 0 ? (
                              <div
                                className={` bg-primary80 mt-2 w-95p border-2 border-primary80 rounded-md ${
                                  isSecondLast && "mb-3"
                                } `}
                              >
                                <div className="flex w-full items-center justify-around  bg-primary80  rounded-t-md ">
                                  <p className="font-workSans text-xl font-medium text-black">
                                    {secondLayerMenu.menuId}
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
                                            className={` bg-primary90 mt-2 w-full border-2 border-primary80 rounded-md ${
                                              isSecondLast && "mb-3"
                                            } `}
                                          >
                                            <div className="flex w-full items-center justify-around  bg-primary90  rounded-t-md ">
                                              <p className="font-workSans text-xl font-medium text-black">
                                                {thirdLayerMenu.menuId}
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
                                                          {
                                                            fourthLayerMenu.menuId
                                                          }
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
                                                            decodeUserId &&
                                                            menuDeleteFunc(
                                                              fourthLayerMenu?.menuId,
                                                              decodeUserId
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
                                            className={`relative bg-primary95 mt-2 w-full border-2 border-primary96 rounded-md ${
                                              isThirdLast ? "mb-3" : ""
                                            } group hover:bg-primary90`}
                                          >
                                            {/* Main Content */}
                                            <div className="flex w-full items-center justify-center bg-primary90 py-2 rounded-t-md group-hover:blur-sm group-hover:opacity-70 transition-all duration-300">
                                              <p className="font-workSans text-xl font-medium text-black">
                                                {thirdLayerMenu.menuId}
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
                                                  decodeUserId &&
                                                  menuDeleteFunc(
                                                    thirdLayerMenu?.menuId,
                                                    decodeUserId
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
                                className={`relative bg-primary80 w-full border-2 border-primary80 rounded-md group hover:bg-primary75`}
                              >
                                {/* Main Content */}
                                <div className="flex w-full items-center justify-center bg-primary75 py-2 rounded-t-md group-hover:blur-sm group-hover:opacity-70 transition-all duration-300">
                                  <p className="font-workSans text-xl font-medium text-black">
                                    {secondLayerMenu.menuId}
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
                                      decodeUserId &&
                                      menuDeleteFunc(
                                        secondLayerMenu?.menuId,
                                        decodeUserId
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
                    className={`relative flex flex-col items-center w-[300px] bg-primary80 rounded-md hover:bg-primary70 shadow-lg group`}
                  >
                    {/* Main Content */}
                    <div className="flex w-full items-center justify-center bg-primary70 py-2 rounded-t-md group-hover:blur-sm group-hover:opacity-70 transition-all duration-300">
                      <p className="font-workSans text-xl font-medium text-black">
                        {parentMenu.menuId}
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
                          decodeUserId &&
                          menuDeleteFunc(parentMenu?.menuId, decodeUserId)
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

//
