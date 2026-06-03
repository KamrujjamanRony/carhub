import { RouterLink } from '@angular/router';
import { DataService } from './../../../services/data.service';
import { Component, inject } from '@angular/core';
import { CategoryService } from '../../../services/admin/category.service';

@Component({
    selector: 'app-categories',
    imports: [RouterLink],
    templateUrl: './categories.component.html',
    styleUrl: './categories.component.css'
})
export class CategoriesComponent {
    private CategoryService = inject(CategoryService);
    categories: any[] = [];
    ngOnInit() {
        this.CategoryService.getCategory().subscribe(data => {
            this.categories = data;
        });
    }

}
