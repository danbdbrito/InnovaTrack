import { TestBed } from '@angular/core/testing';

import { AuthenticaService } from './authentica.service';

describe('AuthenticaService', () => {
  let service: AuthenticaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthenticaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
