import React, { FC } from "react";

interface Props {
  children: React.ReactNode;
}

const RootLayout: FC<Props> = (props) => {
  return <>{props.children}</>;
};

export default RootLayout;
