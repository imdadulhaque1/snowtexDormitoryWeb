class AppURL {
  // static baseURL: string = "http://192.168.15.26:27086/";
  static baseURL: string = "https://localhost:7094/api/";

  // static baseURL: string = "https://localhost:7094/api/admin/room/RoomDetails/images/roomDetails/SSL/Floor - A/Room - B/20250120_091018_6_0e9132f9.png";
  // static baseURL: string = "https://localhost:7094/images/roomDetails/SSL/Floor - A/Room - B/20250120_091018_6_0e9132f9.png";

  // refactor the ccode  for saving imagesand the images will be saved into images forlder. donot need Path.Combine(_imageDirectory, $"{buildingName}/{floorName}/{roomName}"); path directly save in images folder
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

/*


[HttpGet]
public async Task<IActionResult> GetRoomDetails(  
[FromQuery] int userId,
[FromQuery] int buildingId,
[FromQuery] int floorId,
[FromQuery] int roomId)
    {
        // Validate user existence
        if (!await UserExistsAsync(userId))
        {
            return NotFound(new { status = 404, message = "User not found." });
        }

        // Fetch room details
        var roomDetails = await _context.roomDetailsModels
            .Where(r => r.isActive == true &&
                        r.buildingId == buildingId &&
                        r.floorId == floorId &&
                        r.roomId == roomId)
            .ToListAsync();

        if (!roomDetails.Any())
        {
            return NotFound(new { status = 404, message = "No room details found for the specified criteria." });
        }

        // Fetch related data
        var commonFeatureIds = roomDetails.SelectMany(r => r.commonFeatures).Distinct().ToList();
        var availableFurnitureIds = roomDetails.SelectMany(r => r.availableFurnitures).Distinct().ToList();
        var bedIds = roomDetails.SelectMany(r => r.bedSpecification).Distinct().ToList();
        var bathroomIds = roomDetails.SelectMany(r => r.bathroomSpecification).Distinct().ToList();

        var commonFeatures = await _context.roomCommonFeaturesModels
            .Where(cf => commonFeatureIds.Contains(cf.commonFeatureId))
            .ToDictionaryAsync(cf => cf.commonFeatureId);

        var availableFurnitures = await _context.roomAFModels
            .Where(af => availableFurnitureIds.Contains(af.availableFurnitureId))
            .ToDictionaryAsync(af => af.availableFurnitureId);

        var bedSpecifications = await _context.roomBedModels
            .Where(bs => bedIds.Contains(bs.bedId))
            .ToDictionaryAsync(bs => bs.bedId);

        var bathroomSpecifications = await _context.roomBathroomModels
            .Where(bm => bathroomIds.Contains(bm.bathroomId))
            .ToDictionaryAsync(bm => bm.bathroomId);

        // Fetch room, floor, and building names
        var roomInfo = await _context.roomInfoModels.FirstOrDefaultAsync(r => r.roomId == roomId);
        var floorInfo = await _context.floorInfoModels.FirstOrDefaultAsync(f => f.floorId == floorId);
        var buildingInfo = await _context.buildingInfoModels.FirstOrDefaultAsync(b => b.buildingId == buildingId);

        var roomName = roomInfo?.roomName ?? "Unknown";
        var floorName = floorInfo?.floorName ?? "Unknown";
        var buildingName = buildingInfo?.buildingName ?? "Unknown";

        // Construct response
        var response = roomDetails.Select(r => new
        {
            r.roomDetailsId,
            r.roomId,
            roomName, // Include room name
            r.floorId,
            floorName, // Include floor name
            r.buildingId,
            buildingName, // Include building name
            r.roomDimension,
            r.roomSideId,
            r.roomBelconiId,
            r.attachedBathroomId,
            commonFeatures = r.commonFeatures
                .Select(cfId => new
                {
                    commonFeaturesId = cfId,
                    name = commonFeatures.TryGetValue(cfId, out var cf) ? cf.name : "Unknown"
                }).ToList(),
            availableFurnitures = r.availableFurnitures
                .Select(afId => new
                {
                    availableFurnitureId = afId,
                    name = availableFurnitures.TryGetValue(afId, out var af) ? af.name : "Unknown"
                }).ToList(),
            bedSpecification = r.bedSpecification
                .Select(bedId => new
                {
                    bedId = bedId,
                    name = bedSpecifications.TryGetValue(bedId, out var bed) ? bed.name : "Unknown"
                }).ToList(),
            bathroomSpecification = r.bathroomSpecification
                .Select(bathId => new
                {
                    bathroomId = bathId,
                    name = bathroomSpecifications.TryGetValue(bathId, out var bm) ? bm.name : "Unknown"
                }).ToList(),
            r.roomImages,
            r.isApprove,
            r.approvedBy,
            r.isActive,
            r.inactiveBy,
            r.inactiveDate,
            r.createdBy,
            r.createdTime,
            r.updatedBy,
            r.updatedTime
        }).ToList();

        return Ok(new
        {
            status = 200,
            message = "Room details retrieved successfully.",
            data = response
        });
    }


In above is get room details api controller as the response is mentioned bottom.
now refactor the get room details controller for roomImages where  images url will be like 

"roomImages": [ // need this format
      "images/20250120_112440_6_97b423b9.png",
      "images/20250120_112440_6_e403815f.png",
      "images/20250120_112440_6_3c4cae6a.png",
      "images/20250120_112440_6_80fab182.png"
    ],


    [
  {
    "roomDetailsId": 8,
    "roomId": 1006,
    "roomName": "Test - Room",
    "floorId": 2,
    "floorName": "Floor - B",
    "buildingId": 2,
    "buildingName": "SOL",
    "roomDimension": "12 x 16 ft room",
    "roomSideId": 1,
    "roomBelconiId": 1,
    "attachedBathroomId": 1,
    "commonFeatures": [
      {
        "commonFeaturesId": 4,
        "name": "Fan"
      },
      {
        "commonFeaturesId": 5,
        "name": "Heater"
      }
    ],
    "availableFurnitures": [
      {
        "availableFurnitureId": 7,
        "name": "Sofa"
      }
    ],
    "bedSpecification": [
      {
        "bedId": 2,
        "name": "Single Bed"
      }
    ],
    "bathroomSpecification": [
      {
        "bathroomId": 5,
        "name": "Comfort washroom to use with fresh environments"
      }
    ],
    "roomImages": [
      "20250120_112440_6_97b423b9.png",
      "20250120_112440_6_e403815f.png",
      "20250120_112440_6_3c4cae6a.png",
      "20250120_112440_6_80fab182.png"
    ],
    "isApprove": false,
    "approvedBy": null,
    "isActive": true,
    "inactiveBy": null,
    "inactiveDate": null,
    "createdBy": 6,
    "createdTime": "2025-01-20T11:24:40.083",
    "updatedBy": null,
    "updatedTime": null
  }
]





*/
