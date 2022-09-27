const moment = require("moment-timezone");

export const formatInt = value => {
  if (value !== undefined) {
    if (typeof value !== "number") {
      value = parseInt(value);
    }

    return value.toFixed().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return null;
};

export const formatCurrency = (value, forceDecimal = true) => {
  if (value != undefined) {
    value = parseFloat(value);
    let result = formatInt(value);
    const decimals = value.toFixed(2).split(".")[1];
    if (forceDecimal || decimals !== "00") {
      result += `.${decimals}`;
    }
    return result;
  }
  return null;
};

export const convertDateFormat = date => {
  const dateobj = new Date(date);
  const year = dateobj.getFullYear();
  const month = `0${dateobj.getMonth() + 1}`.slice(-2);
  var date = `0${dateobj.getDate()}`.slice(-2);
  const hours = `0${dateobj.getHours()}`.slice(-2);
  const minutes = `0${dateobj.getMinutes()}`.slice(-2);
  const seconds = `0${dateobj.getSeconds()}`.slice(-2);
  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC"
  ];
  const converted_date = `${date} ${months[parseInt(month) - 1]} ${year}`;
  return converted_date;
};

export const timeTo12HrFormat = time => {
  // Take a time in 24 hour format and format it in 12 hour format
  const timePartArray = time.split(":");
  let ampm = "AM";

  if (timePartArray[0] >= 12) {
    ampm = "PM";
  }

  if (timePartArray[0] > 12) {
    timePartArray[0] -= 12;
  }

  const formattedTime = `${timePartArray[0]}:${timePartArray[1]}:${
    timePartArray[2]
  } ${ampm}`;

  return formattedTime;
};

export const timeToMinutes = time => {
  const splittedTime = time.split(":"); // split it at the colons
  const minutes = +splittedTime[0] * 60 + +splittedTime[1];
  return minutes;
};

export const keyGen = keyLength => {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
};

export const getGuid = () => {
  return `${keyGen() + keyGen()}-${keyGen()}-4${keyGen().substr(
    0,
    3
  )}-${keyGen()}-${keyGen()}${keyGen()}${keyGen()}`.toLowerCase();
};

export const userLoggedInSession = (
  currentTime,
  loggedInTime,
  expirationTime
) => {
  const expiredMin = expirationTime;
  const timeDifference = currentTime - loggedInTime;
  if (timeDifference >= expiredMin) return true;
  return false;
};

export const roundNumbers = (number, precision) => {
  const shift = function(number, precision, reverseShift) {
    if (reverseShift) {
      precision = -precision;
    }
    const numArray = `${number}`.split("e");
    return +`${numArray[0]}e${
      numArray[1] ? +numArray[1] + precision : precision
    }`;
  };
  return shift(Math.round(shift(number, precision, false)), precision, true);
};

export const driversData = (data, driverId) => {
  let GLicense;
  let G1License;
  let G2License;
  if (data.license_class == "G") {
    GLicense = data.license_year
      ? `${data.license_year}-${data.license_month}-${data.license_day}`
      : null;
    G1License = data.license_year_G1
      ? `${data.license_year_G1}-${data.license_month_G1}-${
          data.license_day_G1
        }`
      : null;
    G2License = data.license_year_G2
      ? `${data.license_year_G2}-${data.license_month_G2}-${
          data.license_day_G2
        }`
      : null;
  } else if (data.license_class == "G1") {
    G1License = data.license_year
      ? `${data.license_year}-${data.license_month}-${data.license_day}`
      : null;
    GLicense = data.license_year_G
      ? `${data.license_year_G}-${data.license_month_G}-${data.license_day_G}`
      : null;
    G2License = data.license_year_G2
      ? `${data.license_year_G2}-${data.license_month_G2}-${
          data.license_day_G2
        }`
      : null;
  } else if (data.license_class == "G2") {
    G2License = data.license_year
      ? `${data.license_year}-${data.license_month}-${data.license_day}`
      : null;
    GLicense = data.license_year_G
      ? `${data.license_year_G}-${data.license_month_G}-${data.license_day_G}`
      : null;
    G1License = data.license_year_G1
      ? `${data.license_year_G1}-${data.license_month_G1}-${
          data.license_day_G1
        }`
      : null;
  }
  const detail = {
    DriverID: driverId,
    FirstName: data.firstname || "Adam",
    QuoteType: 2,
    HasHadInsurance: data.driverListedInsured != "N",
    Birthday: `${data.birth_year || "1986"}-${data.birth_month ||
      "4"}-${data.birth_day || "5"} 00:00:00.000`,
    Gender: data.gender || "M",
    MaritalStatus: data.maritalstatus || "1",
    G1Date: G1License,
    LastName: data.lastname,
    ContinousIsuranceYears: data.currentInsurancePolicy || "2",
    GDate: GLicense,
    G2Date: G2License,
    Retired: data.retired || "false",
    LicenseLetter: data.license_class,
    IsLicenseCanceled: data.licenseCancelled != "N",
    DateWithCurrentCompany: data.currentInsurancePolicy || "0",
    DriversTesting: data.driverTesting
  };
  return detail;
};

export const vehiclesData = (data, vehicleId, driverId) => {
  let coverageData;
  let detail;
  if (data.coverage === "1") {
    coverageData = {
      LossOfUse: true,
      NonOwnedAuto: true,
      WaiverOfDepreciation: true,
      LiabLimit: "1000000",
      CollisionDeductible: "1000",
      ComprehensiveDeductible: "1000",
      AccidentWaiver: false,
      HasAccidentBenefits: false
    };
  } else if (data.coverage === "0") {
    coverageData = {
      LossOfUse: false,
      NonOwnedAuto: false,
      WaiverOfDepreciation: false,
      LiabLimit: "1000000",
      CollisionDeductible: "0",
      ComprehensiveDeductible: "0",
      AccidentWaiver: false,
      HasAccidentBenefits: false
    };
  } else if (data.coverage === "2") {
    coverageData = {
      LossOfUse: true,
      NonOwnedAuto: true,
      WaiverOfDepreciation: true,
      LiabLimit: "2000000",
      CollisionDeductible: "500",
      ComprehensiveDeductible: "500",
      AccidentWaiver: true,
      HasAccidentBenefits: false
    };
  } else if (data.coverage === "3") {
    coverageData = {
      LossOfUse: data.loss_of_use !== "N",
      NonOwnedAuto: data.non_owned_auto !== "N",
      WaiverOfDepreciation: data.waiver_depreciation !== "N",
      LiabLimit: data.liability_limit,
      CollisionDeductible: data.collision_deductible,
      ComprehensiveDeductible: data.comprehensive_deductible,
      AccidentWaiver: data.accident_forgiveness !== "N",
      HasAccidentBenefits: data.accident_benefits !== "N",
      ABIncomeReplacement: data.income_replacement,
      ABIncreasedCare: data.increased_care,
      ABIncreasedCareInjuries: data.increased_care_injuries !== "N",
      ABImpairCoverages: data.impair_coverages !== "N",
      ABDeathFuneral: data.death_funeral !== "N",
      ABDependantCare: data.dependant_care !== "N",
      ABIndexationBenifit: data.indexation_benefit !== "N",
      ABOffsetTortDed: data.offset_tort_ded !== "N"
    };
  }
  let primaryUseValue = "Business";
  if (data.primaryUse === "1" || data.primaryUse === "3") {
    primaryUseValue = "Pleasure";
  }
  if (data.coverage === "3") {
    detail = {
      VehID: vehicleId,
      DistanceYearly: data.drivenAnnually || "",
      CommercialUseTypes: null,
      VIN: data.VIN || null,
      Model: data.vehicle_model,
      Make: data.vehicle_make,
      Year: data.vehicle_year,
      NewOld: data.newOrUsed,
      WinterTire: data.winterTires !== "N",
      PrimaryUse: primaryUseValue,
      PrimaryDriverID: driverId,
      PurchasePrice: data.purchaseprice,
      PurchaseDate: data.purchase_year
        ? `${data.purchase_year}-${data.purchase_month}-${
            data.purchase_day
          } 00:00:00.000`
        : null,
      LossOfUse: coverageData.LossOfUse,
      NonOwnedAuto: coverageData.NonOwnedAuto,
      WaiverOfDepreciation: coverageData.WaiverOfDepreciation,
      LiabLimit: coverageData.LiabLimit,
      CollisionDeductible: coverageData.CollisionDeductible,
      ComprehensiveDeductible: coverageData.ComprehensiveDeductible,
      AccidentWaiver: coverageData.AccidentWaiver,
      HasAccidentBenefits: coverageData.HasAccidentBenefits,
      ABIncomeReplacement: coverageData.ABIncomeReplacement,
      ABIncreasedCare: coverageData.ABIncreasedCare,
      ABIncreasedCareInjuries: coverageData.ABIncreasedCareInjuries,
      ABImpairCoverages: coverageData.ABImpairCoverages,
      ABDeathFuneral: coverageData.ABDeathFuneral,
      ABDependantCare: coverageData.ABDependantCare,
      ABIndexationBenifit: coverageData.ABIndexationBenifit,
      ABOffsetTortDed: coverageData.ABOffsetTortDed,
      DistanceDaily: data.distanceDaily ? 2 * data.distanceDaily : "0",
      OwnedOrLeased: data.ownOrLease
    };
    return detail;
  }
  detail = {
    VehID: vehicleId,
    DistanceYearly: data.drivenAnnually || "",
    CommercialUseTypes: null,
    VIN: data.VIN || null,
    DistanceDaily: data.distanceDaily ? 2 * data.distanceDaily : "0",
    Model: data.vehicle_model,
    Make: data.vehicle_make,
    Year: data.vehicle_year,
    NewOld: data.newOrUsed,
    WinterTire: data.winterTires !== "N",
    PrimaryUse: primaryUseValue,
    PrimaryDriverID: driverId,
    PurchasePrice: data.purchaseprice,
    PurchaseDate: data.purchase_year
      ? `${data.purchase_year}-${data.purchase_month}-${
          data.purchase_day
        } 00:00:00.000`
      : null,
    LossOfUse: coverageData.LossOfUse,
    NonOwnedAuto: coverageData.NonOwnedAuto,
    WaiverOfDepreciation: coverageData.WaiverOfDepreciation,
    LiabLimit: coverageData.LiabLimit,
    CollisionDeductible: coverageData.CollisionDeductible,
    ComprehensiveDeductible: coverageData.ComprehensiveDeductible,
    AccidentWaiver: coverageData.AccidentWaiver,
    HasAccidentBenefits: coverageData.HasAccidentBenefits,
    OwnedOrLeased: data.ownOrLease
  };
  return detail;
};

export const claimsData = (
  data,
  driverId,
  vehicleId,
  ClaimID,
  i,
  claimDate
) => {
  const detail = {
    DriverID: driverId,
    ClaimType: data.claim_type[i],
    VehID: vehicleId,
    ClaimID,
    ClaimDate: claimDate.length > 0 ? claimDate[i] : null
  };
  return detail;
};

export const convictionsData = (
  data,
  driverId,
  ticketId,
  i,
  convictionDate
) => {
  const detail = {
    Severity: data.severity_conviction[i],
    DriverID: driverId,
    TicketID: ticketId,
    ConvictionDate: convictionDate.length > 0 ? convictionDate[i] : null,
    OffenceCode: data.conviction_type[i]
  };
  return detail;
};

export const incidentsData = (
  data,
  driverId,
  cancellationId,
  i,
  incidentsDate
) => {
  const detail = {
    DriverID: driverId,
    CancellationDate: incidentsDate.length > 0 ? incidentsDate[i] : null,
    IncidentType: data.policesCancel[i],
    DriverCancellationID: cancellationId,
    DateReinstated: null,
    Reason: data.insuranceLapse
  };
  return detail;
};

export const suspendData = (
  data,
  driverId,
  cancellationId,
  i,
  suspendedStartDate,
  suspendedEndDate
) => {
  const detail = {
    DriverID: driverId,
    DriverCancellationID: cancellationId,
    Suspended90Days: false,
    SuspensionStartDate:
      suspendedStartDate.length > 0 ? suspendedStartDate[i] : null,
    SuspensionEndDate: suspendedEndDate.length > 0 ? suspendedEndDate[i] : null,
    SuspendedReason: data.suspension_reason[i]
  };
  return detail;
};

export const removeDuplicates = (originalArray, objKey) => {
  const trimmedArray = [];
  const values = [];
  let value;

  for (let i = 0; i < originalArray.length; i++) {
    value = originalArray[i][objKey];

    if (values.indexOf(value) === -1) {
      trimmedArray.push(originalArray[i]);
      values.push(value);
    }
  }
  return trimmedArray;
};

export const extractNumberFromString = str => {
  const text = str;
  let number = text.match(/\d/g);
  number = number.join("");
  return number;
};

export const convertToServerTimeZone = date => {
  if(!date)
    return null;

  //EST
  const newDate = `${date}`;
  const timeZone = moment.tz.guess();
  const formattedDate = moment.tz(new Date(newDate), timeZone);
  return formattedDate.utc().format();
};

export const convertUTCDateToLocalDate = date => {
  if(!date)
    return null;
    
  return moment(new Date(date).getTime())
    .zone(new Date().toString().match(/([-\+][0-9]+)\s/)[1])
    .format("YYYY-MM-DD HH:mm:ss");
};
