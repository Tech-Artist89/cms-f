export interface Customer {
  id: number;
  customer_number: string;
  first_name: string;
  last_name: string;
  salutation?: 'herr' | 'frau';
  title?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  fax?: string;
  company?: any;
  customer_type: 'private' | 'business';
  category: 'A' | 'B' | 'C';
  created_at: Date;
  updated_at: Date;
}

export interface CustomerAddress {
  id: number;
  customer: number;
  address_type: 'billing' | 'shipping' | 'service';
  street: string;
  city: string;
  postal_code: string;
  country: string;
  is_default: boolean;
}

export interface CustomerContact {
  id: number;
  customer: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  position?: string;
  is_primary: boolean;
}

export interface CustomerNote {
  id: number;
  customer: number;
  content: string;
  created_at: Date;
  created_by: number;
}