import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent implements OnInit {
  @Input() product: any;

  ngOnInit() {
  }

  onImageError(event: any) {
    event.target.src = 'assets/default.png';
  }
}
