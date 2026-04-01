export type CustomerSegment = "budget" | "standard" | "premium";

export type LoyaltyTier = "none" | "silver" | "gold";

export type PaymentMethod = "card" | "paypal" | "bank" | "crypto";

export type DeviceType = "mobile" | "desktop" | "tablet";

export type Carrier = "UPS" | "FedEx" | "USPS";

export type ShippingMethod = "standard" | "expedited" | "overnight";

export type DistanceBand = "local" | "regional" | "national";

export type CustomerRecord = {
  customerId: number;
  fullName: string;
  email: string;
  gender: string;
  birthdate: string;
  createdAt: string;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  customerSegment: CustomerSegment | null;
  loyaltyTier: LoyaltyTier | null;
  isActive: boolean;
};

export type OrderRecord = {
  orderId: number;
  customerId: number;
  orderDatetime: string;
  billingZip: string | null;
  shippingZip: string | null;
  shippingState: string | null;
  paymentMethod: PaymentMethod;
  deviceType: DeviceType;
  ipCountry: string;
  promoUsed: boolean;
  promoCode: string | null;
  orderSubtotal: number;
  shippingFee: number;
  taxAmount: number;
  orderTotal: number;
  riskScore: number;
  isFraud: boolean;
};

export type ShipmentRecord = {
  shipmentId: number;
  orderId: number;
  shipDatetime: string;
  carrier: Carrier;
  shippingMethod: ShippingMethod;
  distanceBand: DistanceBand;
  promisedDays: number;
  actualDays: number;
  lateDelivery: boolean;
};

export type PriorityQueueRow = {
  orderId: number;
  customerId: number;
  customerName: string;
  orderDatetime: string;
  shippingState: string | null;
  carrier: Carrier;
  shippingMethod: ShippingMethod;
  promisedDays: number;
  actualDays: number | null;
  lateDeliveryRisk: number;
  lateDeliveryLabel: "High" | "Medium" | "Low";
};

export type NewOrderDraft = {
  customerId: number;
  billingZip: string;
  shippingZip: string;
  shippingState: string;
  paymentMethod: PaymentMethod;
  deviceType: DeviceType;
  ipCountry: string;
  promoCode: string;
  orderSubtotal: number;
  shippingFee: number;
  taxAmount: number;
};
