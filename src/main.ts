import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appRouter } from './app/app.routes';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { ProductsService } from './app/services/products.service';

bootstrapApplication(AppComponent, {
  providers: [
    appRouter,
    provideHttpClient(withInterceptorsFromDi()),
    ProductsService,
  ]
});