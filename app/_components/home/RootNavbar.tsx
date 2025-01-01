"use client";
import React, { FC, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import profileImg from "../../images/proImg.png";
import dormitoryIcon from "../../images/dormitoryIcon.png";
import { FaUser, FaEnvelope } from "react-icons/fa";
import { AiTwotoneMessage } from "react-icons/ai";
import { IoNotificationsOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/app/_stateManagements/contextApi";
import { COLORS } from "@/app/_utils/COLORS";
import PopupMenu from "../popup/PopupMenu";

interface Props {
  isAuthenticateUser?: boolean;
  passingAuthToken?: any;
}

const RootNavbar: FC<Props> = ({
  isAuthenticateUser = false,
  passingAuthToken,
}) => {
  const router = useRouter();
  const { setToken, getToken } = useAppContext();

  useEffect(() => {
    if (passingAuthToken) {
      setToken(passingAuthToken);
    }
  }, [passingAuthToken, setToken]);

  const menuItems = [
    {
      label: "My Profile",
      icon: (
        <FaUser color={COLORS.primary80} size={20} style={{ marginRight: 5 }} />
      ),
      onClick: () => console.log("Clicked to visit My Profile"),
    },
    {
      label: "Settings",
      icon: (
        <FaEnvelope
          color={COLORS.primary80}
          size={20}
          style={{ marginRight: 5 }}
        />
      ),
      onClick: () => console.log("Clicked on Settings !"),
    },
  ];

  const handleMenuItemClick = (itemLabel: string) => {
    if (itemLabel?.toLowerCase()?.trim() === "my profile") {
      router.push("/admin");
    } else {
      toast.success(`Clicked Item: ${itemLabel}`);
    }
  };

  return (
    <ul className="flex items-center justify-between bg-primary95 px-5  mx-0  rounded-sm md:rounded-xl shadow-sm shadow-primary90 z-50">
      <Link
        href={`/`}
        className="text-blue-300 text-2xl flex rounded flex-wrap items-center py-2  md:mb-0 "
      >
        <Image
          src={dormitoryIcon}
          alt="Dormitory Icon"
          width={40}
          height={40}
          className="object-cover rounded-full transition-transform duration-300 ease-in-out border"
        />
        <span className="text-primary text-2xl font-workSans ml-1">
          Dormitory
        </span>
      </Link>

      <div className="flex  justify-center mb-2 md:mb-0">
        <li className="mr-4 flex items-center ">
          <Link
            href={`/dashboard`}
            className="flex text-black text-lg md:hover:bg-primary90 py-2 px-2 rounded justify-center items-center"
          >
            <AiTwotoneMessage
              color={COLORS.primary50}
              size={25}
              style={{ marginRight: 1 }}
            />
            <span className="hidden md:inline font-workSans">Message</span>
          </Link>
        </li>
        <li className="mr-4 flex items-center ">
          <Link
            href={`/dashboard`}
            className="flex text-black text-lg md:hover:bg-primary90 py-2 px-2 rounded justify-center items-center"
          >
            <IoNotificationsOutline
              color={COLORS.primary50}
              size={25}
              style={{ marginRight: 1 }}
            />
            <span className="hidden md:inline font-workSans">
              Notifications
            </span>
          </Link>
        </li>
        <div className="py-2">
          <PopupMenu
            menuItems={isAuthenticateUser ? menuItems : null}
            proImg={profileImg}
            onClick={handleMenuItemClick}
          />
        </div>
      </div>
    </ul>
  );
};

export default RootNavbar;
