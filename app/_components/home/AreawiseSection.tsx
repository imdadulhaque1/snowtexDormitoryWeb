import Link from "next/link";
import React, { FC } from "react";
import { IoIosArrowForward } from "react-icons/io";

interface Props {}

const AreawiseSection: FC<Props> = (props) => {
  const areawiseData = [
    {
      id: 1,
      name: "dhaka",
      label: "Dhaka",
      availableJobs: 100,
    },
    {
      id: 2,
      name: "rajshahi",
      label: "Rajshahi",
      availableJobs: 777,
    },
    {
      id: 3,
      name: "barisal",
      label: "Barisal",
      availableJobs: 97,
    },
    {
      id: 4,
      name: "khulna",
      label: "Khulna",
      availableJobs: 76,
    },
    {
      id: 5,
      name: "sylhet",
      label: "Sylhet",
      availableJobs: 10,
    },
    {
      id: 6,
      name: "rangpur",
      label: "Rangpur",
      availableJobs: 6,
    },
  ];
  return (
    <div className="flex flex-col w-full">
      {areawiseData &&
        areawiseData?.map((category, index) => {
          return (
            <Link
              href={"/"}
              key={index}
              className="flex items-center my-1 hover:text-primary80"
            >
              <IoIosArrowForward size={16} />
              <p className="text-black font-workSans text-sm hover:text-primary80">{`${category?.label} (${category?.availableJobs})`}</p>
            </Link>
          );
        })}
    </div>
  );
};

export default AreawiseSection;
