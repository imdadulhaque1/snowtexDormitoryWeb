export interface bookedRoomInterface {
  roomBookingId: number;
  personInfo: PersonInfo;
  roomInfo?: RoomInfoEntity[] | null;
  paidItems?: PaidItemsEntityOrFreeItemsEntity[] | null;
  freeItems?: PaidItemsEntityOrFreeItemsEntity[] | null;
  totalPaidItemsPrice: number;
  totalFreeItemsPrice: number;
  totalRoomPrice: number;
  grandTotal: number;
  startTime: string;
  endTime: string;
  remarks?: null;
  isApprove: boolean;
  approvedBy?: null;
  approvedTime?: null;
  isActive: boolean;
  inactiveBy?: null;
  inactiveTime?: null;
  createdBy: number;
  createdTime: string;
  updatedBy?: null;
  updatedTime?: null;
}
export interface PersonInfo {
  personId: number;
  name: string;
  companyName: string;
  personalPhoneNo: string;
  companyPhoneNo: string;
  email: string;
  nidBirthPassport: string;
  countryName: string;
  address: string;
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
export interface RoomInfoEntity {
  roomInfo: RoomInfo;
  roomWisePerson?: RoomWisePersonEntity[] | null;
}
export interface RoomInfo {
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
  roomWisePerson: number;
  roomPrice: string;
}
export interface RoomWisePersonEntity {
  name: string;
  phone: string;
  email: string;
  nidBirth: string;
  age: string;
}
export interface PaidItemsEntityOrFreeItemsEntity {
  itemId: number;
  name: string;
  price: string;
  paidOrFree: number;
  remarks: string;
}
