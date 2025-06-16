import { Component } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-organic-product',
  templateUrl: './organic-product.component.html',
  styleUrls: ['./organic-product.component.css']
})
export class OrganicProductComponent {

constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

}
