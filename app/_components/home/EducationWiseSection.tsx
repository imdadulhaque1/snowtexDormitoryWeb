import Link from "next/link";
import React, { FC } from "react";
import { IoIosArrowForward } from "react-icons/io";

interface Props {}

const EducationWiseSection: FC<Props> = (props) => {
  const educationwiseData = [
    {
      id: 1,
      name: "ssc",
      label: "SSC",
      availableJobs: 100,
    },
    {
      id: 2,
      name: "hsc",
      label: "HSC",
      availableJobs: 777,
    },
    {
      id: 3,
      name: "honors",
      label: "Honors",
      availableJobs: 97,
    },
    {
      id: 4,
      name: "masters",
      label: "Masters",
      availableJobs: 76,
    },
    {
      id: 5,
      name: "medical",
      label: "Medical",
      availableJobs: 10,
    },
  ];
  return (
    <div className="flex flex-col w-full">
      {educationwiseData &&
        educationwiseData?.map((category, index) => {
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

export default EducationWiseSection;
