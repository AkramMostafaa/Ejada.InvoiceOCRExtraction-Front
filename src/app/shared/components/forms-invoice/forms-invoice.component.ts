import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { InvoiceData } from '../../../core/models/data';
import { InvoiceService } from '../../../core/services/invoice.service';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-forms-invoice',
  standalone: true,
  imports: [ReactiveFormsModule, NgForOf],
  templateUrl: './forms-invoice.component.html',
  styleUrl: './forms-invoice.component.scss',
})
export class FormsInvoiceComponent implements OnInit {
  @Input() invoiceData: InvoiceData | null = null;

  formsData!: FormGroup;

  constructor(private fb: FormBuilder, private invoiceService: InvoiceService) {}

  ngOnInit() {
    this.formsData = this.fb.group({
      customerName: ['', Validators.required],
      invoiceDate: ['', Validators.required],
      invoiceNumber: ['', Validators.required],
      totalAmount: [0, Validators.required],
      vat: [0, Validators.required],
      invoiceDetails: this.fb.array([], Validators.required),
    });

    if (this.invoiceData) {
      this.patchForm(this.invoiceData);
    }
  }

  patchForm(data: InvoiceData) {
    this.formsData.patchValue({
      customerName: data.customerName,
      invoiceDate: data.invoiceDate,
      invoiceNumber: data.invoiceNumber,
      totalAmount: data.totalAmount,
      vat: data.vat,
    });

    const details = this.formsData.get('invoiceDetails') as FormArray;
    data.invoiceDetails.forEach((d) => {
      details.push(
        this.fb.group({
          description: [d.description, Validators.required],
          quantity: [d.quantity, Validators.required],
          unitPrice: [d.unitPrice, Validators.required],
          lineTotal: [d.lineTotal, Validators.required],
        }),
      );
    });
  }

  get invoiceDetails(): FormArray {
    return this.formsData.get('invoiceDetails') as FormArray;
  }

  submit(form: FormGroup) {
    if (form.valid) {
      const payload: InvoiceData = form.value;
      this.invoiceService.submitInvoice(payload).subscribe({
        next: (res) => {
          console.log('Submit response:', res);
        },
        error: (err) => console.error('Submit error:', err),
      });
    } else {
      console.error('Form invalid');
    }
  }
}
