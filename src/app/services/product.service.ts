import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  
  private categoryUrl = 'http://localhost:8081/api/product-category';
  private baseUrl = 'http://localhost:8081/api/products'; //ici cest le lien du backend   'http://localhost:8081/api/products?size=100'

  constructor(private httpClient: HttpClient) { }

  getProductListPaginate(thePage: number, thePageSize: number, CategoryId: number): Observable<GetResponseProducts>{

    //create the URL
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${CategoryId}`+ `&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  getProductList(CategoryId: number): Observable<Product[]>{

    //create the URL
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${CategoryId}`;

    return this.getProducts(searchUrl);
  }

  getProductCategories(): Observable<ProductCategory[]> {
    //we call the restAPI that return an observable that we map the json return to ProductCategory array
     return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

  getProductById(productid: number): Observable<Product> {

    const productUrl = `${this.baseUrl}/${productid}`;
    return this.httpClient.get<Product>(productUrl)
  }

  searchProducts(theKeyword: string): Observable<Product[]>{
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`; 

    return this.getProducts(searchUrl);
  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(Response => Response._embedded.products)
    );
  }
}

//exactement la config du json que nous renvoi le backend
interface GetResponseProducts {
  _embedded: {
    products: Product[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface GetResponseProductCategory{
  _embedded: {
    productCategory: ProductCategory[];
  }
}
