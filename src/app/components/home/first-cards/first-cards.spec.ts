import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstCards } from './first-cards';

describe('FirstCards', () => {
  let component: FirstCards;
  let fixture: ComponentFixture<FirstCards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirstCards],
    }).compileComponents();

    fixture = TestBed.createComponent(FirstCards);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
