import flatMap from "lodash/flatMap";

export const getVehicleKinds = results => flatMap(results || [], result => {
  const { vehicles, body_style, body_style_id } = result;

  return vehicles.map(({ vehicle_id, trim_name }) => ({
    body_style,
    body_style_id,
    trim_id: vehicle_id,
    trim_name
  }));
  
}).filter(trim => trim.trim_name !== "-");