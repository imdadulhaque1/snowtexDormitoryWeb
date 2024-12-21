"use client";
import { useWindowSize } from "@/app/_utils/handler/useWindowSize";
import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
  label: string;
  loading: React.ReactNode;
};

const SubmitButton = ({ label, loading }: SubmitButtonProps) => {
  const { pending } = useFormStatus();

  const size = useWindowSize();

  const windowHeight: any = size && size?.height;

  return (
    <button
      disabled={pending}
      type="submit"
      className="  w-10/12 sm:w-5/12 md:w-5/12 py-2 text-black bg-primary95 rounded-full hover:bg-primary70 hover:text-white"
    >
      {pending ? loading : label}
    </button>
  );
};

export default SubmitButton;
