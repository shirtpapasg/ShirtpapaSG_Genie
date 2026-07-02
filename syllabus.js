/* =============================================================================
   Science Claw — 2024 SYLLABUS + PSLE CONCEPT REFERENCE  (window.ScienceSyllabus)
   -----------------------------------------------------------------------------
   A distilled, offline knowledge base for the Shirtpapa Genie's live-AI parsing.
   It is built from the MOE 2024 Primary Science (P3–P6) syllabus structure and
   the house-style "acceptable answers / general explanations" in the Shirtpapa
   PSLE open-ended question bank (Google Drive).

   WHY IT EXISTS: the deployed app cannot reach Google Drive at runtime. Instead
   we bake the essentials in here and feed them to Claude in the parsing prompt,
   so the Genie validates a pasted question against real syllabus topics and
   writes the "Concept" line in the same phrasing PSLE markers reward.

   HOW TO EXTEND: add or edit a topic below. Each topic has:
     key       machine id
     topic     display name
     theme     one of the 5 MOE themes (Diversity, Cycles, Systems, Interactions, Energy)
     levels    which primary levels typically meet it
     match     lowercase keywords used to recognise the topic in a pasted question
     concepts  crisp, PSLE-style concept statements (the "C" in CECL — the science
               RULE a student must recall, phrased the way the mark scheme accepts)
   ========================================================================== */
(function () {
  var TOPICS = [
    /* ---------------- DIVERSITY ---------------- */
    {
      key: 'materials', topic: 'Materials', theme: 'Diversity', levels: ['P3', 'P4'],
      match: ['material', 'wood', 'metal', 'plastic', 'rubber', 'glass', 'fabric', 'waterproof', 'flexible', 'transparent', 'absorb water', 'strong', 'elastic'],
      concepts: [
        'Different materials have different properties (strength, flexibility, transparency, waterproofness, ability to float, ability to conduct heat/electricity).',
        'A material is chosen for an object based on the property that best suits the object\u2019s function.',
        'Metal is strong and a good conductor of heat and electricity. Rubber and plastic are insulators of heat and electricity.',
        'Waterproof materials do not let water pass through; absorbent materials soak up water.',
      ],
    },
    {
      key: 'living', topic: 'Diversity of Living & Non-living Things', theme: 'Diversity', levels: ['P3'],
      match: ['living thing', 'non-living', 'fungi', 'fungus', 'bacteria', 'mould', 'mold', 'classify', 'characteristics of living'],
      concepts: [
        'Living things need air, water and food, can grow, reproduce, respond to changes and give out waste.',
        'Fungi and bacteria are living things; they reproduce and need food, water and suitable conditions (warmth/moisture) to grow.',
        'Mould grows faster where there is moisture, warmth and food; removing moisture (drying) slows or prevents its growth.',
      ],
    },
    /* ---------------- CYCLES ---------------- */
    {
      key: 'lifecycle', topic: 'Life Cycles', theme: 'Cycles', levels: ['P3'],
      match: ['life cycle', 'larva', 'pupa', 'caterpillar', 'tadpole', 'germinate', 'seedling', 'metamorphosis'],
      concepts: [
        'Different animals have different life cycles; some (e.g. butterfly, beetle) go through complete metamorphosis: egg \u2192 larva \u2192 pupa \u2192 adult.',
        'A plant\u2019s life cycle: seed \u2192 germination \u2192 seedling \u2192 mature plant that flowers and produces seeds.',
      ],
    },
    {
      key: 'matter', topic: 'Matter', theme: 'Cycles', levels: ['P4'],
      match: ['matter', 'solid', 'liquid', 'gas', 'volume', 'mass', 'definite shape', 'occupies space', 'compress'],
      concepts: [
        'Matter is anything that has mass and occupies space (has volume).',
        'A solid has a definite shape and volume. A liquid has a definite volume but takes the shape of its container. A gas has no definite shape or volume and fills its container.',
        'Air is matter \u2014 it has mass and occupies space.',
      ],
    },
    {
      key: 'water', topic: 'Water Cycle', theme: 'Cycles', levels: ['P5'],
      match: ['water cycle', 'evaporat', 'condens', 'water vapour', 'humidity', 'boiling', 'rate of evaporation', 'mist', 'dew'],
      concepts: [
        'Evaporation is the change from liquid to gas (water vapour). It happens at any temperature below boiling, only at the liquid\u2019s surface.',
        'The rate of evaporation increases with higher temperature, larger exposed surface area, presence of wind, and lower humidity.',
        'Condensation is the change from water vapour (gas) to liquid when the vapour touches a cooler surface and loses heat.',
        'Boiling occurs only at a fixed temperature (boiling point) and throughout the liquid, not just at the surface.',
      ],
    },
    {
      key: 'reproduction', topic: 'Reproduction', theme: 'Cycles', levels: ['P5'],
      match: ['reproduction', 'pollination', 'pollen', 'stigma', 'fertilisation', 'seed dispersal', 'sperm', 'ovum', 'fetus', 'flower part'],
      concepts: [
        'Pollination is the transfer of pollen grains from the anther to the stigma; it may be carried out by insects, wind or water.',
        'Seeds are dispersed by wind, water, animals or by splitting/bursting, so that new plants do not compete with the parent plant for water, sunlight and space.',
      ],
    },
    /* ---------------- SYSTEMS ---------------- */
    {
      key: 'plantsystem', topic: 'Plant System', theme: 'Systems', levels: ['P4', 'P5'],
      match: ['root', 'stem', 'leaf', 'leaves', 'transport water', 'water-carrying tube', 'absorb water', 'plant parts'],
      concepts: [
        'Roots absorb water and mineral salts from the soil and anchor the plant.',
        'The stem holds the plant up and transports water (and food) through tube-like structures to different parts of the plant.',
        'Leaves make food for the plant by photosynthesis.',
      ],
    },
    {
      key: 'humansystem', topic: 'Human Systems', theme: 'Systems', levels: ['P5'],
      match: ['heart', 'lung', 'blood', 'circulat', 'respiratory', 'digest', 'oxygen', 'carbon dioxide', 'gaseous exchange', 'deoxygenated', 'oxygenated', 'small intestine'],
      concepts: [
        'The heart pumps blood to the lungs and to all parts of the body; the circulatory system transports oxygen, digested food and carbon dioxide.',
        'In the lungs, gaseous exchange occurs: blood takes in oxygen and removes carbon dioxide, so blood leaving the lungs is oxygen-rich (oxygenated).',
        'Cells use oxygen during respiration to break down digested food to release energy, producing carbon dioxide as waste; blood returning from the body is rich in carbon dioxide (deoxygenated).',
        'The digestive system breaks down food so that digested food can be absorbed into the bloodstream at the small intestine.',
      ],
    },
    {
      key: 'cell', topic: 'Cells', theme: 'Systems', levels: ['P5'],
      match: ['cell', 'cell wall', 'cell membrane', 'nucleus', 'chloroplast', 'cytoplasm'],
      concepts: [
        'Cells are the basic units of life. Plant cells have a cell wall, cell membrane, cytoplasm, nucleus and chloroplasts; animal cells lack a cell wall and chloroplasts.',
        'Chloroplasts contain chlorophyll, which traps light for photosynthesis \u2014 so only plant cells can make food.',
      ],
    },
    {
      key: 'electrical', topic: 'Electrical Systems', theme: 'Systems', levels: ['P6'],
      match: ['circuit', 'battery', 'bulb', 'conductor', 'insulator', 'electromagnet', 'series', 'parallel', 'switch', 'current', 'electric'],
      concepts: [
        'Electric current flows only in a closed circuit. A conductor of electricity allows current to flow; an insulator does not.',
        'Adding more batteries supplies more electrical energy, so more current flows (e.g. bulbs glow brighter, wire gets hotter).',
        'In a series arrangement, if one bulb blows the circuit is broken and the others go out. In a parallel arrangement, the other bulbs stay lit.',
        'An electromagnet is a temporary magnet: an iron core becomes magnetised only while current flows through the coil, and loses its magnetism when the current stops.',
      ],
    },
    /* ---------------- INTERACTIONS ---------------- */
    {
      key: 'magnets', topic: 'Magnets', theme: 'Interactions', levels: ['P3', 'P5'],
      match: ['magnet', 'pole', 'attract', 'repel', 'magnetic', 'north pole', 'south pole', 'iron', 'steel', 'magnetic force'],
      concepts: [
        'A magnet has two poles, north and south. Like poles repel each other; unlike (opposite) poles attract each other.',
        'Only magnets can repel. The ability to repel is the true test of whether an object is a magnet (magnetic materials are only attracted, never repelled).',
        'Magnetic force increases as the distance between magnets decreases, and can act without the magnets touching.',
        'Magnets attract magnetic materials such as iron, steel, nickel and cobalt.',
      ],
    },
    {
      key: 'forces', topic: 'Forces', theme: 'Interactions', levels: ['P5', 'P6'],
      match: ['force', 'friction', 'gravity', 'gravitational', 'elastic', 'spring', 'weight', 'push', 'pull', 'frictional force'],
      concepts: [
        'A force is a push or a pull. A force can start or stop motion, change the speed, direction or shape of an object.',
        'Frictional force acts between two surfaces in contact and opposes motion; it can convert kinetic energy into heat.',
        'Gravitational force is the pull of the Earth on all objects; it gives objects weight and pulls them downwards.',
        'Elastic/spring force: a stretched or compressed elastic object exerts a force and stores elastic potential energy.',
      ],
    },
    {
      key: 'foodchain', topic: 'Food Chains & Food Webs', theme: 'Interactions', levels: ['P6'],
      match: ['food chain', 'food web', 'producer', 'consumer', 'predator', 'prey', 'population', 'energy from the sun', 'decomposer'],
      concepts: [
        'A food chain starts with a producer (green plant) that makes its own food by photosynthesis; energy is passed along when one organism is eaten by another.',
        'If the population of a prey increases, its predators have more food and may increase; if predators increase, the prey population decreases.',
        'Removing or adding one organism affects the others connected to it through the food web.',
      ],
    },
    {
      key: 'environment', topic: 'Living Together / Environment', theme: 'Interactions', levels: ['P6'],
      match: ['environment', 'habitat', 'adaptation', 'survive', 'compete', 'pollution', "man's impact", 'conservation'],
      concepts: [
        'Living things have adaptations \u2014 special features or behaviours \u2014 that help them survive in their environment.',
        'Organisms in a habitat compete for resources such as food, water, sunlight and space.',
      ],
    },
    /* ---------------- ENERGY ---------------- */
    {
      key: 'light', topic: 'Light', theme: 'Energy', levels: ['P4'],
      match: ['light', 'shadow', 'reflect', 'transparent', 'translucent', 'opaque', 'light sensor', 'ray', 'straight line'],
      concepts: [
        'Light travels in straight lines. A shadow forms when an opaque object blocks light.',
        'Transparent objects let all light pass through; translucent objects let some light through; opaque objects block light and form dark shadows.',
        'A shadow is longer when the object is further from the light source or the light comes from a lower angle; nearer/higher light gives a shorter shadow.',
        'Light can be reflected; shiny/reflective surfaces bounce more light, which is why reflective materials are seen easily in the dark.',
      ],
    },
    {
      key: 'heat', topic: 'Heat & Temperature', theme: 'Energy', levels: ['P4'],
      match: ['heat', 'temperature', 'conductor of heat', 'insulator', 'expand', 'contract', 'gain heat', 'lose heat', 'hotter', 'colder', 'thermometer'],
      concepts: [
        'Heat is a form of energy. Heat always flows from a hotter object/region to a colder one until both reach the same temperature.',
        'Metals are good conductors of heat; air, plastic, wood and rubber are poor conductors (insulators) of heat.',
        'Most things expand (get bigger) when they gain heat and contract (get smaller) when they lose heat.',
        'Temperature is a measure of how hot or cold an object is, measured with a thermometer.',
      ],
    },
    {
      key: 'energyforms', topic: 'Energy Forms & Conversion', theme: 'Energy', levels: ['P5', 'P6'],
      match: ['energy', 'kinetic', 'potential energy', 'gravitational potential', 'elastic potential', 'chemical', 'energy conversion', 'convert', 'light energy', 'sound energy'],
      concepts: [
        'Energy cannot be created or destroyed; it is converted from one form to another.',
        'A raised object has gravitational potential energy; as it falls this is converted to kinetic energy. The higher it starts, the more energy it has.',
        'A stretched/compressed elastic object stores elastic potential energy, which converts to kinetic energy when released.',
        'During energy conversion some energy is always converted to forms such as heat and sound (e.g. through friction), so not all input energy becomes useful output.',
      ],
    },
    {
      key: 'photosynthesis', topic: 'Photosynthesis', theme: 'Energy', levels: ['P5'],
      match: ['photosynthesis', 'chlorophyll', 'make food', 'sunlight', 'carbon dioxide', 'oxygen', 'green plant', 'raw materials'],
      concepts: [
        'Green plants make food by photosynthesis using water, carbon dioxide and light, in the presence of chlorophyll in the leaves.',
        'Photosynthesis releases oxygen, which other organisms use for respiration.',
        'The food made provides energy for the plant and for animals that eat the plant.',
      ],
    },
  ];

  function norm(s) { return (s || '').toLowerCase(); }

  var Syllabus = {
    themes: ['Diversity', 'Cycles', 'Systems', 'Interactions', 'Energy'],
    levels: ['P3', 'P4', 'P5', 'P6'],
    topics: TOPICS,

    /* find the best-matching topic for a piece of pasted text (or null) */
    detect: function (text) {
      var t = norm(text), best = null, bestScore = 0;
      for (var i = 0; i < TOPICS.length; i++) {
        var topic = TOPICS[i], score = 0;
        for (var j = 0; j < topic.match.length; j++) {
          if (t.indexOf(topic.match[j]) !== -1) score++;
        }
        if (score > bestScore) { bestScore = score; best = topic; }
      }
      return bestScore > 0 ? best : null;
    },

    /* a compact text digest of the whole syllabus, for injecting into an AI prompt */
    promptDigest: function () {
      return TOPICS.map(function (t) {
        return '• ' + t.topic + ' [' + t.theme + ', ' + t.levels.join('/') + ']\n   ' +
          t.concepts.map(function (c) { return '- ' + c; }).join('\n   ');
      }).join('\n');
    },

    /* concept lines for one detected topic (used to anchor the "Concept" of CECL) */
    conceptsFor: function (key) {
      for (var i = 0; i < TOPICS.length; i++) if (TOPICS[i].key === key) return TOPICS[i].concepts;
      return [];
    },
  };

  if (typeof window !== 'undefined') window.ScienceSyllabus = Syllabus;
  if (typeof module !== 'undefined' && module.exports) module.exports = Syllabus;
})();
