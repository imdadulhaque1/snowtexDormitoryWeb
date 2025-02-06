export interface personInterface {
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
