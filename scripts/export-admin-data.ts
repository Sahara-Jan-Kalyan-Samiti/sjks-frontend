/**
 * Exports the data the admin panel (sjks-admin) needs from this website's source:
 *   - page-texts.json   every editable text of the website (the admin's "Website Pages" form is built from it)
 *   - portfolio.json    the read-only project portfolio shown in the admin
 *
 *   npm run export:admin -- ../sjks-admin/src/data/generated
 *
 * Run it whenever src/data/content/pageContent.ts or portfolio.ts changes, then commit the result in sjks-admin.
 */
import fs from "node:fs";
import path from "node:path";
import { pageTexts, PAGE_TEXT_MAX } from "../src/data/content/pageContent";
import { portfolio } from "../src/data/content/portfolio";

const outDir = path.resolve(process.argv[2] ?? "admin-data");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "page-texts.json"), JSON.stringify({ max: PAGE_TEXT_MAX, texts: pageTexts }, null, 2) + "\n");
fs.writeFileSync(path.join(outDir, "portfolio.json"), JSON.stringify(portfolio, null, 2) + "\n");
console.log(`Wrote ${pageTexts.length} page texts and ${portfolio.length} portfolio projects to ${outDir}`);
