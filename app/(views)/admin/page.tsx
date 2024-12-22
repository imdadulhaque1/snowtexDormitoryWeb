"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AdminDashboardPage from "./@content/dashboard/page";
// import BasicSetupPage from "./@content/basic_setup/page";
// import AdminMakePostPage from "./@content/make_post/page";
// import SettingsPage from "./@content/setting/page";
// import CategorywisePage from "./@content/basic_setup/category_wise/page";
// import AreawisePage from "./@content/basic_setup/area_wise/page";
// import EducationwisePage from "./@content/basic_setup/education_wise/page";
import TagPage from "./@content/basic_setup/tags/page";
import CreateMenuPage from "./@content/create_menu/page";
import RolesPage from "./@content/basic_setup/roles/page";
import MenuManagements from "./@content/setting/menu_managements/page";
import MenuPermission from "./@content/setting/menu_permission/page";

const AdminPage = () => {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || "dashboard";

  const renderContent = () => {
    switch (page) {
      case "dashboard":
        return <AdminDashboardPage />;
      // case "basic_setup":
      //   return <BasicSetupPage />;
      // case "basic_setup/category_wise":
      //   return <CategorywisePage />;
      // case "basic_setup/area_wise":
      //   return <AreawisePage />;
      // case "basic_setup/education_wise":
      //   return <EducationwisePage />;
      case "basic_setup/tags":
        return <TagPage />;
      case "basic_setup/roles":
        return <RolesPage />;
      // case "make_post":
      //   return <AdminMakePostPage />;
      // case "setting":
      //   return <SettingsPage />;
      case "setting/menu_managements":
        return <MenuManagements />;
      case "setting/menu_permission":
        return <MenuPermission />;
      case "create_menu":
        return <CreateMenuPage />;
      default:
        return <AdminDashboardPage />;
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>{renderContent()}</div>
    </Suspense>
  );
};

export default AdminPage;
