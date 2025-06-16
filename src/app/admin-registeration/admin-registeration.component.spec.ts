import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRegisterationComponent } from './admin-registeration.component';

describe('AdminRegisterationComponent', () => {
  let component: AdminRegisterationComponent;
  let fixture: ComponentFixture<AdminRegisterationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminRegisterationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminRegisterationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
