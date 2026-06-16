export const UserRole = {
  Visitor: "Visitor",
  RegisteredUser: "Registered User",
  ProductBuyer: "Product Buyer",
  Member: "Member / Subscriber",
  Steward: "Steward",
  Admin: "Admin",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export type ProtectionLevel =
  | "Public"
  | "Paid"
  | "Member Only"
  | "Protected"
  | "Sacred / Restricted";

export type ProductType =
  | "Book"
  | "Audio Learning"
  | "Research Pack"
  | "Workbook"
  | "Learning Pathway";

export type MockUserAccess = {
  role: UserRole;
  permissions: string[];
  subscriptionStatus: "none" | "active" | "paused";
};
