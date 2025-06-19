## Getting Started

First, run the development server:

```bash
nvm use 22
npm run dev
```

Create `.env.local` with the following:

```bash
NEXT_PUBLIC_SUBDOMAIN=local
NEXT_PUBLIC_REGION=local
GRAPHQL_ADMIN_SECRET='nhost-admin-secret'
# this is the only one you need to change
OPENAI_API_KEY=your-api-key
```

Open [http://localhost:3000](http://localhost:3000/companies) and click "sign up now" to start posting jobs.

After making changes to the [hasura backend](../backend/README.md), run the following command to generate API types:

```
npm run codegen
```
