import { FC, ReactNode, Suspense } from "react";
import Sidebar from "./@sidebar/page";
import { cookies } from "next/headers";
import { isTokenExpired } from "@/app/_utils/handler/getCurrentDate";
import RootNavbar from "@/app/_components/home/RootNavbar";

const AdminLayout: FC<{ children?: ReactNode }> = async ({ children }) => {
  const cookieStore = await cookies();
  const aspToken: any = await (cookieStore.get("authToken")?.value || null);

  // Check token validity
  const isExpired = await (aspToken ? isTokenExpired(aspToken) : true);
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex h-screen w-screen">
        <aside className="bg-gray-100">
          <Sidebar />
        </aside>
        <main className="flex-1">
          <RootNavbar
            isAuthenticateUser={!isExpired}
            passingAuthToken={aspToken}
            isShowIcon={false}
          />
          {children}
        </main>
      </div>
    </Suspense>
  );
};

export default AdminLayout;

export const metadata = {
  title: "Admin",
  description: "Snowtex Group | Dormitory",
};
