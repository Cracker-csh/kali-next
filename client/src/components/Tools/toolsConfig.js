import {
  generateHash, generateColor, REGEX_PATTERNS, base64Convert, urlConvert, hexConvert, binaryConvert, formatJSON, numberBaseConvert, csvToJson, markdownToHtml
} from '../../utils/tools/converters';
import {
  ipLookup, dnsLookup, whoisLookup, parseHttpHeaders, parseUserAgent, getScreenInfo
} from '../../utils/tools/finders';
import {
  validateEmail, checkPasswordStrength, checkSSL, convertTimestamp, validateJSON, testRegex, validateCard, validateIP
} from '../../utils/tools/checkers';
import {
  rot13, htmlConvert, decodeJWT
} from '../../utils/tools/encoders';
import {
  analyzeText, analyzeURL
} from '../../utils/tools/analyzers';

export const toolsConfig = [
  {
    category: "CONVERTERS",
    icon: "🔄",
    tools: [
      { id: 'hash', name: 'Hash Generator', type: 'select', options: ['MD5', 'SHA1', 'SHA256'], handler: generateHash, placeholder: 'Enter text to hash...' },
      { id: 'color', name: 'Color Generator', type: 'button_only', options: ['HEX', 'RGB'], handler: generateColor, noInput: true },
      { id: 'regex', name: 'Regex Generator', type: 'button_only', options: Object.keys(REGEX_PATTERNS), handler: (format) => REGEX_PATTERNS[format], noInput: true },
      { id: 'base64', name: 'Base64 Convert', type: 'action_buttons', options: ['encode', 'decode'], handler: base64Convert, placeholder: 'Enter text or base64...' },
      { id: 'urlenc', name: 'URL Convert', type: 'action_buttons', options: ['encode', 'decode'], handler: urlConvert, placeholder: 'Enter text or url...' },
      { id: 'hex', name: 'Hex Convert', type: 'action_buttons', options: ['textToHex', 'hexToText'], handler: hexConvert, placeholder: 'Enter text or hex...' },
      { id: 'binary', name: 'Binary Convert', type: 'action_buttons', options: ['textToBin', 'binToText'], handler: binaryConvert, placeholder: 'Enter text or binary...' },
      { id: 'jsonfmt', name: 'JSON Formatter', type: 'single_action', actionLabel: 'Format', handler: formatJSON, placeholder: 'Enter raw JSON...' },
      { id: 'baseconv', name: 'Base Converter', type: 'base_convert', handler: numberBaseConvert, placeholder: 'Enter number...' },
      { id: 'csv2json', name: 'CSV to JSON', type: 'single_action', actionLabel: 'Convert', handler: csvToJson, placeholder: 'col1,col2\\nval1,val2' },
      { id: 'md2html', name: 'Markdown to HTML', type: 'single_action', actionLabel: 'Convert', handler: markdownToHtml, placeholder: '# Hello\\n**Bold**' }
    ]
  },
  {
    category: "FINDERS",
    icon: "🔍",
    tools: [
      { id: 'ip', name: 'IP Lookup', type: 'single_action', actionLabel: 'Lookup', handler: ipLookup, placeholder: 'Enter IP address (e.g. 8.8.8.8)' },
      { id: 'dns', name: 'DNS Lookup', type: 'single_action', actionLabel: 'Lookup', handler: dnsLookup, placeholder: 'Enter domain (e.g. google.com)' },
      { id: 'whois', name: 'WHOIS Lookup', type: 'single_action', actionLabel: 'Lookup', handler: whoisLookup, placeholder: 'Enter domain (e.g. markmonitor.com)' },
      { id: 'headers', name: 'HTTP Headers', type: 'single_action', actionLabel: 'Parse', handler: parseHttpHeaders, placeholder: 'Paste raw HTTP headers...' },
      { id: 'ua', name: 'User Agent Parser', type: 'single_action', actionLabel: 'Parse', handler: parseUserAgent, placeholder: 'Leave blank for current browser...' },
      { id: 'screen', name: 'Screen Info', type: 'button_only', options: ['Get Info'], handler: getScreenInfo, noInput: true }
    ]
  },
  {
    category: "CHECKERS",
    icon: "✅",
    tools: [
      { id: 'emailval', name: 'Email Validator', type: 'realtime', handler: validateEmail, placeholder: 'Enter email address...' },
      { id: 'passstr', name: 'Password Strength', type: 'realtime', handler: checkPasswordStrength, placeholder: 'Enter password...' },
      { id: 'sslchk', name: 'SSL Checker', type: 'single_action', actionLabel: 'Check SSL', handler: checkSSL, placeholder: 'Enter domain...' },
      { id: 'timestamp', name: 'Timestamp Conv', type: 'realtime', handler: convertTimestamp, placeholder: 'Enter unix timestamp...' },
      { id: 'jsonval', name: 'JSON Validator', type: 'realtime', handler: validateJSON, placeholder: 'Enter JSON to validate...' },
      { id: 'regextst', name: 'Regex Tester', type: 'regex_tester', handler: testRegex, placeholder: 'String to test against regex...' },
      { id: 'cardval', name: 'Card Validator', type: 'realtime', handler: validateCard, placeholder: 'Enter card number (Luhn check)...' },
      { id: 'ipval', name: 'IP Validator', type: 'realtime', handler: validateIP, placeholder: 'Enter IP address...' }
    ]
  },
  {
    category: "ENCODERS",
    icon: "🔐",
    tools: [
      { id: 'rot13', name: 'ROT13 Cipher', type: 'realtime', handler: rot13, placeholder: 'Enter text to ROT13...' },
      { id: 'htmlenc', name: 'HTML Encode/Decode', type: 'action_buttons', options: ['encode', 'decode'], handler: htmlConvert, placeholder: 'Enter HTML or Text...' },
      { id: 'jwtdec', name: 'JWT Decoder', type: 'realtime', handler: decodeJWT, placeholder: 'Paste JWT token...' }
    ]
  },
  {
    category: "ANALYZERS",
    icon: "📊",
    tools: [
      { id: 'txtanal', name: 'Text Analyzer', type: 'realtime', handler: analyzeText, placeholder: 'Type or paste text to analyze...' },
      { id: 'urlanal', name: 'URL Analyzer', type: 'realtime', handler: analyzeURL, placeholder: 'Enter full URL...' }
    ]
  }
];
