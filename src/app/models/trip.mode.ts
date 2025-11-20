export interface Trip {
  id?: number;
  title: string;
  destination: string;
  caption?: string;
  startDate?: string;
  endDate?: string;
  rating?: string;
  images?: string;
  highlights?: string;
  tips?: string;
  status?: string;
  isFeatured?: string;
  userId?: number;
  rejectionReason?: string;
}
