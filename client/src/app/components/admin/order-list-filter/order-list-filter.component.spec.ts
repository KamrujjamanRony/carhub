import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderListFilterComponent } from './order-list-filter.component';

describe('OrderListFilterComponent', () => {
  let component: OrderListFilterComponent;
  let fixture: ComponentFixture<OrderListFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderListFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderListFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
