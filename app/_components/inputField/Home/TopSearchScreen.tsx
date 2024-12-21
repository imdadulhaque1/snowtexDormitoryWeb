"use client";

import { FormEvent } from "react";
import { CiSearch } from "react-icons/ci";
import CustomInputField from "../CustomInputField";
import { useWindowSize } from "@/app/_utils/handler/useWindowSize";
import { COLORS } from "@/app/_utils/COLORS";

interface TopSearchScreenProps {
  initialValue?: string;
}

const TopSearchScreen: React.FC<TopSearchScreenProps> = ({ initialValue }) => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const inputValue = formData.get("dynamicInput");
    console.log("Submitted Value: ", inputValue);
  };

  const size = useWindowSize();

  return (
    <div
      className={`flex w-full ${
        size?.width && size?.width <= 800 ? "h-14" : "h-9p"
      }   justify-center  mb-4`}
    >
      <form
        onSubmit={handleSubmit}
        className="flex justify-between w-9/12 md:w-6/12 h-100p bg-white items-center border  rounded-full border-borderColor shadow-md shadow-primary90"
      >
        <CustomInputField
          name="dynamicInput"
          defaultValue={initialValue}
          onChange={() => {}}
          placeholder="Search your job..."
        />
        <button
          className="flex bg-primary85 font-workSans h-full rounded-r-full justify-center items-center w-[30%] sm:w-[15%] transition-all duration-300 ease-in-out  hover:bg-primary50"
          type="submit"
        >
          <CiSearch
            color={COLORS.white}
            className="w-[20px] h-[20px] sm:w-[30px] sm:h-[30px]"
          />
        </button>
      </form>
    </div>
  );
};

export async function getServerSideProps() {
  const initialValue = "Hello from SSR!";
  return {
    props: {
      initialValue,
    },
  };
}

export default TopSearchScreen;
