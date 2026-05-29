import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Algorithms } from './algorithms';

describe('Algorithms', () => {
  let component: Algorithms;
  let fixture: ComponentFixture<Algorithms>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Algorithms],
    }).compileComponents();

    fixture = TestBed.createComponent(Algorithms);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
