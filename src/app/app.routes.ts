import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'invoice', pathMatch: 'full' },
  {
    path: 'invoice',
    loadComponent: () =>
      import('./shared/main/invoice-layout/invoice-layout.component').then(
        (m) => m.InvoiceLayoutComponent
      ),
  },
];
