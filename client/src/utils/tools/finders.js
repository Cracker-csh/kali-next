// IP LOOKUP
export const ipLookup = (ip) => {
  if (!ip) return 'Awaiting input...';
  // If user inputs random text, do a very basic check just to not completely break, but don't be overly strict
  if (!ip.includes('.')) return '❌ INVALID IP format. Please enter a valid IPv4 or IPv6 address.';
  
  return `✅ IP Lookup Results (Mock Data)\n\nIP Address: ${ip}\nCountry: United States\nCountry Code: US\nRegion: California\nCity: Mountain View\nLatitude: 37.4056\nLongitude: -122.0775\nTimezone: America/Los_Angeles\nISP: Google LLC\nOrganization: Google LLC\nASN: AS15169 Google LLC`;
};

// DNS LOOKUP
export const dnsLookup = (domain) => {
  if (!domain) return 'Awaiting input...';
  if (!domain.includes('.')) return '❌ INVALID Domain format.';

  return `✅ DNS Records for ${domain} (Mock Data)\n\n[A] 142.250.190.46 (TTL: 300)\n[AAAA] 2607:f8b0:4009:81b::200e (TTL: 300)\n[MX] smtp.google.com (Priority: 10, TTL: 3600)\n[NS] ns1.google.com (TTL: 86400)\n[TXT] "v=spf1 include:_spf.google.com ~all" (TTL: 3600)`;
};

// WHOIS LOOKUP
export const whoisLookup = (domain) => {
  if (!domain) return 'Awaiting input...';
  if (!domain.includes('.')) return '❌ INVALID Domain format.';

  return `✅ WHOIS Data for ${domain.toUpperCase()} (Mock Data)\n\nRegistry Domain ID: 2138514_DOMAIN_COM-VRSN\nRegistrar WHOIS Server: whois.markmonitor.com\nRegistrar URL: http://www.markmonitor.com\nUpdated Date: 2024-08-14T09:23:12Z\nCreation Date: 1997-09-15T04:00:00Z\nRegistry Expiry Date: 2028-09-14T04:00:00Z\nRegistrar: MarkMonitor Inc.\nRegistrar Abuse Contact Email: abusecomplaints@markmonitor.com\nRegistrar Abuse Contact Phone: +1.2083895740\nDomain Status: clientTransferProhibited\nName Server: NS1.GOOGLE.COM\nName Server: NS2.GOOGLE.COM\nDNSSEC: unsigned`;
};

// HTTP HEADER FINDER
export const parseHttpHeaders = async (url) => {
  if (!url) return 'Awaiting URL input (e.g. https://example.com)...';
  
  try {
    const validUrl = new URL(url.startsWith('http') ? url : `https://${url}`);
    
    // We use fetch to get headers. In a browser, CORS will likely block this for 3rd party sites,
    // so we handle the error gracefully without crashing.
    const response = await fetch(validUrl.href, { method: 'HEAD', mode: 'cors' });
    
    let headersStr = `✅ HTTP Headers for ${validUrl.host}:\n\nStatus: ${response.status} ${response.statusText}\n`;
    response.headers.forEach((value, key) => {
      headersStr += `${key}: ${value}\n`;
    });
    
    return headersStr;
  } catch (e) {
    return `⚠️ Could not fetch headers for ${url}\n\nReason: Network Error or CORS Policy restriction.\nNote: Browsers block direct fetching of headers from external sites unless they allow it via CORS. In a production app, this request should be routed through a backend proxy.\n\nError Details: ${e.message}`;
  }
};

// USER AGENT PARSER
export const parseUserAgent = (uaString) => {
  const agent = uaString || navigator.userAgent;
  
  let browser = 'Unknown Browser';
  if (agent.includes('Firefox')) browser = 'Firefox';
  else if (agent.includes('Edg')) browser = 'Edge';
  else if (agent.includes('Chrome')) browser = 'Chrome';
  else if (agent.includes('Safari')) browser = 'Safari';

  let os = 'Unknown OS';
  if (agent.includes('Win')) os = 'Windows';
  else if (agent.includes('Mac')) os = 'MacOS';
  else if (agent.includes('X11') || agent.includes('Linux')) os = 'Linux';
  else if (agent.includes('Android')) os = 'Android';
  else if (agent.includes('like Mac')) os = 'iOS';

  const isMobile = /Mobile|Android|iP(hone|od|ad)/.test(agent);

  return `✅ User Agent Details\n\nBrowser: ${browser}\nOperating System: ${os}\nDevice Type: ${isMobile ? 'Mobile/Tablet' : 'Desktop'}\nRaw UA String: ${agent}`;
};

// SCREEN INFO
export const getScreenInfo = () => {
  if (typeof window === 'undefined') return 'Not running in a browser environment.';
  
  return `✅ Screen & Window Information\n\nScreen Resolution: ${window.screen.width} x ${window.screen.height}\nAvailable Screen: ${window.screen.availWidth} x ${window.screen.availHeight}\nViewport Size: ${window.innerWidth} x ${window.innerHeight}\nColor Depth: ${window.screen.colorDepth}-bit\nPixel Ratio: ${window.devicePixelRatio}\nOrientation: ${window.screen.orientation ? window.screen.orientation.type : 'Unknown'}`;
};
