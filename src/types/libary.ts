export type LibraryProduct = {
  id: string;
  title: string;
  subtitle?: string;
  author: string;
  coverImage?: string;

  productType: "Book";
  purchaseDate: string;

  currentPage: number;
  totalPages: number;
  progress: number;
  progressPercentage: number;
  lastReadAt?: string | null;

  pdfFile?: string;

  orderId: string;
  transactionId: string;
  paymentReference: string;
};