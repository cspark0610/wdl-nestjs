import { Injectable } from '@nestjs/common';
import { States } from 'src/common/states.enum';

export interface ICompareAndSetState {
  values: States[];
  letters: string[];
  intent: string;
}
@Injectable()
export class WordleEvaluatorService {
  compareAndSetState(guess: string, answer: string): ICompareAndSetState {
    if (guess.length !== answer.length) {
      throw new Error('The guess must be the same length as the answer');
    }
    const answerLettersArray: string[] = answer.split('');
    const values: States[] = [];
    const letters: string[] = guess.split('');

    for (let i = 0; i < guess.length; i++) {
      if (guess[i] === answer[i]) {
        ///coincide la letra y el index, status Correct
        values.push(States.Correct);
      }
      if (guess[i] != answer[i] && !answerLettersArray.includes(guess[i])) {
        //no coindice la letra y ademas no esta en el answer, status Absent
        values.push(States.Absent);
      }
      if (guess[i] != answer[i] && answerLettersArray.includes(guess[i])) {
        //no coindice la letra pero la misma esta presente en answer
        values.push(States.Present);
      }
    }
    return {
      values,
      letters,
      intent: guess.trim(),
    };
  }
}
