// app/admin/layout.tsx
import { FC, ReactNode, Suspense } from "react";
import Sidebar from "./@sidebar/page";
import { middleware } from "@/app/middleware";

const AdminLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex h-screen w-screen">
        <aside className="bg-gray-100">
          <Sidebar />
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </Suspense>
  );
};

export default AdminLayout;

export const metadata = {
  title: "Admin",
  description: "Job Bangla | Admin",
};

/*








import { FC, ReactNode, Suspense } from "react";
import Sidebar from "./@sidebar/page";

interface LayoutProps {
  children: ReactNode;
}

const AdminLayout: FC<LayoutProps> = ({ children }) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex h-screen w-screen ">
        <aside className="bg-gray-100">
          <Sidebar />
        </aside>
        <main className="flex-1 ">{children}</main>
      </div>
    </Suspense>
  );
};

export default AdminLayout;

export const metadata = {
  title: "Admin",
  description: "Job Bangla | Admin",
};









*/
