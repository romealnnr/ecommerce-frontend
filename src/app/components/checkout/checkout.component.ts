import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ShopFormService } from 'src/app/services/shop-form.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit{

  checkoutFormGroup!: FormGroup; //set of formcontrols or other groups...
  totalPrice: number = 0.00;
  totalQuantity: number = 0;
  creditCartYears: number[] = [];
  creditCartMonths: number[] = [];
  
  constructor(private formBuilder: FormBuilder, private shopFormService: ShopFormService){}
 
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
    }
    else{
      this.checkoutFormGroup.controls['billingAddress'].reset();
    }
  }
  onSubmit() {
    console.log("Handling the submit button");
    console.log(this.checkoutFormGroup.get('customer')?.value);
    console.log(`The email address is ${this.checkoutFormGroup.get('customer')?.value.email}`);
  }

 
}
