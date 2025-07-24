export interface InvoiceDetails {
  description: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  customerName: string;
  totalAmount: number;
  vat: number;
  invoiceDetails: InvoiceDetails[];
}
export interface GeneralResponse<T> {
    success: boolean;
    message: string;
    data: T;
    statusCode: number;
    errors: string[];
  }
