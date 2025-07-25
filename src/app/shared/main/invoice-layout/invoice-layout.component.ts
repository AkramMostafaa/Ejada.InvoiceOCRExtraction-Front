import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FormsInvoiceComponent } from '../../components/forms-invoice/forms-invoice.component';
import { InvoiceService } from '../../../core/services/invoice.service';
import { InvoiceData } from '../../../core/models/data';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-invoice-layout',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule, FormsModule, HttpClientModule,FormsInvoiceComponent],
  templateUrl: 'invoice-layout.component.html',
  styleUrl: './invoice-layout.component.scss',
})
export class InvoiceLayoutComponent {
  dataOfInvoice = new FormGroup({
    invoice: new FormControl<File | null>(null, [Validators.required]),
  });

  parsedInvoiceData: InvoiceData | null = null;
  constructor(private invoiceService: InvoiceService) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.dataOfInvoice.patchValue({
        invoice: input.files[0],
      });
    }
  }

  submit() {
    const file = this.dataOfInvoice.get('invoice')?.value;

    if (file && file instanceof File) {
      this.invoiceService.uploadInvoice(file).subscribe({
        next: (res) => {
          console.log('Upload Response:', res);
          if (res.success) {
                      if (res.success) {
         
          const patchedData = {
            ...res.data,
            invoiceDate: res.data.invoiceDate.slice(0, 10)
          };
          this.parsedInvoiceData = patchedData;
        }
          } else {
            console.error('API Error:', res.errors);
          }
        },
        error: (err) => console.error('HTTP Error:', err),
      });
    } else {
      console.error('No file selected.');
    }
  }
}
