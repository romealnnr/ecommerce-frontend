import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CartItem } from 'src/app/common/cart-item';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { ShopFormService } from 'src/app/services/shop-form.service';
import { NnrShopValidators } from 'src/app/validators/nnr-shop-validators';

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
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), NnrShopValidators.notOnlyWhiteSpace]),
        lastName:  new FormControl('', [Validators.required, Validators.minLength(2), NnrShopValidators.notOnlyWhiteSpace]),
        email: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$')]),
      }),
      shippingAddress:  this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), NnrShopValidators.notOnlyWhiteSpace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), NnrShopValidators.notOnlyWhiteSpace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), NnrShopValidators.notOnlyWhiteSpace]),
      }),
      billingAddress:  this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), NnrShopValidators.notOnlyWhiteSpace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), NnrShopValidators.notOnlyWhiteSpace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), NnrShopValidators.notOnlyWhiteSpace]),
      }),
      creditCard:  this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2), NnrShopValidators.notOnlyWhiteSpace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]), //16 digits from 0 to 9
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),//3 digits from 0 to 9
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

  //getter methods to access the formControl 
  get firstName(){return this.checkoutFormGroup.get('customer.firstName');}
  get lastName(){return this.checkoutFormGroup.get('customer.lastName');}
  get email(){return this.checkoutFormGroup.get('customer.email');}

  get billingAddressStreet(){return this.checkoutFormGroup.get('billingAddress.street');}
  get billingAddressCity(){return this.checkoutFormGroup.get('billingAddress.city');}
  get billingAddressState(){return this.checkoutFormGroup.get('billingAddress.state');}
  get billingAddressCountry(){return this.checkoutFormGroup.get('billingAddress.country');}
  get billingAddressZipcode(){return this.checkoutFormGroup.get('billingAddress.zipCode');}

  get shippingAddressStreet(){return this.checkoutFormGroup.get('shippingAddress.street');}
  get shippingAddressCity(){return this.checkoutFormGroup.get('shippingAddress.city');}
  get shippingAddressState(){return this.checkoutFormGroup.get('shippingAddress.state');}
  get shippingAddressCountry(){return this.checkoutFormGroup.get('shippingAddress.country');}
  get shippingAddressZipcode(){return this.checkoutFormGroup.get('shippingAddress.zipCode');}

  get creditCardType(){return this.checkoutFormGroup.get('creditCard.type');}
  get creditCardNameOnCard(){return this.checkoutFormGroup.get('creditCard.nameOnCard');}
  get creditCardNumber(){return this.checkoutFormGroup.get('creditCard.cardNumber');}
  get creditCardSecurityCode(){return this.checkoutFormGroup.get('creditCard.securityCode');}


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
    if(this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
    }


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
