
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: {
    ["https://local.hasura.local.nhost.run/v1/graphql"]: {
      headers: {
        "x-hasura-admin-secret": "nhost-admin-secret"
      }
    }
  },
  documents: "src/**/*",
  generates: {
    "src/gql/": {
      preset: "client",
      plugins: []
    }
  }
};

export default config;
