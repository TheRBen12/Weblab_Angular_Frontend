import {ProductType} from './product-category';

export interface Product {
  id: number;
  trademark: string;
  price: number,
  specifications: any[];
  type: ProductType,
}
