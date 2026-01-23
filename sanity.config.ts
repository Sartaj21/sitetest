'use client'

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './sanity/schemaTypes'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'ltxsbbar'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export default defineConfig({
  name: 'm2pv-capital',
  title: 'M2PV Capital',
  
  projectId,
  dataset,
  
  basePath: '/studio',
  
  plugins: [structureTool()],
  
  schema: {
    types: schemaTypes,
  },
})
