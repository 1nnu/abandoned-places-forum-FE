export enum ConditionEnum {
    GOOD, AVERAGE, BAD, DANGERIOUS, DEMOLISHED
}

export enum AccessibilityEnum {
    OPEN, SEMI_OPEN, CLOSED, OWNER_PERMISSION_REQUIRED
}

// just a sketch, it's possible that locationTypes should be separate objects with id and name (and color for styling in the future ?)
export enum LocationType {
    ADMINISTRATIVE_BUILDING = "Administrative building",
    RESIDENTIAL_BUILDING = "Residential building",
    WELL_PRESERVED_INTERIOR = "Well-preserved interior",
    SCHOOL = "School",
    HEIGHT = "Height",
    WAREHOUSE = "Warehouse",
    UNDERGROUND = "Underground",
    MILITARY = "Military",
    FACTORY = "Factory",
    RUINS = "Ruins",
    BUNKER = "Bunker",
}

// Content could still change
// rename? "Location" is also a built-in global interface in JS - possible conflicts
export interface Location {
    uuid: string;
    name: string;
    lon: number;
    lat: number;
    locationType: Array<LocationType>;
    condition: ConditionEnum;
    accessibility: AccessibilityEnum;
    additionalInformation: string;
    isPublic: boolean;
    requiredPoints: number;
    createdBy: string;
}

const locationsExample: Location[] = [
    {
        uuid: "67999668-beed-8813-9416-587422a36880",
        name: "location1",
        lon: 25.5,
        lat: 58.6,
        locationType: [LocationType.ADMINISTRATIVE_BUILDING, LocationType.HEIGHT],
        condition: ConditionEnum.GOOD,
        accessibility: AccessibilityEnum.SEMI_OPEN,
        additionalInformation: "This location is near a public park with easy parking.",
        isPublic: true,
        requiredPoints: 100,
        createdBy: "user1",
    },
    {
        uuid: "67999668-beed-8813-9416-587422a36881",
        name: "location2",
        lon: 25.7,
        lat: 58.8,
        locationType: [LocationType.RESIDENTIAL_BUILDING, LocationType.WAREHOUSE],
        condition: ConditionEnum.AVERAGE,
        accessibility: AccessibilityEnum.OWNER_PERMISSION_REQUIRED,
        additionalInformation: "A historical building that requires prior booking for access.",
        isPublic: false,
        requiredPoints: 200,
        createdBy: "user2",
    },
    {
        uuid: "67999668-beed-8813-9416-587422a36882",
        name: "location3",
        lon: 25.9,
        lat: 59.0,
        locationType: [LocationType.RUINS, LocationType.UNDERGROUND],
        condition: ConditionEnum.DEMOLISHED,
        accessibility: AccessibilityEnum.CLOSED,
        additionalInformation: "Ancient ruins located in a remote area.",
        isPublic: true,
        requiredPoints: 50,
        createdBy: "user3",
    },
];

export default locationsExample;