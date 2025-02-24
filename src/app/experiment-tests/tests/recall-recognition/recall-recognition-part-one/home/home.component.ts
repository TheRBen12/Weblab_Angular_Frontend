import { Component } from '@angular/core';
import {ProductIndexComponent} from '../product-index/product-index.component';

@Component({
  selector: 'app-home',
  imports: [ProductIndexComponent],
  templateUrl: './home.component.html',
  standalone: true,
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
