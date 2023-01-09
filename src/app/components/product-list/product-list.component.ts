import { Component , OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit{

  currentCategoryId: number = 1;
  products: Product[] = [];
  searchMode: boolean = false;
  previousCategoryId: number = 1;
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;

  constructor(private productService: ProductService, 
              private cartService: CartService, 
              private route: ActivatedRoute){}

  ngOnInit(): void {
    //this.route.paramMap.subscribe permet dassocier le lien qui a active ce composant
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    })
    
  }
  
  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if(this.searchMode){
      this.handleSearchProducts();
    }
    else{
      this.handleListProducts();
    }
    
  }

  handleSearchProducts(){
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!; // "!" est pour dire quil peu etre null

    //now search for product using the keyword
    this.productService.searchProducts(theKeyword).subscribe(
      data => {
        this.products = data;
      }
    );
  }

  handleListProducts(){

     //check if the id is available
     const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

     if(hasCategoryId){
       //sil ya un id, le recuperer et le convertir
       this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!; // + permet de convertir en number
 
       if(this.currentCategoryId < 1 || this.currentCategoryId > 4){
         this.currentCategoryId = 1;
       }
     }else{
       this.currentCategoryId = 1;
     }
 
    
     //check if we have a different category than previous(angular will reuse the component if it is currently being in use)
     if(this.previousCategoryId != this.currentCategoryId){
      this.thePageNumber = 1;
     }

     this.previousCategoryId = this.currentCategoryId;
     console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`);

     //la page angular commence par 1 et resAPI par 0. pour besoin de mapping on a besoin de faire -1
     this.productService.getProductListPaginate(this.thePageNumber - 1, this.thePageSize, this.currentCategoryId)
      .subscribe(
       data => {
         this.products = data._embedded.products;
         this.thePageNumber = data.page.number + 1;
         this.thePageSize = data.page.size;
         this.theTotalElements = data.page.totalElements;
       }                                     
      );
  }

  updatePageSize(pageSize: string){
    this.thePageSize = +pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

  addToCart(theProduct: Product){
    console.log(`adding to cart: ${theProduct.name}, ${theProduct.unitPrice}`);

    const theCartItem = new CartItem(theProduct);

    this.cartService.addToCart(theCartItem);
  }
}
