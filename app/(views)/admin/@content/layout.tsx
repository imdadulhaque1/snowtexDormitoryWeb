import React, { FC, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const ContentLayout: FC<Props> = ({ children }) => {
  return <>{children}</>;
};

export default ContentLayout;
