import { RouterLink } from '@angular/router';
import { DataService } from './../../../services/data.service';
import { Component, inject, signal } from '@angular/core';
import { CategoryService } from '../../../services/admin/category.service';

interface HomeCategory {
  id?: number | string;
  name: string;
  image: string;
}

@Component({
  selector: 'app-categories',
  imports: [RouterLink],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent {
  private categoryService = inject(CategoryService);
  private dataService = inject(DataService);
  categories = signal<HomeCategory[]>([]);
  currentSlide = signal(0);
  cardsPerView = signal(4);

  private readonly fallbackCategoryImages = [
    'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80'
  ];

  private readonly imageByCategoryName: Record<string, string> = {
    suv: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80',
    sedan: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1200&q=80',
    electric: 'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?auto=format&fit=crop&w=1200&q=80',
    hybrid: 'https://images.unsplash.com/photo-1592853598062-53131f25efb6?auto=format&fit=crop&w=1200&q=80',
    premium: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    pickup: 'https://images.unsplash.com/photo-1502161254066-6c74afbf07aa?auto=format&fit=crop&w=1200&q=80'
  };

  ngOnInit() {
    this.updateCardsPerView();

    this.categoryService.getCategory().subscribe({
      next: (data) => {
        const mappedCategories = this.normalizeCategories(data);

        if (mappedCategories.length > 0) {
          this.categories.set(mappedCategories);
          return;
        }

        this.loadFallbackCategories();
      },
      error: () => {
        this.loadFallbackCategories();
      }
    });
  }

  onResize() {
    this.updateCardsPerView();
  }

  hasSliderControls(): boolean {
    return this.categories().length > this.cardsPerView();
  }

  prevSlide() {
    if (this.currentSlide() > 0) {
      this.currentSlide.update((value) => value - 1);
    }
  }

  nextSlide() {
    const maxSlide = this.getMaxSlide();
    if (this.currentSlide() < maxSlide) {
      this.currentSlide.update((value) => value + 1);
    }
  }

  getTrackTransform(): string {
    const shift = this.currentSlide() * (100 / this.cardsPerView());
    return `translateX(-${shift}%)`;
  }

  cardsPerViewStyle(): string {
    return String(this.cardsPerView());
  }

  isPrevDisabled(): boolean {
    return this.currentSlide() <= 0;
  }

  isNextDisabled(): boolean {
    return this.currentSlide() >= this.getMaxSlide();
  }

  onImageError(index: number) {
    const items = [...this.categories()];
    const fallback = this.fallbackCategoryImages[index % this.fallbackCategoryImages.length];

    if (!items[index]) {
      return;
    }

    items[index] = {
      ...items[index],
      image: fallback
    };

    this.categories.set(items);
  }

  private loadFallbackCategories() {
    this.dataService.getCategories().subscribe((data) => {
      this.categories.set(this.normalizeCategories(data));
    });
  }

  private normalizeCategories(payload: any): HomeCategory[] {
    const source = Array.isArray(payload)
      ? payload
      : payload?.$values ?? payload?.data ?? payload?.items ?? [];

    if (!Array.isArray(source)) {
      return [];
    }

    return source
      .map((item: any, index: number) => {
        const name = item?.name || item?.title || item?.category || '';

        if (!name) {
          return null;
        }

        return {
          id: item?.id,
          name,
          image: this.resolveCategoryImage(item?.image, name, index)
        } as HomeCategory;
      })
      .filter((item: HomeCategory | null): item is HomeCategory => item !== null);
  }

  private resolveCategoryImage(image: string | undefined, name: string, index: number): string {
    const fallbackImage = this.fallbackCategoryImages[index % this.fallbackCategoryImages.length];
    const normalizedName = name.toLowerCase();
    const categoryImage = this.imageByCategoryName[normalizedName];

    if (!image) {
      return categoryImage || fallbackImage;
    }

    const isPlaceholderAsset = image.startsWith('/assets/images/category/');
    const isRemoteImage = image.startsWith('http://') || image.startsWith('https://');

    if (isPlaceholderAsset) {
      return categoryImage || fallbackImage;
    }

    if (!isRemoteImage) {
      return categoryImage || fallbackImage;
    }

    return image;
  }

  private updateCardsPerView() {
    const width = window.innerWidth;

    if (width < 640) {
      this.cardsPerView.set(1);
    } else if (width < 1024) {
      this.cardsPerView.set(2);
    } else if (width < 1280) {
      this.cardsPerView.set(3);
    } else {
      this.cardsPerView.set(4);
    }

    const maxSlide = this.getMaxSlide();
    if (this.currentSlide() > maxSlide) {
      this.currentSlide.set(maxSlide);
    }
  }

  private getMaxSlide(): number {
    const total = this.categories().length;
    const view = this.cardsPerView();

    if (total <= view) {
      return 0;
    }

    return total - view;
  }

}
