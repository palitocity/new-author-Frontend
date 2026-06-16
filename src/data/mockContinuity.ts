import { UserRole, type ProductType, type ProtectionLevel } from "../types/user";

export type ContinuityProduct = {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  description: string;
  coverImage: string;
  productType: ProductType;
  purchaseDate: string;
  progress: number;
  currentChapter: number;
  currentPage: number;
  chapters: string[];
  lastOpened: string;
  accessLevel: UserRole;
  protectionLevel: ProtectionLevel;
  notesCount: number;
  bookmarkCount: number;
  downloadAllowed: boolean;
  resources: string[];
  price: number;
};

export type ReflectionNote = {
  id: string;
  productId: string;
  title: string;
  excerpt: string;
  body: string;
  updatedAt: string;
};

export type BookmarkItem = {
  id: string;
  productId: string;
  label: string;
  chapter: string;
  location: string;
  createdAt: string;
};

export const mockCurrentAccess = {
  role: UserRole.Member,
  permissions: ["library:read", "notes:write", "bookmarks:write", "download:paid"],
  subscriptionStatus: "active" as const,
};

export const continuityProducts: ContinuityProduct[] = [
  {
    id: "adinkra-foundations",
    title: "Foundations of Adinkra Symbols",
    subtitle: "Meaning, memory, and visual language across generations",
    author: "Ama Mensah",
    description:
      "A guided study of Adinkra symbols with reading material, reflection prompts, and preserved visual references for continued learning.",
    coverImage:
      "https://images.unsplash.com/photo-1578926288207-a90a5366759d?auto=format&fit=crop&w=900&q=80",
    productType: "Book",
    purchaseDate: "2026-05-18",
    progress: 72,
    currentChapter: 4,
    currentPage: 118,
    chapters: [
      "Origins and Visual Memory",
      "Symbols in Daily Life",
      "Story, Proverbs, and Practice",
      "Contemporary Preservation",
      "Reflection Pathways",
    ],
    lastOpened: "2 hours ago",
    accessLevel: UserRole.ProductBuyer,
    protectionLevel: "Paid",
    notesCount: 8,
    bookmarkCount: 14,
    downloadAllowed: true,
    resources: ["Symbol index", "Printable reflection worksheet", "Reference images"],
    price: 12500,
  },
  {
    id: "oral-history-field-notes",
    title: "Oral History Field Notes",
    subtitle: "Interview care, consent, and community memory",
    author: "Nia Bello",
    description:
      "A research pack for documenting oral histories with care, including templates, prompts, and preservation checklists.",
    coverImage:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
    productType: "Research Pack",
    purchaseDate: "2026-04-27",
    progress: 48,
    currentChapter: 2,
    currentPage: 36,
    chapters: ["Listening Protocols", "Consent and Context", "Archive Preparation", "Return Copies"],
    lastOpened: "yesterday",
    accessLevel: UserRole.Member,
    protectionLevel: "Protected",
    notesCount: 12,
    bookmarkCount: 6,
    downloadAllowed: false,
    resources: ["Consent template", "Interview checklist", "Archive naming guide"],
    price: 18000,
  },
  {
    id: "memory-migration-workbook",
    title: "Memory and Migration Workbook",
    subtitle: "Reflection prompts for tracing family movement",
    author: "David Okoro",
    description:
      "A workbook for mapping migration stories, preserving family timelines, and connecting personal memory to wider cultural history.",
    coverImage:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=900&q=80",
    productType: "Workbook",
    purchaseDate: "2026-03-09",
    progress: 86,
    currentChapter: 6,
    currentPage: 144,
    chapters: ["Place Names", "Family Routes", "Objects and Memory", "Return Interviews", "Timeline Care", "Sharing Well"],
    lastOpened: "Jun 12",
    accessLevel: UserRole.ProductBuyer,
    protectionLevel: "Member Only",
    notesCount: 21,
    bookmarkCount: 9,
    downloadAllowed: true,
    resources: ["Migration map worksheet", "Family interview prompts"],
    price: 9000,
  },
  {
    id: "custodian-archive-practice",
    title: "Custodian Archive Practice",
    subtitle: "Stewardship models for protected knowledge",
    author: "SankofaSeek Steward Council",
    description:
      "A restricted learning pathway for approved stewards handling protected knowledge collections and access responsibilities.",
    coverImage:
      "https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?auto=format&fit=crop&w=900&q=80",
    productType: "Learning Pathway",
    purchaseDate: "2026-02-14",
    progress: 24,
    currentChapter: 1,
    currentPage: 18,
    chapters: ["Custodial Duty", "Permission Records", "Context Before Access", "Community Review"],
    lastOpened: "Jun 08",
    accessLevel: UserRole.Steward,
    protectionLevel: "Sacred / Restricted",
    notesCount: 4,
    bookmarkCount: 3,
    downloadAllowed: false,
    resources: ["Steward checklist", "Access review template"],
    price: 0,
  },
];

export const reflectionNotes: ReflectionNote[] = [
  {
    id: "note-1",
    productId: "adinkra-foundations",
    title: "Symbol as carried memory",
    excerpt: "Preservation is active. The symbol matters because people return to it.",
    body: "Preservation is active. Each return to the symbol carries a slightly different context, but the original teaching remains visible.",
    updatedAt: "2026-06-14",
  },
  {
    id: "note-2",
    productId: "oral-history-field-notes",
    title: "Consent before recording",
    excerpt: "The archive begins before the recorder is switched on.",
    body: "The archive begins before the recorder is switched on. Consent, setting, and return copies are part of the knowledge itself.",
    updatedAt: "2026-06-10",
  },
];

export const bookmarkItems: BookmarkItem[] = [
  {
    id: "bookmark-1",
    productId: "adinkra-foundations",
    label: "Chapter 4 preservation model",
    chapter: "Contemporary Preservation",
    location: "Page 118",
    createdAt: "2026-06-14",
  },
  {
    id: "bookmark-2",
    productId: "memory-migration-workbook",
    label: "Family route prompt",
    chapter: "Family Routes",
    location: "Prompt 7",
    createdAt: "2026-06-12",
  },
];

export const adminRows = {
  products: continuityProducts,
  users: [
    { id: "u-1", name: "Amina K.", email: "amina@example.com", role: UserRole.Member, status: "Active" },
    { id: "u-2", name: "David O.", email: "david@example.com", role: UserRole.ProductBuyer, status: "Active" },
    { id: "u-3", name: "Nia B.", email: "nia@example.com", role: UserRole.Steward, status: "Review" },
  ],
  purchases: [
    { id: "p-1", product: "Foundations of Adinkra Symbols", buyer: "Amina K.", status: "Paid", amount: "NGN 12,500" },
    { id: "p-2", product: "Memory and Migration Workbook", buyer: "David O.", status: "Paid", amount: "NGN 9,000" },
  ],
  subscriptions: [
    { id: "s-1", user: "Amina K.", plan: "Member", status: "Active", renews: "2026-07-15" },
    { id: "s-2", user: "Nia B.", plan: "Steward", status: "Review", renews: "Manual approval" },
  ],
};
