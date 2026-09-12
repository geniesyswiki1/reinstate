export interface PriceRow {
  id: 'amazon' | 'marketplace' | 'payments' | 'addon';
  product: string;
  price: string;
  amount: number;
  includes: string;
  storePrice: string;
}

export const PRICING: PriceRow[] = [
  {
    id: 'amazon',
    product: 'Amazon case',
    price: '£49',
    amount: 4900,
    includes:
      'Classification, intake, evidence extraction, draft, pre-check, DOCX, unlimited redrafts and rejection handling for 30 days',
    storePrice: '£48.99',
  },
  {
    id: 'marketplace',
    product: 'Marketplace case (Etsy, eBay, TikTok Shop)',
    price: '£29',
    amount: 2900,
    includes:
      'Classification, intake, evidence extraction, draft, pre-check, DOCX, unlimited redrafts and rejection handling for 30 days',
    storePrice: '£28.99',
  },
  {
    id: 'payments',
    product: 'Payments case (PayPal, Stripe, Shopify Payments)',
    price: '£19',
    amount: 1900,
    includes:
      'Classification, intake, evidence extraction, draft, pre-check, DOCX, unlimited redrafts and rejection handling for 30 days',
    storePrice: '£18.99',
  },
  {
    id: 'addon',
    product: 'Add-on case (from an existing case page)',
    price: '£19',
    amount: 1900,
    includes: 'The same, on any platform',
    storePrice: '£18.99',
  },
];

export const PRICING_RULES = [
  'One-time. There is no subscription anywhere in this product.',
  'Refund in full if no draft is delivered within 24 hours, or if we classified your notice wrongly and you tell us before drafting.',
  'Otherwise no refunds. The value is delivered when the draft is.',
  'Cases and uploads are deleted 90 days after purchase.',
];
