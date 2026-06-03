import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RattingReviewsComponent } from './ratting-reviews.component';

describe('RattingReviewsComponent', () => {
  let component: RattingReviewsComponent;
  let fixture: ComponentFixture<RattingReviewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RattingReviewsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RattingReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
