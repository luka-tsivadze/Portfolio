import { Pipe, PipeTransform } from '@angular/core';

export type Token =
  | { type: 'word'; chars: string[]; startIndex: number }
  | { type: 'space'; value: ' '; startIndex: number }
  | { type: 'newline'; value: '\n'; startIndex: number };

@Pipe({
  name: 'splitChars',
  standalone: true,
})
export class SplitCharsPipe implements PipeTransform {
  transform(value: string | null | undefined): Token[] {
    if (!value) return [];

    const tokens: Token[] = [];
    let currentWord: string[] = [];
    let charIndex = 0;

    const flushWord = () => {
      if (currentWord.length > 0) {
        tokens.push({
          type: 'word',
          chars: [...currentWord],
          startIndex: charIndex - currentWord.length,
        });
        currentWord = [];
      }
    };

    for (const ch of value) {
      if (ch === ' ') {
        flushWord();
        tokens.push({ type: 'space', value: ' ', startIndex: charIndex });
        charIndex++;
      } else if (ch === '\n') {
        flushWord();
        tokens.push({ type: 'newline', value: '\n', startIndex: charIndex });
        charIndex++;
      } else {
        currentWord.push(ch);
        charIndex++;
      }
    }

    flushWord();
    return tokens;
  }
}
