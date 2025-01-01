"use client";

import Image from "next/image";
import React, { useState, useRef, useEffect, ReactNode } from "react";
import { LiaSignOutAltSolid } from "react-icons/lia";
import { useRouter } from "next/navigation";
import { COLORS } from "@/app/_utils/COLORS";
import axios from "axios";
import AppURL from "@/app/_restApi/AppURL";
import Cookies from "js-cookie";
import LoginForm from "../Form/LoginForm";

interface MenuItem {
  icon: ReactNode;
  label: string;
  onClick: () => void;
}

interface PopupMenuProps {
  menuItems: MenuItem[] | any;
  proImg: string;
  onClick: (itemLabel: string) => void;
}

const PopupMenu: React.FC<PopupMenuProps> = ({
  menuItems,
  proImg,
  onClick,
}) => {
  const router = useRouter();
  const [isLoginModalView, setIsLoginModalView] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const [menuPosition, setMenuPosition] = useState({
    left: "auto",
    right: "auto",
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (menuRef.current && buttonRef.current && isOpen) {
      const menuRect = menuRef.current.getBoundingClientRect();
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const windowWidth = window.innerWidth;

      // Check for right overflow
      if (menuRect.right > windowWidth) {
        setMenuPosition({ left: "auto", right: "0px" });
      }
      // Check for left overflow if needed
      else if (menuRect.left < 0) {
        setMenuPosition({ left: "0px", right: "auto" });
      } else {
        // Default position
        setMenuPosition({ left: "auto", right: "0px" });
      }
    }
  }, [isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      // Clear the token from browser cookies
      Cookies.remove("authToken", { path: "/" });

      // Also clear the token from the server-side response cookie
      await axios.post(
        AppURL.signout,
        {},
        {
          withCredentials: true, // Ensure the request sends cookies
        }
      );
      handleClose();
      // Redirect to the login page
      router.push("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleCloseLoginModal = () => {
    setIsLoginModalView(false);
  };

  const handleLoginSuccess = () => {
    setIsLoginModalView(false); // Close LoginForm
    router.push("/"); // Navigate to the homepage or other appropriate route
  };

  return (
    <div
      className="relative border-2 border-primary85  rounded-full border-3  shadow-lg "
      ref={buttonRef}
    >
      <div
        className="relative w-10 h-10 md:w-8 md:h-8 cursor-pointer rounded-full overflow-hidden"
        // onClick={isOpen ? handleClose : handleOpen}
        onClick={() => {
          menuItems && menuItems?.length > 0
            ? isOpen
              ? setIsOpen(false)
              : setIsOpen(true)
            : setIsLoginModalView(true);
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Image
          src={proImg}
          alt="Profile"
          className="object-cover rounded-full transition-transform duration-300 ease-in-out border"
        />

        <div
          className={`absolute left-0 w-full h-1/2 bg-black bg-opacity-50 transition-all duration-500 ease-in-out ${
            isHovered ? "bottom-0" : "-bottom-1/2"
          }`}
        />
      </div>

      {isOpen && (
        <div
          className={`bg-primary z-[1000] absolute mt-2 pt-3 md:pt-1 shadow-lg rounded-lg z-100 transform transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
          }`}
          style={{ width: "300px", ...menuPosition }}
          ref={menuRef}
        >
          {menuItems.map((item: any, index: number) => {
            const isLastItem = menuItems && index === menuItems?.length - 1;
            return (
              <button
                key={index}
                onClick={() => {
                  onClick(item.label);
                  handleClose();
                }}
                className={`flex items-center text-md w-full px-4 py-4 text-left text-gray-700 hover:bg-primary96 z-[1000] ${
                  !isLastItem ? "border-b" : ""
                } `}
              >
                {item.icon}
                <span className="ml-2 text-black font-workSans">
                  {item.label}
                </span>
              </button>
            );
          })}
          <button
            onClick={handleLogout}
            className="flex w-full bg-errorLight95 hover:bg-errorLight85 h-full items-center justify-center py-2 rounded-b-md"
          >
            <LiaSignOutAltSolid
              color={COLORS.errorColor}
              size={20}
              style={{ marginRight: 5 }}
            />
            <span className="text-red-400">Logout</span>
          </button>
        </div>
      )}

      {isLoginModalView && (
        <LoginForm
          onClose={handleCloseLoginModal}
          onSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
};

export default PopupMenu;
