/**
 * Typoglycemia Text Scrambler
 * 
 * Rules:
 * 1. Words with 1-3 letters remain unchanged.
 * 2. Words with >3 letters retain their FIRST and LAST letter.
 * 3. All INTERNAL letters are shuffled.
 * 4. Punctuation and capitalization rules are preserved.
 */

// Fisher-Yates shuffle for an array of characters
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Scramble a single word token preserving leading/trailing punctuation
export function scrambleWord(token: string): string {
  if (!token || token.length <= 3) return token;

  // Extract leading punctuation (e.g. quotes, brackets)
  const leadingMatch = token.match(/^[^a-zA-Z0-9]+/);
  const leadingPunct = leadingMatch ? leadingMatch[0] : '';
  const restAfterLeading = token.slice(leadingPunct.length);

  // Extract trailing punctuation (e.g. .,!?":;)
  const trailingMatch = restAfterLeading.match(/[^a-zA-Z0-9]+$/);
  const trailingPunct = trailingMatch ? trailingMatch[0] : '';
  const coreWord = restAfterLeading.slice(0, restAfterLeading.length - trailingPunct.length);

  // If the core alphanumeric word is 3 letters or fewer, no internal shuffle needed
  if (coreWord.length <= 3) {
    return `${leadingPunct}${coreWord}${trailingPunct}`;
  }

  const firstLetter = coreWord[0];
  const lastLetter = coreWord[coreWord.length - 1];
  const middleLetters = coreWord.slice(1, -1).split('');

  // If there are at least 2 middle letters and they aren't all identical, shuffle them
  if (middleLetters.length > 1) {
    let shuffled = shuffleArray(middleLetters);
    // If by chance the shuffle resulted in the exact same order, try to reverse or swap once
    if (shuffled.join('') === middleLetters.join('') && new Set(middleLetters).size > 1) {
      shuffled = shuffled.reverse();
    }
    return `${leadingPunct}${firstLetter}${shuffled.join('')}${lastLetter}${trailingPunct}`;
  }

  return `${leadingPunct}${firstLetter}${middleLetters.join('')}${lastLetter}${trailingPunct}`;
}

/**
 * Scrambles an entire paragraph while preserving spaces, newlines, and punctuation.
 */
export function scrambleParagraph(text: string): string {
  // Split on whitespace while preserving line breaks and spaces
  return text
    .split(/(\s+)/)
    .map(part => {
      // If it's pure whitespace, return as is
      if (/^\s+$/.test(part)) return part;
      return scrambleWord(part);
    })
    .join('');
}
