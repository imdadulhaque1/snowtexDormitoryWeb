"use client";
import { FC, useEffect, useState } from "react";
import { MenuInterface } from "../../../../interface/admin/menu/menuInterface";
import VerticalSingleInput from "../inputField/VerticalSingleInput";
import SearchableDropdown from "../SearchableDropdown";

import axios from "axios";
import { decodeToken } from "@/app/_utils/handler/decodeToken";
import AppURL from "@/app/_restApi/AppURL";

interface ModalProps {
  menu: MenuInterface;
  onClose: () => void;
  onSubmit: (updatedMenu: MenuInterface) => void;
}

const MenuModal: FC<ModalProps> = ({ menu, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<MenuInterface>(menu);
  const [menuRole, setMenuRole] = useState({
    roleData: [],
    menuData: [],
  });

  const [retrieveData, setRetrieeveData] = useState({
    token: null,
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
        console.error("Error retrieving token:", data.message);
        // return data.message;
      }
    } catch (error: any) {
      console.error("Fetch failed:", error);
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

  // const getMenuDataFunc = async (userId?: any, token?: any) => {
  //   try {
  //     const fetchUserBasedMenus =
  //       await `${AppURL.userBasedMenuApi}?userId=${userId}`;

  //     const { data } = await axios.get(fetchUserBasedMenus, {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     const convertedMenuItems: any = convertedMenu(data?.data?.menuData);
  //     setMenuItem(convertedMenuItems);
  //   } catch (error: any) {
  //     console.log("Error Occured to fetch menu Data: ", error?.message);
  //   }
  // };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setFormData((prev) => ({
      ...prev,
      parentLayerId: isChecked ? 0 : null,
    }));
  };

  const handleDropdownChange =
    (key: keyof MenuInterface) => (value: string) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
    };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  useEffect(() => {
    // getRolesFunc();
    getMenuDataFunc();
  }, []);

  // const getRolesFunc = async () => {
  //   try {
  //     const response = await fetch("/api/admin/basic_setup/roles");
  //     const data = await response.json();
  //     const convertedRole = data.map(({ roleId, name }: any) => ({
  //       value: roleId,
  //       label: name,
  //     }));

  //     setMenuRole((prev) => ({ ...prev, roleData: convertedRole }));
  //   } catch (error: any) {
  //     console.error("Error fetching roles:", error?.message);
  //   }
  // };

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
      const convertedMenu =
        data?.data?.menuData &&
        data?.data?.menuData.map(({ menuId, englishName }: any) => ({
          value: menuId,
          label: englishName,
        }));

      setMenuRole((prev) => ({ ...prev, menuData: convertedMenu }));
    } catch (error: any) {
      console.error("Error fetching menu data:", error?.message);
    }
  };

  console.log("formData: ", JSON.stringify(formData, null, 2));

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-3/4 max-w-3xl">
        <h2 className="text-xl font-bold mb-4">Edit Menu</h2>

        {/* Input Fields */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <VerticalSingleInput
            label="Bangla Name"
            type="text"
            name="banglaName"
            placeholder="Enter Bangla Name..."
            value={formData.banglaName}
            onChange={handleChange}
            required
          />
          <VerticalSingleInput
            label="English Name"
            type="text"
            name="englishName"
            placeholder="Enter English Name..."
            value={formData.englishName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex  items-center justify-between gap-4 mb-4">
          <div className="w-1/2">
            <VerticalSingleInput
              label="Menu URL"
              type="url"
              name="url"
              placeholder="Enter Menu URL..."
              value={formData.url}
              onChange={handleChange}
              required
            />
          </div>
          <div className="w-1/2">
            <div className="flex items-center mb-1">
              <label className="text-sm font-medium block">
                Select Parent Layer
              </label>

              <label className="flex items-center gap-2 ml-2">
                <input
                  type="checkbox"
                  checked={formData.parentLayerId === 0}
                  onChange={handleCheckboxChange}
                />
                <span className="text-gray-600 text-sm">Is Parent Layer?</span>
              </label>
            </div>

            <SearchableDropdown
              options={menuRole.menuData}
              defaultValue={menuRole.menuData.find(
                (option) => option.value === formData.parentLayerId
              )}
              isDisable={formData.parentLayerId === 0}
              placeholder="Select Parent Layer..."
              onSelect={handleDropdownChange("parentLayerId")}
            />
          </div>
        </div>

        {/* <div className="flex items-center justify-between bg-white  py-1">
          <CodeEditorView
            label="Icon By Code"
            value={menuData?.htmlIcon}
            onChange={handleCodeChange}
          />
        </div> */}

        {/* <div className="flex items-center justify-between gap-4 mb-4">
          <div className="w-1/2">
            <label className="text-sm font-medium block mb-2">
              Select Related Roles
            </label>
            <SearchableDropdown
              options={menuRole.roleData}
              defaultValue={menuRole.roleData.find(
                (option) => option.value === formData.roleId
              )}
              placeholder="Select Role..."
              onSelect={handleDropdownChange("roleId")}
            />
          </div>
        </div> */}

        {/* Action Buttons */}
        <div className="flex justify-end gap-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-primary70 text-white rounded-md"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuModal;
