// All copy is verbatim from surviant.com. Headlines are split into
// [plain, emphasis] pairs only so the emphasis can be set in italic blue;
// joined back together they read exactly as on the live site.

export type Emphasized = readonly [string, string]

export const links = {
  contact: '/contact',
  services: '/services',
  howWeWork: '/how-we-work',
  work: '/#portfolio',
  about: '/about',
  careers: '/careers',
  research: '/research/ai-ml',
  privacy: '/privacy',
  terms: '/terms',
  aiEngineering: '/services/ai-engineering',
  productEngineering: '/services/product-engineering',
  digitalTransformation: '/services/digital-transformation',
} as const

export const email = 'contact@surviant.com'

export const portal = {
  label: 'Portal access',
  note: 'coming soon',
  items: ['For Employees', 'For Clients'],
  srNote: ', destination coming soon',
}

export const nav = {
  name: 'Surviant',
  tagline: 'Software / AI / Systems',
  items: [
    { label: 'Services', href: links.services },
    { label: 'How We Work', href: links.howWeWork },
    { label: 'Work', href: links.work },
    { label: 'About', href: links.about },
    { label: 'Research', href: links.research },
  ],
  cta: 'Start a project',
}

export const hero = {
  eyebrow: 'Software / AI / Systems',
  title: ['Software, AI, and systems, ', 'built as one.'] as Emphasized,
  body: 'We help established teams modernize operations and build dependable products, adding AI where it creates real value.',
  primary: 'Start a project',
  secondary: 'Explore our services',
  location: 'Bay Area / India',
}

export const systemMap = {
  eyebrow: 'Whole system map / One accountable team',
  title: ['Operation to product to ', 'intelligence'] as Emphasized,
  layers: [
    {
      label: 'Layer 1 / Digital transformation',
      title: 'Modernize the operation',
      body: 'Replace fragile workflows, connect existing systems, and make operational data usable.',
      outcome: 'A stronger operating core',
    },
    {
      label: 'Layer 2 / Product engineering',
      title: 'Build the software layer',
      body: 'Design and ship the web, mobile, API, and cloud systems your teams and customers need.',
      outcome: 'Software people can rely on',
    },
    {
      label: 'Layer 3 / AI engineering',
      title: 'Add intelligence with purpose',
      body: 'Use models, retrieval, agents, vision, and voice where they improve a measurable decision or task.',
      outcome: 'AI that earns its place',
    },
  ],
  result: {
    label: 'The result',
    body: ['Fewer handoffs, clearer ownership, and systems designed to ', 'work together from the start.'] as Emphasized,
  },
}

// Offering names as listed in the site's service navigation.
export const offerings = [
  'Model Training',
  'Agentic Systems',
  'Evaluation Harnesses',
  'RAG & Retrieval',
  'Computer Vision',
  'Voice AI',
  'MCP Servers',
  'AI Integration',
  'AI Strategy & PoC',
  'Web',
  'Mobile',
  'Backend & APIs',
  'Cloud & DevOps',
  'QA & Testing',
  'Product Design',
  'Legacy Modernization',
  'Workflow Automation',
  'Build-or-Buy',
  'Hardware & IoT',
  'Data & Analytics',
  'AI Enablement',
]

export const services = {
  eyebrow: 'Services / Three connected practices',
  title: ['Start with the business constraint. ', 'Bring in the disciplines it crosses.'] as Emphasized,
  body: 'Modernization, product work, and AI rarely stay in separate boxes. Our practices make the entry point clear while keeping the whole system connected.',
  directory: 'View the complete service directory',
  explore: 'Explore practice',
  practices: [
    {
      count: 9,
      name: 'AI Engineering',
      body: 'Put useful intelligence inside products and workflows, with the measurement needed to understand how it performs.',
      tags: ['Model Training', 'Agentic Systems', 'Evaluation Harnesses', 'RAG & Retrieval'],
      href: links.aiEngineering,
    },
    {
      count: 6,
      name: 'Product Engineering',
      body: 'Build the product as one coherent system, from the interface people use to the services and infrastructure that support it.',
      tags: ['Web', 'Mobile', 'Backend & APIs', 'Cloud & DevOps'],
      href: links.productEngineering,
    },
    {
      count: 6,
      name: 'Digital Transformation',
      body: 'Modernize the systems and operating workflows that limit how the business works today.',
      tags: ['Legacy Modernization', 'Workflow Automation', 'Build-or-Buy', 'Hardware & IoT'],
      href: links.digitalTransformation,
    },
  ],
}

export const howWeWork = {
  eyebrow: 'How we work',
  title: ['Think clearly. Build visibly. ', 'Stay for what comes next.'] as Emphasized,
  body: 'The work moves through seven real stages, from understanding the business to improving the live system. These three phases keep that sequence easy to follow.',
  link: 'See the complete delivery sequence',
  outcomeLabel: 'Outcome /',
  // Stage names are from surviant.com/how-we-work.
  phases: [
    {
      label: 'Phase / Think',
      name: 'Think',
      body: 'Understand the business, define the constraint, and design the system before expensive choices become fixed.',
      outcome: 'A grounded direction',
      stages: [
        ['01', 'Understand your business'],
        ['02', 'Design and architect'],
        ['03', 'Present and refine'],
      ],
    },
    {
      label: 'Phase / Build',
      name: 'Build',
      body: 'Ship in visible stages, test the parts that carry risk, and keep your team close to every important decision.',
      outcome: 'Working software',
      stages: [
        ['04', 'Build in stages, with you in the loop'],
        ['05', 'Test and prove it works'],
      ],
    },
    {
      label: 'Phase / Sustain',
      name: 'Sustain',
      body: 'Run, maintain, and improve the system with clear ownership, useful documentation, and evidence from production.',
      outcome: 'A system that keeps moving',
      stages: [
        ['06', 'Maintain and run it'],
        ['07', 'Keep building'],
      ],
    },
  ],
}

export const whySurviant = {
  eyebrow: 'Why Surviant',
  title: ['Better decisions ', 'survive the handoff.'] as Emphasized,
  body: 'Surviant is useful when the product, the underlying systems, and the operating reality cannot be separated without losing context.',
  items: [
    {
      label: 'Ownership',
      title: ['One team sees the ', 'whole system.'] as Emphasized,
      body: 'Product, engineering, AI, and operations decisions stay connected instead of being handed between disconnected vendors.',
    },
    {
      label: 'Access',
      title: ['The leaders stay ', 'close to the work.'] as Emphasized,
      body: 'The people responsible for the engagement remain involved in the decisions, reviews, and tradeoffs that shape the result.',
    },
    {
      label: 'Judgment',
      title: ['Complexity has to ', 'justify itself.'] as Emphasized,
      body: 'We use the smallest dependable approach that meets the need, then add sophistication only when the evidence supports it.',
    },
    {
      label: 'Continuity',
      title: ['Release is ', 'part of the build.'] as Emphasized,
      body: 'Operations, measurement, documentation, and the next improvement are planned before the system reaches production.',
    },
  ],
}

