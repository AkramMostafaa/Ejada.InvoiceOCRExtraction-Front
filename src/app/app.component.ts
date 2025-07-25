import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InvoiceLayoutComponent } from './shared/main/invoice-layout/invoice-layout.component';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, InvoiceLayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  template:'<app-invoice-layout></app-invoice-layout>'
})
export class AppComponent {
  title = 'invoice-OCR';
}
