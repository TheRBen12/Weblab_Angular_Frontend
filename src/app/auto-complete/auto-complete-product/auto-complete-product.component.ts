import {
  AfterViewInit,
  Component,
  ElementRef, inject,
  Input,
  OnChanges,
  QueryList,
  SimpleChanges,
  ViewChildren
} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-auto-complete-product',
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './auto-complete-product.component.html',
  standalone: true,
  styleUrl: './auto-complete-product.component.css'
})
export class AutoCompleteProductComponent implements OnChanges, AfterViewInit{
  @Input() product: any
  @Input() textToMark: string = "";
  @ViewChildren('textAttribute') textAttributes!: QueryList<ElementRef>;
  router: Router = inject(Router);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);


  ngOnChanges(changes: SimpleChanges): void {
    const textToMark = changes["textToMark"]?.currentValue
    setTimeout(() => {
    }, 2000);

    if (textToMark != undefined && textToMark != "" && this.textAttributes) {
      this.textAttributes.forEach((attr) => {
        if (!attr.nativeElement.dataset.originalText) {
          attr.nativeElement.dataset.originalText = attr.nativeElement.innerText;
        }

        const originalText = attr.nativeElement.dataset.originalText;
        const regex = new RegExp(`(${textToMark})`, "gi");
        attr.nativeElement.innerHTML = originalText.replace(regex, `<mark>$1</mark>`);
      });

    } else {
      this.textAttributes?.forEach((attr) => {
        if (attr.nativeElement.dataset.originalText) {
          attr.nativeElement.innerHTML = attr.nativeElement.dataset.originalText;
        }
      });
    }
  }

  ngAfterViewInit(): void {

  }

  showProduct() {
    this.router.url;
    const childRoute = this.activatedRoute.firstChild;

    this.router.navigate(["/show/product/"+this.product.id], {relativeTo: childRoute});
  }
}
