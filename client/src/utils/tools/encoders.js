// ROT13 CIPHER
export const rot13 = (str) => {
  if (!str) return '';
  return str.replace(/[a-zA-Z]/g, (c) => {
    return String.fromCharCode(
      (c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26
    );
  });
};

// HTML ENCODER/DECODER
export const htmlConvert = (input, action) => {
  if (!input) return '';
  try {
    if (action === 'encode') {
      return input.replace(/[&<>'"]/g, 
        tag => ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          "'": '&#39;',
          '"': '&quot;'
        }[tag] || tag)
      );
    } else if (action === 'decode') {
      const doc = new DOMParser().parseFromString(input, "text/html");
      return doc.documentElement.textContent;
    }
  } catch (e) {
    return 'Error during conversion';
  }
  return '';
};

// JWT DECODER
export const decodeJWT = (token) => {
  if (!token) return 'Awaiting input...';
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return '❌ Invalid JWT format (needs 3 parts separated by dots)';
    
    const decodeBase64Url = (str) => {
      let output = str.replace(/-/g, '+').replace(/_/g, '/');
      switch (output.length % 4) {
        case 0: break;
        case 2: output += '=='; break;
        case 3: output += '='; break;
        default: throw new Error('Illegal base64url string!');
      }
      return decodeURIComponent(escape(atob(output)));
    };

    const header = JSON.parse(decodeBase64Url(parts[0]));
    const payload = JSON.parse(decodeBase64Url(parts[1]));

    return JSON.stringify({ Header: header, Payload: payload }, null, 2);
  } catch (e) {
    return `❌ Failed to decode JWT\\nError: ${e.message}`;
  }
};
