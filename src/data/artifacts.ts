import type { Artifact } from "./types";

/* ============================================================
   THE COLLECTION (demonstration archive)
   ------------------------------------------------------------
   All content below is representative sample material. Nothing
   here claims a client, an award, a metric, or a credential.
   Real work can replace any entry one-for-one: the interface
   renders whatever it is given and never assumes structure.
   ============================================================ */

export const ARTIFACTS: Artifact[] = [
  /* ---------------- ROOM I — THE WORKSHOP ---------------- */
  {
    id: "W-01",
    accession: "W-01 / 05",
    title: "Atlas of Small Systems",
    domain: "workshop",
    type: "PROJECT",
    year: "2024",
    status: "CATALOGUED",
    featured: true,
    short: "A publication cataloguing forty tiny rule-based systems.",
    summary:
      "A self-initiated catalogue of forty small systems — bus timetables, prayer beads, tide charts, queuing ropes — each documented with the same four fields: the rule, the failure mode, the material, the reason it survived.",
    thread: 0.06,
    alt: "Specimen plates from the Atlas of Small Systems",
    meta: [
      { label: "Format", value: "Web publication, 40 plates" },
      { label: "Duration", value: "11 months" },
      { label: "Made with", value: "Type, SVG, patience" },
      { label: "Kept in", value: "Workshop, shelf 1" },
    ],
    blocks: [
      {
        kind: "text",
        text: "It started as a way to avoid making a portfolio. Instead of showing outcomes, I wanted to show *rules* — the small governing logics that make a thing feel coherent. Forty of them, documented with total uniformity, so that the differences between them became the content.",
      },
      {
        kind: "evidence",
        label: "PLATES 01–04",
        caption:
          "Uniform documentation was the design decision. Same four fields, same drawing weight, same silence around each object.",
        kindOf: "DOCUMENT",
        aspect: 1.5,
        series: 4,
      },
      {
        kind: "decisions",
        label: "DECISIONS",
        items: [
          {
            chose: "Four fields, never five",
            because:
              "A fifth field appeared in every draft and always became a place to hide opinions. Opinions went into the notes instead.",
          },
          {
            chose: "No hero images",
            because:
              "A plate that tries to be beautiful stops being evidence. Each object is drawn at the same scale whether it is a rosary or a rail network.",
          },
          {
            chose: "Failure mode listed first",
            because:
              "A system is only legible at the point where it breaks. Leading with that made the catalogue honest.",
          },
        ],
      },
      {
        kind: "text",
        text: "The hardest part was not the collection. It was the refusal to explain. I wrote forty introductions and deleted thirty-nine of them.",
      },
      { kind: "questions", items: ["Is a catalogue an argument if it never states one?"] },
    ],
    connections: [
      {
        id: "L-01",
        note: "The Atlas only became possible after a failed experiment proved that four buckets were enough to hold almost anything.",
        weight: "primary",
      },
      {
        id: "O-03",
        note: "The first plate in the Atlas is a supermarket markdown sticker — an object I had already been photographing for a year without knowing why.",
        weight: "primary",
      },
      {
        id: "B-04",
        note: "Warburg's Mnemosyne Atlas is the direct ancestor: images laid next to each other so the arrangement argues.",
      },
      { id: "W-05", note: "Every plate sits on the same deliberately-broken grid." },
    ],
  },
  {
    id: "W-02",
    accession: "W-02 / 05",
    title: "Marginalia",
    domain: "workshop",
    type: "PROJECT",
    year: "2023",
    status: "CATALOGUED",
    featured: true,
    short: "A reading surface that keeps the argument in the margin.",
    summary:
      "A long-form reading interface where annotation is not a layer on top of the text but the primary structure. Notes live in the margin at the exact vertical position of the sentence that provoked them.",
    thread: 0.18,
    alt: "Marginalia reading interface, text with aligned margin notes",
    meta: [
      { label: "Format", value: "Interface study, working prototype" },
      { label: "Constraint", value: "One column of text, ever" },
      { label: "Status", value: "Runs locally, unreleased" },
    ],
    blocks: [
      {
        kind: "text",
        text: "Every reading app treats notes as objects you attach to text. I wanted the reverse: text is what you attach to thinking. The margin is not decoration at the edge of the page — it is the second half of the page.",
      },
      {
        kind: "evidence",
        label: "FIG. 01 — MARGIN LOCK",
        caption:
          "Notes are pinned to a sentence, not a paragraph. Scrolling keeps the note within the reading window until the sentence leaves it.",
        kindOf: "SCREEN",
        aspect: 1.7,
      },
      {
        kind: "note",
        label: "TECHNICAL NOTE",
        text: "The alignment is not a nicety, it is the product. Keeping a note within the viewport while its anchor scrolls required a constraint solver rather than a scroll listener.",
      },
      {
        kind: "list",
        label: "WHAT IT TAUGHT ME",
        items: [
          "Annotation is a spatial act before it is a textual one.",
          "Two people reading the same page produce two different architectures.",
          "The margin is the original responsive container.",
        ],
      },
    ],
    connections: [
      {
        id: "B-02",
        note: "Meetings with Remarkable Manuscripts showed me that medieval marginalia were not noise — they were a second, parallel reading.",
        weight: "primary",
      },
      {
        id: "L-04",
        note: "The first version had no edges at all. It failed, and its failure set the constraint this project is built on.",
        weight: "primary",
      },
      { id: "O-05", note: "Taped instructions on a delivery door: the fastest margin note I ever photographed." },
    ],
  },
  {
    id: "W-03",
    accession: "W-03 / 05",
    title: "Field Notation Kit",
    domain: "workshop",
    type: "PROJECT",
    year: "2025",
    status: "IN PROGRESS",
    short: "A typographic notation kit for research notebooks.",
    summary:
      "An in-progress kit of glyphs and rules for writing down observations quickly enough that the noticing is not lost. Designed for notebooks first, screens second.",
    thread: 0.3,
    alt: "Notation specimens: glyphs for sky, sound, density, doubt",
    meta: [
      { label: "Format", value: "Glyph set + 12-page rulebook" },
      { label: "Constraint", value: "Must be drawable by hand in under 2 seconds" },
      { label: "Progress", value: "31 of a planned 40 marks" },
    ],
    blocks: [
      {
        kind: "text",
        text: "I kept losing observations between seeing them and writing them. The sentence was too slow. A mark had to be faster than a word and more specific than a shrug.",
      },
      {
        kind: "evidence",
        label: "SPECIMEN SHEET — MARKS 09–16",
        caption:
          "Each mark is tested against three questions: can a stranger guess it, can I draw it cold in the dark, does it survive being drawn badly.",
        kindOf: "SCAN",
        aspect: 1.35,
        series: 3,
      },
      {
        kind: "decisions",
        items: [
          {
            chose: "Hand-drawable over elegant",
            because: "A notation that requires a font is a notation that stays at home.",
          },
          {
            chose: "Marks for uncertainty included",
            because: "Certainty-only notation produces confident, useless notebooks.",
          },
        ],
      },
    ],
    connections: [
      {
        id: "O-02",
        note: "A year of daily sky notation produced the first eleven marks. Observation became the alphabet.",
        weight: "primary",
      },
      { id: "B-06", note: "Direct application of the principle: notation precedes form." },
      { id: "L-03", note: "The kit needed a rendering test — one line, drawn continuously, on slow devices." },
    ],
  },
  {
    id: "W-04",
    accession: "W-04 / 05",
    title: "The Slow Feed",
    domain: "workshop",
    type: "PROTOTYPE",
    year: "2022",
    status: "ABANDONED",
    short: "A reader that refuses to refresh more than twice a day.",
    summary:
      "A feed reader with a hard rule: it updates at 07:40 and 16:20, and never on demand. Abandoned when I realised I was designing a punishment rather than a tool.",
    thread: 0.42,
    alt: "Slow Feed interface showing a locked refresh state",
    meta: [
      { label: "Format", value: "Prototype, 6 weeks" },
      { label: "Rule", value: "Two refreshes per day, no override" },
      { label: "Cause of death", value: "Moralising" },
    ],
    blocks: [
      {
        kind: "text",
        text: "I built it out of irritation with myself. The refresh button was removed, then the pull gesture, then the loading state. Each removal felt like a small moral victory and made the product worse at being a product.",
      },
      {
        kind: "failure",
        label: "WHAT WENT WRONG",
        wrong:
          "I was designing a correction to my own behaviour and calling it an interface. Every design decision came from disapproval. Users could feel the disapproval. So could I.",
        kept: "The measurement stuck: latency is a material with a texture, not a bug to be minimised. That sentence has paid for itself many times.",
      },
      {
        kind: "evidence",
        label: "FIG. 02 — LOCKED STATE",
        caption:
          "The most interesting screen in the prototype, and the one that ended it: an interface telling you to come back later.",
        kindOf: "SCREEN",
        aspect: 1.4,
      },
    ],
    connections: [
      {
        id: "L-02",
        note: "This is where latency-as-material was measured rather than theorised.",
        weight: "primary",
      },
      { id: "B-03", note: "Illich's convivial tools: a tool should increase the user's autonomy. This one reduced mine." },
      { id: "Q-02", note: "Filed here because the question of what counts as unfinished is unresolved." },
    ],
  },
  {
    id: "W-05",
    accession: "W-05 / 05",
    title: "Quiet Grid",
    domain: "workshop",
    type: "PROJECT",
    year: "2024",
    status: "CATALOGUED",
    short: "A twelve-column editorial grid that deliberately breaks.",
    summary:
      "A layout system with a documented legal break: one column pair may be violated per page, and only where the content argues for it. Used across most of the work in this room.",
    thread: 0.54,
    alt: "Quiet Grid diagram showing twelve columns and one permitted violation",
    meta: [
      { label: "Format", value: "Layout system, ~700 lines" },
      { label: "Columns", value: "12 / 6 / 2 at breakpoints" },
      { label: "Permitted violations", value: "Exactly one per page" },
    ],
    blocks: [
      {
        kind: "text",
        text: "Grids fail in one of two ways: they are obeyed so completely that the page dies, or broken so freely that they were never a grid. I wanted the break to be a rule, so that breaking it would mean something.",
      },
      {
        kind: "evidence",
        label: "FIG. 03 — THE PERMITTED BREAK",
        caption:
          "One element per page may leave the grid. Because it is the only one, the eye reads it as an argument rather than an accident.",
        kindOf: "DIAGRAM",
        aspect: 1.6,
      },
      {
        kind: "code",
        label: "GRID RULE, ABRIDGED",
        text: `grid-template-columns:
  repeat(12, minmax(0, 1fr));

break-permitted: 1;   /* not a CSS property.
                        a discipline. */`,
      },
    ],
    connections: [
      { id: "B-05", note: "Principle 04 is this system written as a sentence instead of code." },
      {
        id: "O-06",
        note: "The whole thing came from a fire escape I could not stop photographing.",
        weight: "primary",
      },
      { id: "L-06", note: "The Constraint Machine later automated the same permission, badly." },
    ],
  },

  /* ---------------- ROOM II — THE OBSERVATORY ---------------- */
  {
    id: "O-01",
    accession: "O-01 / 06",
    title: "Waiting Rooms",
    domain: "observatory",
    type: "OBSERVATION",
    year: "2025",
    status: "CIRCULATING",
    short: "Nineteen chairs that face the wrong way.",
    summary:
      "A photographic series of seating that does not face anything: not the door, not the window, not another chair. Documentation of a small, repeated failure of orientation.",
    thread: 0.62,
    alt: "Photograph of a chair facing a corner in an institutional waiting room",
    meta: [
      { label: "Method", value: "One photograph, no rearranging" },
      { label: "Span", value: "2021—2025, four countries" },
      { label: "Count", value: "19" },
    ],
    blocks: [
      {
        kind: "text",
        text: "The rule was that I never move anything. The photograph is only admissible if the chair was already like that. This turns out to be a rule about me, not about chairs.",
      },
      {
        kind: "evidence",
        label: "PLATE 07 — CORNER CHAIR, CLINIC",
        caption:
          "Evidence held as a placeholder: the real prints are not yet archived. Metadata above is complete.",
        kindOf: "PHOTOGRAPH",
        aspect: 0.78,
      },
      {
        kind: "note",
        label: "WHY IT BELONGS HERE",
        text: "Every interface I have ever designed has a chair facing a corner in it somewhere: a control that faces a direction nothing arrives from.",
      },
    ],
    connections: [
      { id: "L-01", note: "Feeds the taxonomy: the fourth bucket is always 'things facing the wrong way'." },
      { id: "Q-04", note: "Waiting rooms are where I first started timing the two-second pause." },
    ],
  },
  {
    id: "O-02",
    accession: "O-02 / 06",
    title: "Weather Notation",
    domain: "observatory",
    type: "SKETCH",
    year: "2024",
    status: "CATALOGUED",
    short: "A shorthand for the sky, drawn every morning for a year.",
    summary:
      "Three hundred and eleven mornings of sky, each reduced to a single drawn mark in a fixed 40mm square. The sixty-four missed mornings are left blank and crossed.",
    thread: 0.7,
    alt: "Grid of small hand-drawn sky marks across a year",
    meta: [
      { label: "Method", value: "40mm square, pencil, 20 seconds" },
      { label: "Coverage", value: "311 / 365" },
      { label: "Gaps", value: "Drawn as crosses, not skipped" },
    ],
    blocks: [
      {
        kind: "evidence",
        label: "SHEET 04 OF 09 — FEBRUARY",
        caption:
          "The gaps are the most useful part. A cross is a record of a day I did not look up.",
        kindOf: "SKETCHBOOK",
        aspect: 1.25,
        series: 3,
      },
      {
        kind: "text",
        text: "By month three the marks had stopped being pictures of weather and started being a vocabulary. That shift — from drawing to writing — is the whole reason this sketch is in the archive.",
      },
    ],
    connections: [
      {
        id: "W-03",
        note: "This sketch is the direct ancestor of the Field Notation Kit. Without a year of mornings there is no alphabet.",
        weight: "primary",
      },
      { id: "Q-03", note: "The evidence for the claim that notation changes what you can notice." },
      { id: "O-05", note: "Both are about marks that carry more than one meaning at once." },
    ],
  },
  {
    id: "O-03",
    accession: "O-03 / 06",
    title: "The Handwritten Price",
    domain: "observatory",
    type: "OBSERVATION",
    year: "2023",
    status: "CATALOGUED",
    short: "Marked-down produce and the evidence of a human decision.",
    summary:
      "A collecting habit: the sticker, the chalkboard, the tape-and-marker price. Not the price — the visible trace of the person who changed it.",
    thread: 0.14,
    alt: "Close photograph of a handwritten markdown sticker on packaging",
    meta: [
      { label: "Method", value: "Phone camera, no cropping" },
      { label: "Count", value: "112" },
      { label: "Oldest", value: "2016" },
    ],
    blocks: [
      {
        kind: "text",
        text: "A printed price is a system speaking. A handwritten one is a person inside a system, leaving a mark that says *I decided, here, at this time*. It is the cheapest possible provenance and it is being replaced by nothing at all.",
      },
      {
        kind: "quote",
        text: "The sticker is a signature the person never agreed to give.",
      },
      {
        kind: "evidence",
        label: "PLATE 02 — REDUCED, TODAY ONLY",
        caption: "Placeholder plate. The collection exists; the scans are not yet in the archive.",
        kindOf: "PHOTOGRAPH",
        aspect: 1.1,
        series: 2,
      },
    ],
    connections: [
      {
        id: "W-01",
        note: "Became plate 01 of the Atlas — the first system I documented instead of just admired.",
        weight: "primary",
      },
      { id: "B-01", note: "Sontag on collecting: the album as a way of possessing experience. I recognised myself immediately." },
    ],
  },
  {
    id: "O-04",
    accession: "O-04 / 06",
    title: "Two Seconds at the Top",
    domain: "observatory",
    type: "OBSERVATION",
    year: "2024",
    status: "CIRCULATING",
    short: "The hesitation where the escalator meets the floor.",
    summary:
      "A repeated observation: at the transition between moving and still ground, nearly everyone performs the same two-second adjustment. A universal onboarding state, occurring eight times a day.",
    thread: 0.78,
    alt: "Photograph of the top of an escalator with a crowd step adjustment",
    meta: [
      { label: "Method", value: "Standing still, counting" },
      { label: "Locations", value: "14" },
      { label: "Median", value: "1.9 seconds" },
    ],
    blocks: [
      {
        kind: "text",
        text: "Every person does the same thing: a half-step, a hand hover, a look down. It is a loading state written into the body. No one is bad at it. No one is taught it.",
      },
      {
        kind: "list",
        label: "WHAT I DO WITH THIS",
        items: [
          "Every transition in an interface deserves its own two seconds of tolerance.",
          "Onboarding is not a tutorial. It is the moment the floor changes speed.",
          "People forgive a pause if the pause is doing work.",
        ],
      },
    ],
    connections: [
      { id: "L-02", note: "This observation is the reason I started measuring latency as a feeling rather than a number." },
      { id: "L-05", note: "Eleven invented gestures could not compete with the one the body already knows." },
    ],
  },
  {
    id: "O-05",
    accession: "O-05 / 06",
    title: "Taped Instructions",
    domain: "observatory",
    type: "OBSERVATION",
    year: "2023",
    status: "CATALOGUED",
    short: "Hand-lettered tape: the fastest interface in the world.",
    summary:
      "A study of tape-and-marker interfaces — delivery doors, broken machines, library signage. Design produced under time pressure by people with no design training and no budget for error.",
    thread: 0.86,
    alt: "Photograph of taped handwritten instructions on a door",
    meta: [
      { label: "Method", value: "Photograph, then transcribe the wording" },
      { label: "Count", value: "68" },
      { label: "Best wording", value: "\"NOT THIS DOOR\"" },
    ],
    blocks: [
      {
        kind: "quote",
        text: "NOT THIS DOOR — USE THE OTHER ONE. SAME BUILDING.",
        source: "Taped to a service door, 2023",
      },
      {
        kind: "text",
        text: "It is a complete interface: location, negation, redirection, reassurance. Four functions, eleven words, zero design tools. I have never written anything that efficient.",
      },
      {
        kind: "evidence",
        label: "PLATE 11 — THE COMPLETE INTERFACE",
        caption: "Placeholder for the archived print. Wording transcribed exactly as found.",
        kindOf: "PHOTOGRAPH",
        aspect: 1.3,
      },
    ],
    connections: [
      { id: "W-02", note: "Marginalia is an attempt to get interface language that direct." },
      { id: "L-06", note: "Tape is a constraint machine that runs on a deadline. Mine ran on rules." },
    ],
  },
  {
    id: "O-06",
    accession: "O-06 / 06",
    title: "Grid Found in the Wild",
    domain: "observatory",
    type: "SKETCH",
    year: "2022",
    status: "CATALOGUED",
    short: "A fire escape that resolves into a nine-column grid.",
    summary:
      "A single measured drawing of a fire escape in a back street, made because the proportions felt correct before I understood why. The drawing revealed a nine-column structure with one deviation.",
    thread: 0.94,
    alt: "Measured pencil drawing of a fire escape with column overlay",
    meta: [
      { label: "Method", value: "Pencil, ruler, 90 minutes" },
      { label: "Columns found", value: "9" },
      { label: "Deviations", value: "1" },
    ],
    blocks: [
      {
        kind: "evidence",
        label: "FIG. 04 — MEASURED DRAWING",
        caption:
          "The overlay was drawn after the outline. The deviation in column seven is the reason the whole thing felt alive.",
        kindOf: "SKETCHBOOK",
        aspect: 0.72,
      },
      {
        kind: "text",
        text: "This is the drawing that made me stop treating grids as scaffolding and start treating them as an agreement you are allowed to break once.",
      },
    ],
    connections: [
      {
        id: "W-05",
        note: "Quiet Grid exists because of this drawing. Nine columns and one deviation became twelve and one.",
        weight: "primary",
      },
      { id: "B-05", note: "Principle 04 was written two years later, about this page." },
    ],
  },

  /* ---------------- ROOM III — THE LABORATORY ---------------- */
  {
    id: "L-01",
    accession: "L-01 / 06",
    title: "Taxonomy of Four",
    domain: "laboratory",
    type: "EXPERIMENT",
    year: "2024",
    status: "CATALOGUED",
    featured: true,
    short: "Can anything be catalogued in exactly four buckets?",
    summary:
      "A two-month experiment: catalogue every incoming note, image and idea into exactly four categories. No fifth bucket. Nothing uncategorised. Result: 87% held. The remaining 13% became the most interesting drawer in the archive.",
    thread: 0.1,
    alt: "Diagram of four taxonomy buckets with overflow items",
    meta: [
      { label: "Method", value: "Constraint, 61 days" },
      { label: "Items processed", value: "1,204" },
      { label: "Held", value: "87%" },
      { label: "Refused", value: "13%" },
    ],
    blocks: [
      {
        kind: "text",
        text: "The point was not to build a taxonomy. It was to find out where a taxonomy stops working — and to make that place visible instead of hiding it in 'miscellaneous'.",
      },
      {
        kind: "evidence",
        label: "FIG. 05 — REFUSAL RATE BY WEEK",
        caption:
          "Refusals rise in weeks 4–5 and then fall. The categories were not wrong; they were undeveloped.",
        kindOf: "DIAGRAM",
        aspect: 1.9,
      },
      {
        kind: "note",
        label: "FINDING",
        text: "Everything that refused classification was a connection between two existing categories. The residue was the graph. That is the sentence this entire website is built on.",
      },
    ],
    connections: [
      {
        id: "W-01",
        note: "The four-field structure of the Atlas is the surviving rule from this experiment.",
        weight: "primary",
      },
      { id: "Q-01", note: "The refusals were the first evidence of the recurring diagram." },
    ],
  },
  {
    id: "L-02",
    accession: "L-02 / 06",
    title: "Latency as Material",
    domain: "laboratory",
    type: "EXPERIMENT",
    year: "2023",
    status: "CATALOGUED",
    short: "Slowness introduced on purpose, measured against patience.",
    summary:
      "An instrumented test in which deliberate delays of 0, 120, 400, 900 and 1600ms were inserted into the same interaction. Nine participants, thinking aloud. The interesting data was not the numbers.",
    thread: 0.22,
    alt: "Chart of perceived latency against actual latency",
    meta: [
      { label: "Method", value: "Instrumented, 9 participants" },
      { label: "Threshold found", value: "~700ms before narrative begins" },
      { label: "Output", value: "Notes, 22 pages" },
    ],
    blocks: [
      {
        kind: "text",
        text: "Below roughly 700 milliseconds people described the *system*. Above it they began describing *time* — 'it's thinking', 'it's loading', 'did that work?'. The delay stopped being invisible and became a sentence.",
      },
      {
        kind: "evidence",
        label: "FIG. 06 — THE NARRATIVE THRESHOLD",
        caption: "At 900ms every participant produced a story about the machine. None of the stories were about machinery.",
        kindOf: "DIAGRAM",
        aspect: 1.7,
      },
      {
        kind: "decisions",
        items: [
          {
            chose: "Report the transcripts, not the averages",
            because: "The averages said '400ms is fine'. The transcripts said 'I assumed it had failed'.",
          },
        ],
      },
    ],
    connections: [
      { id: "W-04", note: "The Slow Feed was the unrigorous version of this. Doing it properly killed the product and saved the idea." },
      { id: "O-04", note: "The escalator pause is the body's version of the same threshold." },
    ],
  },
  {
    id: "L-03",
    accession: "L-03 / 06",
    title: "One Continuous Line",
    domain: "laboratory",
    type: "EXPERIMENT",
    year: "2025",
    status: "IN PROGRESS",
    short: "A single line, drawn at 120fps, on a decade of devices.",
    summary:
      "A rendering test for the Field Notation Kit: draw one unbroken line that never drops a frame, on hardware from 2014 to now. The test is still failing on two devices and those two devices are the interesting result.",
    thread: 0.34,
    alt: "A single unbroken line rendered across a full viewport",
    meta: [
      { label: "Method", value: "Canvas, rAF, fixed timestep" },
      { label: "Devices", value: "11" },
      { label: "Failing", value: "2" },
    ],
    blocks: [
      {
        kind: "text",
        text: "The line has to be continuous because the notation is continuous. If a mark can break mid-gesture, the vocabulary breaks with it. Performance is not a technical concern here; it is a linguistic one.",
      },
      {
        kind: "code",
        label: "THE RULE",
        text: `if (frame.delta > 16.7) {
  // do not interpolate. hold the line.
  // a corrected line is a lie about
  // where the hand was.
}`,
      },
      {
        kind: "note",
        label: "CURRENT STATE",
        text: "Two older devices drop frames at the 4,000th segment. The fix is to reduce geometry, which would make the line smoother and less true. Not yet decided.",
      },
    ],
    connections: [
      { id: "W-03", note: "Built to answer a question the notation kit raised." },
      { id: "Q-05", note: "The unfinished map was drawn in exactly this way, three years earlier, badly." },
    ],
  },
  {
    id: "L-04",
    accession: "L-04 / 06",
    title: "The Infinite Canvas",
    domain: "laboratory",
    type: "FAILURE",
    year: "2023",
    status: "SEALED",
    short: "A note surface with no edges. Nobody could find anything.",
    summary:
      "A spatial note-taking surface with unlimited pan and zoom. Technically successful, cognitively useless. Sealed after four months because not one note written in it was ever retrieved.",
    thread: 0.46,
    alt: "Screenshot of a vast empty canvas with scattered notes",
    meta: [
      { label: "Format", value: "4 months, working build" },
      { label: "Notes created", value: "268" },
      { label: "Notes retrieved", value: "0" },
      { label: "Status", value: "Sealed" },
    ],
    blocks: [
      {
        kind: "failure",
        label: "POST-MORTEM",
        wrong:
          "I mistook freedom for structure. With no edges there is no address, and without an address there is no returning. Everything written became a message in a bottle, sent by me, to me.",
        kept: "The single most useful failure in this archive. It produced the constraint that Marginalia is built on: content must have an address, and an address must be finite.",
      },
      {
        kind: "evidence",
        label: "FIG. 07 — THE LAST VIEWPORT",
        caption:
          "The final state of the canvas, 2.3% zoom. Every dark mark is a note that was never read again.",
        kindOf: "SCREEN",
        aspect: 1.6,
      },
      {
        kind: "quote",
        text: "An archive is not a place where things are kept. It is a place where things can be found again.",
      },
    ],
    connections: [
      {
        id: "W-02",
        note: "Marginalia is the inversion of this failure: a page with edges, and an address for every sentence.",
        weight: "primary",
      },
      { id: "B-04", note: "Warburg solved this with a finite board and a camera. He replaced the canvas with the plate." },
    ],
  },
  {
    id: "L-05",
    accession: "L-05 / 06",
    title: "Gesture Vocabulary",
    domain: "laboratory",
    type: "FAILURE",
    year: "2022",
    status: "SEALED",
    short: "Eleven custom gestures. Users remembered two.",
    summary:
      "A prototype interface built around an invented gesture language. Eleven gestures, each documented with a rationale. In testing, participants used two, invented a third, and asked for buttons.",
    thread: 0.58,
    alt: "Diagram of eleven gesture glyphs, two highlighted as remembered",
    meta: [
      { label: "Method", value: "Prototype + 6 sessions" },
      { label: "Gestures designed", value: "11" },
      { label: "Gestures retained", value: "2" },
    ],
    blocks: [
      {
        kind: "failure",
        label: "POST-MORTEM",
        wrong:
          "I designed a language before checking whether anyone needed one. A gesture is a word: it must be heard before it is spoken. Mine were all speak and no hear.",
        kept: "Two gestures survived because they already existed in the body — pull toward, push away. Everything invented from scratch died in the first five minutes.",
      },
      {
        kind: "note",
        label: "CARRIED FORWARD",
        text: "The surviving principle: never invent a gesture that the body does not already know. The escalator observation is the evidence.",
      },
    ],
    connections: [
      { id: "O-04", note: "The two surviving gestures were both movements the body performs at a threshold." },
      { id: "L-06", note: "After this failure, all constraints moved from the gesture to the system." },
    ],
  },
  {
    id: "L-06",
    accession: "L-06 / 06",
    title: "Constraint Machine",
    domain: "laboratory",
    type: "PROTOTYPE",
    year: "2024",
    status: "IN PROGRESS",
    short: "A generator that only outputs layouts it can justify.",
    summary:
      "A layout generator with a justification requirement: for every arrangement it produces, it must emit a sentence explaining why. Layouts without a defensible sentence are discarded before rendering.",
    thread: 0.66,
    alt: "Generated layout variants with justification sentences beneath",
    meta: [
      { label: "Format", value: "Prototype" },
      { label: "Rule", value: "No output without a reason string" },
      { label: "Discard rate", value: "71%" },
    ],
    blocks: [
      {
        kind: "text",
        text: "Generators produce quantity and hide judgement. Requiring a reason string does not make the output good — it makes the *bad output legible*, which is more useful.",
      },
      {
        kind: "evidence",
        label: "FIG. 08 — ACCEPTED / DISCARDED",
        caption:
          "Top row: accepted layouts with their reason strings. Bottom row: discards. The reasons are more interesting than the layouts.",
        kindOf: "DIAGRAM",
        aspect: 1.45,
        series: 2,
      },
      {
        kind: "code",
        label: "JUSTIFICATION, AN EXAMPLE",
        text: `ACCEPTED   "asymmetric — text left, figure right,
           because the figure carries more mass
           and needs the wider column."

DISCARDED  "symmetric — no reason available."`,
      },
    ],
    connections: [
      { id: "W-05", note: "Automating the permitted break produces breaks without arguments. This is the tension." },
      { id: "O-05", note: "Tape is what constraint looks like when the deadline is thirty seconds." },
    ],
  },

  /* ---------------- ROOM IV — THE LIBRARY ---------------- */
  {
    id: "B-01",
    accession: "B-01 / 06",
    title: "On Photography",
    domain: "library",
    type: "REFERENCE",
    year: "2018",
    status: "CATALOGUED",
    short: "Susan Sontag — on collecting as a way of looking.",
    summary:
      "The book that made collecting legible to me as a behaviour rather than a hobby. Read first in 2018; re-read every eighteen months; annotated more heavily each time.",
    thread: 0.02,
    alt: "Photograph of a heavily annotated paperback page",
    meta: [
      { label: "Author", value: "Susan Sontag" },
      { label: "First read", value: "2018" },
      { label: "Re-reads", value: "4" },
      { label: "Condition", value: "Structural damage from annotation" },
    ],
    blocks: [
      {
        kind: "quote",
        text: "To collect photographs is to collect the world.",
        source: "Sontag, On Photography",
      },
      {
        kind: "note",
        label: "WHY IT MATTERED",
        text: "It described exactly what I was doing with the markdown stickers, two years before I admitted it was a collection. Reading it was the first time a book told me what I was already doing.",
      },
      {
        kind: "list",
        label: "MARGINAL NOTES, CHRONOLOGICAL",
        items: [
          "2018: 'this is about other people'",
          "2020: 'this is about me'",
          "2023: 'an archive is a confession arranged by date'",
        ],
      },
    ],
    connections: [
      { id: "O-03", note: "The sticker collection is the object-level version of this sentence." },
    ],
  },
  {
    id: "B-02",
    accession: "B-02 / 06",
    title: "Meetings with Remarkable Manuscripts",
    domain: "library",
    type: "REFERENCE",
    year: "2020",
    status: "CATALOGUED",
    short: "Christopher de Hamel — the margin as a second reading.",
    summary:
      "Twelve manuscripts, described by a man who has held them. What stayed with me was not the illumination but the accumulated marginalia of centuries of readers in the same physical space.",
    thread: 0.26,
    alt: "Photograph of a manuscript page with layered marginal annotations",
    meta: [
      { label: "Author", value: "Christopher de Hamel" },
      { label: "Read", value: "2020" },
      { label: "Kept", value: "Library, shelf 3, spine cracked at ch. 6" },
    ],
    blocks: [
      {
        kind: "quote",
        text: "The margin is where the reader is permitted to answer.",
      },
      {
        kind: "note",
        label: "WHY IT MATTERED",
        text: "Marginalia (W-02) is a direct attempt to build a digital object with that property: a fixed text, and a place beside it that belongs to whoever is reading.",
      },
    ],
    connections: [{ id: "W-02", note: "The entire premise of that project is borrowed from this book." }],
  },
  {
    id: "B-03",
    accession: "B-03 / 06",
    title: "Tools for Conviviality",
    domain: "library",
    type: "REFERENCE",
    year: "2019",
    status: "CATALOGUED",
    short: "Ivan Illich — the test a tool has to pass.",
    summary:
      "Illich's argument that a tool is convivial when it increases the user's capacity to act on their own terms. A blunt instrument for evaluating almost anything, including my own prototypes.",
    thread: 0.38,
    alt: "Photograph of an open book with a single underlined passage",
    meta: [
      { label: "Author", value: "Ivan Illich" },
      { label: "Read", value: "2019" },
      { label: "Use", value: "Evaluation instrument" },
    ],
    blocks: [
      {
        kind: "quote",
        text: "Tools foster conviviality to the extent to which they can be easily used, by anybody, as often or as seldom as desired.",
        source: "Illich, Tools for Conviviality",
      },
      {
        kind: "note",
        label: "WHY IT MATTERED",
        text: "The Slow Feed fails this test in one sentence. That is how I knew to abandon it: the tool was reducing my autonomy while claiming to protect it.",
      },
    ],
    connections: [{ id: "W-04", note: "The reason that prototype was abandoned rather than shipped." }],
  },
  {
    id: "B-04",
    accession: "B-04 / 06",
    title: "Mnemosyne Atlas",
    domain: "library",
    type: "REFERENCE",
    year: "2021",
    status: "CIRCULATING",
    short: "Aby Warburg — images that argue by adjacency.",
    summary:
      "Warburg's unfinished atlas of black-clad photographs pinned to screens covered in black cloth: images arranged so that the arrangement, not any caption, carries the meaning. Never finished. Never intended to be.",
    thread: 0.5,
    alt: "Reconstruction of a black-and-white atlas plate with pinned images",
    meta: [
      { label: "Author", value: "Aby Warburg" },
      { label: "Plates", value: "63 reconstructed" },
      { label: "State at death", value: "Unfinished" },
    ],
    blocks: [
      {
        kind: "text",
        text: "Two things changed how I work. First: adjacency is an argument. Second: he worked on boards, not in an endless scroll — a finite surface that forced decisions. Both of those are structural commitments in this archive.",
      },
      {
        kind: "note",
        label: "STRUCTURAL INFLUENCE",
        text: "The Red Thread in this museum is an adjacency argument. So is the Index. So is the decision to give every artifact an address instead of an infinite canvas.",
      },
    ],
    connections: [
      { id: "W-01", note: "The Atlas of Small Systems borrows the method: no thesis statement, only arrangement." },
      { id: "L-04", note: "Warburg's finite board is the answer to the infinite canvas." },
    ],
  },
  {
    id: "B-05",
    accession: "B-05 / 06",
    title: "Principle 04",
    domain: "library",
    type: "PRINCIPLE",
    year: "2021",
    status: "CIRCULATING",
    short: "Break the grid exactly once, or not at all.",
    summary:
      "A rule written after years of breaking grids accidentally: one deliberate violation per composition, and it must be defensible out loud.",
    thread: 0.74,
    alt: "Diagram of a grid with a single highlighted violation",
    meta: [
      { label: "Number", value: "04 of 12" },
      { label: "Written", value: "2021" },
      { label: "Origin", value: "O-06" },
    ],
    blocks: [
      {
        kind: "quote",
        text: "A grid is an agreement. An agreement you have never broken is a cage; one you break constantly was never an agreement.",
      },
      {
        kind: "note",
        label: "TEST IT MUST PASS",
        text: "If you cannot say why the break is there, in one sentence, in a crit — remove it.",
      },
    ],
    connections: [
      { id: "W-05", note: "The principle, expressed as code instead of a sentence." },
      { id: "O-06", note: "Where the principle came from: a fire escape, a ruler, ninety minutes." },
    ],
  },
  {
    id: "B-06",
    accession: "B-06 / 06",
    title: "Principle 11",
    domain: "library",
    type: "PRINCIPLE",
    year: "2020",
    status: "CIRCULATING",
    short: "Notation precedes form.",
    summary:
      "You cannot design what you cannot write down. The mark comes before the object; the vocabulary determines what is thinkable.",
    thread: 0.9,
    alt: "Hand-drawn notation marks with labels",
    meta: [
      { label: "Number", value: "11 of 12" },
      { label: "Written", value: "2020" },
      { label: "Provenance", value: "A drawing failure" },
    ],
    blocks: [
      {
        kind: "text",
        text: "I once spent six weeks unable to draw something and could not work out why. The answer was that I had no marks for the parts I cared about. The drawing was not failing; the vocabulary was.",
      },
      {
        kind: "note",
        label: "IN PRACTICE",
        text: "Before designing a system, write its notation. If the notation is clumsy, the system will be clumsy in exactly the same places.",
      },
    ],
    connections: [
      { id: "W-03", note: "The Field Notation Kit is this principle turned into a tool." },
      { id: "O-02", note: "A year of sky marks is the evidence that notation changes perception." },
    ],
  },

  /* ---------------- ROOM V — THE WUNDERKAMMER ---------------- */
  {
    id: "Q-01",
    accession: "Q-01 / 05",
    title: "The Recurring Diagram",
    domain: "wunderkammer",
    type: "ANOMALY",
    year: "2024",
    status: "UNRESOLVED",
    short: "Every two years I redraw the same diagram and forget the last one.",
    summary:
      "Six versions of what is recognisably the same diagram, drawn between 2016 and 2024, in six different notebooks, none of which refer to the others. I have no memory of drawing four of them.",
    thread: 0.16,
    alt: "Six similar hand-drawn diagrams pinned in a row",
    meta: [
      { label: "Instances", value: "6" },
      { label: "Interval", value: "Roughly 2 years" },
      { label: "Explanation", value: "None" },
    ],
    blocks: [
      {
        kind: "evidence",
        label: "ALL SIX, SIDE BY SIDE",
        caption:
          "Drawn in different pens, in different cities, for different stated reasons. The structure is identical: one central node, four satellites, one orbit that never closes.",
        kindOf: "SKETCHBOOK",
        aspect: 2.1,
        series: 2,
      },
      {
        kind: "text",
        text: "It is the shape of the taxonomy experiment's refusal residue. It is also, I now notice, the shape of this website. I am not comfortable with that, and I am not going to resolve it here.",
      },
      { kind: "questions", items: ["Is this a diagram, or is it a symptom?"] },
    ],
    connections: [
      { id: "L-01", note: "The 13% of items that refused four buckets all had this shape." },
    ],
  },
  {
    id: "Q-02",
    accession: "Q-02 / 05",
    title: "Is an unfinished thing a failure?",
    domain: "wunderkammer",
    type: "QUESTION",
    year: "2025",
    status: "UNRESOLVED",
    short: "An unresolved filing problem, not a philosophical one.",
    summary:
      "A practical question with consequences: two abandoned projects and one sealed failure are the most-cited artifacts in this archive. Should they be shelved with the work, or apart from it?",
    thread: 0.28,
    alt: "Two archive boxes, one open, one sealed",
    meta: [
      { label: "Opened", value: "2025" },
      { label: "Depends on", value: "L-04, W-04, L-05" },
      { label: "State", value: "Open" },
    ],
    blocks: [
      {
        kind: "text",
        text: "The Laboratory exists because of this question. It is not a category of work. It is a category of *evidence* — and I still do not know whether that distinction holds.",
      },
      {
        kind: "questions",
        items: [
          "If a failure produces the constraint for a later success, is it part of the success?",
          "Does 'abandoned' mean I stopped, or that it stopped?",
        ],
      },
    ],
    connections: [{ id: "W-04", note: "Abandoned, and yet the most quoted artifact in the room." }],
  },
  {
    id: "Q-03",
    accession: "Q-03 / 05",
    title: "Can a notation change what you notice?",
    domain: "wunderkammer",
    type: "QUESTION",
    year: "2024",
    status: "UNRESOLVED",
    short: "A question I am testing rather than answering.",
    summary:
      "The claim, from Principle 11, that vocabulary determines perception. Testable: learn a notation, then look. The sky notation is the first trial; the results are annoyingly positive.",
    thread: 0.4,
    alt: "Two columns of notation marks, before and after learning",
    meta: [
      { label: "Trial 1", value: "O-02, 311 mornings" },
      { label: "Result", value: "Positive" },
      { label: "Confidence", value: "Low" },
    ],
    blocks: [
      {
        kind: "text",
        text: "After the year of sky marks I can no longer see a cloud without evaluating it as a mark. I have gained a vocabulary and lost a certain kind of looking. Nobody warned me that notation has a cost.",
      },
    ],
    connections: [
      { id: "O-02", note: "The evidence: 311 mornings, and a permanent change in how sky is seen." },
      { id: "B-06", note: "The principle under test — and possibly the principle's rebuttal." },
    ],
  },
  {
    id: "Q-04",
    accession: "Q-04 / 05",
    title: "Thresholds",
    domain: "wunderkammer",
    type: "OBSERVATION",
    year: "2023",
    status: "CIRCULATING",
    short: "Everything I notice is a transition.",
    summary:
      "An unproven pattern claim: every observation in this archive worth keeping is about a moment where one state becomes another. Raised here as a hypothesis rather than a fact.",
    thread: 0.8,
    alt: "Diagram of states with highlighted transitions",
    meta: [
      { label: "Raised", value: "2023" },
      { label: "Supporting", value: "O-04, L-02, W-04" },
      { label: "Counter-evidence", value: "O-03" },
    ],
    blocks: [
      {
        kind: "list",
        label: "EITHER SIDE OF THE LINE",
        items: [
          "Moving floor to still floor",
          "Loading to loaded",
          "Printed price to handwritten price",
          "Unread to read, with a mark left behind",
        ],
      },
      {
        kind: "text",
        text: "If this is true, then what I actually design is not pages or systems. It is the moment of change between them. I am not confident enough to put that on a business card.",
      },
    ],
    connections: [
      { id: "O-04", note: "The escalator is the cleanest instance: a threshold written into the body." },
      { id: "O-01", note: "A chair facing a corner is a threshold nobody designed." },
    ],
  },
  {
    id: "Q-05",
    accession: "Q-05 / 05",
    title: "Unfinished Map",
    domain: "wunderkammer",
    type: "SKETCH",
    year: "2022",
    status: "UNRESOLVED",
    short: "A map of the archive, drawn before the archive existed.",
    summary:
      "A single page, drawn in 2022, showing five rooms connected by a continuous line. Three of the rooms did not exist yet. The line is the same line that runs through this website.",
    thread: 0.98,
    alt: "Hand-drawn map of five rooms connected by one line",
    meta: [
      { label: "Drawn", value: "2022, one sitting" },
      { label: "Rooms shown", value: "5" },
      { label: "Rooms existing then", value: "2" },
    ],
    blocks: [
      {
        kind: "evidence",
        label: "FIG. 09 — THE MAP",
        caption:
          "The line enters at the lower left, loops twice, breaks once, and leaves the page without terminating. I did not plan that. I have not corrected it.",
        kindOf: "SKETCHBOOK",
        aspect: 1.3,
      },
      {
        kind: "note",
        label: "ARCHIVIST'S NOTE",
        text: "Filed in the Wunderkammer rather than the Workshop because it was not made for anything. It is the only artifact here that predicted the others.",
      },
    ],
    connections: [
      { id: "L-03", note: "The line on this page is the line I have been trying to draw properly ever since." },
      { id: "B-04", note: "A finite page, five regions, adjacency doing the arguing." },
    ],
  },
];

export const artifactById = (id: string) => ARTIFACTS.find((a) => a.id === id);

/** Undirected edge list derived from the artifact graph. */
export interface Edge {
  a: string;
  b: string;
  note: string;
  weight: "primary" | "secondary" | "faint";
}

export const EDGES: Edge[] = (() => {
  const seen = new Set<string>();
  const out: Edge[] = [];
  for (const a of ARTIFACTS) {
    for (const c of a.connections) {
      const key = [a.id, c.id].sort().join("→");
      if (seen.has(key)) continue;
      if (!artifactById(c.id)) continue;
      seen.add(key);
      out.push({
        a: a.id,
        b: c.id,
        note: c.note,
        weight: c.weight ?? "secondary",
      });
    }
  }
  return out;
})();

export const edgesFor = (id: string) => EDGES.filter((e) => e.a === id || e.b === id);

export const STATS = {
  domains: 5,
  artifacts: ARTIFACTS.length,
  connections: EDGES.length,
};
