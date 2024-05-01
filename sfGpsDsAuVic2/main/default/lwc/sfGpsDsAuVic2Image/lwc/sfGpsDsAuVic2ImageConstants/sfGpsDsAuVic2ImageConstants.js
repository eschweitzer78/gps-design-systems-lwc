export const RplImageAspectOptions = {
  square: "Square",
  full: "Full",
  wide: "Wide",
  ultrawide: "Ultrawide",
  panorama: "Panorama"
};

export const RplImagePriorityOptions = {
  auto: "Auto",
  low: "Low",
  high: "High"
};

export const RplImageFitOptions = {
  none: "None",
  contain: "Contain",
  cover: "Cover"
};

const ASPECT_DEFAULT = null;
const PRIORITY_DEFAULT = "auto";
const FIT_DEFAULT = "cover";

export const IMAGE_DEFAULT = {
  aspect: ASPECT_DEFAULT,
  priority: PRIORITY_DEFAULT,
  fit: FIT_DEFAULT
};

export const IMAGE_DEFAULT_JSON = JSON.stringify(IMAGE_DEFAULT);
