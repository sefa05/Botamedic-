export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      restaurants: {
        Row: {
          id: string;
          name: string;
          logo_url: string | null;
          cover_image_url: string | null;
          phone: string | null;
          address: string | null;
          min_order_amount: number;
          delivery_fee: number;
          is_open: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Row, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Row>;
      };
      categories: {
        Row: {
          id: string;
          restaurant_id: string;
          name: string;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Row, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Row>;
      };
      products: {
        Row: {
          id: string;
          restaurant_id: string;
          category_id: string;
          name: string;
          description: string | null;
          price: number;
          discounted_price: number | null;
          image_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Row, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Row>;
      };
      product_options: {
        Row: {
          id: string;
          product_id: string;
          name: string;
          type: 'single' | 'multi';
          is_required: boolean;
        };
        Insert: Omit<Row, 'id'> & { id?: string };
        Update: Partial<Row>;
      };
      product_option_values: {
        Row: {
          id: string;
          option_id: string;
          label: string;
          extra_price: number;
        };
        Insert: Omit<Row, 'id'> & { id?: string };
        Update: Partial<Row>;
      };
      customers: {
        Row: {
          id: string;
          auth_user_id: string;
          full_name: string;
          phone: string | null;
          created_at: string;
        };
        Insert: Omit<Row, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Row>;
      };
      addresses: {
        Row: {
          id: string;
          customer_id: string;
          title: string;
          full_address: string;
          floor: string | null;
          apartment: string | null;
          doorbell: string | null;
          phone: string;
          notes: string | null;
          created_at: string;
        };
        Insert: Omit<Row, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Row>;
      };
      orders: {
        Row: {
          id: string;
          restaurant_id: string;
          customer_id: string;
          address_id: string;
          status: 'new' | 'preparing' | 'on_the_way' | 'delivered' | 'cancelled';
          payment_method: 'cash' | 'card' | 'online';
          subtotal_amount: number;
          delivery_fee: number;
          total_amount: number;
          customer_note: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Row, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string };
        Update: Partial<Row>;
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          quantity: number;
          unit_price: number;
          total_price: number;
          created_at: string;
        };
        Insert: Omit<Row, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Row>;
      };
      order_item_options: {
        Row: {
          id: string;
          order_item_id: string;
          option_value_id: string | null;
          label: string;
          extra_price: number;
          created_at: string;
        };
        Insert: Omit<Row, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Row>;
      };
    };
  };
}
