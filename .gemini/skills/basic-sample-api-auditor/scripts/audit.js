const url = process.argv[2];

if (!url) {
  console.error('Usage: node audit.js <url>');
  process.exit(1);
}

console.log(`Auditing ${url}...`);
fetch(url, { method: 'HEAD' })
  .then((r) => console.log(`Result: Success (Status ${r.status})`))
  .catch((e) => console.error(`Result: Failed (${e.message})`));
