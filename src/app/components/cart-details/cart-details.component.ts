import { Component, OnInit } from '@angular/core';
import { Route } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent {

  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;

  constructor(private cartService: CartService){}

  ngOnInit(): void{
    this.listCartDetails();
  }

  listCartDetails() {
    this.cartItems = this.cartService.allCartItems;
    this.cartService.totalPrice.subscribe(data => this.totalPrice = data);
    this.cartService.totalQuantity.subscribe(data => this.totalQuantity = data);

    this.cartService.calculateCartTotals();
  }

  incrementQuantity(cart: CartItem){
    this.cartService.addToCart(cart);
  }

  decrementQuantity(cartItem: CartItem){
    this.cartService.decrementQuantity(cartItem);
  }

  removeCart(cartItem: CartItem){
    this.cartService.remove(cartItem);
  }
}
