export interface roomItemInterface {
  itemId: number;
  name: string;
  price: string;
  paidOrFree: number;
  remarks: string;
  isApprove: boolean;
  approvedBy?: null;
  isActive: boolean;
  inactiveBy?: null;
  inactiveTime?: null;
  createdBy: number;
  createdTime: string;
  updatedBy?: null;
  updatedTime?: null;
}
