import { Component } from '@angular/core';
import { BdtPipe } from "../../../pipes/bdt.pipe";

@Component({
    selector: 'app-feature-product',
    imports: [BdtPipe],
    templateUrl: './feature-product.component.html',
    styleUrl: './feature-product.component.css'
})
export class FeatureProductComponent {

}
