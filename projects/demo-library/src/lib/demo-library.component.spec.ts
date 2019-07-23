import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoLibraryComponent } from './demo-library.component';

describe('DemoLibraryComponent', () => {
  let component: DemoLibraryComponent;
  let fixture: ComponentFixture<DemoLibraryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoLibraryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
