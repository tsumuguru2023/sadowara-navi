import {defineCliConfig} from 'sanity/cli'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

export default defineCliConfig({
  api: {projectId, dataset},
  deployment: {autoUpdates: true},
  typegen: {
    path: './{app,sanity}/**/*.{ts,tsx,js,jsx}',
    schema: './sanity.schema.json',
    generates: './sanity.types.ts',
    overloadClientMethods: true,
  },
})
