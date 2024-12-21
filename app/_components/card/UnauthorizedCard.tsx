import React, { FC } from "react";
import Image from "next/image";
import Button from "../button/Button";
import { COLORS } from "@/app/_utils/COLORS";

interface Props {
  imgSrc?: any;
  title?: string;
  jobDescription?: string;
  signInOnClick?: () => void;
  createAccountsOnClick?: any;
}

const UnauthorizedCard: FC<Props> = (props) => {
  const {
    imgSrc,
    title,
    jobDescription,
    signInOnClick,
    createAccountsOnClick,
  } = props;
  return (
    <div
      className="h-full flex-col justify-center items-center border-2 rounded-md mb-2 "
      style={{ backgroundColor: COLORS.primary96, marginTop: 5 }}
    >
      <div className="flex w-full items-center ">
        <Image
          src={imgSrc}
          alt="Job Seekers"
          height={35}
          width={50}
          style={{ borderRadius: 10, margin: 5 }}
        />
        <div className="ml-2 ">
          <h2 className="text-lg font-semibold text-black font-workSans">
            {title}
          </h2>
          <p className="font-light text-xs text-black font-workSans">
            {jobDescription}
          </p>
        </div>
      </div>
      <div className="flex items-center w-full justify-between my-5">
        <Button
          className="w-3/12 border-2 mx-1 rounded-full text-black font-workSans text-xs hover:text-white py-2 px-2"
          btnOnClick={signInOnClick}
        >
          Login
        </Button>
        <Button
          className="w-7/12 border-2 mx-1 rounded-full text-black font-workSans text-xs hover:text-white py-2"
          btnOnClick={createAccountsOnClick}
        >
          Create Account
        </Button>

        {/* <Link
          href={createAccountsOnClick}
          className="w-7/12 border-2 mx-1 rounded-full text-black font-workSans text-xs hover:text-white py-2"
        >
          Create Account
        </Link> */}
      </div>
    </div>
  );
};

export default UnauthorizedCard;
