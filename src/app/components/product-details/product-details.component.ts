import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { subscribeOn } from 'rxjs';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit{

  product!: Product;
  constructor(private productServce: ProductService,private cartService: CartService, private route: ActivatedRoute){}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.handleProductDetails();
    })
  }
  
  handleProductDetails() {
    //get the id and convert to a number
    const productid: number = +this.route.snapshot.paramMap.get('id')!;

    this.productServce.getProductById(productid).subscribe(
      data =>{
        this.product = data;
      }
    )
  }
  addToCart(){
    console.log(`Adding to cart: ${this.product.name}, ${this.product.unitPrice}`);

    const aCart = new CartItem(this.product);
    this.cartService.addToCart(aCart);
  }
}

