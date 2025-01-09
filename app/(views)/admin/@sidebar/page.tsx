"use client";
import { useState, ReactNode, Suspense, useEffect } from "react";
import Link from "next/link";
import { FaBars } from "react-icons/fa";
import dormitoryIcon from "@/app/images/dormitoryIcon.png";

import axios from "axios";
import { useAppContext } from "@/app/_stateManagements/contextApi";
import AppURL from "@/app/_restApi/AppURL";
import { convertedMenu } from "@/app/_utils/handler/ConvertedMenu";
import Image from "next/image";
import retrieveToken from "@/app/_utils/handler/retrieveToken";
import jwtDecode from "jsonwebtoken";

type MenuItem = {
  englishName: string;
  url?: string;
  htmlIcon: string;
  href?: string;
  subItems?: MenuItem[];
  badge?: string;
};

const getLayerColor = (level: number) => {
  switch (level) {
    case 1:
      return "bg-blue-200";
    case 2:
      return "bg-blue-300";
    case 3:
      return "bg-blue-400";
    case 4:
      return "bg-blue-500";
    default:
      return "bg-blue-600";
  }
};

interface SidebarProps {
  children?: ReactNode;
}
type DecodeToken = {
  userId: string;
  name: string;
  email: string;
  token: string;
  expireDate: Date | null;
};

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  const { menuReload, setIsMenuReload } = useAppContext();
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});
  const [menuItem, setMenuItem] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  const [decodeToken, setDecodeToken] = useState<DecodeToken>({
    userId: "",
    name: "",
    email: "",
    token: "",
    expireDate: null,
  });

  useEffect(() => {
    if (menuReload && decodeToken?.token && decodeToken?.userId) {
      getMenuDataFunc(decodeToken?.token, decodeToken?.userId).finally(() => {
        setIsMenuReload(false);
      });
    }
  }, [menuReload]);

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

  const getMenuDataFunc = async (token: string, userId: string) => {
    try {
      const fetchUserBasedMenus = `${AppURL.userBasedMenuApi}?userId=${userId}`;

      const { data } = await axios.get(fetchUserBasedMenus, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!data?.data?.menus || !Array.isArray(data.data.menus)) {
        console.error(
          "menuData is not an array or is missing:",
          data?.data?.menus
        );
        return;
      }

      const convertedMenuItems: any = convertedMenu(data.data.menus);
      setMenuItem(convertedMenuItems);
    } catch (error: any) {
      console.error("Error to fetch user-based menus: ", error.message);
    }
  };

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const renderMenu = (items: MenuItem[], level = 1) => (
    <ul className="space-y-1">
      {items.map((item) => (
        <li
          key={item?.englishName}
          className={`rounded ${getLayerColor(level)} hover:bg-opacity-80`}
        >
          <div className="flex items-center justify-between text-black px-2">
            {/* Menu Item */}
            <Link
              href={item.url || "#"}
              onClick={() => toggleMenu(item?.englishName)}
              className="flex w-full items-center space-x-2 py-2"
            >
              <span
                className="inline-block"
                dangerouslySetInnerHTML={{ __html: item?.htmlIcon }}
              />
              <span className="font-workSans">{item?.englishName}</span>
              {item.badge && (
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-300 text-black">
                  {item.badge}
                </span>
              )}
            </Link>

            {/* Expand/Collapse Button */}
            {item.subItems && item.subItems?.length > 0 && (
              <button
                onClick={() => toggleMenu(item?.englishName)}
                className="text-black hover:text-gray-600"
              >
                {openMenus[item?.englishName] ? "▲" : "▼"}
              </button>
            )}
          </div>

          {/* Submenu */}
          {item.subItems && (
            <div
              className={`pl-4 transition-all duration-300 ease-in-out ${
                openMenus[item?.englishName]
                  ? `max-h-screen opacity-100 ${
                      item.subItems?.length > 0 && "pb-2"
                    }`
                  : "max-h-0 opacity-0"
              } overflow-hidden`}
            >
              {renderMenu(item.subItems, level + 1)}
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div
        className={`flex  h-screen bg-white transition-transform duration-500 ease-in-out border-r-2 shadow-2xl  ${
          isDrawerOpen ? "w-[265]" : "w-0"
        }`}
      >
        {!isDrawerOpen && (
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="fixed top-4 left-4 z-50 p-2 text-white bg-gray-800 rounded-full shadow-lg hover:bg-gray-700"
          >
            <FaBars />
          </button>
        )}

        <div
          className={` ${
            isDrawerOpen ? "w-full" : "w-0"
          } transition-transform duration-500 ease-in-out  shadow-lg text-gray-800 overflow-hidden h-full`}
        >
          {isDrawerOpen && (
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center p-4 border-b">
                {/* <h2 className="text-lg font-semibold">MENU</h2> */}

                <Link
                  href={`/`}
                  className="text-blue-300 text-2xl flex rounded flex-wrap items-center py-2  md:mb-0 "
                >
                  <Image
                    src={dormitoryIcon}
                    alt="Dormitory Icon"
                    width={30}
                    height={30}
                    className="object-cover rounded-full transition-transform duration-300 ease-in-out border"
                  />
                  <span className="text-primary text-xl font-workSans ml-1">
                    Dormitory
                  </span>
                </Link>

                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  ✖
                </button>
              </div>
              <div className="p-2 overflow-y-auto">{renderMenu(menuItem)}</div>
            </div>
          )}
        </div>

        <main
          className={`flex-1  min-h-screen  ${
            isDrawerOpen ? "w-full" : "w-0"
          } transition-all duration-500  overflow-y-auto`}
        >
          {children ?? <div>No Content Available</div>}
        </main>
      </div>
    </Suspense>
  );
};

export default Sidebar;

//
