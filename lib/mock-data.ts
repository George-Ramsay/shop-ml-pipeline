import type {
  CustomerRecord,
  NewOrderDraft,
  OrderRecord,
  PriorityQueueRow,
  ShipmentRecord,
} from "@/lib/types";

const customers: CustomerRecord[] = [
  {
    customerId: 1,
    fullName: "Patricia Diallo",
    email: "patriciadiallo0@example.com",
    gender: "Female",
    birthdate: "1991-04-14",
    createdAt: "2024-01-11T10:24:00Z",
    city: "Denver",
    state: "CO",
    zipCode: "80205",
    customerSegment: "premium",
    loyaltyTier: "gold",
    isActive: true,
  },
  {
    customerId: 2,
    fullName: "Marcus Bennett",
    email: "marcus.bennett@example.com",
    gender: "Male",
    birthdate: "1987-09-22",
    createdAt: "2024-03-03T14:02:00Z",
    city: "Phoenix",
    state: "AZ",
    zipCode: "85004",
    customerSegment: "standard",
    loyaltyTier: "silver",
    isActive: true,
  },
  {
    customerId: 3,
    fullName: "Avery Nguyen",
    email: "avery.nguyen@example.com",
    gender: "Non-binary",
    birthdate: "1995-12-01",
    createdAt: "2024-05-19T08:15:00Z",
    city: "Seattle",
    state: "WA",
    zipCode: "98104",
    customerSegment: "budget",
    loyaltyTier: "none",
    isActive: true,
  },
];

const orders: OrderRecord[] = [
  {
    orderId: 30101,
    customerId: 1,
    orderDatetime: "2026-03-27T09:18:00Z",
    billingZip: "80205",
    shippingZip: "80211",
    shippingState: "CO",
    paymentMethod: "card",
    deviceType: "desktop",
    ipCountry: "US",
    promoUsed: true,
    promoCode: "SPRING15",
    orderSubtotal: 184.5,
    shippingFee: 9.99,
    taxAmount: 15.13,
    orderTotal: 209.62,
    riskScore: 18,
    isFraud: false,
  },
  {
    orderId: 30102,
    customerId: 1,
    orderDatetime: "2026-03-29T16:42:00Z",
    billingZip: "80205",
    shippingZip: "80014",
    shippingState: "CO",
    paymentMethod: "paypal",
    deviceType: "mobile",
    ipCountry: "US",
    promoUsed: false,
    promoCode: null,
    orderSubtotal: 96.0,
    shippingFee: 12.5,
    taxAmount: 8.24,
    orderTotal: 116.74,
    riskScore: 22,
    isFraud: false,
  },
  {
    orderId: 30103,
    customerId: 2,
    orderDatetime: "2026-03-26T11:06:00Z",
    billingZip: "85004",
    shippingZip: "85281",
    shippingState: "AZ",
    paymentMethod: "card",
    deviceType: "tablet",
    ipCountry: "US",
    promoUsed: true,
    promoCode: "VIPSHIP",
    orderSubtotal: 245.0,
    shippingFee: 0,
    taxAmount: 19.6,
    orderTotal: 264.6,
    riskScore: 41,
    isFraud: false,
  },
  {
    orderId: 30104,
    customerId: 2,
    orderDatetime: "2026-03-30T13:54:00Z",
    billingZip: "85004",
    shippingZip: "89109",
    shippingState: "NV",
    paymentMethod: "bank",
    deviceType: "desktop",
    ipCountry: "US",
    promoUsed: false,
    promoCode: null,
    orderSubtotal: 132.25,
    shippingFee: 8.99,
    taxAmount: 11.14,
    orderTotal: 152.38,
    riskScore: 57,
    isFraud: false,
  },
  {
    orderId: 30105,
    customerId: 3,
    orderDatetime: "2026-03-28T07:32:00Z",
    billingZip: "98104",
    shippingZip: "97205",
    shippingState: "OR",
    paymentMethod: "card",
    deviceType: "mobile",
    ipCountry: "US",
    promoUsed: true,
    promoCode: "WELCOME10",
    orderSubtotal: 74.0,
    shippingFee: 7.5,
    taxAmount: 6.77,
    orderTotal: 88.27,
    riskScore: 35,
    isFraud: false,
  },
  {
    orderId: 30106,
    customerId: 3,
    orderDatetime: "2026-03-31T08:10:00Z",
    billingZip: "98104",
    shippingZip: "98109",
    shippingState: "WA",
    paymentMethod: "crypto",
    deviceType: "desktop",
    ipCountry: "CA",
    promoUsed: false,
    promoCode: null,
    orderSubtotal: 310.0,
    shippingFee: 14.0,
    taxAmount: 30.46,
    orderTotal: 354.46,
    riskScore: 81,
    isFraud: true,
  },
];

const shipments: ShipmentRecord[] = [
  {
    shipmentId: 40101,
    orderId: 30101,
    shipDatetime: "2026-03-27T17:10:00Z",
    carrier: "UPS",
    shippingMethod: "standard",
    distanceBand: "local",
    promisedDays: 2,
    actualDays: 2,
    lateDelivery: false,
  },
  {
    shipmentId: 40102,
    orderId: 30102,
    shipDatetime: "2026-03-30T08:20:00Z",
    carrier: "FedEx",
    shippingMethod: "expedited",
    distanceBand: "regional",
    promisedDays: 2,
    actualDays: 3,
    lateDelivery: true,
  },
  {
    shipmentId: 40103,
    orderId: 30103,
    shipDatetime: "2026-03-26T19:05:00Z",
    carrier: "USPS",
    shippingMethod: "standard",
    distanceBand: "regional",
    promisedDays: 3,
    actualDays: 4,
    lateDelivery: true,
  },
  {
    shipmentId: 40104,
    orderId: 30104,
    shipDatetime: "2026-03-30T17:45:00Z",
    carrier: "UPS",
    shippingMethod: "overnight",
    distanceBand: "national",
    promisedDays: 1,
    actualDays: 1,
    lateDelivery: false,
  },
  {
    shipmentId: 40105,
    orderId: 30105,
    shipDatetime: "2026-03-28T15:22:00Z",
    carrier: "FedEx",
    shippingMethod: "standard",
    distanceBand: "national",
    promisedDays: 4,
    actualDays: 5,
    lateDelivery: true,
  },
  {
    shipmentId: 40106,
    orderId: 30106,
    shipDatetime: "2026-03-31T11:40:00Z",
    carrier: "UPS",
    shippingMethod: "expedited",
    distanceBand: "local",
    promisedDays: 2,
    actualDays: 2,
    lateDelivery: false,
  },
];

const draftByCustomerId: Record<number, NewOrderDraft> = {
  1: {
    customerId: 1,
    billingZip: "80205",
    shippingZip: "80211",
    shippingState: "CO",
    paymentMethod: "card",
    deviceType: "desktop",
    ipCountry: "US",
    promoCode: "SPRING15",
    orderSubtotal: 125,
    shippingFee: 9.99,
    taxAmount: 10.15,
  },
  2: {
    customerId: 2,
    billingZip: "85004",
    shippingZip: "89109",
    shippingState: "NV",
    paymentMethod: "bank",
    deviceType: "desktop",
    ipCountry: "US",
    promoCode: "",
    orderSubtotal: 148,
    shippingFee: 8.99,
    taxAmount: 12.03,
  },
  3: {
    customerId: 3,
    billingZip: "98104",
    shippingZip: "98109",
    shippingState: "WA",
    paymentMethod: "card",
    deviceType: "mobile",
    ipCountry: "US",
    promoCode: "WELCOME10",
    orderSubtotal: 88,
    shippingFee: 7.5,
    taxAmount: 7.39,
  },
};

function riskToLabel(risk: number): PriorityQueueRow["lateDeliveryLabel"] {
  if (risk >= 0.75) {
    return "High";
  }

  if (risk >= 0.45) {
    return "Medium";
  }

  return "Low";
}

function buildQueueRows(): PriorityQueueRow[] {
  const rows = orders.reduce<PriorityQueueRow[]>((accumulator, order) => {
      const customer = customers.find((item) => item.customerId === order.customerId);
      const shipment = shipments.find((item) => item.orderId === order.orderId);

      if (!customer || !shipment) {
        return accumulator;
      }

      const lateDeliveryRisk = Math.min(
        0.98,
        Number(
          (
            shipment.promisedDays / Math.max(shipment.actualDays, 1) * 0.12 +
            order.riskScore / 100 * 0.55 +
            (shipment.lateDelivery ? 0.28 : 0.08)
          ).toFixed(2),
        ),
      );

      accumulator.push({
        orderId: order.orderId,
        customerId: customer.customerId,
        customerName: customer.fullName,
        orderDatetime: order.orderDatetime,
        shippingState: order.shippingState,
        carrier: shipment.carrier,
        shippingMethod: shipment.shippingMethod,
        promisedDays: shipment.promisedDays,
        actualDays: shipment.actualDays,
        lateDeliveryRisk,
        lateDeliveryLabel: riskToLabel(lateDeliveryRisk),
      });

      return accumulator;
    }, []);

  return rows.sort((a, b) => b.lateDeliveryRisk - a.lateDeliveryRisk);
}

export function getCustomers() {
  return customers;
}

export function getCustomerById(customerId: number) {
  return customers.find((customer) => customer.customerId === customerId) ?? null;
}

export function getOrdersByCustomerId(customerId: number) {
  return orders
    .filter((order) => order.customerId === customerId)
    .sort((a, b) => b.orderDatetime.localeCompare(a.orderDatetime));
}

export function getLatestOrderForCustomer(customerId: number) {
  return getOrdersByCustomerId(customerId)[0] ?? null;
}

export function getNewOrderDraft(customerId: number) {
  return draftByCustomerId[customerId] ?? null;
}

export function getPriorityQueueRows() {
  return buildQueueRows();
}

export function getOrderCountByCustomer(customerId: number) {
  return orders.filter((order) => order.customerId === customerId).length;
}

export function getCustomerLifetimeSpend(customerId: number) {
  return orders
    .filter((order) => order.customerId === customerId)
    .reduce((total, order) => total + order.orderTotal, 0);
}
