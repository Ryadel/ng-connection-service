import { TestBed, inject } from '@angular/core/testing';

import { ConnectionService } from './connection-service.service';

describe('HeartbeatService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConnectionService]
    });
  });

  it('should be created', inject([ConnectionService], (service: ConnectionService) => {
    expect(service).toBeTruthy();
  }));
});
