"use client";

import CodeEditorView from "@/app/_components/codeEditor/CodeEditorView";
import VerticalSingleInput from "@/app/_components/inputField/VerticalSingleInput";
import SearchableDropdown from "@/app/_components/SearchableDropdown";
import AppURL from "@/app/_restApi/AppURL";
import { useAppContext } from "@/app/_stateManagements/contextApi";
import { decodeToken } from "@/app/_utils/handler/decodeToken";
import axios from "axios";
import React, { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Props {}

const CreateMenuPage: FC<Props> = (props) => {
  const { menuReload, setIsMenuReload } = useAppContext();
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
    // roleId: null,
    parentLayerId: null,
    htmlIcon: "",
  });
  const decodeUserId = getToken ? decodeToken(getToken) : null;

  const retrieveToken = async () => {
    try {
      const response = await fetch(AppURL.retrieveCookieToken, {
        credentials: "include", // Include cookies in the request
      });

      const data = await response.json();
      if (response.ok) {
        setGetToken(data.token);
      } else {
        console.error("Error retrieving token:", data.message);
        // return data.message;
      }
    } catch (error: any) {
      console.error("Fetch failed:", error);
      // return error?.message;
    }
  };

  useEffect(() => {
    retrieveToken();

    if (getToken) {
      getRolesFunc();
      getMenuDataFunc(1);
    }
    // Fetch roles and menu data only if the token is available
  }, [getToken]);

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

  const getMenuDataFunc = async (userId?: any) => {
    try {
      // const response = await fetch("/api/admin/create_menu");

      const fetchUserBasedMenus =
        await `${AppURL.userBasedMenuApi}?userId=${userId}`;

      const { data } = await axios.get(fetchUserBasedMenus, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken}`,
        },
      });

      const convertedMenu = data?.data?.menuData.map(
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

  const onSubmitFunc = async (newMenu: any) => {
    const menuInfo = {
      banglaName: newMenu.banglaName?.trim(),
      englishName: newMenu.englishName?.trim(),
      url: newMenu.url ? newMenu.url?.trim() : null,
      // roleId: newMenu.roleId?.toString(),
      // accessibleRole: newMenu?.accessibleRole,
      parentLayerId: newMenu.parentLayerId?.toString(),
      htmlIcon: newMenu.htmlIcon?.toString(),
      userId: decodeUserId,
    };

    console.log("Submitted Menu: ", JSON.stringify(menuInfo, null, 2));

    try {
      const response = await fetch(AppURL.menuApi, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken}`,
        },
        body: JSON.stringify(menuInfo),
      });

      console.log("Response: ", JSON.stringify(response, null, 2));

      if (response.ok) {
        toast.success("Menu has been created !");
        setIsMenuReload(true);
        getMenuDataFunc(1);
      } else {
        const errorText = await response.json();
        toast.error(errorText?.error?.toString());

        throw new Error(errorText?.error?.toString());
      }
    } catch (error) {
      toast.error("Failed to create menu !");
    }
  };

  console.log("decodeUserId: ", decodeUserId);

  const isFormValidated =
    menuData?.banglaName &&
    menuData?.englishName &&
    // menuData?.roleId &&
    menuData?.parentLayerId?.toString() &&
    menuData?.htmlIcon;
  return (
    <div className="flex h-screen items-center justify-center  bg-gradient-to-b from-primary to-primary90 ">
      <div className="flex w-80p flex-col bg-primary justify-center gap-y-4 border border-primary80 rounded-2xl p-4">
        <h1 className="text-zinc-500 font-sans text-center text-2xl">
          Create Menu
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
        {/* <div className="flex items-center justify-between bg-white  py-1">
          <div className="w-[49%]">
            <div className="flex-col items-center">
              <label className=" text-black text-sm font-workSans mb-2">
                Select Related Roles
              </label>

              <div className="mb-2">
                <SearchableDropdown
                  options={role?.data}
                  placeholder="Select Role..."
                  onSelect={(value: string, label: string) => {
                    setMenuData((prevItem: any) => ({
                      ...prevItem,
                      roleId: value,
                    }));
                  }}
                />
              </div>
            </div>
          </div>
        </div> */}
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
              isFormValidated && decodeUserId
                ? onSubmitFunc(menuData)
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
