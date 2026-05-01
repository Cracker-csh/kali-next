// Characters sets
const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

const MAX_WORDS = 5000;

function getRandomChar(charSet) {
  return charSet[Math.floor(Math.random() * charSet.length)];
}

// Mode 1: Random
export function generateRandom(options) {
  let charSet = '';
  if (options.useLower) charSet += LOWER;
  if (options.useUpper) charSet += UPPER;
  if (options.useNumbers) charSet += NUMBERS;
  if (options.useSymbols) charSet += SYMBOLS;
  if (options.customChars) charSet += options.customChars;

  if (!charSet) charSet = LOWER; // fallback

  const results = new Set();
  const count = Math.min(options.count || 20, MAX_WORDS);
  
  // Try to generate unique strings up to count
  let attempts = 0;
  while (results.size < count && attempts < count * 3) {
    let word = '';
    for (let i = 0; i < options.length; i++) {
      word += getRandomChar(charSet);
    }
    results.add(word);
    attempts++;
  }

  return Array.from(results).map(w => `${options.prefix}${w}${options.suffix}`);
}

// Mode 2: Pattern
export function generatePattern(options) {
  const { pattern, count, prefix, suffix } = options;
  if (!pattern) return [];

  const results = new Set();
  const numToGen = Math.min(count || 20, MAX_WORDS);

  let attempts = 0;
  while (results.size < numToGen && attempts < numToGen * 3) {
    let word = '';
    for (let char of pattern) {
      if (char === '@') word += getRandomChar(LOWER);
      else if (char === ',') word += getRandomChar(UPPER);
      else if (char === '%') word += getRandomChar(NUMBERS);
      else if (char === '^') word += getRandomChar(SYMBOLS);
      else if (char === '*') word += getRandomChar(LOWER + UPPER + NUMBERS);
      else word += char;
    }
    results.add(word);
    attempts++;
  }

  return Array.from(results).map(w => `${prefix}${w}${suffix}`);
}

// Mode 3: Mutate
const LEET_MAP = {
  a: '4', e: '3', i: '1', o: '0', s: '5', t: '7', b: '8', g: '9'
};

function applyMutations(word, transforms) {
  let variations = new Set([word]);

  if (transforms.case) {
    variations.add(word.toLowerCase());
    variations.add(word.toUpperCase());
    variations.add(word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
  }

  if (transforms.leet) {
    variations.forEach(v => {
      let leeted = v.split('').map(c => LEET_MAP[c.toLowerCase()] || c).join('');
      variations.add(leeted);
    });
  }

  if (transforms.reverse) {
    variations.forEach(v => {
      variations.add(v.split('').reverse().join(''));
    });
  }

  if (transforms.duplicate) {
    variations.forEach(v => {
      variations.add(v + v);
    });
  }

  if (transforms.numbers) {
    const temp = new Set(variations);
    temp.forEach(v => {
      ['1', '12', '123', '1234', '12345', '69', '99'].forEach(n => {
        variations.add(v + n);
      });
    });
  }

  if (transforms.years) {
    const temp = new Set(variations);
    temp.forEach(v => {
      ['2023', '2024', '2025', '2026'].forEach(y => {
        variations.add(v + y);
      });
    });
  }

  if (transforms.symbols) {
    const temp = new Set(variations);
    temp.forEach(v => {
      ['!', '@', '#', '$', '!!', '!@#'].forEach(s => {
        variations.add(v + s);
      });
    });
  }

  return Array.from(variations);
}

export function generateMutate(options) {
  const { words, transforms, prefix, suffix, minLen, maxLen } = options;
  if (!words || words.length === 0) return [];

  let results = [];
  for (let w of words) {
    if (results.length >= MAX_WORDS) break;
    const mutated = applyMutations(w, transforms);
    results = results.concat(mutated);
  }

  // Filter and limit
  results = results.filter(w => w.length >= minLen && w.length <= maxLen);
  results = [...new Set(results)].slice(0, MAX_WORDS);

  return results.map(w => `${prefix}${w}${suffix}`);
}

// Mode 4: Combine
export function generateCombine(options) {
  const { words, separators, minLen, maxLen, prefix, suffix } = options;
  if (!words || words.length < 2) return [];

  let results = new Set();

  for (let i = 0; i < words.length; i++) {
    for (let j = 0; j < words.length; j++) {
      if (i === j) continue; // Don't combine with itself unless duplicated intentionally? Let's skip self for now.
      if (results.size >= MAX_WORDS) break;
      
      separators.forEach(sep => {
        results.add(words[i] + sep + words[j]);
      });
    }
    if (results.size >= MAX_WORDS) break;
  }

  let finalArray = Array.from(results).filter(w => w.length >= minLen && w.length <= maxLen);
  return finalArray.map(w => `${prefix}${w}${suffix}`);
}

// Mode 5: Presets
const PRESETS = {
  seasonal: ['Summer', 'Winter', 'Spring', 'Autumn', 'Fall'],
  tech: ['admin', 'root', 'password', 'qwerty', '123456', 'system', 'server', 'network', 'dbadmin'],
  email: ['gmail', 'yahoo', 'hotmail', 'outlook', 'mail'],
  company: ['company', 'corp', 'inc', 'llc', 'enterprise'],
  names: ['john', 'mary', 'smith', 'admin', 'user', 'guest', 'test']
};

export function generatePresets(options) {
  const { presetKeys, prefix, suffix, minLen, maxLen } = options;
  
  let baseWords = [];
  presetKeys.forEach(k => {
    if (PRESETS[k]) {
      baseWords = baseWords.concat(PRESETS[k]);
    }
  });

  if (baseWords.length === 0) return [];

  // Apply a standard set of "typical" mutations for presets
  const transforms = { case: true, numbers: true, years: true, symbols: true, leet: false, reverse: false, duplicate: false };
  
  let results = [];
  for (let w of baseWords) {
    if (results.length >= MAX_WORDS) break;
    results = results.concat(applyMutations(w, transforms));
  }

  results = results.filter(w => w.length >= minLen && w.length <= maxLen);
  results = [...new Set(results)].slice(0, MAX_WORDS);

  return results.map(w => `${prefix}${w}${suffix}`);
}
