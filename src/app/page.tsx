import { client } from '../../sanity/lib/client'
import { siteSettingsQuery, sectorsQuery } from '../../sanity/lib/queries'
import PageClient from './page-client'

export const revalidate = 60 // Revalidate every 60 seconds

export const metadata = {
  title: 'AI Energy Infrastructure Private Equity',
  description: 'M2PV Capital deploys growth capital into solar PV plants and nuclear SMRs — powering AI and hyperscale data centers.',
  alternates: {
    canonical: '/',
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

export default async function Home() {
  const { settings, sectors } = await getData()

  return (
    <PageClient
      settings={settings}
      sectors={sectors}
    />
  )
}
