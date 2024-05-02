import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubSettingsComponent } from './sub-settings.component';

describe('SubSettingsComponent', () => {
  let component: SubSettingsComponent;
  let fixture: ComponentFixture<SubSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubSettingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
