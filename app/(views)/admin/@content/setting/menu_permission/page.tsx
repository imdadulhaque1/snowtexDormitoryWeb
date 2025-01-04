"use client";

import MenuSelector from "@/app/_components/checkbox/MenuSelector";
import UserMultiSelector from "@/app/_components/checkbox/UserMultiSelector";
import AppURL from "@/app/_restApi/AppURL";
import { convertedMenu } from "@/app/_utils/handler/ConvertedMenu";
import retrieveToken from "@/app/_utils/handler/retrieveToken";
import axios from "axios";
import React, { FC, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import jwtDecode from "jsonwebtoken";
import { tokenInterface } from "@/interface/admin/decodeToken/tokenInterface";

interface Props {}

const MenuPermission: FC<Props> = (props) => {
  const [roleBasedMenuSelectedItems, setRoleBasedMenuSelectedItems] = useState({
    role: null,
    menus: [],
  });
  const [roleBasedUserPermission, setRoleBasedUserPermission] = useState({
    role: null,
    userIds: [],
  });

  const [retrieveData, setRetrieeveData] = useState({
    token: null,
    roles: [],
    menus: [],
    users: [],
    roleBasedMenu: [],
    roleBasedUser: [],
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
      getMenuDataFunc(decodeToken?.token, decodeToken?.userId);
      getRolesFunc(decodeToken?.token);
      getAllUser();
    }
  }, [decodeToken?.token, decodeToken?.userId]);

  const getRolesFunc = async (token: string) => {
    try {
      const { data } = await axios.get(AppURL.roleApi, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // const data = await response.json();
      const convertedRole = data?.roles.map(({ roleId, name }: any) => ({
        value: roleId,
        label: name,
      }));
      setRetrieeveData((prev) => ({ ...prev, roles: data?.roles }));
    } catch (error: any) {
      console.log("Error to fetch roles: " + error.message);
    }
  };

  const getMenuDataFunc = async (token: string, userId?: any) => {
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

      setRetrieeveData((prev: any) => ({ ...prev, menus: convertedMenuItems }));
    } catch (error: any) {
      console.log("Error to fetch menu data: " + error.message);
    }
  };

  const handleSelectionChange = useCallback((updatedSelection: number[]) => {
    setRoleBasedMenuSelectedItems((prev: any) => {
      if (JSON.stringify(prev.menus) === JSON.stringify(updatedSelection)) {
        return prev;
      }
      return { ...prev, menus: updatedSelection };
    });
  }, []);

  const handleUserSelectionChange = useCallback(
    (updatedSelection: number[]) => {
      setRoleBasedUserPermission((prev: any) => {
        if (JSON.stringify(prev.userIds) === JSON.stringify(updatedSelection)) {
          return prev;
        }
        return { ...prev, userIds: updatedSelection };
      });
    },
    []
  );

  const postRoleBasedMenuFunc = async () => {
    const roleBasedMenuData = {
      roleId: roleBasedMenuSelectedItems.role,
      menuIds: roleBasedMenuSelectedItems.menus,
      createdBy: parseInt(decodeToken?.userId),
    };

    try {
      const { data } = await axios.post(
        AppURL.roleBasedMenuApi,
        roleBasedMenuData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${decodeToken?.token}`,
          },
        }
      );

      if (data?.status === 201) {
        toast.success(data?.message);
        setRoleBasedMenuSelectedItems((prev: any) => ({
          ...prev,
          role: null,
          menus: [],
        }));
        handleSelectionChange([]);
      } else {
        toast.error("Error: ", data?.message);
      }
    } catch (error: any) {
      toast.error("Failed to submit role based menu");
      console.log("Error to post role based menu: " + error.message);
    }
  };

  const postRoleBasedUserPermissionFunc = async () => {
    const roleBasedUserData = {
      roleId: roleBasedUserPermission.role,
      userIds: roleBasedUserPermission.userIds,
      createdBy: decodeToken?.userId,
    };

    try {
      const { data } = await axios.post(
        AppURL.roleBasedUserApi,
        roleBasedUserData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${decodeToken?.token}`,
          },
        }
      );

      if (data?.status === 201) {
        toast.success("Successfully submitted !");
        setRoleBasedUserPermission((prev: any) => ({
          ...prev,
          role: null,
          userIds: [],
        }));
        handleUserSelectionChange([]);
      } else {
        console.log("Error: ", data?.message);

        toast.error("Error: ", data?.message);
      }
    } catch (error: any) {
      toast.error("Failed to submit role based Users");
      console.log("Error to post role based Users: " + error.message);
    }
  };

  const getRoleBasedMenu = async (roleId: any) => {
    await setRetrieeveData((prev) => ({
      ...prev,
      roleBasedMenu: [],
    }));

    try {
      const { data } = await axios.get(`${AppURL.roleBasedMenuApi}/${roleId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${decodeToken?.token}`,
        },
      });

      if (data.status === 200) {
        setRetrieeveData((prev) => ({
          ...prev,
          roleBasedMenu: data?.menus,
        }));
      } else {
        console.log("No Menu found for this role!");
      }
    } catch (error: any) {
      console.log("Error to fetch role based menu: " + error.message);
    }
  };

  const getAllUser = async () => {
    try {
      const { data } = await axios.get(AppURL.roleBasedUserApi, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${decodeToken?.token}`,
        },
      });

      if (data.status === 200) {
        setRetrieeveData((prev) => ({
          ...prev,
          users: data?.users,
        }));
      } else {
        console.log(data.message || "No user found for this role!");
      }
    } catch (error: any) {
      console.log("Error fetching role-based user: " + error.message);
    }
  };
  const getRoleBasedUser = async (roleId: any) => {
    await setRetrieeveData((prev) => ({
      ...prev,
      roleBasedUser: [],
    }));
    try {
      const { data } = await axios.get(`${AppURL.roleBasedUserApi}/${roleId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${decodeToken?.token}`,
        },
      });

      if (data.status === 200) {
        setRetrieeveData((prev) => ({
          ...prev,
          roleBasedUser: data?.users,
        }));
      } else {
        console.log(data.message || "No user found for this role!");
      }
    } catch (error: any) {
      console.log("Error fetching role-based user: " + error.message);
    }
  };

  return (
    <div className="flex flex-col   md:flex-row h-screen py-5 bg-gradient-to-b from-primary to-primary90 ">
      <div className="flex flex-col items-center w-full md:w-48p  md:h-90p bg-white ml-3 m-2 py-5 border-2 border-primary80 rounded-lg shadow-lg">
        <p className="font-workSans text-black text-xl  text-center mb-3 pb-1 border-b-2 border-primary80 border-double">
          Role Based Menu Selected
        </p>
        <div className="flex flex-col items-center md:flex-row justify-center w-full h-full">
          <div className="flex flex-col w-11/12 md:w-40p h-95p bg-primary96 p-5 rounded-lg border-2 border-primary80">
            <p className="font-workSans text-black text-md mb-3 pb-1 border-b-2 border-primary80 border-dashed">
              Select Role
            </p>
            {retrieveData?.roles &&
              retrieveData?.roles?.length > 0 &&
              retrieveData?.roles.map((role: any, index: number) => (
                <label
                  key={index}
                  className="flex items-center space-x-2 mb-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    value={role.roleId}
                    checked={roleBasedMenuSelectedItems.role === role.roleId}
                    onChange={async () => {
                      await (decodeToken?.token &&
                        getRoleBasedMenu(role.roleId));
                      await setRoleBasedMenuSelectedItems((prevState: any) => ({
                        ...prevState,
                        role: role.roleId,
                      }));
                    }}
                    className="w-5 h-5 cursor-pointer"
                    required
                  />
                  <span className="font-workSans text-black text-sm">
                    {role.name}
                  </span>
                </label>
              ))}
          </div>

          <div className="w-11/12 md:w-1/2 h-95p mt-5 md:mt-0 md:ml-5 ">
            {retrieveData?.menus && retrieveData?.menus.length > 0 && (
              <MenuSelector
                label="Select Menus"
                menus={retrieveData.menus}
                roleBasedMenu={retrieveData?.roleBasedMenu}
                onSelectionChange={handleSelectionChange}
              />
            )}
          </div>
        </div>

        <button
          onClick={postRoleBasedMenuFunc}
          className="w-1/2 md:w-1/4 mt-5 md:mt-0 py-2 px-4 bg-blue-500 text-white font-bold rounded-lg"
        >
          Submit
        </button>
      </div>

      <div className="flex flex-col items-center w-full md:w-48p md:h-90p  bg-white ml-3 m-2 py-5 border-2 border-primary80 rounded-lg shadow-lg">
        <p className="font-workSans text-black text-xl  text-center mb-3 pb-1 border-b-2 border-primary80 border-double">
          Role Based User Permissions
        </p>
        <div className="flex flex-col items-center md:flex-row justify-center w-full h-full">
          <div className="flex flex-col w-11/12 md:w-40p h-95p bg-primary96 p-5 rounded-lg border-2 border-primary80">
            <p className="font-workSans text-black text-md mb-3 pb-1 border-b-2 border-primary80 border-dashed">
              Select Role
            </p>
            {retrieveData?.roles &&
              retrieveData?.roles?.length > 0 &&
              retrieveData?.roles.map((role: any, index: number) => (
                <label
                  key={index}
                  className="flex items-center space-x-2 mb-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    value={role.roleId}
                    checked={roleBasedUserPermission.role === role.roleId}
                    onChange={async () => {
                      await getRoleBasedUser(role.roleId);
                      await setRoleBasedUserPermission((prevState: any) => ({
                        ...prevState,
                        role: role.roleId,
                      }));
                    }}
                    className="w-5 h-5 cursor-pointer"
                    required
                  />
                  <span className="font-workSans text-black text-sm">
                    {role.name}
                  </span>
                </label>
              ))}
          </div>

          <div className="w-11/12 md:w-1/2 h-95p mt-5 md:mt-0 md:ml-5 ">
            {retrieveData?.users && retrieveData?.users.length > 0 && (
              <UserMultiSelector
                roleBasedUser={retrieveData.roleBasedUser}
                label="Select users"
                users={retrieveData.users}
                onSelectionChange={handleUserSelectionChange}
              />
            )}
          </div>
        </div>

        <button
          onClick={postRoleBasedUserPermissionFunc}
          className="w-1/2 md:w-1/4 py-2 px-4 mt-5 md:mt-0 bg-blue-500 text-white font-bold rounded-lg"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default MenuPermission;
