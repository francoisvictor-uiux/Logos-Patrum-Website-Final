export const en = {
  meta: {
    title: "Logos Patrum | Theology, Manuscripts & AI Translation",
    description:
      "From ancient ink to the smart screen. Read, analyze, translate, and protect the writings of the Church Fathers — Greek and Armenian — with visual grammar analysis, Gemini AI translation, and industrial-grade content security.",
  },

  /* Labels that exist only for assistive tech, shared across sections. */
  common: {
    openMenu: "Open menu",
    closeMenu: "Close menu",
    previous: "Previous",
    next: "Next",
    mainNav: "Main navigation",
    footerNav: "Footer",
  },

  nav: {
    links: [
      { label: "Platform", href: "#features" },
      { label: "Features", href: "#story" },
      { label: "Pricing", href: "#pricing" },
      { label: "Resources", href: "#news" },
      { label: "About", href: "#faq" },
    ],
    features: {
      label: "Capabilities",
      items: [
        { title: "Visual Grammar Analysis", desc: "8 live filter categories", href: "#filters" },
        { title: "AI Translation", desc: "Gemini, tuned per tradition", href: "#preview" },
        { title: "Theological Lexicon", desc: "BDAG · LSJ · Lampe, in-text", href: "#features" },
        { title: "Library & OCR", desc: "Digitize scanned manuscripts", href: "#features" },
        { title: "Custom Rule Builder", desc: "Program your own analysis", href: "#filters" },
        { title: "Security & Protection", desc: "Watermarking, DLP, RBAC", href: "#security" },
      ],
    },
    resources: {
      label: "Resources",
      items: [
        { title: "Knowledge Center", desc: "Articles on Patristic study", href: "#news" },
        { title: "Heritage Stories", desc: "Manuscripts we helped rescue", href: "#story" },
        { title: "Documentation", desc: "Guides to the platform", href: "#faq" },
        { title: "FAQ", desc: "Common questions answered", href: "#faq" },
      ],
    },
    publications: {
      label: "Traditions",
      items: [
        { title: "Greek Fathers", desc: "Patrologia Graeca — available", href: "#story" },
        { title: "Armenian Fathers", desc: "A dedicated collection — available", href: "#story" },
        { title: "Syriac & Coptic", desc: "Coming soon", href: "#story" },
        { title: "Latin & Slavonic", desc: "On the roadmap", href: "#story" },
      ],
    },
    pricing: { label: "Pricing", href: "#pricing" },
    about: {
      label: "About",
      items: [
        { title: "Our Mission", desc: "Why Logos Patrum exists", href: "#why" },
        { title: "The Three Pillars", desc: "Analyze, translate, protect", href: "#pillars" },
        { title: "Security & Trust", desc: "How we protect your rights", href: "#security" },
        { title: "For Institutions", desc: "Licensing for organizations", href: "#pricing" },
        { title: "Contact", desc: "Reach the team", href: "#footer" },
      ],
    },
    search: "Search",
    login: "Log in",
    signup: "Start free",
    home: "Home",
  },

  announcement: {
    text: "Now live: a dedicated Armenian Fathers collection — 27 rescued manuscripts, analyzed and searchable.",
    cta: "Read the story",
    href: "#story",
  },

  hero: {
    eyebrow: "An academic platform for the study of Christian heritage",
    title: "From the original text to deeper study",
    description:
      "Explore the Church Fathers in their original languages, compare translations, and analyze texts with advanced tools — one platform built for researchers and scholars.",
    primaryCta: "Start now",
    secondaryCta: "Explore the platform",
    /* Key capabilities — a light row under the CTAs. `icon` keys map to the
       Phosphor duotone set in components/icons.tsx. */
    capabilities: [
      { icon: "magnifyingGlass", label: "Advanced search" },
      { icon: "bookOpenText", label: "Text comparison" },
      { icon: "brain", label: "Academic analysis" },
      { icon: "books", label: "Verified sources" },
    ],
  },

  /* Opening sequence — one word at a time, then it dissolves into the hero. */
  preloader: {
    words: ["We Translate", "We Analyze", "We Connect"],
  },

  heroIntro: {
    prefix: "We explore",
    words: [
      "the original texts.",
      "the translations.",
      "knowledge.",
      "meaning.",
      "heritage.",
    ],
  },

  /* The three verbs are the ones the opening sequence cycles through — the
     loader states the promise, this section pays it off. Keep the two in sync. */
  pillars: {
    eyebrow: "The research experience",
    /* The break is authored here, not left to the wrap: one clause per line.
       Rendered with whitespace-pre-line by the section. */
    title: "One platform for the whole research journey.\nThree pillars for deeper discovery.",
    description:
      "An integrated workspace bringing together philological precision, contextual translation, and the connections between texts — built for the serious study of Christian heritage.",
    /* The simplified application surface at the centre of the section. */
    workspace: {
      label: "Workspace",
      search: "Search the original texts…",
      filters: ["Greek", "Armenian", "Syriac"],
      resultsLabel: "Results",
      results: [
        { title: "John 1:1", meta: "Alexandria · 4th c." },
        { title: "Homilies on John", meta: "Chrysostom · 390" },
        { title: "Against the Arians", meta: "Athanasius · 340" },
      ],
      panels: {
        translate: "Contextual translation",
        analyze: "Morphological analysis",
        connect: "Citation network",
      },
    },
    cards: [
      {
        num: "01",
        title: "We Analyze",
        lead: "A precise anatomy of every word.",
        desc: "Every source word becomes structured knowledge — morphology, syntax, roots, grammatical forms, and linguistic context.",
      },
      {
        num: "02",
        title: "We Translate",
        lead: "Translation informed by theology.",
        desc: "Guided by history and ecclesial tradition rather than vocabulary alone — a reading that knows where the text came from.",
      },
      {
        num: "03",
        title: "We Connect",
        lead: "A knowledge network across the centuries.",
        desc: "Discover citations, shared concepts, and theological relationships across centuries of Christian literature.",
      },
    ],
    /* Labels inside the miniature previews. */
    ui: {
      word: "λόγος",
      tags: ["Noun", "Nominative", "Masculine", "Genitive"],
      source: "Greek",
      target: "English",
      sourceLine: "Ἐν ἀρχῇ ἦν ὁ λόγος",
      /* Generic MT rendering vs the received theological reading — the
         crossfade between the two IS the pitch. */
      targetGeneric: "In the beginning was the word",
      targetLine: "In the beginning was the Word",
      contextLabel: "Theological context",
      nodes: ["Augustine", "Chrysostom", "Gregory", "Basil"],
      graph: "Citation network across the Fathers",
    },
  },

  why: {
    eyebrow: "Why it exists",
    title: "Research in the Fathers *should not start from zero* every time",
    description:
      "Scattered manuscripts, unreliable translations, and no Arabic-language grammar tools for the Greek or Armenian text. Logos Patrum was built to close that distance.",
    points: [
      {
        title: "From the manuscript to the analysis, in one place",
        desc: "Scan, digitize, read, analyze, translate, and cite — without leaving the workspace.",
      },
      {
        title: "Visual grammar instead of rote memorization",
        desc: "See the structure of a Greek sentence in color; learn by interaction, not by memory.",
      },
      {
        title: "Translation that respects the Patristic context",
        desc: "Gemini applies an analysis template built for each tradition, not one generic model.",
      },
      {
        title: "A unified lexical reference across thousands of texts",
        desc: "Every term links directly to BDAG, LSJ, or Lampe — consistency no individual can match by hand.",
      },
      {
        title: "Content rights protected by design, not as an afterthought",
        desc: "Watermarking, copy prevention, and permissions are built into the reader itself.",
      },
    ],
    quote: {
      greek: "Αὐτὸς γὰρ ἐνηνθρώπησεν, ἵνα ἡμεῖς θεοποιηθῶμεν.",
      text: "For He was made man that we might be made god.",
      source: "Athanasius of Alexandria, On the Incarnation 54",
    },
  },

  filters: {
    eyebrow: "The visual grammar engine",
    title: "*Eight live filter categories* that reveal a text's structure at a glance",
    description:
      "Each word is a rich data element — its type, case, root, and relations. A smart AST rule engine evaluates it in the moment, coloring and linking it visually.",
    items: [
      { title: "Instant syntactic & case coloring", desc: "Every noun, verb, and adjective — and every case — in a distinct color. The structure of the sentence in a single glance." },
      { title: "Relational glow", desc: "Tap a subject and its verb glows at once — learn the rules of ancient Greek by practice, not by memory." },
      { title: "Long-range dependency arcs", desc: "Curved lines connect a verb to its distant subject — the sentence tree made visible, not imagined." },
      { title: "Textual criticism tools", desc: "Dagger marks (†) for variant readings across manuscripts, with damaged and restored text shown transparently." },
      { title: "Rhetorical & stylistic analysis", desc: "Automatic detection of parallelism and chiasmus with matching colors and crossing arrows." },
      { title: "AI reconstruction with confidence", desc: "Missing parts of a damaged manuscript are proposed by AI with an explicit confidence score (e.g. 94%) — no silent guessing." },
      { title: "Lexicon links & rare-word badges", desc: "An icon over each term opens BDAG, LSJ, or Lampe, and a badge marks words that appear only once (hapax legomena)." },
      { title: "Custom rule builder", desc: "Build your own grammatical analysis rule visually and save it — a programmable research environment, no code required." },
    ],
    more: "And more: historical phonetic (iotacism) alerts, frequency heatmaps, and geographic, historical, and liturgical badges.",
  },

  preview: {
    eyebrow: "See it work",
    title: "The original and the translation, *side by side*",
    description: "A live excerpt from the platform. No account needed to understand what it does.",
    greekLabel: "Original Greek",
    greekTitle: "Περὶ Ἐνανθρωπήσεως",
    greekAuthor: "Ἀθανάσιος Ἀλεξανδρείας",
    greekText: [
      "Αὐτὸς γὰρ ἐνηνθρώπησεν, ἵνα ἡμεῖς θεοποιηθῶμεν·",
      "καὶ αὐτὸς ἐφανέρωσεν ἑαυτὸν διὰ σώματος, ἵνα ἡμεῖς τοῦ ἀοράτου Πατρὸς ἔννοιαν λάβωμεν·",
      "καὶ αὐτὸς ὑπέμεινε τὴν παρ᾽ ἀνθρώπων ὕβριν, ἵνα ἡμεῖς ἀφθαρσίαν κληρονομήσωμεν.",
    ],
    translationLabel: "AI translation · Gemini",
    translationTitle: "On the Incarnation",
    translationAuthor: "Athanasius of Alexandria",
    translationText: [
      "For He was made man that we might be made god;",
      "and He manifested Himself through a body that we might receive an idea of the invisible Father;",
      "and He endured the insolence of men that we might inherit incorruption.",
    ],
    connections: [
      { k: "Author", v: "Athanasius of Alexandria, c. 296–373" },
      { k: "Work", v: "De Incarnatione Verbi, §54" },
      { k: "Also in", v: "Greek and Armenian, with per-tradition analysis" },
    ],
    note: "Scholars review and refine every published translation.",
    cta: "Open the full reader",
  },

  features: {
    eyebrow: "Full capabilities",
    title: "Everything the platform *actually does*",
    description: "Each capability exists because a researcher, translator, or institution asked for it.",
    items: [
      { icon: "reading", title: "Full-screen interactive reader", desc: "A per-paragraph immersive mode with every grammatical mark and arc in crisp detail." },
      { icon: "workspace", title: "Seamless virtual scroll", desc: "Read an entire work in one continuous scroll — no lag, no browser memory strain." },
      { icon: "translation", title: "Instant Gemini translation", desc: "Turn Greek or Armenian into clear Arabic and English with one click." },
      { icon: "globe", title: "Automatic language detection", desc: "The platform knows Greek from Armenian and applies the right analysis template." },
      { icon: "citation", title: "In-text theological lexicon", desc: "Look up any word without leaving the page — BDAG, LSJ, and Lampe, built in." },
      { icon: "search", title: "Millions of indexed words", desc: "A central grammatical index across the whole corpus — a foundation for any linguistic study." },
      { icon: "scan", title: "Digital library & OCR", desc: "Turn scanned manuscripts into searchable, analyzable text with an engine tuned for ancient scripts." },
      { icon: "greek", title: "Multiple traditions", desc: "Greek and Armenian today; Syriac, Coptic, and Latin are a natural expansion." },
      { icon: "lock", title: "Roles & permissions (RBAC)", desc: "Four ready roles, author- and manuscript-level grants, registration approval, instant account kill-switch." },
      { icon: "collections", title: "Smart preview paywall", desc: "Non-subscribers see the first paragraph; the rest converts visitors into subscribers." },
      { icon: "workspace", title: "Admin dashboard", desc: "Manage users, permissions, and AI prompts from one graphical panel — no programmer needed." },
      { icon: "notes", title: "AI prompt management", desc: "Tune the quality and style of translation and interpretation directly, with full editorial control." },
    ],
  },

  workflow: {
    eyebrow: "Research workflow",
    title: "From a manuscript to *a citable answer*",
    description: "Six steps, one workspace, no lost context along the way.",
    steps: [
      { title: "Digitize", desc: "Scan and OCR a manuscript into searchable text." },
      { title: "Analyze", desc: "See grammar, syntax, and rhetoric in color." },
      { title: "Translate", desc: "Read Greek or Armenian beside a Gemini draft." },
      { title: "Compare", desc: "Set witnesses and parallel readings side by side." },
      { title: "Annotate", desc: "Anchor notes to the exact line and build your argument." },
      { title: "Export", desc: "Cite and publish in the format you need." },
    ],
  },

  story: {
    eyebrow: "Heritage gallery",
    title: "How we saved *27 Armenian manuscripts* from disappearing",
    body: [
      "From the Nshan Palanjian Hamazkayin Library in Beirut, we digitized 27 rare Armenian manuscripts and analyzed them inside a dedicated Armenian Fathers collection — with its own interface and visual markers.",
      "It is a living example of what the platform does for any endangered heritage: a secure digital copy that can be read, searched, and studied forever, without ever leaving the rights-holder's control.",
    ],
    traditions: [
      { name: "Greek — Patrologia Graeca", status: "Available" },
      { name: "Armenian Fathers", status: "Available" },
      { name: "Syriac & Coptic", status: "Coming soon" },
      { name: "Latin & Slavonic", status: "On the roadmap" },
    ],
    cta: "Explore the manuscript gallery",
  },

  security: {
    eyebrow: "Security & trust",
    title: "Digitizing your heritage *should not mean giving up its rights*",
    description:
      "An industrial-grade protection suite designed for publishers, patriarchal libraries, and universities.",
    items: [
      {
        icon: "shield",
        title: "Dynamic identity watermark",
        desc: "A transparent, repeating layer prints each reader's email, account number, IP, and timestamp behind every text — a real deterrent against screenshots and leaks.",
      },
      {
        icon: "lock",
        title: "Copy & print prevention",
        desc: "Right-click, selection, copy/print shortcuts, and developer tools are disabled, with a professional warning message on any attempt.",
      },
      {
        icon: "users",
        title: "Fine-grained access (RBAC)",
        desc: "Four ready roles, grants at the author or single-manuscript level, registration approval, and a genuine instant account kill-switch.",
      },
      {
        icon: "collections",
        title: "Converting smart preview",
        desc: "Non-subscribers see only the first paragraph; the rest is a clear upgrade prompt — a proven conversion mechanism built into the system.",
      },
    ],
    tagline: "We analyze. We translate. We preserve. We protect.",
  },

  stats: {
    eyebrow: "The platform in numbers",
    title: "*Real depth,* measured",
    items: [
      { value: 4000000, suffix: "+", label: "Grammatically indexed words" },
      { value: 8, suffix: "", label: "Visual filter categories" },
      { value: 27, suffix: "", label: "Armenian manuscripts preserved" },
      { value: 3, suffix: "", label: "Reference lexicons built in" },
      { value: 16, suffix: " centuries", label: "of Patristic heritage" },
      { value: 2, suffix: "+", label: "Church traditions supported" },
    ],
  },

  testimonials: {
    previous: "Previous testimonial",
    next: "Next testimonial",
    eyebrow: "Voices from the field",
    title: "*What early users say* (gathered during our beta)",
    items: [
      {
        quote:
          "I verified a disputed reading in Chrysostom in twenty minutes. The dagger marks and the manuscript apparatus were right there in the text.",
        name: "Dr. Helena Markou",
        role: "Professor of Patristics",
        org: "Oriental Studies Faculty",
        initials: "HM",
      },
      {
        quote:
          "My students see Greek grammar glow in front of them. The relational highlight is a teaching tool I could not build in a classroom.",
        name: "Fr. Youhanna Ibrahim",
        role: "Seminary Lecturer",
        org: "St. Macarius Theological Seminary",
        initials: "YI",
      },
      {
        quote:
          "As a publisher, the dynamic watermark is why we agreed to digitize. Every reader knows a leak carries their own name.",
        name: "Dr. Samuel Reeves",
        role: "Publishing Director",
        org: "Byzantine Texts Consortium",
        initials: "SR",
      },
      {
        quote:
          "The Armenian collection saved manuscripts our library was losing to time. Now they are searchable, and still fully under our control.",
        name: "Mariam Tadros",
        role: "Manuscript Librarian",
        org: "Nshan Palanjian Armenian Library",
        initials: "MT",
      },
    ],
  },

  pricing: {
    eyebrow: "Pricing",
    title: "*Plans for individuals* and for institutions",
    description:
      "Start free. The prices below are an initial guide and will be finalized against the local market and running costs.",
    groups: ["For individuals", "For institutions"],
    perMonth: "/month",
    perYear: "/year",
    individuals: [
      {
        name: "Free Reader",
        price: "$0",
        unit: "",
        desc: "For curious readers and first-time visitors.",
        features: ["Preview (first paragraph) of every text", "Limited lexicon access", "No advanced grammar filters"],
        cta: "Start free",
        featured: false,
      },
      {
        name: "Student",
        price: "$5–8",
        unit: "/month",
        desc: "For theology students and clergy.",
        features: [
          "Full access to subscribed texts",
          "Complete theological lexicon",
          "Basic grammar filters",
          "Gemini translation, monthly quota",
        ],
        cta: "Start 14-day trial",
        featured: true,
      },
      {
        name: "Researcher / Pro",
        price: "$15–20",
        unit: "/month",
        desc: "For active researchers and translators.",
        features: [
          "All eight filter categories",
          "Custom rule builder",
          "Unlimited translation",
          "Export for research",
          "Priority support",
        ],
        cta: "Start 14-day trial",
        featured: false,
      },
    ],
    institutions: [
      {
        name: "Small college / seminary",
        price: "From $300",
        unit: "/year",
        desc: "For small theological colleges and seminaries.",
        features: ["Up to 50 student accounts", "One admin dashboard", "Email support"],
        cta: "Request a demo",
        featured: false,
      },
      {
        name: "University / mid-size",
        price: "From $1,200",
        unit: "/year",
        desc: "For universities and mid-size institutions.",
        features: [
          "Up to 300 accounts",
          "Multi-level permissions",
          "Usage reports",
          "Private institutional content upload",
        ],
        cta: "Request a demo",
        featured: true,
      },
      {
        name: "Large / patriarchate / publisher",
        price: "Custom",
        unit: "",
        desc: "For large institutions, patriarchates, and publishers.",
        features: [
          "Unlimited accounts",
          "Semi-private environment (partial white-label)",
          "Priority support & SLA",
          "Integration and team training",
        ],
        cta: "Contact sales",
        featured: false,
      },
    ],
    note: "The Free Reader plan is the acquisition gateway: the smart preview gradually converts visitors into paying subscribers.",
  },

  partners: {
    eyebrow: "Partners and supporters",
    title: "Carried by *a community of institutions*",
    partners: {
      title: "Academic partners",
      desc: "Colleges, publishers, and research institutes who contribute manuscripts and review analysis.",
      items: [
        "St. Macarius Theological Seminary",
        "Oriental Studies Faculty",
        "Byzantine Texts Consortium",
        "Antioch School of Theology",
      ],
    },
    sponsors: {
      title: "Cultural supporters",
      desc: "Organizations whose support keeps endangered heritage safe and the reader open to students.",
      items: [
        "Nshan Palanjian Hamazkayin Library",
        "Friends of the Fathers Society",
        "Eastern Heritage Trust",
        "Anonymous benefactors",
      ],
    },
  },

  news: {
    eyebrow: "Knowledge center",
    title: "From *the scriptorium*",
    items: [
      {
        tag: "Story",
        date: "July 10, 2026",
        title: "Rescuing the Armenian manuscripts of the Palanjian Library",
        desc: "How 27 rare codices became a searchable digital collection.",
      },
      {
        tag: "Feature",
        date: "June 28, 2026",
        title: "Inside the relational glow: teaching Greek by interaction",
        desc: "A look at the filter that lights up a verb the moment you tap its subject.",
      },
      {
        tag: "Study",
        date: "June 12, 2026",
        title: "How AI reconstructs a missing line — with a confidence score",
        desc: "Transparency instead of silent guessing in textual criticism.",
      },
      {
        tag: "Article",
        date: "May 30, 2026",
        title: "Why patristic Greek needs its own translation model",
        desc: "Context-aware translation versus generic machine output.",
      },
    ],
    viewAll: "All articles",
  },

  faq: {
    eyebrow: "Questions",
    title: "*Asked often,* answered plainly",
    description: "Everything else lives in the documentation.",
    all: "All",
    categories: ["General", "AI", "Traditions", "Security", "Pricing", "Institutions"],
    items: [
      {
        cat: "Traditions",
        q: "Does the platform support Syriac and Coptic?",
        a: "It supports Greek and Armenian today, and its architecture is built to expand: adding Syriac, Coptic, or Latin is a natural extension, not a rebuild.",
      },
      {
        cat: "Security",
        q: "How are my rights protected as an author or publisher?",
        a: "Through a full DLP suite: a dynamic watermark carrying each reader's identity, copy and print prevention, and role-based access down to a single manuscript.",
      },
      {
        cat: "Pricing",
        q: "Is there a free trial?",
        a: "Yes. The Free Reader plan lets anyone preview every text, and paid individual plans include a 14-day trial.",
      },
      {
        cat: "AI",
        q: "What makes the translation different?",
        a: "It is powered by Gemini and applies an analysis template tuned to each tradition, showing the original beside the draft. Scholars review everything we publish.",
      },
      {
        cat: "General",
        q: "Are the grammar filters available to students?",
        a: "The Student plan includes the basic filters; the Researcher plan unlocks all eight categories plus the custom rule builder.",
      },
      {
        cat: "Institutions",
        q: "Can an institution upload its own manuscripts?",
        a: "Yes. Institutional plans include private content upload with OCR, multi-level permissions, and usage reports.",
      },
      {
        cat: "General",
        q: "How does the smart preview work?",
        a: "Non-subscribers read the first paragraph of any text as a free preview; the rest is shown behind a clear upgrade prompt.",
      },
      {
        cat: "AI",
        q: "Will AI replace human scholars here?",
        a: "No. AI accelerates the mechanical work; interpretation, review, and the final wording remain with human scholars, whose names appear on the published translation.",
      },
    ],
  },

  newsletter: {
    title: "A letter worth its parchment",
    description:
      "One email a month: new features, a knowledge-center article, and one Patristic passage worth your time. No noise.",
    placeholder: "Your email address",
    button: "Subscribe",
    privacy: "We never share your address. Unsubscribe anytime.",
    success: "Welcome. The next letter arrives at the start of the month.",
    invalid: "Please enter a valid email address.",
  },

  finalCta: {
    title: "Ready to read the Fathers as you never have before?",
    description: "Create a free account and open your first analyzed text in under a minute.",
    primary: "Try it free",
    secondary: "Request an institutional demo",
  },

  footer: {
    tagline: "From ancient ink to the smart screen.",
    columns: [
      { title: "Platform", links: ["Capabilities", "Grammar filters", "AI translation", "Security", "Pricing"] },
      { title: "Traditions", links: ["Greek Fathers", "Armenian Fathers", "Syriac & Coptic", "Roadmap"] },
      { title: "Resources", links: ["Knowledge center", "Heritage stories", "Documentation", "FAQ"] },
      { title: "Solutions", links: ["For individuals", "For institutions", "For publishers", "Request a demo"] },
      { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Content Rights", "Accessibility"] },
      { title: "Account", links: ["Log in", "Register", "Dashboard"] },
    ],
    contact: {
      email: "hello@logospatrum.org",
      phone: "+961 1 000 000",
      address: "Beirut · Cairo · Athens",
    },
    social: ["LinkedIn", "X", "Facebook", "YouTube", "GitHub"],
    rights: "Logos Patrum. All rights reserved.",
    version: "v1.0",
    backToTop: "Back to top",
    langSwitch: "العربية",
  },
};
