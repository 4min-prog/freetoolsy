import fs from "node:fs";
import path from "node:path";
import { Resend } from "resend";

const ROOT = process.cwd();

function loadEnv(): Record<string, string> {
  const file = path.join(ROOT, ".env.local");
  if (!fs.existsSync(file)) return {};
  const out: Record<string, string> = {};
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (!m) continue;
    out[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
  return out;
}

type Args = {
  to: string[];
  subject: string;
  text: string;
  html: string;
  replyTo: string;
  send: boolean;
};

function parseArgs(argv: string[]): Args {
  const args: Args = { to: [], subject: "", text: "", html: "", replyTo: "", send: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => argv[++i] ?? "";
    if (a === "--to") args.to.push(next());
    else if (a === "--subject") args.subject = next();
    else if (a === "--text") args.text = next();
    else if (a === "--html") args.html = next();
    else if (a === "--file") args.text = fs.readFileSync(next(), "utf8");
    else if (a === "--reply-to") args.replyTo = next();
    else if (a === "--send") args.send = true;
    else if (a === "--help" || a === "-h") {
      console.log(USAGE);
      process.exit(0);
    } else {
      console.error(`Unknown argument: ${a}`);
      process.exit(1);
    }
  }
  return args;
}

const USAGE = `Usage:
  npm run send -- --to someone@site.com --subject "Subject" --text "Body" [--send]
  npm run send -- --to someone@site.com --subject "Subject" --file body.txt [--send]

Default is a DRY RUN: nothing is sent.
Add --send to actually deliver the email.

Optional:
  --html "<p>...</p>"   HTML body
  --reply-to address    reply-to address
`;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const args = parseArgs(process.argv.slice(2));

if (!args.to.length || !args.subject || !args.text.trim()) {
  console.error("Missing fields: --to, --subject and --text (or --file) are required.\n");
  console.error(USAGE);
  process.exit(1);
}

const invalid = args.to.filter((t) => !EMAIL_RE.test(t));
if (invalid.length) {
  console.error(`Invalid email address: ${invalid.join(", ")}`);
  process.exit(1);
}

const env = { ...loadEnv(), ...process.env } as Record<string, string>;
const apiKey = env.RESEND_API_KEY;
const from = env.CONTACT_FROM ?? "FreetoolsY <support@freetoolsy.com>";

if (!apiKey) {
  console.error("RESEND_API_KEY not found (.env.local or environment).");
  process.exit(1);
}

console.log("Mode    :", args.send ? "SEND" : "DRY RUN (no email sent)");
console.log("");
console.log("From    :", from);
console.log("To      :", args.to.join(", "));
console.log("Subject :", args.subject);
if (args.replyTo) console.log("Reply-To:", args.replyTo);
console.log("Format  :", args.html ? "text + html" : "plain text");
console.log("");
console.log("--- MESSAGE THE RECIPIENT WILL SEE ---");
console.log("");
console.log(args.text.replace(/\s+$/, ""));
console.log("");
console.log("--- END ---");

if (!args.send) {
  console.log("");
  console.log("No email was sent. Re-run with --send to deliver it.");
  process.exit(0);
}

const resend = new Resend(apiKey);
const { data, error } = await resend.emails.send({
  from,
  to: args.to,
  subject: args.subject,
  text: args.text,
  html: args.html || undefined,
  replyTo: args.replyTo || undefined,
});

if (error) {
  console.error("ERROR:", error.name, "-", error.message);
  process.exit(1);
}

console.log("");
console.log(`Sent. id=${data?.id}`);
