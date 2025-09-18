import { TestBed } from '@angular/core/testing';

import { ToastComponent } from './toast-component';

describe('ToastComponent', () => {
  let service: ToastComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastComponent);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
