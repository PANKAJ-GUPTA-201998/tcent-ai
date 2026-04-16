/**
 * Local dev server — runs api/[...path].js as a plain Express server on port 3000.
 * Use this instead of `npx vercel dev` for faster local development.
 *
 * Run:  node dev.js
 */

require('dotenv').config({ path: '.env.local' });

const app = require('./api/[...path]');
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`\n  API running at http://localhost:${PORT}/api\n`);
});
