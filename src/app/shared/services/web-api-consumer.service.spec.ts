import { TestBed } from '@angular/core/testing';

import { WebApiConsumerService } from './web-api-consumer.service';

describe('WebApiConsumerService', () => {
  let service: WebApiConsumerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebApiConsumerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
