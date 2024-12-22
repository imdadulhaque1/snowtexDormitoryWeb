import React, { FC, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const MakePostLayout: FC<Props> = ({ children }) => {
  return <div>{children}</div>;
};

export default MakePostLayout;

export const metadata = {
  title: "Admin | Make Post",
  description: "Job Bangla | Admin",
};
