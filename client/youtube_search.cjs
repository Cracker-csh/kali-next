const https = require('https');
const search = (query) => new Promise((resolve) => {
  https.get('https://www.youtube.com/results?search_query=' + encodeURIComponent(query), (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const match = data.match(/"videoId":"([a-zA-Z0-9_-]{11})"/g);
      if (match) {
        // extract the actual IDs and resolve the first 3
        const ids = [...new Set(match.map(m => m.split('"')[3]))].slice(0, 3);
        resolve(query + ': ' + ids.join(', '));
      } else {
        resolve(query + ': Not found');
      }
    });
  });
});

Promise.all([
  search('Apna College Computer Networks'),
  search('WsCube Tech Ethical Hacking'),
  search('Geeky Shows Kali Linux'),
  search('Technical Suneja Nmap'),
  search('Hitesh Choudhary Cyber Security')
]).then(results => console.log(results.join('\n')));
