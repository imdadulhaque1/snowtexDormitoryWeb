type MenuItem = {
  menuId: number;
  banglaName: string;
  englishName: string;
  url: string;
  parentLayerId: string;
  menuSerialNo: number;
  htmlIcon: string;
  subItems?: MenuItem[];
};

export const convertedMenu = (menuList: MenuItem[]): MenuItem[] => {
  if (!Array.isArray(menuList)) {
    console.error("Invalid menuList, expected an array:", menuList);
    return [];
  }

  const menuMap: Map<string, MenuItem[]> = new Map();
  for (const menu of menuList) {
    const parentId = menu.parentLayerId;
    if (!menuMap.has(parentId)) {
      menuMap.set(parentId, []);
    }
    menuMap.get(parentId)?.push(menu);
  }

  const buildMenuTree = (parentId: string): MenuItem[] => {
    const children = menuMap.get(parentId) || [];
    return children.map((child) => ({
      ...child,
      subItems: buildMenuTree(child.menuId.toString()),
    }));
  };

  return buildMenuTree("0");
};
