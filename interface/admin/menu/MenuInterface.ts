export interface MenuInterface {
  _id: string;
  menuId: number;
  selfLayerId: number;
  banglaName: string;
  englishName: string;
  url?: null;
  roleId: number;
  parentLayerId: number;
  childLayerId?: null;
  htmlIcon: string;
  isApprove: boolean;
  approvedBy: string;
  isActive: boolean;
  createdBy: string;
  createdTime: string;
  updatedBy: string;
  updatedTime?: null;
  __v: number;
  subItems?: SubItemsEntity[] | null;
}
export interface SubItemsEntity {
  _id: string;
  menuId: number;
  selfLayerId: number;
  banglaName: string;
  englishName: string;
  url: string;
  roleId: number;
  parentLayerId: number;
  childLayerId?: null;
  htmlIcon: string;
  isApprove: boolean;
  approvedBy: string;
  isActive: boolean;
  createdBy: string;
  createdTime: string;
  updatedBy: string;
  updatedTime?: null;
  __v: number;
  subItems?: null[] | null;
}
