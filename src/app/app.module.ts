import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http'
import { ProductService } from './services/product.service';
import { ProductListComponent } from './components/product-list/product-list.component'; 
import { RouterModule, Routes } from '@angular/router';

const routes: Routes=[
  {path: 'category/:id', component: ProductListComponent},
  {path: 'category', component: ProductListComponent},
  {path: 'products', component: ProductListComponent},
  {path: '', redirectTo: '/products', pathMatch: 'full'}, //sil nya rien dans le path alors rediriger a la page des produits
  {path: '**', redirectTo: '/products', pathMatch: 'full'},//sil le path est mal ecrit alors rediriger a la page des produits

]
@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule
  ],
  providers: [ProductService],
  bootstrap: [AppComponent]
})
export class AppModule { }
