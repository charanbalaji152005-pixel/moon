export const SECTIONS_DATA = [
  {
    id: "beyond-the-moon",
    index: "01",
    total: "18",
    eyebrow: "DEPARTURE",
    title: "Beyond The Moon",
    subtitle: "A cinematic flight through silence, gravity, and light. Enter the ring portal and begin your voyage across the cosmos.",
    quote: "“We are all connected to the Moon by wonder.”",
    telemetry: [
      { label: "DISTANCE", value: "384,400 KM FROM EARTH" },
      { label: "AGE", value: "4.53 BILLION YEARS" },
      { label: "ORBIT", value: "27.3 DAYS EARTH" },
      { label: "DIAMETER", value: "3,474 KM" }
    ],
    scrollRange: [0.0, 0.08],
    cameraPos: [0, 0, 4.5],
    cameraLookAt: [0, 0, 0]
  },
  {
    id: "river-of-stars",
    index: "02",
    total: "18",
    eyebrow: "MILKY WAY",
    title: "A River of Stars",
    subtitle: "Beyond the portal, the galactic band unfolds — a soft river of light made of a hundred billion suns. Dust lanes carve dark paths through glowing clouds.",
    quote: "“You are inside the Milky Way now. Every spark ahead is a distant sun, older than Earth itself.”",
    telemetry: [
      { label: "GALAXY", value: "MILKY WAY" },
      { label: "STARS", value: "100B+" },
      { label: "DIAMETER", value: "100K LY" },
      { label: "TYPE", value: "BARRED SPIRAL" }
    ],
    scrollRange: [0.08, 0.15],
    cameraPos: [0, 0.5, 3.8],
    cameraLookAt: [0, 0, -2]
  },
  {
    id: "leave-the-surface",
    index: "03",
    total: "18",
    eyebrow: "LOW EARTH ORBIT",
    title: "Leave the Surface",
    subtitle: "Engines quiet. Earth glows like a living jewel below. An astronaut floats between worlds while the silence becomes the soundtrack of ascent.",
    quote: "“From orbit, borders disappear. Oceans shine. Clouds spiral. You see one planet, one crew, one shared sky.”",
    telemetry: [
      { label: "ORBIT", value: "LOW EARTH" },
      { label: "SPEED", value: "7.8 KM/S" },
      { label: "ALTITUDE", value: "408 KM" },
      { label: "VIEW", value: "PALE BLUE DOT" }
    ],
    scrollRange: [0.15, 0.22],
    cameraPos: [0.3, 0, 4.0],
    cameraLookAt: [0, 0, 0]
  },
  {
    id: "universe-never-ends",
    index: "04",
    total: "18",
    eyebrow: "DEEP SPACE",
    title: "The Universe Never Ends",
    subtitle: "Trillions of galaxies drift through infinite night. Worlds rush past the camera like sparks. Billions of stars exist beyond this view — each one a possible beginning.",
    quote: "“You are no longer a visitor. You are the voyage.”",
    telemetry: [
      { label: "SCALE", value: "OBSERVABLE UNIVERSE" },
      { label: "EXPANSION", value: "ACCELERATING" },
      { label: "HORIZON", value: "46.5B LY" },
      { label: "DEPTH", value: "INFINITE" }
    ],
    scrollRange: [0.22, 0.29],
    cameraPos: [-0.4, 0.2, 5.2],
    cameraLookAt: [0, 0, 0]
  },
  {
    id: "solar-system",
    index: "05",
    total: "18",
    eyebrow: "SOLAR FAMILY",
    title: "Our Solar System",
    subtitle: "Eight worlds and one blazing star — a family born from the same cosmic cloud. Never stop planet to learn its way, size, and secrets.",
    quote: "“Sun at the center, dance at the edge: Earth is the garden, Jupiter the shield.”",
    telemetry: [
      { label: "SUN", value: "G-TYPE MAIN SEQUENCE" },
      { label: "PLANETS", value: "8 WORLDS" },
      { label: "SPAN", value: "287 BILLION KM" },
      { label: "ORBIT", value: "HELIOCENTRIC" }
    ],
    scrollRange: [0.29, 0.35],
    cameraPos: [0, 1.8, 4.8],
    cameraLookAt: [0, 0, 0]
  },
  {
    id: "asteroid-belt",
    index: "06",
    total: "18",
    eyebrow: "DEBRIS FIELD",
    title: "The Asteroid Belt",
    subtitle: "Between Mars and Jupiter, leftover rubble from the birth of the system drift in silent cold. A river of rock — a timeless sea of frozen fragments.",
    quote: "“Each one is a time capsule from 4.6 billion years ago.”",
    telemetry: [
      { label: "LOCATION", value: "2.2 - 3.2 AU" },
      { label: "OBJECTS", value: "1.9M+ > 1KM" },
      { label: "LARGEST", value: "CERES" },
      { label: "COMPOSITION", value: "ROCK & METAL" }
    ],
    scrollRange: [0.35, 0.42],
    cameraPos: [0, 0, 3.5],
    cameraLookAt: [0, 0, 0]
  },
  {
    id: "stars-are-born",
    index: "07",
    total: "18",
    eyebrow: "STELLAR NURSERY",
    title: "Where Stars Are Born",
    subtitle: "Inside glowing gas and dust, gravity gathers light into new suns. Pillars of cloud cradle infant stars — heat, shock, and radiation carve towers of creation.",
    quote: "“Every atom you have began in a place like this. Creation is not a past act, it is happening tonight.”",
    telemetry: [
      { label: "NEBULA", value: "EMISSION & REFLECTION" },
      { label: "TEMP", value: "10,000 K" },
      { label: "ELEMENTS", value: "H, HE, O, S" },
      { label: "PROTOSTARS", value: "FORMING" }
    ],
    scrollRange: [0.42, 0.48],
    cameraPos: [0, 0.2, 4.2],
    cameraLookAt: [0, 0, 0]
  },
  {
    id: "binary-dance",
    index: "08",
    total: "18",
    eyebrow: "BINARY SYSTEM",
    title: "A Binary Dance",
    subtitle: "Two stars bound by gravity’s waltz — forever orbiting a shared center. Days would have two dawns. Shadows would split and bend.",
    quote: "“Most stars in the galaxy are not alone. Companionship is cosmic.”",
    telemetry: [
      { label: "STARS", value: "G-STAR & B-STAR" },
      { label: "SEPARATION", value: "1.2 AU" },
      { label: "PERIOD", value: "312 DAYS" },
      { label: "GRAVITY", value: "MUTUAL ORBIT" }
    ],
    scrollRange: [0.48, 0.54],
    cameraPos: [0, 0.5, 4.0],
    cameraLookAt: [0, 0, 0]
  },
  {
    id: "supernova",
    index: "09",
    total: "18",
    eyebrow: "COLLAPSE",
    title: "Supernova",
    subtitle: "A giant star ends in a flash brighter than a galaxy. Elements forged in its heart — iron, gold, oxygen — scatter into space.",
    quote: "“The calcium in your bones, the iron in your blood — gifts from ancient explosions.”",
    telemetry: [
      { label: "TYPE", value: "CORE COLLAPSE (II-P)" },
      { label: "ENERGY", value: "10^44 JOULES" },
      { label: "EXPANSION", value: "15,000 KM/S" },
      { label: "REMNANT", value: "NEUTRON STAR" }
    ],
    scrollRange: [0.54, 0.60],
    cameraPos: [0, 0, 4.2],
    cameraLookAt: [0, 0, 0]
  },
  {
    id: "where-light-ends",
    index: "10",
    total: "18",
    eyebrow: "EVENT HORIZON",
    title: "Where Light Ends",
    subtitle: "Gravity bends space itself. Stars stretch into glowing rings. At the edge of the void, time slows — and even light cannot escape.",
    quote: "“Beyond this is the unknown — a singularity where known physics fades.”",
    telemetry: [
      { label: "OBJECT", value: "SUPERMASSIVE BLACK HOLE" },
      { label: "MASS", value: "4.1M SOLAR MASSES" },
      { label: "SCHWARZSCHILD", value: "12M KM" },
      { label: "LENSING", value: "EINSTEIN RING" }
    ],
    scrollRange: [0.60, 0.66],
    cameraPos: [0, 0, 3.8],
    cameraLookAt: [0, 0, 0]
  },
  {
    id: "quasar",
    index: "11",
    total: "18",
    eyebrow: "RELATIVISTIC JET",
    title: "Quasar",
    subtitle: "A hungry black hole feeds on a swirling disk — and launches jets of light across billions of years. Among the brightest objects in the universe.",
    quote: "“Looking at a quasar is looking deep into the early cosmos.”",
    telemetry: [
      { label: "LUMINOSITY", value: "10^40 WATTS" },
      { label: "JET SPEED", value: "0.99C" },
      { label: "REDSHIFT", value: "Z = 6.4" },
      { label: "POWER", value: "ACCRETION DISK" }
    ],
    scrollRange: [0.66, 0.72],
    cameraPos: [0, 0, 4.0],
    cameraLookAt: [0, 0, 0]
  },
  {
    id: "comet-crosses",
    index: "12",
    total: "18",
    eyebrow: "WANDERER",
    title: "A Comet Crosses",
    subtitle: "Ice and dust wake up as they near the Sun. A glowing coma blooms. Twin tails stream across the dark — one of gas, one of shimmering dust.",
    quote: "“Some return every lifetime. Others visit once and vanish forever. Either way, they are messengers from the outer cold.”",
    telemetry: [
      { label: "ORIGIN", value: "OORT CLOUD" },
      { label: "VELOCITY", value: "54 KM/S" },
      { label: "TAIL LENGTH", value: "15M KM" },
      { label: "STATUS", value: "PERIHELION" }
    ],
    scrollRange: [0.72, 0.78],
    cameraPos: [0, 0, 4.4],
    cameraLookAt: [0, 0, 0]
  },
  {
    id: "exoplanet",
    index: "13",
    total: "18",
    eyebrow: "NEW WORLDS",
    title: "Exoplanet",
    subtitle: "A world orbiting another sun. Clouds of methane, or oceans of iron, or blue skies like home. Kepler and James Webb showed us thousands of possible shores.",
    quote: "“Somewhere, someone else may be looking back.”",
    telemetry: [
      { label: "DESIGNATION", value: "TOI-700 D" },
      { label: "HOST STAR", value: "M-DWARF" },
      { label: "HABITABLE", value: "OPTIMISTIC ZONE" },
      { label: "RADIUS", value: "1.14 EARTH" }
    ],
    scrollRange: [0.78, 0.84],
    cameraPos: [-0.2, 0, 4.2],
    cameraLookAt: [0, 0, 0]
  },
  {
    id: "aurora",
    index: "14",
    total: "18",
    eyebrow: "SOLAR SHIELD",
    title: "Aurora",
    subtitle: "Solar wind dances with a magnetic shield. Delicate ribbons of green, violet, and rose paint the night — proof that a planet is alive.",
    quote: "“Space weather made visible — a living shield protecting life below.”",
    telemetry: [
      { label: "ALTITUDE", value: "100 - 300 KM" },
      { label: "EMISSION", value: "OXYGEN & NITROGEN" },
      { label: "MAGNETIC", value: "DIPOLE FIELD" },
      { label: "IONOSPHERE", value: "ACTIVE" }
    ],
    scrollRange: [0.84, 0.89],
    cameraPos: [0, 0, 3.8],
    cameraLookAt: [0, 0, 0]
  },
  {
    id: "skies-without-borders",
    index: "15",
    total: "18",
    eyebrow: "EARTH",
    title: "Skies Without Borders",
    subtitle: "Above every ocean and desert, the same dark canopy opens. Constellations look down on maps. Nations vanish like brief shadows. The night sky is poetry written without boundaries.",
    quote: "“Look up — and you are already traveling. Every star you see is a message from deep time.”",
    telemetry: [
      { label: "VIEWPOINT", value: "ORBITAL DAWN" },
      { label: "ATMOSPHERE", value: "100 KM LINE" },
      { label: "HORIZON", value: "CURVED LIMB" },
      { label: "HOME", value: "ONE PLANET" }
    ],
    cards: [
      { title: "TWILIGHT", text: "When day softens into a dark halo — the first planets appear like quiet lanterns." },
      { title: "MILKY BAND", text: "Our galaxy seen from the inside — a river of light archived in human mythology." },
      { title: "DAWN RETURN", text: "Morning arrives from space: first the gold rim on the ocean, then a world woken up." }
    ],
    scrollRange: [0.89, 0.93],
    cameraPos: [0, 0, 4.5],
    cameraLookAt: [0, 0, 0]
  },
  {
    id: "stories-in-light",
    index: "16",
    total: "18",
    eyebrow: "STAR MAPS",
    title: "Stories Written in Light",
    subtitle: "Long before telescopes, humanity connected the dots to find navigation, seasons, and myths in the stars — bridges across millennia of wonder.",
    quote: "“The patterns are ours. The stars are just fire. But every story is our light.”",
    telemetry: [
      { label: "CONSTELLATIONS", value: "88 RECOGNIZED" },
      { label: "CHART", value: "NORTHERN SKY" },
      { label: "NAVIGATOR", value: "POLARIS" },
      { label: "CANVAS", value: "CELESTIAL SPHERE" }
    ],
    constellations: [
      { name: "Ursa Major", stars: 7, myth: "The Great Bear & Big Dipper" },
      { name: "Orion", stars: 7, myth: "The Hunter & Golden Belt" },
      { name: "Cassiopeia", stars: 5, myth: "The Queen's W-Crown" }
    ],
    scrollRange: [0.93, 0.96],
    cameraPos: [0, 0, 4.8],
    cameraLookAt: [0, 0, 0]
  },
  {
    id: "return-summary",
    index: "17",
    total: "18",
    eyebrow: "EXPEDITION LOG",
    title: "Beyond The Moon",
    subtitle: "Eighteen chapters. Endless sky. The cosmos is curiosity — and every night is a new invitation to ponder, to explore, to go beyond the Moon.",
    quote: "“Thank you for flying Beyond The Moon.”",
    bulletPoints: [
      "You crossed fields of stone and rivers of light",
      "You watched new suns and dying stars",
      "You faced the dark and distant quasars",
      "You chased comets and found other worlds",
      "You saw aurora, maps, and a pale blue home",
      "You looked up — and returned"
    ],
    telemetry: [
      { label: "CHAPTERS", value: "18 LOGGED" },
      { label: "VOYAGE", value: "COMPLETED" },
      { label: "STATUS", value: "READY FOR FLIGHT" }
    ],
    scrollRange: [0.96, 1.0],
    cameraPos: [0, 0, 4.5],
    cameraLookAt: [0, 0, 0]
  }
];
