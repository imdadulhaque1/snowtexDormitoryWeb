import RegistrationForm from "@/app/_components/Form/RegistratioForm";
import React, { FC } from "react";

interface Props {
  accountType: number;
}

const RegistrationPage: FC<Props> = ({ accountType }) => {
  console.log("accountType: ", accountType);

  // const router = useRouter();

  // const { accountType } = router.query;
  return (
    <div className="flex min-h-screen justify-center items-center px-5 bg-primary">
      <RegistrationForm />
    </div>
  );
};

export default RegistrationPage;

export const metadata = {
  title: "Registration",
  // title: "Registration | Job Bangla",
  description: "Welcome to JobsBangla",
};
