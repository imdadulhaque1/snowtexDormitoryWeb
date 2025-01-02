// "use client";

// import React, { Suspense, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useSearchParams } from "next/navigation";
// import AdminDashboardPage from "./@content/dashboard/page";
// import TagPage from "./@content/basic_setup/tags/page";
// import CreateMenuPage from "./@content/create_menu/page";
// import RolesPage from "./@content/basic_setup/roles/page";
// import MenuManagements from "./@content/setting/menu_managements/page";
// import MenuPermission from "./@content/setting/menu_permission/page";
// import retrieveToken from "@/app/_utils/handler/retrieveToken";
// import { isTokenExpired } from "@/app/_utils/handler/getCurrentDate";

// const AdminPage = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const page = searchParams.get("page") || "dashboard";

//   useEffect(() => {
//     const checkToken = async () => {
//       const token = await retrieveToken();
//       const isExpired = await (token && isTokenExpired(token));
//       // const isExpired = await (token ? isTokenExpired(token) : true);

//       if (!token || isExpired) {
//         router.push("/");
//       }
//     };

//     checkToken();
//   }, []);

//   const renderContent = () => {
//     switch (page) {
//       case "dashboard":
//         return <AdminDashboardPage />;
//       case "basic_setup/tags":
//         return <TagPage />;
//       case "basic_setup/roles":
//         return <RolesPage />;
//       case "setting/menu_managements":
//         return <MenuManagements />;
//       case "setting/menu_permission":
//         return <MenuPermission />;
//       case "create_menu":
//         return <CreateMenuPage />;
//       default:
//         return <AdminDashboardPage />;
//     }
//   };

//   return (
//     <Suspense fallback={<div>Loading...</div>}>
//       <div>{renderContent()}</div>
//     </Suspense>
//   );
// };

// export default AdminPage;

"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import jwtDecode from "jsonwebtoken";
import retrieveToken from "@/app/_utils/handler/retrieveToken";
import { isTokenExpired } from "@/app/_utils/handler/getCurrentDate";
import AdminDashboardPage from "./@content/dashboard/page";
import TagPage from "./@content/basic_setup/tags/page";
import MenuPermission from "./@content/setting/menu_permission/page";
import axios from "axios";
import AppURL from "@/app/_restApi/AppURL";

const AdminPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || "dashboard";

  const [allowedMenus, setAllowedMenus] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializePage = async () => {
      const token = await retrieveToken();

      if (!token || isTokenExpired(token)) {
        router.push("/");
        return;
      }

      try {
        const decoded: any = jwtDecode.decode(token);

        const { data } = await axios.get(
          `${AppURL.userBasedMenuApi}?userId=${decoded?.userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const menuUrls =
          data?.data &&
          data?.data?.menus?.length > 0 &&
          data?.data?.menus.map((menu: { url: string }) => menu.url);
        setAllowedMenus(menuUrls);

        if (!menuUrls.includes(`admin?page=${page}`)) {
          router.push("/");
        }
      } catch (error) {
        console.error("Initialization error:", error);
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    };

    initializePage();
  }, [page]);

  const renderContent = () => {
    switch (page) {
      case "dashboard":
        return <AdminDashboardPage />;
      case "basic_setup/tags":
        return <TagPage />;
      case "setting/menu_permission":
        return <MenuPermission />;
      default:
        return <AdminDashboardPage />;
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {allowedMenus.includes(`admin?page=${page}`) ? (
        renderContent()
      ) : (
        <div>Unauthorized</div>
      )}
    </Suspense>
  );
};

export default AdminPage;
