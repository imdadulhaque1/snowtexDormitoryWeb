import { FC, ReactNode } from "react";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AppProvider } from "./_stateManagements/contextApi";
interface Props {
  children: ReactNode;
}

const RootLayout: FC<Props> = ({ children }) => {
  return (
    <html lang="en">
      <body className="bg-gray-200 ">
        <AppProvider>{children}</AppProvider>
        <Toaster position="top-center" reverseOrder={false} />
      </body>
    </html>
  );
};

export default RootLayout;

export const metadata = {
  title: "Snowtex Dormitory",
  description: "Welcome to Snowtex Dormitory",
};
