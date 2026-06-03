import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCoverComponent } from './admin-cover.component';

describe('AdminCoverComponent', () => {
  let component: AdminCoverComponent;
  let fixture: ComponentFixture<AdminCoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCoverComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
