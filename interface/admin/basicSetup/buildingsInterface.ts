export interface buildingsInterface {
  buildingId: number;
  buildingName: string;
  buildingAddress: string;
  contactNo: string;
  isApprove: boolean;
  approvedBy?: null;
  isActive: boolean;
  inactiveBy?: null;
  createdBy: number;
  createdTime: string;
  updatedBy?: null;
  updatedTime?: null;
}
