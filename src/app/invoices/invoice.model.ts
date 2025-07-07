export interface Invoice {
  id: number;
  invoice_number: string;
  customer: number;
  customer_name?: string;
  project?: number;
  project_name?: string;
  title: string;
  description?: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  issue_date: Date;
  due_date: Date;
  payment_date?: Date;
  payment_terms: number;
  created_at: Date;
  updated_at: Date;
  total_net: number;
  total_gross: number;
  tax_rate: number;
  items: InvoiceItem[];
  discount_amount?: number;
  discount_percentage?: number;
  notes?: string;
}

export interface InvoiceItem {
  id: number;
  invoice: number;
  position: number;
  item_type: 'material' | 'service' | 'hours';
  description: string;
  quantity: number;
  unit: string;
  unit_price: number;
  discount_percent: number;
  net_amount: number;
  tax_rate: number;
  gross_amount: number;
}

export interface InvoiceStatus {
  value: string;
  label: string;
  color: string;
}

export const INVOICE_STATUSES: InvoiceStatus[] = [
  { value: 'draft', label: 'Entwurf', color: 'secondary' },
  { value: 'sent', label: 'Versendet', color: 'primary' },
  { value: 'paid', label: 'Bezahlt', color: 'success' },
  { value: 'overdue', label: 'Überfällig', color: 'danger' },
  { value: 'cancelled', label: 'Storniert', color: 'warning' }
];

export interface PaymentReminder {
  id: number;
  invoice: number;
  reminder_level: 1 | 2 | 3;
  sent_date: Date;
  due_date: Date;
  amount: number;
  notes?: string;
}