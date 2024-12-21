import Link from "next/link";
import React, { FC } from "react";
import { IoIosArrowForward } from "react-icons/io";

interface Props {}

const CategorySection: FC<Props> = (props) => {
  const categoryData = [
    {
      id: 1,
      name: "accounts finance",
      label: "Accounting / Finance",
      availableJobs: 100,
    },
    {
      id: 2,
      name: "it",
      label: "Information Technology (IT)",
      availableJobs: 777,
    },
    {
      id: 3,
      name: "bank non-bank",
      label: "Bank / Non-Bank Fin. Institutions",
      availableJobs: 97,
    },
    {
      id: 4,
      name: "supply chain",
      label: "Supply Chain / Procurements",
      availableJobs: 76,
    },
    {
      id: 5,
      name: "education training",
      label: "Education and Training",
      availableJobs: 10,
    },
    {
      id: 6,
      name: "engineer architects",
      label: "Engineer / Architects",
      availableJobs: 6,
    },
    {
      id: 7,
      name: "accounts finance",
      label: "Accounting / Finance",
      availableJobs: 100,
    },
    {
      id: 8,
      name: "it",
      label: "Information Technology (IT)",
      availableJobs: 555,
    },
    {
      id: 9,
      name: "bank non-bank",
      label: "Bank / Non-Bank Fin. Institutions",
      availableJobs: 23,
    },
    {
      id: 10,
      name: "supply chain",
      label: "Supply Chain / Procurements",
      availableJobs: 66,
    },
    {
      id: 11,
      name: "education training",
      label: "Education and Training",
      availableJobs: 5,
    },
    {
      id: 12,
      name: "engineer architects",
      label: "Engineer / Architects",
      availableJobs: 125,
    },
  ];
  return (
    <div className="flex flex-col">
      {categoryData &&
        categoryData?.map((category, index) => {
          return (
            <Link
              href={"/posts"}
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

export default CategorySection;
