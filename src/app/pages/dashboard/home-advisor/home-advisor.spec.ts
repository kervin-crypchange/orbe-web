import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeAdvisor } from './home-advisor';

describe('HomeAdvisor', () => {
  let component: HomeAdvisor;
  let fixture: ComponentFixture<HomeAdvisor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeAdvisor],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeAdvisor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
