class AppURL {
  // static baseURL: string = "http://192.168.15.26:27086/";
  static baseURL: string = "http://192.168.1.232:212/api/";
  static imgURL: string = "http://192.168.1.232:212/";
  // static baseURL: string = "https://localhost:7094/api/";
  // static imgURL: string = "https://localhost:7094/";

  // Authentication API's
  static signup: string = `${this.baseURL}auth/signup`; // .net
  static signin: string = `${this.baseURL}Auth/login`; // .net
  static signout: string = `${this.baseURL}Auth/logout`; // .net
  static retrieveCookieToken: string = `${this.baseURL}auth/retrieveToken`;

  // Admin API's
  static menuApi: string = `${this.baseURL}Menu`; // .net
  static postApi: string = `${this.baseURL}admin/post`;
  static roleBasedMenuApi: string = `${this.baseURL}admin/RoleBasedMenu`; // .net
  static roleBasedUserApi: string = `${this.baseURL}admin/RoleBasedUser`; // .net
  static userBasedMenuApi: string = `${this.baseURL}admin/getUserBasedMenu`; // .net

  // Admin/Basic Setup API's
  static roleApi: string = `${this.baseURL}Role`; //.net
  static categoryApi: string = `${this.baseURL}admin/category`;
  static areaApi: string = `${this.baseURL}admin/area_wise/`;
  static tagApi: string = `${this.baseURL}admin/tag`;

  static buildingInfoApi: string = `${this.baseURL}admin/BuildingInfo`;
  static floorInfoApi: string = `${this.baseURL}admin/FloorInfo`;
  static roomInfoApi: string = `${this.baseURL}admin/RoomInfo`;

  // Room Managements Api
  static roomCommonFeature: string = `${this.baseURL}admin/room/RoomCommonFeature`;
  static furnitureApi: string = `${this.baseURL}admin/room/RoomFurniture`;
  static bedApi: string = `${this.baseURL}admin/room/RoomBed`;
  static bathroomApi: string = `${this.baseURL}admin/room/RoomBathroom`;

  // Room Details API
  static roomDetailsApi: string = `${this.baseURL}admin/room/RoomDetails`;

  // Paid Items API
  static paidItemApi: string = `${this.baseURL}admin/PaidItems`;

  // new persons API
  static personApi: string = `${this.baseURL}admin/NewPerson`;

  // Room Category API
  static roomCategoryApi: string = `${this.baseURL}admin/RoomCategory`;

  // Room Booking API
  static roomBookingApi: string = `${this.baseURL}admin/RoomBooking`;

  // Available Room fetching API
  static availableRoomApi: string = `${this.baseURL}admin/RoomBooking/availableRoom`;

  // Get All Users
  static getUsersApi: string = `${this.baseURL}admin/user`;

  static createEmpAccounts: string = `${this.baseURL}employee/createAccounts`;
  static singleEmployee(empId: number): string {
    return `${this.baseURL}employee?id=${empId}`;
  }
  static deleteEmployee(empId: number): string {
    return `${this.baseURL}employee/${empId}`;
  }
}

export default AppURL;
