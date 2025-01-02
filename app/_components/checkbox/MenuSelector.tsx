import React, { useState, useEffect, useCallback, useMemo } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

interface Menu {
  menuId: number;
  englishName: string;
  url?: string;
  parentLayerId: number;
  subItems: Menu[];
}

interface MenuSelectorProps {
  menus: Menu[];
  roleBasedMenu: Menu[];
  onSelectionChange: (selectedMenus: number[]) => void;
  label: string;
}

const MenuSelector: React.FC<MenuSelectorProps> = ({
  menus,
  roleBasedMenu,
  onSelectionChange,
  label,
}) => {
  const [selectedMenus, setSelectedMenus] = useState<number[]>([]);
  const [expandedMenus, setExpandedMenus] = useState<number[]>([]);

  const roleBasedMenuIds = useMemo(
    () => roleBasedMenu.map((menu) => menu.menuId),
    [roleBasedMenu]
  );

  // Initialize selected menus based on role-based menus
  useEffect(() => {
    const preSelectedMenus = menus
      .flatMap((menu) => [menu, ...menu.subItems])
      .filter((menu) => roleBasedMenuIds.includes(menu.menuId))
      .map((menu) => menu.menuId);

    setSelectedMenus(preSelectedMenus);
  }, [menus, roleBasedMenuIds]);

  useEffect(() => {
    onSelectionChange(selectedMenus);
  }, [selectedMenus, onSelectionChange]);

  const toggleExpand = useCallback((menuId: number) => {
    setExpandedMenus((prev) =>
      prev.includes(menuId)
        ? prev.filter((id) => id !== menuId)
        : [...prev, menuId]
    );
  }, []);

  const handleCheckboxChange = useCallback(
    (menuId: number, subItems: Menu[] = [], parentId?: number) => {
      const isSelected = selectedMenus.includes(menuId);

      let updatedSelection = [...selectedMenus];

      if (isSelected) {
        // Remove menu and sub-items
        updatedSelection = updatedSelection.filter(
          (id) => id !== menuId && !subItems.some((item) => item.menuId === id)
        );
      } else {
        // Add menu, sub-items, and parent if applicable
        updatedSelection = [
          ...updatedSelection,
          menuId,
          ...subItems.map((item) => item.menuId),
        ];

        if (parentId && !updatedSelection.includes(parentId)) {
          updatedSelection.push(parentId);
        }
      }

      setSelectedMenus(updatedSelection);
    },
    [selectedMenus]
  );

  const handleSelectAll = useCallback(
    (isSelectAll: boolean) => {
      if (isSelectAll) {
        const allMenuIds = menus.flatMap((menu) => [
          menu.menuId,
          ...menu.subItems.map((sub) => sub.menuId),
        ]);
        setSelectedMenus(allMenuIds);
      } else {
        setSelectedMenus([]);
      }
    },
    [menus]
  );

  return (
    <div className="flex flex-col w-full h-full bg-primary96 p-5 rounded-lg border-2 border-primary80">
      <div className="flex flex-col">
        <p className="font-workSans text-black text-md mb-3 pb-1">{label}</p>
        <label className="flex items-center space-x-2 mb-3 border-b-2 border-primary80 border-dashed pb-2 cursor-pointer">
          <input
            type="checkbox"
            checked={
              selectedMenus.length ===
              menus.flatMap((menu) => [
                menu.menuId,
                ...menu.subItems.map((sub) => sub.menuId),
              ]).length
            }
            onChange={(e) => handleSelectAll(e.target.checked)}
            className="w-4 h-4 cursor-pointer"
          />
          <span className="font-workSans text-black text-sm">Select All</span>
        </label>
      </div>

      {menus.map((menu) => (
        <div key={menu.menuId} className="mb-3">
          <label className="flex items-center space-x-2 cursor-pointer">
            {menu.subItems && menu.subItems.length > 0 ? (
              <span
                onClick={() => toggleExpand(menu.menuId)}
                className="cursor-pointer"
              >
                {expandedMenus.includes(menu.menuId) ? (
                  <IoIosArrowUp />
                ) : (
                  <IoIosArrowDown />
                )}
              </span>
            ) : (
              <input
                type="checkbox"
                checked={selectedMenus.includes(menu.menuId)}
                onChange={() =>
                  handleCheckboxChange(menu.menuId, [], menu.parentLayerId)
                }
                className="w-4 h-4 cursor-pointer"
              />
            )}
            <span
              onClick={() =>
                menu.subItems &&
                menu.subItems.length > 0 &&
                toggleExpand(menu.menuId)
              }
              className="font-workSans text-black text-sm cursor-pointer"
            >
              {menu.englishName}
            </span>
          </label>

          {expandedMenus.includes(menu.menuId) &&
            menu.subItems.map((subItem) => (
              <label
                key={subItem.menuId}
                className="flex items-center space-x-2 ml-6 mt-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedMenus.includes(subItem.menuId)}
                  onChange={() =>
                    handleCheckboxChange(subItem.menuId, [], menu.menuId)
                  }
                  className="w-4 h-4 cursor-pointer"
                />
                <span className="font-workSans text-black text-sm">
                  {subItem.englishName}
                </span>
              </label>
            ))}
        </div>
      ))}
    </div>
  );
};

export default React.memo(MenuSelector);
