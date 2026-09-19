// Real enhanced photographs of Vikings Gym & Spa (Aurangabad, Bihar)
// Captured in-situ and enhanced for high-end fitness brand presentation.

// Entrance & Reception
import entranceSign from "../../assets/GymPhotos/enhanced/gym-entrance-illuminated-sign.webp";
import entranceFront from "../../assets/GymPhotos/enhanced/gym-entrance-front-view.webp";
import receptionClose from "../../assets/GymPhotos/enhanced/gym-reception-lounge-close.webp";
import receptionWide from "../../assets/GymPhotos/enhanced/gym-reception-lounge-wide.webp";
import receptionDesk from "../../assets/GymPhotos/enhanced/gym-reception-executive-desk.webp";
import receptionGlassDoor from "../../assets/GymPhotos/enhanced/gym-reception-glass-door.webp";
import receptionDeskWorkstation from "../../assets/GymPhotos/enhanced/gym-reception-desk-workstation.webp";
import receptionSupplements from "../../assets/GymPhotos/enhanced/gym-reception-supplements-station.webp";
import receptionWideVertical from "../../assets/GymPhotos/enhanced/gym-reception-wide-vertical.webp";

// Free Weights & Strength Arena
import deadliftPlatform from "../../assets/GymPhotos/enhanced/gym-olympic-deadlift-platform.webp";
import powerSquatRack from "../../assets/GymPhotos/enhanced/gym-power-squat-rack-station.webp";
import strengthPanoramic from "../../assets/GymPhotos/enhanced/gym-strength-equipment-panoramic.webp";
import dumbbellRackClose from "../../assets/GymPhotos/enhanced/gym-free-weights-dumbbell-rack-close.webp";
import freeWeightsBenches from "../../assets/GymPhotos/enhanced/gym-free-weights-benches-arena.webp";
import dumbbellReflection from "../../assets/GymPhotos/enhanced/gym-dumbbell-rack-reflection.webp";
import freeWeightsDarkMood from "../../assets/GymPhotos/enhanced/gym-free-weights-dark-mood.webp";
import inclineBenchStation from "../../assets/GymPhotos/enhanced/gym-incline-bench-press-station.webp";
import plateLoadedRow from "../../assets/GymPhotos/enhanced/gym-plate-loaded-row-station.webp";
import assistedPullupDip from "../../assets/GymPhotos/enhanced/gym-assisted-pullup-dip-station.webp";
import deadliftPreacherBench from "../../assets/GymPhotos/enhanced/gym-strength-deadlift-preacher-bench.webp";

// Main Floor & Functional Training
import mainArenaPanoramic from "../../assets/GymPhotos/enhanced/gym-main-arena-panoramic.webp";
import mainTrainingFloorReverse from "../../assets/GymPhotos/enhanced/gym-main-training-floor-reverse.webp";
import sprintTrackFloor from "../../assets/GymPhotos/enhanced/gym-functional-sprint-track.webp";
import boxingHeavyBag from "../../assets/GymPhotos/enhanced/gym-boxing-heavy-bag-zone.webp";
import cableCrossoverHub from "../../assets/GymPhotos/enhanced/gym-cable-crossover-cardio-hub.webp";
import selectorizedAisle from "../../assets/GymPhotos/enhanced/gym-selectorized-machine-aisle.webp";
import hallwayPerspectiveFloor from "../../assets/GymPhotos/enhanced/gym-hallway-perspective-floor.webp";

// Cardio Suite
import cardioRowingWide from "../../assets/GymPhotos/enhanced/gym-cardio-rowing-treadmills-wide.webp";
import cardioTreadmillLine from "../../assets/GymPhotos/enhanced/gym-cardio-treadmill-line.webp";
import cardioSpinBikes from "../../assets/GymPhotos/enhanced/gym-cardio-spin-bikes-floor.webp";

// Yoga, Aerobics & Group Dance Studio
import yogaStudioClean from "../../assets/GymPhotos/enhanced/gym-yoga-aerobics-studio-clean.webp";
import yogaStudioMats from "../../assets/GymPhotos/enhanced/gym-yoga-dance-studio-mats.webp";
import yogaStudioSpacious from "../../assets/GymPhotos/enhanced/gym-yoga-studio-spacious.webp";
import groupClassEquipment from "../../assets/GymPhotos/enhanced/gym-group-class-equipment-studio.webp";
import wellnessStudioCorner from "../../assets/GymPhotos/enhanced/gym-wellness-studio-corner.webp";

// Restroom & Executive Lounge
import restroomsChangingSuite from "../../assets/GymPhotos/enhanced/gym-restrooms-changing-suite.webp";

export {
  entranceSign,
  entranceFront,
  receptionClose,
  receptionWide,
  receptionDesk,
  receptionGlassDoor,
  receptionDeskWorkstation,
  receptionSupplements,
  receptionWideVertical,
  deadliftPlatform,
  powerSquatRack,
  strengthPanoramic,
  dumbbellRackClose,
  freeWeightsBenches,
  dumbbellReflection,
  freeWeightsDarkMood,
  inclineBenchStation,
  plateLoadedRow,
  assistedPullupDip,
  deadliftPreacherBench,
  mainArenaPanoramic,
  mainTrainingFloorReverse,
  sprintTrackFloor,
  boxingHeavyBag,
  cableCrossoverHub,
  selectorizedAisle,
  hallwayPerspectiveFloor,
  cardioRowingWide,
  cardioTreadmillLine,
  cardioSpinBikes,
  yogaStudioClean,
  yogaStudioMats,
  yogaStudioSpacious,
  groupClassEquipment,
  wellnessStudioCorner,
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
  id: string;
  url: string;
  alt: string;
  label: string;
  zone: string;
  category: "all" | "reception" | "strength" | "cardio" | "studio" | "restroom";
}

// Complete 36-Photo Real Gym Archive — Vikings Reception is placed FIRST!
export const ALL_GYM_GALLERY_IMAGES: GalleryItem[] = [
  // 1. VIKINGS RECEPTION FIRST (Prominently featured)
  {
    id: "g-reception-1",
    url: receptionDesk,
    alt: "Vikings Gym luxury reception lounge with illuminated 3D logo and executive check-in desk",
    label: "Reception & Check-In Desk",
    zone: "Lobby & Lounge",
    category: "reception",
  },
  // 2. OLYMPIC POWERLIFTING PLATFORM
  {
    id: "g-deadlift",
    url: deadliftPlatform,
    alt: "Olympic deadlift competition platform with calibrated bumper plates and steel bar",
    label: "Olympic Deadlift Platform",
    zone: "Strength Arena",
    category: "strength",
  },
  // 3. FREE WEIGHTS & DUMBBELLS
  {
    id: "g-free-weights-1",
    url: freeWeightsBenches,
    alt: "Heavy dumbbell racks and adjustable incline benches on pristine rubber flooring",
    label: "Free Weights & Dumbbells Arena",
    zone: "Strength Arena",
    category: "strength",
  },
  // 4. POWER SQUAT CAGE
  {
    id: "g-power-rack",
    url: powerSquatRack,
    alt: "Viva Fitness commercial multi-grip power squat cage station",
    label: "Power Squat Cage Station",
    zone: "Strength Arena",
    category: "strength",
  },
  // 5. FUNCTIONAL AGILITY TRACK
  {
    id: "g-sprint-track",
    url: sprintTrackFloor,
    alt: "Numbered functional sprint and sled agility turf track",
    label: "Functional Agility Turf Track",
    zone: "Cardio & Functional",
    category: "cardio",
  },
  // 6. YOGA & AEROBICS STUDIO
  {
    id: "g-yoga-studio-clean",
    url: yogaStudioClean,
    alt: "Mirror-lined yoga, aerobics and dance studio with clean hardwood flooring and halo lighting",
    label: "Yoga, Aerobics & Dance Studio",
    zone: "Studio & Wellness",
    category: "studio",
  },

  // 7. RECEPTION LOUNGE WIDE
  {
    id: "g-reception-wide",
    url: receptionWide,
    alt: "Wide angle view of Vikings Gym reception lounge and member seating area",
    label: "Executive Member Lounge",
    zone: "Lobby & Lounge",
    category: "reception",
  },
  // 8. RECEPTION CLOSE
  {
    id: "g-reception-close",
    url: receptionClose,
    alt: "Close-up of Vikings Gym front desk and illuminated branding",
    label: "Front Desk & Consultation Desk",
    zone: "Lobby & Lounge",
    category: "reception",
  },
  // 9. SUPPLEMENTS & NUTRITION BAR
  {
    id: "g-reception-supplements",
    url: receptionSupplements,
    alt: "Authentic sports nutrition and whey protein supplement display at front desk",
    label: "Nutrition & Supplement Station",
    zone: "Lobby & Lounge",
    category: "reception",
  },
  // 10. RECEPTION DESK WORKSTATION
  {
    id: "g-reception-workstation",
    url: receptionDeskWorkstation,
    alt: "Front office workstation and member access management terminal",
    label: "Member Management Workstation",
    zone: "Lobby & Lounge",
    category: "reception",
  },
  // 11. RECEPTION WIDE VERTICAL
  {
    id: "g-reception-vertical",
    url: receptionWideVertical,
    alt: "Portrait perspective of Vikings entrance foyer and illuminated logo",
    label: "Grand Entrance Foyer",
    zone: "Lobby & Lounge",
    category: "reception",
  },
  // 12. GLASS ENTRANCE DOORWAY
  {
    id: "g-reception-glass",
    url: receptionGlassDoor,
    alt: "Commercial tempered glass entrance doorway leading into Vikings training arena",
    label: "Arena Access Glass Portal",
    zone: "Lobby & Lounge",
    category: "reception",
  },
  // 13. EXTERIOR ILLUMINATED SIGN
  {
    id: "g-entrance-sign",
    url: entranceSign,
    alt: "Illuminated high-contrast red exterior Vikings Gym signage on MG Road",
    label: "Illuminated Exterior Signage",
    zone: "Lobby & Lounge",
    category: "reception",
  },
  // 14. FACADE FRONT VIEW
  {
    id: "g-entrance-front",
    url: entranceFront,
    alt: "Direct architectural front view of the Vikings Gym entrance facade",
    label: "Main Facility Entrance",
    zone: "Lobby & Lounge",
    category: "reception",
  },

  // 15. DUMBBELL RACK CLOSE
  {
    id: "g-dumbbell-close",
    url: dumbbellRackClose,
    alt: "Commercial rubber-coated hex dumbbells aligned on precision steel racks",
    label: "Precision Dumbbell Arsenal",
    zone: "Strength Arena",
    category: "strength",
  },
  // 16. DUMBBELL RACK REFLECTION
  {
    id: "g-dumbbell-mirror",
    url: dumbbellReflection,
    alt: "Mirror reflection of heavy dumbbell line and spotter benches",
    label: "Free Weights Mirror Line",
    zone: "Strength Arena",
    category: "strength",
  },
  // 17. FREE WEIGHTS DARK MOOD
  {
    id: "g-free-weights-dark",
    url: freeWeightsDarkMood,
    alt: "Cinematic dark gym atmosphere over the free weight training zone",
    label: "Iron Pit Atmospheric Perspective",
    zone: "Strength Arena",
    category: "strength",
  },
  // 18. INCLINE BENCH PRESS
  {
    id: "g-incline-bench",
    url: inclineBenchStation,
    alt: "Commercial Olympic incline barbell bench press station with spotter platform",
    label: "Olympic Incline Press Station",
    zone: "Strength Arena",
    category: "strength",
  },
  // 19. PLATE LOADED ROWS
  {
    id: "g-plate-row",
    url: plateLoadedRow,
    alt: "Heavy duty plate-loaded isolateral back rowing machine station",
    label: "Plate-Loaded Iso-Lateral Row",
    zone: "Strength Arena",
    category: "strength",
  },
  // 20. ASSISTED PULL-UP & DIP
  {
    id: "g-pullup-dip",
    url: assistedPullupDip,
    alt: "Selectorized counterbalanced assisted pull-up and triceps dip tower",
    label: "Assisted Pull-Up & Dip Station",
    zone: "Strength Arena",
    category: "strength",
  },
  // 21. DEADLIFT PREACHER BENCH
  {
    id: "g-preacher-bench",
    url: deadliftPreacherBench,
    alt: "Heavy preacher curl bench station and barbell conditioning rack",
    label: "Preacher Curl & Biceps Bench",
    zone: "Strength Arena",
    category: "strength",
  },
  // 22. STRENGTH EQUIPMENT PANORAMIC
  {
    id: "g-strength-panoramic",
    url: strengthPanoramic,
    alt: "Panoramic wide angle view across the imported strength machine floor",
    label: "Strength Machine Panorama",
    zone: "Strength Arena",
    category: "strength",
  },

  // 23. CARDIO TREADMILL SUITE
  {
    id: "g-treadmill-line",
    url: cardioTreadmillLine,
    alt: "Viva Fitness commercial treadmill fleet with individual digital metrics consoles",
    label: "Viva Fitness Commercial Treadmills",
    zone: "Cardio & Functional",
    category: "cardio",
  },
  // 24. SPIN BIKES FLEET
  {
    id: "g-spin-bikes",
    url: cardioSpinBikes,
    alt: "Commercial magnetic flywheel spin cycle fleet on the cardio deck",
    label: "High-RPM Spin Bike Deck",
    zone: "Cardio & Functional",
    category: "cardio",
  },
  // 25. CARDIO ROWING & TREADMILLS WIDE
  {
    id: "g-cardio-wide",
    url: cardioRowingWide,
    alt: "Wide angle perspective of the cardio deck showing rowing machines and treadmills",
    label: "Cardio Deck Wide Perspective",
    zone: "Cardio & Functional",
    category: "cardio",
  },
  // 26. BOXING HEAVY BAG ZONE
  {
    id: "g-boxing-bag",
    url: boxingHeavyBag,
    alt: "Suspended heavy leather boxing bag for combat conditioning and HIIT rounds",
    label: "Combat Conditioning Heavy Bag",
    zone: "Cardio & Functional",
    category: "cardio",
  },
  // 27. CABLE CROSSOVER HUB
  {
    id: "g-cable-crossover",
    url: cableCrossoverHub,
    alt: "Commercial 8-stack cable crossover and multi-station functional tower",
    label: "Cable Crossover Functional Hub",
    zone: "Cardio & Functional",
    category: "cardio",
  },
  // 28. SELECTORIZED AISLE
  {
    id: "g-selectorized-aisle",
    url: selectorizedAisle,
    alt: "Aisle of pin-selected selectorized weight stack machines with instructional placards",
    label: "Pin-Selected Machine Aisle",
    zone: "Cardio & Functional",
    category: "cardio",
  },
  // 29. MAIN TRAINING ARENA PANORAMIC
  {
    id: "g-main-panoramic",
    url: mainArenaPanoramic,
    alt: "Grand panoramic view overlooking the entire main training arena",
    label: "Main Training Arena Floor",
    zone: "Cardio & Functional",
    category: "cardio",
  },
  // 30. REVERSE TRAINING FLOOR
  {
    id: "g-training-reverse",
    url: mainTrainingFloorReverse,
    alt: "Reverse angle view across the training arena toward the strength stations",
    label: "Arena Central Training Deck",
    zone: "Cardio & Functional",
    category: "cardio",
  },
  // 31. ARENA HALLWAY PERSPECTIVE
  {
    id: "g-hallway-perspective",
    url: hallwayPerspectiveFloor,
    alt: "Clean corridor perspective connecting the workout floor to the studios",
    label: "Arena Access Concourse",
    zone: "Cardio & Functional",
    category: "cardio",
  },

  // 32. YOGA STUDIO MATS
  {
    id: "g-yoga-mats",
    url: yogaStudioMats,
    alt: "Group yoga studio setup with alignment mats and halo lighting",
    label: "Group Yoga & Pilates Studio",
    zone: "Studio & Wellness",
    category: "studio",
  },
  // 33. YOGA STUDIO SPACIOUS
  {
    id: "g-yoga-spacious",
    url: yogaStudioSpacious,
    alt: "Spacious mirror-lined studio for aerobics, Zumba and martial arts group classes",
    label: "Spacious Group Aerobics Studio",
    zone: "Studio & Wellness",
    category: "studio",
  },
  // 34. GROUP CLASS EQUIPMENT
  {
    id: "g-group-equipment",
    url: groupClassEquipment,
    alt: "Racks of step platforms, resistance bands, and foam rollers for classes",
    label: "Functional Group Accessories",
    zone: "Studio & Wellness",
    category: "studio",
  },
  // 35. WELLNESS STUDIO CORNER
  {
    id: "g-wellness-corner",
    url: wellnessStudioCorner,
    alt: "Quiet studio corner designed for stretching, mobility and core workouts",
    label: "Mobility & Core Wellness Corner",
    zone: "Studio & Wellness",
    category: "studio",
  },

  // 36. EXECUTIVE RESTROOMS & CHANGING LOUNGE
  {
    id: "g-restrooms-suite",
    url: restroomsChangingSuite,
    alt: "Modern executive changing lounge and luxury restrooms suite",
    label: "Executive Changing Lounge & Restrooms",
    zone: "Executive Amenities",
    category: "restroom",
  },
];

// Preview collection: Exactly the first 6 images for the homepage
export const HOMEPAGE_GALLERY_PREVIEW = ALL_GYM_GALLERY_IMAGES.slice(0, 6);

// Backward-compatible alias
export const REAL_GALLERY_IMAGES = ALL_GYM_GALLERY_IMAGES;

// Daily Stories circular bubbles
export const REAL_STORY_TILES = [
  { img: receptionDesk, label: "Vikings" },
  { img: deadliftPlatform, label: "Lifts" },
  { img: freeWeightsBenches, label: "Iron" },
  { img: sprintTrackFloor, label: "Track" },
  { img: yogaStudioClean, label: "Studio" },
];
