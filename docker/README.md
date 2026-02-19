# Self-hosted Supabase সেটআপ

## ১. প্রস্তুতি

```bash
cd docker
cp .env.example .env
```

## ২. .env ফাইল এডিট করুন

`POSTGRES_PASSWORD`, `JWT_SECRET` নিজের ভ্যালু দিন।

### ANON_KEY ও SERVICE_ROLE_KEY জেনারেট:

```bash
node -e "
const jwt = require('jsonwebtoken');
const secret = 'YOUR_JWT_SECRET_HERE';
console.log('ANON_KEY:', jwt.sign({ role: 'anon', iss: 'supabase', iat: Math.floor(Date.now()/1000), exp: Math.floor(Date.now()/1000) + 315360000 }, secret));
console.log('SERVICE_ROLE_KEY:', jwt.sign({ role: 'service_role', iss: 'supabase', iat: Math.floor(Date.now()/1000), exp: Math.floor(Date.now()/1000) + 315360000 }, secret));
"
```

## ৩. চালু করুন

```bash
docker compose up -d
```

## ৪. চেক করুন

- **API:** http://localhost:8000
- **Studio:** http://localhost:3000

## ৫. SMTP সেটআপ (ইমেইল ভেরিফিকেশন)

`.env` ফাইলে SMTP সেটিংস দিন এবং `MAILER_AUTOCONFIRM=false` করুন।

Gmail এর জন্য: Google Account → Security → App Passwords থেকে App Password জেনারেট করুন।

## ৬. Lovable প্রজেক্টে কানেক্ট

`src/lib/supabase.ts` এ অথবা environment variable হিসেবে সেট করুন:

- `VITE_SUPABASE_URL=http://localhost:8000`
- `VITE_SUPABASE_ANON_KEY=your-anon-key`
