// EMAIL VALIDATOR
export const validateEmail = (email) => {
  if (!email) return 'Awaiting input...';
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (re.test(email)) return '✅ VALID Email Address\n\n' + email;
  return '❌ INVALID Email Address';
};

// PASSWORD STRENGTH CHECKER
export const checkPasswordStrength = (password) => {
  if (!password) return 'Awaiting input...';
  
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  
  if (password.length < 6) {
    return '❌ WEAK: Password is too short (Must be at least 6 characters).';
  }
  
  if (hasLetter && hasUpper && hasNumber && hasSpecial && password.length >= 8) {
    return '✅ STRONG: Great password! Contains letters, numbers, uppercase, and special characters.';
  }
  
  if (hasLetter && hasNumber) {
    return '⚠️ MEDIUM: Good, but consider adding uppercase letters and special characters for maximum security.';
  }
  
  return '❌ WEAK: Very predictable. Add a mix of letters, numbers, and symbols.';
};

// SSL CHECKER (Mock)
export const checkSSL = (domain) => {
  if (!domain) return 'Awaiting input...';
  if (!domain.includes('.')) return '❌ INVALID Domain format';
  return `✅ SSL is VALID (Mock Data)\n\nDomain: ${domain}\nIssuer: Let's Encrypt Authority X3\nValid From: 2024-01-01\nValid To: 2024-04-01\nDays Remaining: 45\nProtocol: TLS 1.3\nCipher: TLS_AES_256_GCM_SHA384`;
};

// TIMESTAMP CONVERTER
export const convertTimestamp = (ts) => {
  if (!ts) return 'Awaiting input...';
  let num = parseInt(ts, 10);
  if (isNaN(num)) return '❌ INVALID Timestamp format';
  
  // If timestamp is reasonably small (e.g. UNIX seconds), convert to milliseconds
  if (num < 10000000000) num *= 1000;
  
  const d = new Date(num);
  if (isNaN(d.getTime())) return '❌ INVALID Date parsed from timestamp';
  
  return `✅ VALID Timestamp\n\nInput: ${ts}\nUTC: ${d.toUTCString()}\nLocal: ${d.toLocaleString()}\nISO: ${d.toISOString()}`;
};

// JSON VALIDATOR
export const validateJSON = (input) => {
  if (!input) return 'Awaiting input...';
  try {
    const parsed = JSON.parse(input);
    return `✅ VALID JSON\n\n${JSON.stringify(parsed, null, 2)}`;
  } catch (e) {
    return `❌ INVALID JSON\n\nError: ${e.message}`;
  }
};

// REGEX TESTER
export const testRegex = (regexStr, testString) => {
  if (!regexStr || !testString) return 'Awaiting both regex and test string...';
  try {
    let regex;
    // Support regex wrapped in slashes
    if (regexStr.startsWith('/')) {
      const parts = regexStr.match(/^\/(.*?)\/([gimy]*)$/);
      if (parts) {
        regex = new RegExp(parts[1], parts[2]);
      } else {
        regex = new RegExp(regexStr);
      }
    } else {
      regex = new RegExp(regexStr);
    }
    
    const isMatch = regex.test(testString);
    const matches = testString.match(regex);
    
    if (isMatch) {
      return `✅ MATCH FOUND\n\nMatches:\n${JSON.stringify(matches, null, 2)}`;
    } else {
      return '❌ NO MATCH';
    }
  } catch (e) {
    return `❌ INVALID Regex\n\nError: ${e.message}`;
  }
};

// CARD NUMBER VALIDATOR (Luhn Algorithm)
export const validateCard = (number) => {
  if (!number) return 'Awaiting input...';
  const clean = number.replace(/\D/g, '');
  if (!clean || clean.length < 13 || clean.length > 19) {
    return '❌ INVALID Card format (Must be 13-19 digits)';
  }
  
  let sum = 0;
  let isEven = false;
  for (let i = clean.length - 1; i >= 0; i--) {
    let digit = parseInt(clean.charAt(i), 10);
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    isEven = !isEven;
  }
  
  if (sum % 10 === 0) {
    return `✅ VALID Card\n\nNumber passes the Luhn Algorithm check.`;
  } else {
    return '❌ INVALID Card\n\nFails Luhn Algorithm validation.';
  }
};

// IP ADDRESS VALIDATOR
export const validateIP = (ip) => {
  if (!ip) return 'Awaiting input...';
  // Strict IPv4 validation
  const ipv4 = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  // Simple IPv6 validation
  const ipv6 = /^[0-9a-fA-F:]+$/;
  
  if (ipv4.test(ip)) {
    return `✅ VALID IPv4 Address\n\n${ip}`;
  }
  if (ipv6.test(ip) && ip.includes(':')) {
    return `✅ VALID IPv6 Address\n\n${ip}`;
  }
  
  return '❌ INVALID IP Address';
};
