import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganicProductComponent } from './organic-product.component';

describe('OrganicProductComponent', () => {
  let component: OrganicProductComponent;
  let fixture: ComponentFixture<OrganicProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganicProductComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganicProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
