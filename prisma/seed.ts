// Seeds/updates the single ADMIN account from ADMIN_NAME / ADMIN_EMAIL / ADMIN_PASSWORD in .env.
// The /auth/create endpoint always creates USER-role accounts, so this is the
// only way to get an ADMIN account, which the dashboard's middleware requires.
//
// Also seeds default portfolio content. Skills and experience are inserted only
// for a fresh database, while the curated projects are inserted idempotently so
// production deployments can add missing work without overwriting dashboard edits.
import { PrismaClient, FieldType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const ICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons';
const companyLogo = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=16a34a&color=fff&bold=true`;

// Ongoing roles: endDate is required by the schema, so current positions use this
// far-future sentinel — the site's formatDateRange() renders any future endDate as "Present".
const PRESENT = new Date('2099-12-31');

// Dates are stored as UTC midnight; using the 15th (not the 1st) keeps the displayed
// month correct in every viewer timezone (a 1st-of-month UTC date renders as the
// previous month for visitors west of UTC).
const month = (ym: string) => new Date(`${ym}-15`);

const portfolioSiteUrl = (process.env.PORTFOLIO_SITE_URL || 'https://amdad-dev.vercel.app').replace(/\/$/, '');
const projectImage = (fileName: string) => `${portfolioSiteUrl}/projects/${fileName}`;

const PROJECTS = [
  {
    name: 'LeadPylot CRM',
    description:
      'A multi-tenant CRM for financial-services teams, covering lead intake, advanced filtering and grouping, sales pipelines, internal communication, document generation, tasks, and real-time operations.',
    type: 'Web Application',
    liveLink: 'https://test.leadpylot.com/sign-in',
    gitHubLink: 'https://test.leadpylot.com/sign-in',
    siteMockup: projectImage('leadpylot-crm.jpg'),
    projectStartDate: month('2025-08'),
    projectEndDate: month('2026-09'),
    elements: 0,
    totalCode: 0,
    isFeatured: true,
    features: [
      'Multi-tenant lead management with advanced domain filters and grouping',
      'Offer-to-payment workflow with fillable PDF mapping and generation',
      'Role-based access control with Redis-cached permissions',
      'Real-time notifications, email, Kanban, and team collaboration',
      'AI-assisted lead summaries plus spreadsheet import and export',
    ],
    services: ['Product engineering', 'Frontend development', 'Backend architecture', 'Real-time systems'],
    techonology: ['Next.js', 'TypeScript', 'Node.js', 'MongoDB', 'Redis', 'Socket.IO'],
  },
  {
    name: 'MyPick Dynamic Storefront',
    description:
      'A custom, CMS-driven e-commerce storefront where page layouts, content, catalog experiences, and customer journeys are assembled from configurable data and reusable dynamic components.',
    type: 'Web Application',
    liveLink: 'https://demo-web.mypick.dev/us-en',
    gitHubLink: 'https://demo-web.mypick.dev/us-en',
    siteMockup: projectImage('mypick-storefront.jpg'),
    projectStartDate: month('2026-01'),
    projectEndDate: month('2026-09'),
    elements: 0,
    totalCode: 0,
    isFeatured: true,
    features: [
      'Fully dynamic page layouts and reusable CMS content blocks',
      'Product and order synchronisation with Shopify and WooCommerce',
      'AI translation and image recognition for product workflows',
      'Shipping, fulfilment, tracking, catalog, and checkout experiences',
    ],
    services: ['E-commerce engineering', 'CMS architecture', 'API integrations', 'Performance optimisation'],
    techonology: ['Next.js', 'TypeScript', 'Node.js', 'Redis', 'AWS Rekognition', 'Shopify API'],
  },
  {
    name: 'Nalshe — Social Blogging Platform',
    description:
      'A multilingual social publishing platform where readers discover stories, follow writers, join discussions, and interact with a community-led content feed.',
    type: 'Web Application',
    liveLink: 'https://nalshe.com/',
    gitHubLink: 'https://nalshe.com/',
    siteMockup: projectImage('nalshe.jpg'),
    projectStartDate: month('2024-03'),
    projectEndDate: month('2025-04'),
    elements: 0,
    totalCode: 0,
    isFeatured: true,
    features: [
      'Story publishing and content discovery',
      'Community discussions, comments, reactions, and ratings',
      'Writer profiles, following, and ranked contributor discovery',
      'Search, feed filters, language switching, and light/dark themes',
    ],
    services: ['Web application development', 'Responsive UI', 'Social product experience'],
    techonology: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
  },
  {
    name: 'SimFree Global eSIM',
    description:
      'A global eSIM product for finding, purchasing, and activating mobile data plans across 200+ countries, delivered through a responsive web experience and companion iOS and Android apps.',
    type: 'Mobile App',
    liveLink: 'https://simfree.io/en',
    gitHubLink: 'https://simfree.io/en',
    siteMockup: projectImage('simfree.jpg'),
    projectStartDate: month('2024-03'),
    projectEndDate: month('2025-04'),
    elements: 0,
    totalCode: 0,
    isFeatured: false,
    features: [
      'Country-based eSIM plan discovery and comparison',
      'Digital purchase and guided activation journey',
      'Multi-language and international market experience',
      'Consistent product experience across web, iOS, and Android',
    ],
    services: ['Web development', 'Mobile product integration', 'Responsive experience'],
    techonology: ['Next.js', 'React', 'TypeScript', 'REST APIs'],
  },
  {
    name: 'MyPick Partner Portal',
    description:
      'A seller operations portal for managing products, inventory, orders, earnings, and real-time marketplace analytics within the wider MyPick commerce ecosystem.',
    type: 'Web Application',
    liveLink: 'https://demo-partner.mypick.dev/en/sign-in?returnTo=%2Fus-en',
    gitHubLink: 'https://demo-partner.mypick.dev/en/sign-in?returnTo=%2Fus-en',
    siteMockup: projectImage('mypick-partner.jpg'),
    projectStartDate: month('2026-01'),
    projectEndDate: month('2026-09'),
    elements: 0,
    totalCode: 0,
    isFeatured: false,
    features: [
      'Seller product and inventory management',
      'Order and fulfilment workflows',
      'Revenue and marketplace analytics',
      'Secure seller authentication and account access',
    ],
    services: ['Partner platform development', 'Dashboard engineering', 'Commerce integrations'],
    techonology: ['Next.js', 'TypeScript', 'Node.js', 'Redis'],
  },
  {
    name: 'MyPick Admin CMS',
    description:
      'The administration platform behind MyPick, giving internal teams control over dynamic pages, content, catalogs, users, settings, translations, and commerce operations.',
    type: 'Web Application',
    liveLink: 'https://demo-admin.mypick.dev/en/sign-in?returnTo=%2Fus-en',
    gitHubLink: 'https://demo-admin.mypick.dev/en/sign-in?returnTo=%2Fus-en',
    siteMockup: projectImage('mypick-admin.jpg'),
    projectStartDate: month('2026-01'),
    projectEndDate: month('2026-09'),
    elements: 0,
    totalCode: 0,
    isFeatured: false,
    features: [
      'Dynamic page layout and CMS configuration',
      'Catalog, user, order, and operational administration',
      'Role-based permissions with Redis-cached access checks',
      'Translation and platform settings management',
    ],
    services: ['Admin platform development', 'CMS architecture', 'Role-based access control'],
    techonology: ['Next.js', 'TypeScript', 'Node.js', 'Redis'],
  },
  {
    name: 'LGC Workforce ERP',
    description:
      'An employee operations platform for field teams, combining workforce management with GPS-aware attendance and real-time, location-verified check-in and check-out workflows.',
    type: 'Web Application',
    liveLink: 'https://lgcglobalcontractingltd.com/',
    gitHubLink: 'https://lgcglobalcontractingltd.com/',
    siteMockup: projectImage('lgc-erp.jpg'),
    projectStartDate: month('2025-05'),
    projectEndDate: month('2025-08'),
    elements: 0,
    totalCode: 0,
    isFeatured: false,
    features: [
      'Employee profiles, roles, and workforce administration',
      'Location-verified check-in and check-out',
      'Real-time attendance and field activity visibility',
      'Operational records and management reporting',
    ],
    services: ['ERP development', 'Backend architecture', 'Real-time features', 'Location services'],
    techonology: ['React', 'Node.js', 'MongoDB', 'Socket.IO', 'Geolocation'],
  },
  {
    name: 'Thumbnail Boss Portfolio',
    description:
      'A fast, polished portfolio experience for a specialist thumbnail designer, built to showcase visual work clearly and turn browsing visitors into qualified client enquiries.',
    type: 'Website',
    liveLink: 'https://www.thumbnailboss.com/',
    gitHubLink: 'https://www.thumbnailboss.com/',
    siteMockup: projectImage('thumbnail-boss.jpg'),
    projectStartDate: month('2024-03'),
    projectEndDate: month('2025-04'),
    elements: 0,
    totalCode: 0,
    isFeatured: false,
    features: [
      'Visual-first portfolio and project browsing',
      'Responsive layouts for desktop and mobile visitors',
      'Clear service positioning and enquiry paths',
      'Lightweight, performance-focused interactions',
    ],
    services: ['Portfolio development', 'Responsive UI', 'Frontend implementation'],
    techonology: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
  },
];

const SKILLS: { field: FieldType; name: string; image: string }[] = [
  // Languages
  { field: 'PROGRAMMING_LANGUAGE', name: 'JavaScript', image: `${ICON}/javascript/javascript-original.svg` },
  { field: 'PROGRAMMING_LANGUAGE', name: 'TypeScript', image: `${ICON}/typescript/typescript-original.svg` },
  { field: 'PROGRAMMING_LANGUAGE', name: 'Python', image: `${ICON}/python/python-original.svg` },
  { field: 'PROGRAMMING_LANGUAGE', name: 'Go', image: `${ICON}/go/go-original.svg` },
  { field: 'PROGRAMMING_LANGUAGE', name: 'C/C++', image: `${ICON}/cplusplus/cplusplus-original.svg` },
  // Frontend
  { field: 'FRONTEND', name: 'React', image: `${ICON}/react/react-original.svg` },
  { field: 'FRONTEND', name: 'Next.js', image: `${ICON}/nextjs/nextjs-original.svg` },
  { field: 'FRONTEND', name: 'Redux', image: `${ICON}/redux/redux-original.svg` },
  { field: 'FRONTEND', name: 'Zustand', image: `${ICON}/zustand/zustand-original.svg` },
  { field: 'FRONTEND', name: 'Tailwind CSS', image: `${ICON}/tailwindcss/tailwindcss-original.svg` },
  // Backend
  { field: 'BACKEND', name: 'Node.js', image: `${ICON}/nodejs/nodejs-original.svg` },
  { field: 'BACKEND', name: 'Express', image: `${ICON}/express/express-original.svg` },
  { field: 'BACKEND', name: 'NestJS', image: `${ICON}/nestjs/nestjs-original.svg` },
  { field: 'BACKEND', name: 'Socket.IO', image: `${ICON}/socketio/socketio-original.svg` },
  { field: 'BACKEND', name: 'Prisma', image: `${ICON}/prisma/prisma-original.svg` },
  { field: 'BACKEND', name: 'Mongoose', image: `${ICON}/mongoose/mongoose-original.svg` },
  { field: 'BACKEND', name: 'MongoDB', image: `${ICON}/mongodb/mongodb-original.svg` },
  { field: 'BACKEND', name: 'PostgreSQL', image: `${ICON}/postgresql/postgresql-original.svg` },
  { field: 'BACKEND', name: 'Redis', image: `${ICON}/redis/redis-original.svg` },
  // DevOps / Data & Infra
  { field: 'DEVOPS', name: 'Docker', image: `${ICON}/docker/docker-original.svg` },
  { field: 'DEVOPS', name: 'AWS S3', image: `${ICON}/amazonwebservices/amazonwebservices-original-wordmark.svg` },
  { field: 'DEVOPS', name: 'Linux VPS', image: `${ICON}/linux/linux-original.svg` },
  { field: 'DEVOPS', name: 'GitLab CI', image: `${ICON}/gitlab/gitlab-original.svg` },
  { field: 'DEVOPS', name: 'Cloudflare', image: `${ICON}/cloudflare/cloudflare-original.svg` },
  { field: 'DEVOPS', name: 'Firebase', image: `${ICON}/firebase/firebase-original.svg` },
  { field: 'DEVOPS', name: 'Supabase', image: `${ICON}/supabase/supabase-original.svg` },
  // Tools (Figma isn't on the resume's skills list, but the site brands its owner
  // as a "Full-Stack Developer & Figma Designer", so it stays)
  { field: 'TOOL', name: 'Git', image: `${ICON}/git/git-original.svg` },
  { field: 'TOOL', name: 'GitHub', image: `${ICON}/github/github-original.svg` },
  { field: 'TOOL', name: 'Figma', image: `${ICON}/figma/figma-original.svg` },
];

const EXPERIENCES = [
  {
    role: 'Software Engineer',
    company: 'Digital Pylot',
    companyImage: companyLogo('Digital Pylot'),
    startDate: month('2026-04'),
    endDate: PRESENT,
    description:
      'Core engineer on LeadPylot, a multi-tenant CRM SaaS for financial-services lead management spanning 14 Dockerised Node.js/Express microservices. Built the PDF form-mapping and generation engine with pdf-lib — admins upload a fillable bank form, its AcroForm fields are auto-extracted, and a visual mapping UI binds each field to CRM data sources — plus one-click offer-to-PDF generation, snapshot-based document versioning, and hybrid AWS S3 / local-disk storage. Designed a multi-channel notification rules engine (realtime Socket.IO inbox, Telegram bots, Firebase web push, scheduled email digests) driven by admin-configurable templates bound to event triggers, now being rebuilt in TypeScript on BullMQ job queues. Hardened authentication with Redis-cached permission resolution and login-attempt throttling, and built internal DevOps tooling including an in-browser web terminal and GitLab-driven deployment pipelines.',
    skill: ['Node.js', 'Express', 'TypeScript', 'MongoDB', 'Redis', 'Docker', 'Socket.IO', 'BullMQ', 'AWS S3', 'pdf-lib'],
  },
  {
    role: 'Full Stack Developer',
    company: 'Digital Pylot',
    companyImage: companyLogo('Digital Pylot'),
    startDate: month('2025-08'),
    endDate: month('2026-03'),
    description:
      "Developed LeadPylot's core lead engine: Odoo-style domain filtering through a universal query middleware, strategy-pattern grouping, Redis-backed bulk selection, and the full offer lifecycle from Offer to Opening to Confirmation to Payment Voucher. Implemented three-tier RBAC (per-user overrides, page permissions, Redis-cached role keys) with an admin permission editor, built a two-way email client inside the CRM with realtime IMAP IDLE inbox sync and Nodemailer SMTP delivery, created a realtime Kanban board service with drag-and-drop ordering and built-in team chat over Socket.IO, and added OpenAI-powered lead summaries, Excel import/export, and a multi-language UI on the Next.js App Router frontend.",
    skill: ['Node.js', 'Express', 'Next.js', 'TanStack Query', 'Tailwind CSS', 'Redis', 'IMAP/SMTP', 'Socket.IO', 'OpenAI & Gemini APIs'],
  },
  {
    role: 'Software Engineer',
    company: 'Mypick',
    companyImage: companyLogo('Mypick'),
    startDate: month('2026-01'),
    endDate: PRESENT,
    description:
      'Working remotely on a US-based e-commerce platform. Integrated AWS Rekognition for automated image recognition in the product pipeline, built WooCommerce and Shopify API integrations that keep products and orders in sync across platforms, developed an AI translation system, a shipping module with shipment tracking, and a CMS-driven storefront built from dynamic components, and cut database load by moving auth-flow and RBAC permission lookups into Redis.',
    skill: ['Node.js', 'AWS Rekognition', 'WooCommerce', 'Shopify API', 'Redis', 'Next.js'],
  },
  {
    role: 'Backend Team Lead',
    company: 'Softvence',
    companyImage: companyLogo('Softvence'),
    startDate: month('2025-05'),
    endDate: month('2025-08'),
    description:
      'Joined as a Full Stack Developer and moved up to Backend Team Lead. Led 20 developers delivering 7–8 service-based projects under tight deadlines, set architectural direction, and mentored engineers. Ran production backend hosting on Linux VPS servers with root-level access, and built ERP modules, realtime chat and notification services, admin dashboards, and a GPS location-tracking system.',
    skill: ['Node.js', 'Express', 'Linux VPS', 'Socket.IO', 'MongoDB', 'Team Leadership'],
  },
  {
    role: 'Full Stack Developer',
    company: 'Monster Studio',
    companyImage: companyLogo('Monster Studio'),
    startDate: month('2024-03'),
    endDate: month('2025-04'),
    description:
      'Started as a Front End Developer and grew into a Full Stack role. Contributed to 20+ client websites in a large-scale monorepo and designed the database and architecture for a creator-economy platform. Developed a custom CMS with YouTube API integration for creator tools, built responsive, SEO-optimised UIs with Remix, React, and Tailwind CSS, and customised shadcn/ui, Material UI, and Magic UI component systems, delivering corporate sites combining WordPress and React.',
    skill: ['React', 'Remix', 'Tailwind CSS', 'WordPress', 'YouTube API', 'shadcn/ui'],
  },
];

async function main() {
  const name = process.env.ADMIN_NAME;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!name || !email || !password) {
    throw new Error(
      'ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env before seeding.'
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // A DB with no users at all is a brand-new install — only then does default
  // content get seeded automatically. This keeps `npm run dev`/`deploy` (which
  // both run the seed) from resurrecting skills/experiences an admin deliberately
  // deleted through the dashboard. Set SEED_DEFAULT_CONTENT=true to force it.
  const isFreshDb = (await prisma.user.count()) === 0;
  const seedContent = isFreshDb || process.env.SEED_DEFAULT_CONTENT === 'true';

  const admin = await prisma.user.upsert({
    where: { email },
    update: { name, password: hashedPassword, role: 'ADMIN' },
    create: { name, email, password: hashedPassword, role: 'ADMIN' },
  });

  console.log(`ADMIN user ready: ${admin.email} (id: ${admin.id})`);

  let createdProjects = 0;
  let existingProjects = 0;

  for (const project of PROJECTS) {
    const existingProject = await prisma.project.findFirst({
      where: {
        OR: [{ name: project.name }, { liveLink: project.liveLink }],
      },
      select: { id: true },
    });

    if (existingProject) {
      existingProjects += 1;
      continue;
    }

    await prisma.project.create({
      data: { ...project, userId: admin.id },
    });
    createdProjects += 1;
  }

  console.log(`Curated projects ready: ${createdProjects} created, ${existingProjects} already present`);

  if (!seedContent) {
    console.log('Existing database — skipping default content (set SEED_DEFAULT_CONTENT=true to force)');
    return;
  }

  const skillCount = await prisma.skill.count();
  if (skillCount === 0) {
    await prisma.skill.createMany({
      data: SKILLS.map((s) => ({ ...s, userId: admin.id })),
    });
    console.log(`Seeded ${SKILLS.length} default skills`);
  } else {
    console.log(`Skills table already has ${skillCount} row(s) — skipping default skills`);
  }

  const experienceCount = await prisma.experience.count();
  if (experienceCount === 0) {
    await prisma.experience.createMany({
      data: EXPERIENCES.map((e) => ({ ...e, userId: admin.id })),
    });
    console.log(`Seeded ${EXPERIENCES.length} default experiences`);
  } else {
    console.log(
      `Experience table already has ${experienceCount} row(s) — skipping default experiences`
    );
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
