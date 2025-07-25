import { Component, Input, OnInit,OnChanges,SimpleChanges  } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { InvoiceData } from '../../../core/models/data';
import { InvoiceService } from '../../../core/services/invoice.service';
import { NgForOf } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forms-invoice',
  standalone: true,
  imports: [ReactiveFormsModule, NgForOf],
  templateUrl: './forms-invoice.component.html',
  styleUrl: './forms-invoice.component.scss',
   
})
export class FormsInvoiceComponent implements OnInit ,OnChanges {
  @Input() invoiceData: InvoiceData | null = null;

  formsData!: FormGroup;

  constructor(private fb: FormBuilder, private invoiceService: InvoiceService, private toastr : ToastrService) {}

  ngOnInit() {
  
     this.initForm();
    if (this.invoiceData) {
      this.patchForm(this.invoiceData);
    }
  }
 ngOnChanges(changes: SimpleChanges): void {
  if (changes['invoiceData'] && this.invoiceData && this.formsData) {
    this.formsData.reset(); 
    this.patchForm(this.invoiceData);
  }
}

     initForm() {
    this.formsData = this.fb.group({
      customerName: ['', Validators.required],
      invoiceDate: ['', Validators.required],
      invoiceNumber: ['', Validators.required],
      totalAmount: [0, Validators.required],
      vat: [0, Validators.required],  
      invoiceDetails: this.fb.array([]) 
    });
  }

  patchForm(data: InvoiceData) {
     this.formsData.reset(); 
    this.formsData.patchValue({
      customerName: data.customerName,
      invoiceDate: data.invoiceDate,
      invoiceNumber: data.invoiceNumber,
      totalAmount: data.totalAmount,
      vat: data.vat,
    });

    const details = this.formsData.get('invoiceDetails') as FormArray;
      details.clear();
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
          if (res.success) {
            this.toastr.success(res.message || 'Invoice submitted successfully');
          } else {
            this.toastr.error(res.message || 'Invoice submission failed');
          }
        },
        error: (err) => {
          console.error('Submit error:', err);
          this.toastr.error('Something went wrong during submission ❌');
        }
      });
    } else {
      form.markAllAsTouched();
      console.error('Form invalid');
      this.toastr.warning('Please fill in all required fields ⚠️');
    }
  }
}
