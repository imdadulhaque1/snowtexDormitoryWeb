export interface roomDetailsInterface {
  roomDetailsId: number;
  roomId: number;
  roomName: string;
  floorId: number;
  floorName: string;
  buildingId: number;
  buildingName: string;
  roomCategoryId: number;
  roomCategoryName: string;
  roomDimension: string;
  roomSideId: number;
  bedSpecificationId: number;
  roomBelconiId: number;
  attachedBathroomId: number;
  commonFeatures?: CommonFeaturesEntity[] | null;
  availableFurnitures?: AvailableFurnituresEntity[] | null;
  bathroomSpecification?: BathroomSpecificationEntity[] | null;
  roomImages?: string[] | null;
  isApprove: boolean;
  approvedBy?: null;
  isActive: boolean;
  inactiveBy: number;
  inactiveDate: string;
  createdBy: number;
  createdTime: string;
  updatedBy: number;
  updatedTime: string;
}
export interface CommonFeaturesEntity {
  commonFeaturesId: number;
  name: string;
}
export interface AvailableFurnituresEntity {
  availableFurnitureId: number;
  name: string;
}
export interface BathroomSpecificationEntity {
  bathroomId: number;
  name: string;
}
