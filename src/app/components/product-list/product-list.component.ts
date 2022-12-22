import { Component , OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit{

  currentCategoryId: number = 1;
  products: Product[] = [];

  constructor(private productService: ProductService, 
              private route: ActivatedRoute){}

  ngOnInit(): void {
    //this.route.paramMap.subscribe permet dassocier le lien qui a active ce composant
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    })
    
  }
  
  listProducts() {
    //check if the id is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if(hasCategoryId){
      //sil ya un id, le recuperer et le convertir
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!; // + permet de convertir en number
    }else{
      //set category to 1
      this.currentCategoryId=1;
    }

    //get the products for the given category id

    this.productService.getProductList(this.currentCategoryId).subscribe(
      data => { this.products = data;}
    )
  }
}
