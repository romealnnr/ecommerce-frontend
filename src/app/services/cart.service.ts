import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';
import { Product } from '../common/product';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  

  allCartItems: CartItem[] = [];
  totalPrice: Subject<number> = new BehaviorSubject<number>(0); //BehaviorSubject is a subclass of observable. we use it to save the lastest(has buffer for the last event) message/event and  send to new subscribers. 0 is the default initial value
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);
  //totalPrice: Subject<number> = new Subject<number>(); //subject is a subclass of observable. we use it to publish events in our code, and the event will be sent to all subscribers
  //totalQuantity: Subject<number> = new Subject<number>();


  constructor() { }

  addToCart(theCartItem: CartItem){
    //check if we already have the item in our cart
    let isInCart: boolean = false;
    let p = new Product("0","0","0","0",0,"0",false,0,new Date(),new Date());
    let existingCartItem: CartItem = new CartItem(p) ; //  let existingCartItem: CartItem = undefined

    if(this.allCartItems.length > 0){
      //find the item in the cart based on id
      for(let tempCartItem of this.allCartItems){
        //existingCartItem = this.allCartItems.find(aCart => aCart.id === theCartItem.id);  //it return undefined if nothing found
        if(tempCartItem.id == theCartItem.id){
          existingCartItem = tempCartItem;
          isInCart = true;
          break;
        }
      }
    }
    
    if(isInCart){
      existingCartItem.quantity++;
    } else{
      this.allCartItems.push(theCartItem);
    }

    this.calculateCartTotals();
  }

  calculateCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for(let cart of this.allCartItems){
      totalPriceValue += cart.quantity*cart.unitPrice;
      totalQuantityValue += cart.quantity
    }

    //publish the new values .... all subscribers will receive the nwe data (.next punlish and send events)
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    this.logCardData(totalPriceValue,totalQuantityValue);
  }
  
  logCardData(totalPriceValue: number, totalQuantityValue: number) {
    console.log('content of the cart');
    for(let cart of this.allCartItems){
      const subTotalPrice = cart.quantity*cart.unitPrice;
      console.log(`name: ${cart.name}, quantity: ${cart.quantity}, unitPrice: ${cart.unitPrice}`);
    }

    console.log(`totalprice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue}`); //give the result with 2 digits after decimal
  }

  decrementQuantity(cartItem: CartItem) {
    cartItem.quantity--;

    if(cartItem.quantity == 0){
      this.remove(cartItem);
    }
  }
  remove(AcartItem: CartItem) {
    const itemIndex = this.allCartItems.findIndex(cartItem => cartItem.id == AcartItem.id);

    if(itemIndex > -1){
      this.allCartItems.splice(itemIndex, 1);//remove one element in the index with number itemIndex

      this.calculateCartTotals();
    }
  }
}
