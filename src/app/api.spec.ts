import { TestBed } from '@angular/core/testing';
import { ApiService } from './api';   // ✅ correct import

describe('ApiService', () => {
  let service: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiService);  // ✅ inject correct service
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
