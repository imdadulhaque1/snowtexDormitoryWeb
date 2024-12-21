"use client";
import React, { FC } from "react";
import totalJobs from "../../../images/infoSection/totalJobs.png";
import totalComapnies from "../../../images/infoSection/totalComapnies.png";
import privateCompany from "../../../images/infoSection/privateCompany.png";
import snowtexGroup from "../../../images/infoSection/snowtexGroup.png";
import Image from "next/image";
import Link from "next/link";
import { useWindowSize } from "@/app/_utils/handler/useWindowSize";

interface Props {}

const InfoSectionPage: FC<Props> = (props) => {
  const listOfOption = [
    {
      label: "No. Of Emp.",
      icon: totalJobs,
      onClick: () => console.log("No. Of Emp."),
    },
    {
      label: "Total Companies",
      icon: totalComapnies,
      onClick: () => console.log("Clicked to View totalComapnies !"),
    },
    {
      label: "My Company",
      icon: privateCompany,
      onClick: () => console.log("Clicked to View My Company"),
    },
    {
      label: "Snowtex Group",
      icon: snowtexGroup,
      onClick: () => console.log("Clicked to View Snowtex Group"),
    },
  ];

  const size = useWindowSize();

  return (
    <div className="flex items-center justify-center">
      <div className="flex w-9/12 items-center justify-between border-2 mx-0 md:mx-10 rounded-full my-5">
        {listOfOption.map((option, index) => {
          const isFirstItem = index === 0;
          const isLastItem = index === listOfOption.length - 1;
          return (
            <Link
              href={`/`}
              key={index}
              className={`group relative flex w-auto items-center gap-2 py-3 px-3 hover:bg-primary90 ${
                isFirstItem ? "rounded-l-full" : "rounded-l-md"
              } ${isLastItem ? "rounded-r-full" : "rounded-r-md"}`}
            >
              <Image
                src={option.icon}
                width={30}
                height={30}
                alt={option.label}
                className="rounded-full "
              />

              <h1 className="hidden md:inline text-black font-workSans text-lg">
                {option.label}
              </h1>

              {size?.width && size?.width <= 768 && (
                <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 hidden group-hover:flex text-black text-xs px-2 py-1 rounded-lg shadow-lg transition-opacity duration-300 ease-in-out opacity-0 group-hover:opacity-100 md:hidden">
                  {option.label}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default InfoSectionPage;
