import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsIs } from './whats-is';

describe('WhatsIs', () => {
  let component: WhatsIs;
  let fixture: ComponentFixture<WhatsIs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhatsIs],
    }).compileComponents();

    fixture = TestBed.createComponent(WhatsIs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
