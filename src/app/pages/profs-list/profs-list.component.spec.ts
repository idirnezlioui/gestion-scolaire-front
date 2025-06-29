import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfsListComponent } from './profs-list.component';

describe('ProfsListComponent', () => {
  let component: ProfsListComponent;
  let fixture: ComponentFixture<ProfsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
