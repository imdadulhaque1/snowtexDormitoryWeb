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
import RolesPage from "./@content/basic_setup/roles/page";
import MenuManagements from "./@content/setting/menu_managements/page";
import CreateMenuPage from "./@content/create_menu/page";
import ProfilePage from "./@content/profile/page";
import BuildingManagements from "./@content/basic_setup/building_management/page";
import FloorManagement from "./@content/basic_setup/floor_management/page";
import RoomManagement from "./@content/basic_setup/room_management/page";
import RoomDetailsPage from "./@content/basic_setup/room_details/page";
import RoomGoodsEntriesPage from "./@content/basic_setup/room_properties/page";
import PaidItemsPage from "./@content/basic_setup/paid_items/page";
import RoomAssignmentsPage from "./@content/setting/room_assignments/page";
import RoomCategoryPage from "./@content/basic_setup/room_categories/page";
import BookedRoomPage from "./@content/booked_room/page";
import RoomCheckoutPage from "./@content/checkout/page";
import RoomReservationUpdatePage from "./@content/update_reservation/page";

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
      case "profile":
        return <ProfilePage />;
      case "basic_setup/tags":
        return <TagPage />;
      case "basic_setup/roles":
        return <RolesPage />;
      case "setting/menu_managements":
        return <MenuManagements />;
      case "setting/menu_permission":
        return <MenuPermission />;
      case "create_menu":
        return <CreateMenuPage />;
      case "basic_setup/building_management":
        return <BuildingManagements />;
      case "basic_setup/floor_management":
        return <FloorManagement />;
      case "basic_setup/room_management":
        return <RoomManagement />;
      case "basic_setup/room_details":
        return <RoomDetailsPage />;
      case "basic_setup/room_categories":
        return <RoomCategoryPage />;
      case "basic_setup/room_properties":
        return <RoomGoodsEntriesPage />;
      case "basic_setup/paid_items":
        return <PaidItemsPage />;
      case "setting/room_assignments":
        return <RoomAssignmentsPage />;
      case "booked_room":
        return <BookedRoomPage />;
      case "checkout":
        return <RoomCheckoutPage />;
      case "update_reservation":
        return <RoomReservationUpdatePage />;

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
