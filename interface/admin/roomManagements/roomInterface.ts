export interface roomInterface {
  roomId: number;
  roomName: string;
  roomDescription: string;
  remarks: string;
  roomCategoryId: number;
  floorId: number;
  buildingId: number;
  isRoomAvailable: boolean;
  haveRoomDetails: boolean;
  isApprove: boolean;
  approvedBy?: null;
  approvedTime?: null;
  isActive: boolean;
  inactiveBy?: null;
  createdBy: number;
  createdTime: string;
  updatedBy?: number | null;
  updatedTime?: string | null;
  floorName: string;
  buildingName: string;
  roomCategoryName: string;
  roomWisePerson: number | string;
}
