import CryptoJS from 'crypto-js';

// HASH GENERATOR
export const generateHash = (input, algorithm) => {
  if (!input) return '';
  switch (algorithm) {
    case 'MD5': return CryptoJS.MD5(input).toString();
    case 'SHA1': return CryptoJS.SHA1(input).toString();
    case 'SHA256': return CryptoJS.SHA256(input).toString();
    default: return '';
  }
};

// COLOR GENERATOR
export const generateColor = (format) => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  
  if (format === 'HEX') {
    const toHex = (n) => n.toString(16).padStart(2, '0').toUpperCase();
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }
  return `rgb(${r}, ${g}, ${b})`;
};

// REGEX GENERATOR (Preset patterns)
export const REGEX_PATTERNS = {
  Email: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
  URL: '^(https?:\\/\\/)?([\\da-z\\.-]+)\\.([a-z\\.]{2,6})([\\/\\w \\.-]*)*\\/?$',
  IPv4: '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$',
  Date: '^\\d{4}-\\d{2}-\\d{2}$',
  StrongPassword: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'
};

// BASE64 ENCODER/DECODER
export const base64Convert = (input, action) => {
  try {
    if (action === 'encode') return btoa(input);
    if (action === 'decode') return atob(input);
  } catch (e) {
    return 'Error: Invalid input for ' + action;
  }
  return '';
};

// URL ENCODER/DECODER
export const urlConvert = (input, action) => {
  try {
    if (action === 'encode') return encodeURIComponent(input);
    if (action === 'decode') return decodeURIComponent(input);
  } catch (e) {
    return 'Error: Invalid input for ' + action;
  }
  return '';
};

// HEX CONVERTER
export const hexConvert = (input, action) => {
  if (!input) return '';
  try {
    if (action === 'textToHex') {
      return Array.from(input).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');
    } else if (action === 'hexToText') {
      const hexes = input.replace(/[^0-9A-Fa-f]/g, '').match(/.{1,2}/g) || [];
      return hexes.map(h => String.fromCharCode(parseInt(h, 16))).join('');
    }
  } catch (e) {
    return 'Error during conversion';
  }
  return '';
};

// BINARY CONVERTER
export const binaryConvert = (input, action) => {
  if (!input) return '';
  try {
    if (action === 'textToBin') {
      return Array.from(input).map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
    } else if (action === 'binToText') {
      const bins = input.replace(/[^01]/g, '').match(/.{1,8}/g) || [];
      return bins.map(b => String.fromCharCode(parseInt(b, 2))).join('');
    }
  } catch (e) {
    return 'Error during conversion';
  }
  return '';
};

// JSON FORMATTER
export const formatJSON = (input) => {
  try {
    const obj = JSON.parse(input);
    return JSON.stringify(obj, null, 2);
  } catch (e) {
    return 'Error: Invalid JSON format';
  }
};

// NUMBER BASE CONVERTER
export const numberBaseConvert = (input, fromBase, toBase) => {
  if (!input) return '';
  try {
    const dec = parseInt(input, fromBase);
    if (isNaN(dec)) throw new Error();
    return dec.toString(toBase).toUpperCase();
  } catch (e) {
    return 'Error: Invalid number for base ' + fromBase;
  }
};

// CSV TO JSON
export const csvToJson = (csv) => {
  if (!csv) return '';
  try {
    const lines = csv.trim().split('\\n');
    if (lines.length < 2) return 'Error: CSV must have at least a header and one data row';
    const headers = lines[0].split(',').map(h => h.trim());
    const result = [];
    for (let i = 1; i < lines.length; i++) {
      const obj = {};
      const currentline = lines[i].split(',').map(v => v.trim());
      headers.forEach((header, index) => {
        obj[header] = currentline[index] || '';
      });
      result.push(obj);
    }
    return JSON.stringify(result, null, 2);
  } catch (e) {
    return 'Error: Invalid CSV format';
  }
};

// MARKDOWN TO HTML (basic)
export const markdownToHtml = (md) => {
  if (!md) return '';
  let html = md;
  // bold
  html = html.replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>');
  // italic
  html = html.replace(/\\*(.*?)\\*/g, '<em>$1</em>');
  // code
  html = html.replace(/`(.*?)`/g, '<code>$1</code>');
  // links
  html = html.replace(/\\[(.*?)\\]\\((.*?)\\)/g, '<a href="$2">$1</a>');
  // paragraphs
  html = html.split('\\n\\n').map(p => `<p>${p}</p>`).join('\\n');
  return html;
};
