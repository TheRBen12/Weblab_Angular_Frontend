import { TestBed } from '@angular/core/testing';

import { RecallRecognitionExperimentTestService } from './recall-recognition-experiment-test.service';

describe('RecallRecognitionPartOneService', () => {
  let service: RecallRecognitionExperimentTestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecallRecognitionExperimentTestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
