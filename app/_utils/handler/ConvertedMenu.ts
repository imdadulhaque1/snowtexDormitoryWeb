export const convertedMenu = (menuList: any) => {
  const menuMap = new Map();
  for (const menu of menuList) {
    const parentId = menu.parentLayerId;
    if (!menuMap.has(parentId)) {
      menuMap.set(parentId, []);
    }
    menuMap.get(parentId).push(menu);
  }

  const buildMenuTree = (parentId: any) => {
    const children = menuMap.get(parentId) || [];
    return children.map((child: any) => ({
      ...child,
      subItems: buildMenuTree(child.selfLayerId),
    }));
  };

  return buildMenuTree(0);
};
