import moment from 'moment';

export const vehiclesToInsureOptions = [{ label: '1', value: '1' }, { label: '2', value: '2' }, { label: '3', value: '3' }]
export const driversToInsureOptions = [{ label: '1', value: '1' }, { label: '2', value: '2' }, { label: '3', value: '3' }, { label: '4', value: '4' }]
export const yesNoOptions = [{ label: 'No', value: 'N' }, { label: 'Yes', value: 'Y' }]
export const retiredOptions = [{ label: 'No', value: 'false' }, { label: 'Yes', value: 'true' }]
export const ticketsRecievedOptions = [
  { label: '0', value: '0' },
  { label: '1', value: '1' },
  { label: '2', value: '2' }, 
  { label: '3', value: '3' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
  { label: '6', value: '6' },
  { label: '7', value: '7' },
  { label: '8', value: '8' },
  { label: '9', value: '9' },
  { label: '10', value: '10' },
  { label: '11', value: '11' },
  { label: '12', value: '12' },
]
export const claimsOptions = [
  { label: '0', value: '0' },
  { label: '1', value: '1' },
  { label: '2', value: '2' }, 
  { label: '3', value: '3' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
  { label: '6', value: '6' }
]

// note months are zero-indexed
export const licenseDate = moment({ year: 1994, month: 2, day: 31 });


export const birthDayOptions = {
  days: [],
  years: [],
  months: [
    { value: '1', label: 'Jan' },
    { value: '2', label: 'Feb' },
    { value: '3', label: 'Mar' },
    { value: '4', label: 'Apr' },
    { value: '5', label: 'May' },
    { value: '6', label: 'Jun' },
    { value: '7', label: 'Jul' },
    { value: '8', label: 'Aug' },
    { value: '9', label: 'Sept' },
    { value: '10', label: 'Oct' },
    { value: '11', label: 'Nov' },
    { value: '12', label: 'Dec' }
  ]
}
for (let index = 0; index < 31; index++) {
  birthDayOptions.days.push({ label: `${index+1}`, value: index+1 });
}
const d = new Date();
const yearsBack = 100; // how many years old can the person select?
const thisYear = d.getFullYear();
for (let index = 16; index < yearsBack; index++) {
  birthDayOptions.years.push({ label: `${thisYear-index}`, value: thisYear-index });
}

export const dateDropdown = {
  days: [],
  years: [],
  months: [
    { value: '1', label: 'Jan' },
    { value: '2', label: 'Feb' },
    { value: '3', label: 'Mar' },
    { value: '4', label: 'Apr' },
    { value: '5', label: 'May' },
    { value: '6', label: 'Jun' },
    { value: '7', label: 'Jul' },
    { value: '8', label: 'Aug' },
    { value: '9', label: 'Sept' },
    { value: '10', label: 'Oct' },
    { value: '11', label: 'Nov' },
    { value: '12', label: 'Dec' }
  ]
}

for (let index = 0; index < 31; index++) {
  dateDropdown.days.push({ label: `${index+1}`, value: index+1 });
}
const currentDate = new Date();
const totalYear = 100; // how many years old can the person select?
const currentYear = currentDate.getFullYear();
for (let index = 0; index < totalYear; index++) {
  dateDropdown.years.push({ label: `${currentYear-index}`, value: currentYear-index });
}

export const licenseSuspendDateDropdwon = {
  days: [],
  years: [],
  months: [
    { value: '1', label: 'Jan' },
    { value: '2', label: 'Feb' },
    { value: '3', label: 'Mar' },
    { value: '4', label: 'Apr' },
    { value: '5', label: 'May' },
    { value: '6', label: 'Jun' },
    { value: '7', label: 'Jul' },
    { value: '8', label: 'Aug' },
    { value: '9', label: 'Sept' },
    { value: '10', label: 'Oct' },
    { value: '11', label: 'Nov' },
    { value: '12', label: 'Dec' }
  ]
}
for (let index = 0; index < 31; index++) {
  licenseSuspendDateDropdwon.days.push({ label: `${index+1}`, value: index+1 });
}
const licenseSuspendDate = new Date();
const totalSuspendYear = 6; // how many years old can the person select?
const licenseSuspendYear = licenseSuspendDate.getFullYear();
for (let index = 0; index < totalSuspendYear; index++) {
  licenseSuspendDateDropdwon.years.push({ label: `${licenseSuspendYear-index}`, value: licenseSuspendYear-index });
}


export const maritalOptions = [
  { label: 'Common Law', value: 'Common Law'},
  { label: 'Divorced', value: 'Divorced' },
  { label: 'Married', value: 'Married' },
  { label: 'Single', value: 'Single' },
  { label: 'Widowed', value: 'Widowed' },
]
export const licenseClassOptions = [{ label: 'G', value: 'G' }, { label: 'G2', value: 'G2' }, { label: 'G1', value: 'G1' }]
export const licenseGClassOptions = [{ label: 'G', value: 'G' }]

export const licenseObtainedOptions = [{ label: 'Option 1', value: '1' }, { label: 'Option 2', value: '2' }, { label: 'Option 3', value: '3' }]
export const ticketsRecieved= [{ label: 'Option 0', value: '0' },{ label: 'Option 1', value: '1' }, { label: 'Option 2', value: '2' }, { label: 'Option 3', value: '3' }]
export const severityConviction = [{ label: 'Criminal', value: 'criminal' }, { label: 'Major', value: 'major' }, { label: 'Minor', value: 'minor' }]


export const yearsInsuredOptions = (number) => {
  let yearOptions = [];
  for (let index = -1; index < number; index++) {
    if(index == -1) yearOptions.push({label: `Less Than ${index+2}`, value: index })
    else if (index+1 == number) yearOptions.push({label: ` ${index+1}+`, value: index+1 })
    else yearOptions.push({ label: `${index+1}`, value: index+1 });
  }
  return yearOptions
}

export const datePurchasedLeasedOptions = [{ label: 'Option 1', value: '1' }, { label: 'Option 2', value: '2' }, { label: 'Option 3', value: '3' }]
export const policiesCancelledOptions = [
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
];
export const lapseOptions = [
  { label: 'Driving without Insurance', value: 'DWOI' },
  { label: 'Insurance cancelled due to License Suspension', value: 'LicSusp' },
  { label: 'Insurance cancelled due to non-disclosure of information', value: 'NonDiscl' },
  { label: 'Insurance cancelled due to non payment', value: 'NonPay' },
  { label: 'Material Misrepresentation', value: 'MatMisrep' },
  { label: 'No vehicle so no insurance was required', value: 'NotReqrd' },
];

export const suspensionOptions = [
  { label: 'Alcohol related license suspension', value: 'Alcohol related license suspension' },
  { label: 'Criminal related (Non Alcohol) License Suspension', value: 'Criminal related (Non Alcohol) License Suspension' },
  { label: 'Too many convictions', value: 'Too many convictions' },
  { label: 'Suspension due to non payment of fines', value: 'Suspension due to non payment of fines' },
  { label: 'Other-Administrative', value: 'Other-Administrative' },
  { label: 'Other-Non-administrative', value: 'Other-Non-administrative' },
]

export const claimTypeOptions = [
  { label: 'At Fault Accident', value: 'Collision' },
  {label: 'Fire', value: 'Fire'},
  { label: 'Glass Breakage', value: 'Glass Breakage' },
  { label: 'Glass Repair', value: 'Glass Repair' },
  { label: 'Hail', value: 'Hail' },
  { label: 'Not At Fault Accident', value: 'Non-responsible Collision' },
  { label: 'Theft', value: 'Theft' },
  { label: 'Vandalism', value: 'Vandalism' },
  { label: 'You Struck an Object or Vehicle', value: 'collision' },
  { label: 'You Were Struck by an Object or Vehicle', value: 'Non-responsible collision' },
];
export const continuousPolicyOptions = [{ label: 'Option 1', value: '1' }, { label: 'Option 2', value: '2' }, { label: 'Option 3', value: '3' }]
export const primaryUseOptions =
[
  { label: 'Commuting to Work, School or Transit Station', value: '1' },
  { label: 'Pleasure or errands only', value: '3' },
  { label: 'Business', value: '0', showBusinessModal: true },
  { label: 'Commercial', value: '2', showBusinessModal: true }
];

export const comprehensiveDeductible =
[
  { label: '0', value: '0' },
  { label: '500', value: '500' },
  { label: '1000', value: '1000' },
];

export const liablityLimit =
[
  { label: '1000000', value: '1000000' },
  { label: '2000000', value: '2000000' }
];

export const incomeReplacement =
[
  { label: '300', value: '300' },
  { label: '600', value: '600' },
  { label: '800', value: '800' },
  { label: '1000', value: '1000' }
];
export const increaseCare =
[
  { label: '1(65000)', value: '65000' },
  { label: '2(130000)', value: '130000' },
  { label: '3(1000000)', value: '1000000' }
];
export const cancelReasonOptions =
[
  { label: 'Cancelled due to driving record', value: 'Cancelled due to driving record' },
  { label: 'Material Misrepresentation', value: 'Material Misrepresentation' },
  { label: 'Non-Disclosure', value: 'Non-Disclosure' },
  { label: 'Non-Payment', value: 'Non-Payment' },
];

export const majorSeverity =
[
  { label: 'Failure to report damage to highway property', value: 'FDH' },
  { label: 'Failing to report accident', value: 'FRA' },
  { label: 'Major Conviction', value: 'MAJOR' },
  { label: 'Operate motor vehicle no insurance', value: 'OMVNI' },
  { label: 'Speeding 50km or over posted speed limit', value: 'SP' },
  { label: 'School bus improper passing or fail to stop', value: 'PSB' },
  { label: 'School playground improper passing', value: 'PSG' },
];
export const criminalSeverity =
[
  { label: 'Blood Alcohol over .08', value: 'ALC' },
  { label: 'Careless Driving, undue care or attention', value: 'CD' },
  { label: 'Criminal Negligence', value: 'CN' },
  {label: 'Dangerous Driving', value: 'DD'},
  {label: 'Driving while under suspension', value: 'DUS'},
  {label: 'Drunk Driving', value: 'DRK'},
  {label: 'Failing to obey police', value: 'FP'},
  {label: 'Failure to remain at the scene of an accident', value: 'FTR'},
  {label: 'Impaired driving', value: 'IMP'},
  { label: 'Motor manslaughter', value: 'MM' },
  { label: 'Racing', value: 'RAC' },
  { label: 'Refuse breathalyzer', value: 'RB' },
  { label: 'Serious Conviction', value: 'SECTD' },
];
export const minorSeverity =
[
  {label: 'Crowding Drivers Seat', value: 'DS'},
  {label: 'Defective Brakes', value: 'DB'},
  {label: 'Failure to produce drivers licence', value: 'LIC'},
  {label: 'Failing to share road', value: 'FSR'},
  {label: 'Failing to signal', value: 'FTS'},
  {label: 'Failure to use seatbelts', value: 'SB'},
  {label: 'Failing to yield', value: 'FTY'},
  {label: 'Failing to yield to pedestrian', value: 'PX'},
  {label: 'Failure to produce insurance card', value: 'FCIC'},
  {label: 'Following too closely', value: 'FTC'},
  {label: 'Headlight Offenses', value: 'HL'},
  {label: 'Improper driving in a Bus Lane', value: 'BL'},
  {label: 'Improper lane change', value: 'ILC'},
  {label: 'Improper opening of door', value: 'IOD'},
  {label: 'Improper passing', value: 'IP'},
  {label: 'Improper towing, persons on sled, bicycle, etc.', value: 'TW'},
  {label: 'Improper turn', value: 'IT'},
  {label: 'Improper use of divided highway', value: 'DH'},
  {label: 'Insecure load', value: 'LD'},
  {label: 'Minor Conviction', value: 'MINOR'},
  {label: 'Minor Conviction', value: 'CPV'},
  { label: 'Obstructing traffic', value: 'OT' },
  { label: 'Overload', value: 'OLO' },
  {label: 'Prohibited use of hand-held device', value: 'minor'},
  { label: 'Railway crossing', value: 'RRX' },
  { label: 'Speeding up to 49 km over posted speed limit', value: 'SP' },
  { label: 'Stop sign infraction', value: 'SS' },
  { label: 'Stunting', value: 'STN' },
  { label: 'Traffic light', value: 'TSL' },
  {label: 'Trailer passenger', value: 'TP'},
  {label: 'Unnecessary noise', value: 'UN'},
  {label: 'Unnecessary slow driving', value: 'SD'},
  {label: 'Unsafe move', value: 'UM'},
  {label: 'Unsafe or prohibited turn', value: 'UT'},
  {label: 'Unsafe Vehicle', value: 'WIN'},
  {label: 'Wrong way on one way', value: 'OW'},
  
  
];

export const genderOptions = [{ label: 'Female', value: 'F' }, { label: 'Male', value: 'M' }]

export const ownLeaseOptions = [{ label: 'Own', value: 'owned' }, { label: 'Lease', value: 'leased' }]
export const newUsedOptions = [{ label: 'New', value: 'true' }, { label: 'Used', value: 'false' }]

export const coverageOptions = [
  {label: 'Minimum', value: '0' },
  { label: 'Essentials', value: '1' },
  { label: 'Enhanced', value: '2' },
  { label: 'Custom', value: '3' },
]
