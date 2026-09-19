// Real enhanced photographs of Vikings Gym & Spa (Aurangabad, Bihar)
// Captured in-situ and enhanced for high-end fitness brand presentation.

// Entrance & Reception
import entranceSign from "../../assets/GymPhotos/enhanced/gym-entrance-illuminated-sign.webp";
import entranceFront from "../../assets/GymPhotos/enhanced/gym-entrance-front-view.webp";
import receptionClose from "../../assets/GymPhotos/enhanced/gym-reception-lounge-close.webp";
import receptionWide from "../../assets/GymPhotos/enhanced/gym-reception-lounge-wide.webp";
import receptionDesk from "../../assets/GymPhotos/enhanced/gym-reception-executive-desk.webp";
import receptionGlassDoor from "../../assets/GymPhotos/enhanced/gym-reception-glass-door.webp";

// Free Weights & Strength Arena
import deadliftPlatform from "../../assets/GymPhotos/enhanced/gym-olympic-deadlift-platform.webp";
import powerSquatRack from "../../assets/GymPhotos/enhanced/gym-power-squat-rack-station.webp";
import strengthPanoramic from "../../assets/GymPhotos/enhanced/gym-strength-equipment-panoramic.webp";
import dumbbellRackClose from "../../assets/GymPhotos/enhanced/gym-free-weights-dumbbell-rack-close.webp";
import freeWeightsBenches from "../../assets/GymPhotos/enhanced/gym-free-weights-benches-arena.webp";
import dumbbellReflection from "../../assets/GymPhotos/enhanced/gym-dumbbell-rack-reflection.webp";
import inclineBenchStation from "../../assets/GymPhotos/enhanced/gym-incline-bench-press-station.webp";
import plateLoadedRow from "../../assets/GymPhotos/enhanced/gym-plate-loaded-row-station.webp";
import assistedPullupDip from "../../assets/GymPhotos/enhanced/gym-assisted-pullup-dip-station.webp";
import deadliftPreacherBench from "../../assets/GymPhotos/enhanced/gym-strength-deadlift-preacher-bench.webp";

// Main Floor & Functional Training
import mainArenaPanoramic from "../../assets/GymPhotos/enhanced/gym-main-arena-panoramic.webp";
import sprintTrackFloor from "../../assets/GymPhotos/enhanced/gym-functional-sprint-track.webp";
import boxingHeavyBag from "../../assets/GymPhotos/enhanced/gym-boxing-heavy-bag-zone.webp";
import cableCrossoverHub from "../../assets/GymPhotos/enhanced/gym-cable-crossover-cardio-hub.webp";
import selectorizedAisle from "../../assets/GymPhotos/enhanced/gym-selectorized-machine-aisle.webp";

// Cardio Suite
import cardioRowingWide from "../../assets/GymPhotos/enhanced/gym-cardio-rowing-treadmills-wide.webp";
import cardioTreadmillLine from "../../assets/GymPhotos/enhanced/gym-cardio-treadmill-line.webp";
import cardioSpinBikes from "../../assets/GymPhotos/enhanced/gym-cardio-spin-bikes-floor.webp";

// Yoga, Aerobics & Group Dance Studio
import yogaStudioClean from "../../assets/GymPhotos/enhanced/gym-yoga-aerobics-studio-clean.webp";
import yogaStudioMats from "../../assets/GymPhotos/enhanced/gym-yoga-dance-studio-mats.webp";
import yogaStudioSpacious from "../../assets/GymPhotos/enhanced/gym-yoga-studio-spacious.webp";
import groupClassEquipment from "../../assets/GymPhotos/enhanced/gym-group-class-equipment-studio.webp";

// Restroom & Executive Lounge
import restroomsChangingSuite from "../../assets/GymPhotos/enhanced/gym-restrooms-changing-suite.webp";

export {
  entranceSign,
  entranceFront,
  receptionClose,
  receptionWide,
  receptionDesk,
  receptionGlassDoor,
  deadliftPlatform,
  powerSquatRack,
  strengthPanoramic,
  dumbbellRackClose,
  freeWeightsBenches,
  dumbbellReflection,
  inclineBenchStation,
  plateLoadedRow,
  assistedPullupDip,
  deadliftPreacherBench,
  mainArenaPanoramic,
  sprintTrackFloor,
  boxingHeavyBag,
  cableCrossoverHub,
  selectorizedAisle,
  cardioRowingWide,
  cardioTreadmillLine,
  cardioSpinBikes,
  yogaStudioClean,
  yogaStudioMats,
  yogaStudioSpacious,
  groupClassEquipment,
  restroomsChangingSuite,
};

// Hero Ambient Background Image
export const HERO_BACKGROUND_IMAGE = mainArenaPanoramic;

// Hero Carousel Images (pure workout & training floor)
export const HERO_CAROUSEL_IMAGES = [
  { src: deadliftPlatform, label: "OLYMPIC DEADLIFT" },
  { src: freeWeightsBenches, label: "FREE WEIGHTS ARENA" },
  { src: powerSquatRack, label: "POWER SQUAT CAGE" },
  { src: plateLoadedRow, label: "PLATE-LOADED ROWS" },
  { src: sprintTrackFloor, label: "AGILITY TRACK" },
  { src: cardioTreadmillLine, label: "CARDIO SUITE" },
  { src: inclineBenchStation, label: "OLYMPIC BENCH PRESS" },
  { src: dumbbellRackClose, label: "DUMBBELL ARSENAL" },
  { src: boxingHeavyBag, label: "COMBAT ZONE" },
  { src: cardioSpinBikes, label: "SPIN BIKE FLEET" },
];

export interface GalleryItem {
  url: string;
  alt: string;
  label: string;
  category: "all" | "strength" | "cardio" | "studio" | "restroom";
}

// Curated Gallery including Restrooms and Clean Training Zones
export const REAL_GALLERY_IMAGES: GalleryItem[] = [
  {
    url: deadliftPlatform,
    alt: "Olympic deadlift competition platform with calibrated bumper plates",
    label: "Powerlifting Arena",
    category: "strength",
  },
  {
    url: freeWeightsBenches,
    alt: "Heavy dumbbell racks and adjustable incline benches on pristine rubber flooring",
    label: "Free Weights & Dumbbells",
    category: "strength",
  },
  {
    url: powerSquatRack,
    alt: "Viva Fitness commercial multi-grip power squat cage station",
    label: "Power Squat Cage",
    category: "strength",
  },
  {
    url: plateLoadedRow,
    alt: "Heavy duty plate-loaded back rowing machine station",
    label: "Plate-Loaded Rows",
    category: "strength",
  },
  {
    url: sprintTrackFloor,
    alt: "Numbered functional sprint and sled agility turf track",
    label: "Agility Track",
    category: "cardio",
  },
  {
    url: cardioTreadmillLine,
    alt: "Viva Fitness commercial treadmill suite and cardio floor",
    label: "Cardio Treadmills",
    category: "cardio",
  },
  {
    url: boxingHeavyBag,
    alt: "Heavy boxing bag and functional combat conditioning zone",
    label: "Combat Zone",
    category: "cardio",
  },
  {
    url: yogaStudioClean,
    alt: "Mirror-lined yoga, aerobics and dance studio with clean hardwood flooring and halo lighting",
    label: "Yoga & Dance Studio",
    category: "studio",
  },
  {
    url: restroomsChangingSuite,
    alt: "Modern executive changing lounge and luxury restrooms suite",
    label: "Executive Restrooms",
    category: "restroom",
  },
  {
    url: receptionDesk,
    alt: "Vikings Gym luxury reception lounge with illuminated 3D logo",
    label: "Reception Lounge",
    category: "restroom",
  },
  {
    url: cardioSpinBikes,
    alt: "Commercial spin bikes and studio cycle fleet",
    label: "Spin Fleet",
    category: "cardio",
  },
];

// Daily Stories circular bubbles
export const REAL_STORY_TILES = [
  { img: sprintTrackFloor, label: "WOD" },
  { img: plateLoadedRow, label: "Training" },
  { img: deadliftPlatform, label: "Lifts" },
  { img: dumbbellRackClose, label: "Warriors" },
  { img: yogaStudioSpacious, label: "Studio" },
];
