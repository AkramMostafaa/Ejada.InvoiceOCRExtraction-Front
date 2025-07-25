import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable ,of } from 'rxjs';
import { GeneralResponse, InvoiceData } from '../models/data';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private apiUrl = 'http://localhost:5042/api/Invoices/upload';
  private submitUrl = 'http://localhost:5042/api/Invoices/submit';

  constructor(private http: HttpClient,private toastr: ToastrService) {}
uploadInvoice(file: File): Observable<GeneralResponse<InvoiceData>> {
  const useMock = false; 

  if (useMock) {
    const staticResponse: GeneralResponse<InvoiceData> = {
      success: true,
      message: 'Invoice parsed successfully.',
      data: {
        invoiceNumber: 'INV123456',
        invoiceDate: '2025-07-24T13:12:52.4495763Z',
        customerName: 'John Smith',
        totalAmount: 100,
        vat: 15,
        invoiceDetails: [
          {
            description: 'T-Shirts',
            quantity: 2,
            unitPrice: 20,
            lineTotal: 40
          },
          {
            description: 'Jeans',
            quantity: 1,
            unitPrice: 60,
            lineTotal: 60
          }
        ]
      },
      statusCode: 200,
      errors: ["test err"]
    };

    return of(staticResponse);
  } else {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<GeneralResponse<InvoiceData>>(this.apiUrl, formData, {
      headers: new HttpHeaders({
        Accept: 'text/plain',
      }),
      responseType: 'json',
    });
  }
}
   submitInvoice(invoice: InvoiceData): Observable<GeneralResponse<any>> {
    return this.http.post<GeneralResponse<any>>(this.submitUrl, invoice, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'text/plain',
      }),
      responseType: 'json',
    });
  }

}
