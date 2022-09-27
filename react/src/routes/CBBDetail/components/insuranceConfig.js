export const insuranceConfig = data => {
  console.log(data, "data-console");
  const detail = {
    GUID: "2697f200-dc3b-4e97-9069-748195f11b22",
    QuoteID: 0,
    ID: 0,
    ProvinceABBR: "ON",
    City: "Windsor",
    PostalCode: data.postalCode.toUpperCase().replace(" ", ""),
    VehicleInfo: [
      {
        VehID: data.vehicleId,
        Model: data.model,
        Make: data.make,
        Year: data.year,
        PrimaryDriverID: data.driverId,
        PurchasePrice: data.price,
        PurchaseDate: new Date(),
        VIN: null,
        DistanceYearly: 15000,
        PrimaryUse: "Pleasure",
        DistanceDaily: 10,
        OwnedOrLeased: "Owned",
        WinterTire: true,
        LossOfUse: false,
        NonOwnedAuto: false,
        WaiverOfDepreciation: false,
        LiabLimit: "1000000",
        CollisionDeductible: "0",
        ComprehensiveDeductible: "0",
        AccidentWaiver: false,
        HasAccidentBenefits: false
      }
    ],
    DriverProfile: [
      {
        DriverID: data.driverId,
        QuoteType: 2,
        MaritalStatus: "M",
        Retired: false,
        Birthday: "1986-04-15 00:00:00.000",
        Gender: "M",
        DriversTesting: false,
        Retired: false,
        GDate: "2007-10-01 00:00:00.000",
        G1Date: "2005-09-01 00:00:00.000",
        G2Date: "2006-10-01 00:00:00.000",
        LicenseLetter: "G",
        IsLicenseCanceled: false,
        ContinousIsuranceYears: 6,
        DateWithCurrentCompany: "0"
      }
    ]
  };
  return detail;
};

export const insurancesubmitData = (props, postalCode) => {
  const driverId = randomId(1000000);
  const vehicleId = randomId(1000000);
  const data = {
    postalCode: postalCode || "",
    make:
      props.car_details &&
      props.car_details.data &&
      props.car_details.data.make,
    model:
      props.car_details &&
      props.car_details.data &&
      props.car_details.data.model,
    year:
      props.car_details &&
      props.car_details.data &&
      props.car_details.data.year,
    price: props.totalPrice,
    driverId,
    vehicleId
  };
  return data;
};

export const randomId = number => {
  let x = Math.random() * number;
  return Math.ceil(x);
};

export const providerWhitelist = [
  "GA",
  "GORE",
  "HAL",
  "LOMI",
  "DOC",
  "WAWA",
  "ECON",
  "ROY",
  "FAC"
];
