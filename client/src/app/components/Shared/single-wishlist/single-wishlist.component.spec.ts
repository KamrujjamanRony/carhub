import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleWishlistComponent } from './single-wishlist.component';

describe('SingleWishlistComponent', () => {
  let component: SingleWishlistComponent;
  let fixture: ComponentFixture<SingleWishlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleWishlistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleWishlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
