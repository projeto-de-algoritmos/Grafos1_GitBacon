import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BfsSearchComponent } from './bfs-search.component';

describe('ConsoleComponent', () => {
  let component: BfsSearchComponent;
  let fixture: ComponentFixture<BfsSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BfsSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BfsSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
