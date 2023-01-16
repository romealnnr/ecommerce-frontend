import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CartItem } from 'src/app/common/cart-item';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { ShopFormService } from 'src/app/services/shop-form.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit{

  cartItems: CartItem[] = [];
  checkoutFormGroup!: FormGroup; //set of formcontrols or other groups...
  totalPrice: number = 0.00;
  totalQuantity: number = 0;
  creditCartYears: number[] = [];
  creditCartMonths: number[] = [];
  countries: Country[] = [];
  shippingAddressStates: State[]= [];
  billingAddressStates: State[]= [];
  
  
  constructor(private formBuilder: FormBuilder, private shopFormService: ShopFormService, private cartService: CartService){}
 
  ngOnInit(): void{
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: [''],
      }),
      shippingAddress:  this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: [''],
      }),
      billingAddress:  this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: [''],
      }),
      creditCard:  this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYear: ['']
      }),
    })

    //populate credit cart month and year
    const startMonth: number = new Date().getMonth() + 1;  //get the current month(in javascript the month start from 0)
    console.log(startMonth);

    this.shopFormService.getCreditCartMonths(startMonth).subscribe(
      data => {
        console.log("retrieved credit cart months" + JSON.stringify(data));
        this.creditCartMonths = data;
      }
    );

    this.shopFormService.getCreditCardYears().subscribe(
      data => {
        console.log("retrieved credit cart years" + JSON.stringify(data));
        this.creditCartYears = data;
      }
    );

    //populate countries
    this.shopFormService.getCountries().subscribe(
      data => {
        console.log("retrieved countries" + JSON.stringify(data));
        this.countries = data;
      }
    );

    this.cartItems = this.cartService.allCartItems;
    this.cartService.totalPrice.subscribe(data => this.totalPrice = data);
    this.cartService.totalQuantity.subscribe(data => this.totalQuantity = data);

    this.cartService.calculateCartTotals();

    this.listCartDetails();
  }

  listCartDetails() {
    this.cartItems = this.cartService.allCartItems;
    this.cartService.totalPrice.subscribe(data => this.totalPrice = data);
    this.cartService.totalQuantity.subscribe(data => this.totalQuantity = data);

    this.cartService.calculateCartTotals();
  }

  handleMonthAndYears(){
    const creditCardFormGroup = this.checkoutFormGroup.get('creditcard');
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup?.value.expirationYear);

    let startMonth: number;

    if(currentYear == selectedYear){
      startMonth = new Date().getMonth() + 1;
    }else{
      startMonth = 1;
    }

    this.shopFormService.getCreditCartMonths(startMonth).subscribe(
      data => {
        console.log("retrieved credit cart months" + JSON.stringify(data));
        this.creditCartMonths = data;
      }
    );
  }

  copyShippingToBillingAdress(event: any){
    if(event.target.checked){
      this.checkoutFormGroup.controls['billingAddress'].setValue(this.checkoutFormGroup.controls['shippingAddress'].value);

      //add bug fix code
      this.billingAddressStates = this.shippingAddressStates;
    }
    else{
      this.checkoutFormGroup.controls['billingAddress'].reset();

      //add bug fix code
      this.billingAddressStates = [];
    }
  }
  onSubmit() {
    console.log("Handling the submit button");
    console.log(this.checkoutFormGroup.get('customer')?.value);
    console.log(`The email address is ${this.checkoutFormGroup.get('customer')?.value.email}`);
    console.log(`The shippingAdress  is ${this.checkoutFormGroup.get('shippingAdress')?.value.state.Country.name}`);
  }

  getAllStates(formGroupName: string){
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode =formGroup?.value.country.code;
    const countryName =formGroup?.value.country.name;

    console.log(`the nameof formGroup: ${formGroup}`);
    console.log(countryCode);
    console.log(countryName);

    this.shopFormService.getStates(countryCode).subscribe(
      data => {
        if(formGroupName == 'shippingAddress'){
          this.shippingAddressStates = data;
        }else{
          this.billingAddressStates = data;
        }

        //default value
        formGroup?.get('state')?.setValue(data[0]);
      }
    );
  }  
}
