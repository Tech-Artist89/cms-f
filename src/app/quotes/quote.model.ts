export interface Quote {
  id: number;
  quote_number: string;
  customer: number;
  customer_name?: string;
  title: string;
  description?: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  version: number;
  valid_until: Date;
  created_at: Date;
  updated_at: Date;
  total_net: number;
  total_gross: number;
  tax_rate: number;
  items: QuoteItem[];
}

export interface QuoteItem {
  id: number;
  quote: number;
  position: number;
  item_type: 'material' | 'service';
  description: string;
  quantity: number;
  unit: string;
  unit_price: number;
  discount_percent: number;
  net_amount: number;
  tax_rate: number;
  gross_amount: number;
}

export interface QuoteStatus {
  value: string;
  label: string;
  color: string;
}

export const QUOTE_STATUSES: QuoteStatus[] = [
  { value: 'draft', label: 'Entwurf', color: 'secondary' },
  { value: 'sent', label: 'Versendet', color: 'primary' },
  { value: 'accepted', label: 'Angenommen', color: 'success' },
  { value: 'rejected', label: 'Abgelehnt', color: 'danger' },
  { value: 'expired', label: 'Abgelaufen', color: 'warning' }
];