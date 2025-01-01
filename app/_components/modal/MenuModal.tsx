"use client";
import { FC, useEffect, useState } from "react";

import VerticalSingleInput from "../inputField/VerticalSingleInput";
import SearchableDropdown from "../SearchableDropdown";

import axios from "axios";
import { decodeToken } from "@/app/_utils/handler/decodeToken";
import AppURL from "@/app/_restApi/AppURL";
import { MenuInterface } from "@/interface/admin/menu/MenuInterface";
import { tokenInterface } from "@/interface/admin/decodeToken/TokenInterface";
import retrieveToken from "@/app/_utils/handler/retrieveToken";
import jwtDecode from "jsonwebtoken";

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
    console.log(`${AppURL.userBasedMenuApi}?userId=${userId}`);

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
        data?.data?.menus &&
        data?.data?.menus.map(({ menuId, englishName }: any) => ({
          value: menuId,
          label: englishName,
        }));

      setMenuRole((prev) => ({ ...prev, menuData: convertedMenu }));
    } catch (error: any) {
      console.log("Error Occured to fetch menu Data: ", error?.message);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setFormData((prev: any) => ({
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
            // @ts-ignore
            value={formData.banglaName}
            onChange={handleChange}
            required
          />
          <VerticalSingleInput
            label="English Name"
            type="text"
            name="englishName"
            placeholder="Enter English Name..."
            // @ts-ignore
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
              // @ts-ignore
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
                  // @ts-ignore
                  checked={parseInt(formData.parentLayerId) === 0}
                  onChange={handleCheckboxChange}
                />
                <span className="text-gray-600 text-sm">Is Parent Layer?</span>
              </label>
            </div>

            <SearchableDropdown
              options={menuRole.menuData}
              defaultValue={menuRole.menuData.find(
                (option: any) =>
                  // @ts-ignore
                  option.value === parseInt(formData.parentLayerId)
              )}
              // @ts-ignore
              isDisable={parseInt(formData.parentLayerId) === 0}
              placeholder="Select Parent Layer..."
              onSelect={handleDropdownChange("parentLayerId")}
            />
          </div>
        </div>

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
