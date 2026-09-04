import { loadEnv, defineConfig } from '@medusajs/framework/utils'
import { join } from 'path'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

// Stripe is only registered once real credentials are set, so a missing/
// unconfigured .env doesn't break the payment module (and existing
// checkout) at boot.
const stripeEnabled = !!process.env.STRIPE_API_KEY

// Same reasoning - fall back to the built-in manual provider only if
// EasyPost isn't configured, rather than crashing on boot.
const easypostEnabled = !!process.env.EASYPOST_API_KEY

// Same reasoning - fall back to local disk storage if R2 isn't configured
// (e.g. local dev) rather than crashing on boot.
const r2Enabled =
  !!process.env.R2_ACCOUNT_ID &&
  !!process.env.R2_BUCKET &&
  !!process.env.R2_ACCESS_KEY_ID &&
  !!process.env.R2_SECRET_ACCESS_KEY &&
  !!process.env.R2_PUBLIC_BASE_URL

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    // Medusa v2 opens a separate Knex pool per module (20+ modules). With
    // default pool sizing that can exceed Postgres's max_connections on
    // startup even on a modest instance, causing "too many clients already".
    // Cap each module's pool small since nothing here needs high concurrency.
    databaseDriverOptions: {
      pool: {
        min: 0,
        max: 3,
      },
    },
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET,
      cookieSecret: process.env.COOKIE_SECRET,
    }
  },
  modules: [
    {
      // @medusajs/file-local defaults backend_url to
      // "http://localhost:9000/static" unconditionally when unconfigured -
      // fine for local dev, but it means uploaded file URLs (product
      // images, COA PDFs) are unreachable from any real client in
      // production unless this is set explicitly.
      //
      // upload_dir also defaults to `${process.cwd()}/static`, which is a
      // problem here: `medusa exec` (used by seed scripts) runs from the
      // project root, while the running server's WorkingDirectory is
      // .medusa/server - two different directories on disk, so anything
      // uploaded by a seed script is invisible to the running server.
      // .medusa/server is also fully deleted and rebuilt on every `medusa
      // build`, so pointing uploads there would lose them on every deploy
      // regardless. STATIC_UPLOAD_DIR pins both to one absolute path
      // outside .medusa/server that survives rebuilds.
      resolve: '@medusajs/medusa/file',
      options: {
        providers: [
          r2Enabled
            ? {
                resolve: '@medusajs/file-s3',
                id: 's3',
                options: {
                  // NOTE: the provider's actual runtime options are
                  // snake_case despite the published .d.ts using camelCase
                  // (S3FileServiceConfig) - confirmed against the compiled
                  // source (dist/services/s3-file.js), which reads
                  // options.access_key_id etc. Using the camelCase names
                  // from the type silently fails validation at boot.
                  file_url: process.env.R2_PUBLIC_BASE_URL,
                  access_key_id: process.env.R2_ACCESS_KEY_ID,
                  secret_access_key: process.env.R2_SECRET_ACCESS_KEY,
                  region: 'auto',
                  bucket: process.env.R2_BUCKET,
                  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
                  // No `|| 'coffee-demo/'` fallback here - that prefix was
                  // only needed while this bucket was shared with other
                  // projects. R2_PREFIX unset now means genuinely no
                  // prefix, not "fall back to the old shared-bucket path".
                  prefix: process.env.R2_PREFIX ?? '',
                  // R2 doesn't support per-object ACLs the way S3 does -
                  // access is controlled at the bucket level (public via
                  // r2.dev/custom domain, or private). Sending an ACL header
                  // causes R2 to reject the request, so disable it.
                  acl: false,
                },
              }
            : {
                resolve: '@medusajs/file-local',
                id: 'local',
                options: {
                  backend_url: `${process.env.BACKEND_URL || 'http://localhost:9000'}/static`,
                  upload_dir: process.env.STATIC_UPLOAD_DIR,
                  private_upload_dir: process.env.STATIC_UPLOAD_DIR
                    ? join(process.env.STATIC_UPLOAD_DIR, 'private')
                    : undefined,
                },
              },
        ],
      },
    },
    {
      resolve: '@medusajs/medusa/payment',
      options: {
        providers: [
          ...(stripeEnabled
            ? [
                {
                  resolve: '@medusajs/payment-stripe',
                  id: 'stripe',
                  options: {
                    apiKey: process.env.STRIPE_API_KEY,
                    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
                    capture: true,
                  },
                },
              ]
            : []),
        ],
      },
    },
    {
      resolve: '@medusajs/medusa/fulfillment',
      options: {
        providers: [
          {
            resolve: '@medusajs/fulfillment-manual',
            id: 'manual',
          },
          ...(easypostEnabled
            ? [
                {
                  resolve: './src/modules/easypost-fulfillment',
                  id: 'easypost',
                  options: {
                    apiKey: process.env.EASYPOST_API_KEY,
                  },
                },
              ]
            : []),
        ],
      },
    },
  ],
})
