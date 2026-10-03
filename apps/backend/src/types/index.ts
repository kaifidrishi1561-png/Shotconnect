export type UserRole = 'BRAND' | 'PHOTOGRAPHER' | 'STYLIST' | 'ADMIN';

export type UserStatus = 'ACTIVE' | 'BLOCKED' | 'PENDING';

export type ProjectStatus =
  | 'DRAFT'
  | 'OPEN'
  | 'PROPOSALS_RECEIVED'
  | 'PHOTOGRAPHER_SELECTED'
  | 'PAYMENT_PENDING'
  | 'CONFIRMED'
  | 'SHOOTING'
  | 'EDITING'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'DISPUTED';

export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'PAID' | 'FAILED' | 'REFUNDED' | 'PARTIALLY_REFUNDED';

export type DisputeStatus = 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'REJECTED';

export interface AuthTokenPayload {
  id: string;
  role: UserRole;
  email: string;
}
