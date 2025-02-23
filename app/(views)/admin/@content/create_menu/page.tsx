"use client";

import CodeEditorView from "@/app/_components/codeEditor/CodeEditorView";
import VerticalSingleInput from "@/app/_components/inputField/VerticalSingleInput";
import SearchableDropdown from "@/app/_components/SearchableDropdown";
import AppURL from "@/app/_restApi/AppURL";
import { useAppContext } from "@/app/_stateManagements/contextApi";
import retrieveToken from "@/app/_utils/handler/retrieveToken";
import axios from "axios";
import React, { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import jwtDecode from "jsonwebtoken";

interface Props {}
interface tokenInterface {
  userId: string;
  name: string;
  email: string;
  token: string;
  expireDate: Date | null;
}

const CreateMenuPage: FC<Props> = (props) => {
  const { menuReload, setIsMenuReload, getDrawerStatus } = useAppContext();
  const [getToken, setGetToken] = useState(null);
  const [role, setRole] = useState({
    data: [],
    roleErrorMsg: "",
  });

  const [isSelfParent, setIsSelfParent] = useState(false);
  const [menu, setMenu] = useState({
    postStatus: false,
    postError: "",
    data: [],
    dropdownData: [],
  });

  const [menuData, setMenuData] = useState({
    banglaName: "",
    englishName: "",
    url: "",
    parentLayerId: null,
    menuSerialNo: 0,
    htmlIcon: "",
  });

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
      getRolesFunc();
      getMenuDataFunc(decodeToken?.token, decodeToken?.userId);
    }
  }, [decodeToken?.token, decodeToken?.userId]);

  const getRolesFunc = async () => {
    try {
      const { data } = await axios.get(AppURL.roleApi, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken}`,
        },
      });

      // const data = await response.json();
      const convertedRole = data?.roles.map(({ roleId, name }: any) => ({
        value: roleId,
        label: name,
      }));

      setRole((prev) => ({ ...prev, data: convertedRole }));
    } catch (error: any) {
      setRole((prev) => ({ ...prev, roleErrorMsg: error.message }));
    }
  };

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

      const convertedMenu = data?.data?.menus.map(
        ({ menuId, englishName }: any) => ({
          value: menuId,
          label: englishName,
        })
      );
      setIsMenuReload(true);
      setMenu((prev) => ({ ...prev, data: data, dropdownData: convertedMenu }));
    } catch (error: any) {
      setRole((prev) => ({ ...prev, roleErrorMsg: error.message }));
    }
  };

  const handleCodeChange = (newCode: string) => {
    setMenuData((prev: any) => ({
      ...prev,
      htmlIcon: newCode,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSelfParent(e.target.checked);
    setMenuData((prevState: any) => ({
      ...prevState,
      parentLayerId: e.target.checked && 0,
    }));
  };

  const onSubmitFunc = async (newMenu: any, token: string) => {
    const menuInfo = {
      banglaName: newMenu.banglaName?.trim(),
      englishName: newMenu.englishName?.trim(),
      url: newMenu.url ? newMenu.url?.trim() : "",
      parentLayerId: newMenu.parentLayerId?.toString(),
      menuSerialNo: newMenu.menuSerialNo,
      htmlIcon: newMenu.htmlIcon?.toString(),
      createdBy: decodeToken?.userId,
    };

    console.log("Submitted Menu: ", JSON.stringify(menuInfo, null, 2));

    try {
      const response = await fetch(AppURL.menuApi, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(menuInfo),
      });

      console.log("Response: ", JSON.stringify(response, null, 2));

      if (response.ok) {
        toast.success("Menu has been created !");
        setIsMenuReload(true);
        getMenuDataFunc(decodeToken?.token, decodeToken?.userId);
      } else {
        const errorText = await response.json();
        toast.error(errorText?.error?.toString());

        throw new Error(errorText?.error?.toString());
      }
    } catch (error) {
      toast.error("Failed to create menu !");
    }
  };

  const isFormValidated =
    menuData?.banglaName &&
    menuData?.englishName &&
    // menuData?.roleId &&
    // @ts-ignore
    menuData?.parentLayerId?.toString() &&
    menuData?.htmlIcon;

  return (
    <div
      className={`flex ${
        getDrawerStatus ? "pl-[265px]" : "pl-0"
      }  items-center  `}
    >
      <div className="flex  w-[80%] flex-col bg-white justify-center gap-y-4 border border-primary80 rounded-2xl p-5">
        <h1 className="text-zinc-500 font-sans text-center text-2xl">
          Create Dormitory Menu
        </h1>
        <div className="flex items-center justify-between bg-white py-1">
          <div className="w-[49%]">
            <VerticalSingleInput
              label="Bangla Name"
              type="text"
              name="banglaName"
              placeholder="Enter Bangla Name..."
              // @ts-ignore
              value={menuData?.banglaName}
              onChange={(e: any) =>
                setMenuData((prev) => ({
                  ...prev,
                  banglaName: e.target.value,
                }))
              }
              required
            />
          </div>
          <div className="w-[49%]">
            <VerticalSingleInput
              label="English Name"
              type="text"
              name="englishName"
              placeholder="Enter English Name..."
              // @ts-ignore
              value={menuData?.englishName}
              onChange={(e: any) =>
                setMenuData((prev) => ({
                  ...prev,
                  englishName: e.target.value,
                }))
              }
              required
            />
          </div>
        </div>
        <div className="flex items-center justify-between bg-white  py-1">
          <div className="w-[49%]">
            <VerticalSingleInput
              label="Menu URL"
              type="url"
              name="url"
              placeholder="Enter Menu Url..."
              // @ts-ignore
              value={menuData?.url}
              onChange={(e: any) =>
                setMenuData((prev) => ({ ...prev, url: e.target.value }))
              }
              required
            />
          </div>
          <div className="w-[49%] mt-1">
            <div className="flex items-center mb-1">
              <label className=" text-black text-sm font-workSans">
                Select Parent Layer
              </label>
              <label className="flex items-center space-x-2 ml-3">
                <input
                  type="checkbox"
                  value="0"
                  checked={menuData.parentLayerId === 0}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4 cursor-pointer"
                />
                <span className="text-gray-500 text-sm font-workSans">
                  Is Parent Layer ?
                </span>
              </label>
            </div>

            <SearchableDropdown
              options={menu.dropdownData}
              isDisable={isSelfParent}
              placeholder="Select Parent Layer..."
              onSelect={(value: string, label: string) => {
                setMenuData((prevItem: any) => ({
                  ...prevItem,
                  parentLayerId: value,
                }));
              }}
            />
          </div>
        </div>
        <div className="flex items-center justify-between bg-white  py-1">
          <div className="w-[49%]">
            <VerticalSingleInput
              label="Menu Serial No"
              type="number"
              name="url"
              placeholder="Enter Menu Serial No..."
              // @ts-ignore
              value={menuData?.menuSerialNo}
              onChange={(e: any) =>
                setMenuData((prev) => ({
                  ...prev,
                  menuSerialNo: e.target.value,
                }))
              }
              required
            />
          </div>
        </div>

        <div className="flex items-center justify-between bg-white  py-1">
          <CodeEditorView
            label="Icon By Code"
            value={menuData?.htmlIcon}
            onChange={handleCodeChange}
          />
        </div>

        <div className="flex items-center justify-center">
          <button
            className="bg-primary70 font-workSans text-md py-2 px-8 rounded-lg text-black hover:bg-primary50 hover:text-white"
            onClick={() => {
              isFormValidated && decodeToken?.userId
                ? onSubmitFunc(menuData, decodeToken?.token)
                : toast.error("Please complete all the required fields !");
            }}
          >
            Menu Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateMenuPage;
