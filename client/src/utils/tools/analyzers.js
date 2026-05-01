// TEXT ANALYZER
export const analyzeText = (text) => {
  if (!text) return 'Awaiting input...';
  
  const charCount = text.length;
  const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const lineCount = text.split('\n').length;
  const spaceCount = (text.match(/ /g) || []).length;
  const byteCount = new Blob([text]).size;
  
  return `✅ Text Analysis Results\n\nCharacters: ${charCount}\nWords: ${wordCount}\nLines: ${lineCount}\nSpaces: ${spaceCount}\nSize (Bytes): ${byteCount}`;
};

// URL ANALYZER
export const analyzeURL = (urlStr) => {
  if (!urlStr) return 'Awaiting input...';
  try {
    // Attempt to parse the URL natively
    const url = new URL(urlStr.startsWith('http') ? urlStr : `https://${urlStr}`);
    
    const params = {};
    for (const [key, value] of url.searchParams.entries()) {
      params[key] = value;
    }

    return `✅ VALID URL\n\n${JSON.stringify({
      Href: url.href,
      Protocol: url.protocol,
      Host: url.host,
      Hostname: url.hostname,
      Port: url.port || (url.protocol === 'https:' ? '443' : '80'),
      Pathname: url.pathname,
      Search: url.search,
      Hash: url.hash,
      QueryParams: params
    }, null, 2)}`;
  } catch (e) {
    return `❌ INVALID URL\n\nError: ${e.message}`;
  }
};
