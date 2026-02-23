import { client } from '../../../sanity/lib/client'
import { siteSettingsQuery, sectorsQuery } from '../../../sanity/lib/queries'
import SectorsPageClient from './page-client'

export const revalidate = 60

export const metadata = {
  title: 'Sectors | M2PV Capital',
  description: 'Explore our investment focus areas: Mobility, Digital Infrastructure, and Renewables.',
  alternates: {
    canonical: '/sectors',
  },
}

async function getData() {
  try {
    const [settings, sectors] = await Promise.all([
      client.fetch(siteSettingsQuery),
      client.fetch(sectorsQuery),
    ])
    return { settings, sectors }
  } catch (error) {
    console.error('Error fetching from Sanity:', error)
    return { settings: null, sectors: [] }
  }
}

export default async function SectorsPage() {
  const { settings, sectors } = await getData()
  return <SectorsPageClient settings={settings} sectors={sectors} />
}
