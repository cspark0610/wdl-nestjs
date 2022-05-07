import { Test, TestingModule } from '@nestjs/testing';
import { States } from 'src/common/states.enum';
import { WordleEvaluatorService } from 'src/utils/wordle-evaluator.service';

describe('WordleEvaluatorService', () => {
  let provider: WordleEvaluatorService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WordleEvaluatorService],
    }).compile();

    provider = module.get<WordleEvaluatorService>(WordleEvaluatorService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  describe('compareAndSetState function', () => {
    it('should evaluate correctly 1 correct letter', () => {
      const ICompareAndSetStateMock = {
        values: [
          States.Correct,
          States.Absent,
          States.Absent,
          States.Absent,
          States.Absent,
        ],
        letters: ['s', 'o', 'u', 'p', 'e'],
        intent: 'soupe',
      };
      const guess = 'soupe';
      const answer = 'silly';
      const result = provider.compareAndSetState(guess, answer);
      expect(result).toEqual(ICompareAndSetStateMock);
      expect(result.values).toStrictEqual(ICompareAndSetStateMock.values);
    });

    it('should evaluate more than 1 present letter', () => {
      const ICompareAndSetStateMock = {
        values: [
          States.Absent,
          States.Absent,
          States.Present,
          States.Present,
          States.Absent,
        ],
        letters: ['w', 'h', 'a', 'l', 'e'],
        intent: 'whale',
      };
      const guess = 'whale';
      const answer = 'ultra';
      const result = provider.compareAndSetState(guess, answer);
      expect(result).toEqual(ICompareAndSetStateMock);
      expect(result.values).toEqual(ICompareAndSetStateMock.values);
    });
    it('should not accept words of different lengths', () => {
      const guess = 'tet';
      const answer = 'ultra';
      expect(() => provider.compareAndSetState(guess, answer)).toThrowError(
        'The guess must be the same length as the answer',
      );
    });
  });
});
