import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { CartItem } from '../common/cart-item';
import { Country } from '../common/country';
import { State } from '../common/state';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root'
})
export class ShopFormService {

  private cartItems: CartItem[] = [];
  public totalPrice: number = 0.00;
  public totalQuantity: number = 0;

  private countriesUrl = 'http://localhost:8081/api/countries';
  private statesUrl =  'http://localhost:8081/api/states';

  constructor(private httpClient: HttpClient, private cartService: CartService) { }

  //rest API to get the countries
  getCountries(): Observable<Country[]>{
    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
      map(response => response._embedded.countries)
    );
  }

  getStates(theCountryCode: string): Observable<State[]>{
    const searchStatesUrl = `${this.statesUrl}/search/findByCountryCode?code=${theCountryCode}`
    return this.httpClient.get<GetResponseState>(searchStatesUrl).pipe(
      map(response => response._embedded.states)
    );
  }

  getCreditCartMonths(startMonth: number): Observable<number[]>{
    let data: number[] = [];

    for(let theMonth = startMonth; theMonth <= 12; theMonth++){
      data.push(theMonth);
    }

    return of(data);  // "of" wrap object as observable
  }

  getCreditCardYears(): Observable<number[]>{
    let data: number[] = [];
    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;

    for(let theYear = startYear; theYear <= endYear; theYear++){
      data.push(theYear);
    }

    return of(data);  // "of" wrap object as an observable
  }

}

interface GetResponseCountries{
  _embedded: {
    countries: Country[];
  }
}

interface GetResponseState{
  _embedded: {
    states: State[];
  }
}