import { Component } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-product-index',
  imports: [],
  templateUrl: './product-index.component.html',
  standalone: true,
  styleUrl: './product-index.component.css'
})
export class ProductIndexComponent {
  title: string | undefined = "";
  constructor(private route: ActivatedRoute) {
    this.title = this.route.snapshot.title;
  }
}
