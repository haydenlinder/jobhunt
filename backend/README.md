## Install Nhost CLI
```
sudo curl -L https://raw.githubusercontent.com/nhost/cli/main/get.sh | bash
```

# Add secrets
First, create a `.secrets` file in this folder with the following:
```
GRAFANA_ADMIN_PASSWORD = 'grafana-admin-password'
HASURA_GRAPHQL_ADMIN_SECRET = 'nhost-admin-secret'
HASURA_GRAPHQL_JWT_SECRET = '0f987876650b4a085e64594fae9219e7781b17506bec02489ad061fba8cb22db'
NHOST_WEBHOOK_SECRET = 'nhost-webhook-secret'
```

## Start
```
nhost up
```

URLs:
- Postgres:         postgres://postgres:postgres@localhost:5432/local
- Hasura:           https://local.hasura.local.nhost.run
- GraphQL:          https://local.graphql.local.nhost.run
- Auth:             https://local.auth.local.nhost.run
- Storage:          https://local.storage.local.nhost.run
- Functions:        https://local.functions.local.nhost.run
- Dashboard:        https://local.dashboard.local.nhost.run
- Mailhog:          https://local.mailhog.local.nhost.run


Any changes to the Hasura console will automatically be source-controlled with migrations and metadata.