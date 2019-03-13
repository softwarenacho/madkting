import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatTooltipModule} from '@angular/material/tooltip';

import { MatPaginatorModule, MatSortModule } from '@angular/material';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { ProductsComponent } from './products/products.component';
import { api } from './api.service';

@NgModule({
  declarations: [
    AppComponent,
    ProductsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatCardModule,
    BrowserAnimationsModule,
    MatTooltipModule,
    environment.production ? ServiceWorkerModule.register('ngsw-worker.js') : []
  ],
  providers: [api],
  bootstrap: [AppComponent]
})
export class AppModule { }
