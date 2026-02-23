import { client } from '../../../sanity/lib/client'
import { siteSettingsQuery, insightsQuery } from '../../../sanity/lib/queries'
import InsightsPageClient from './page-client'

export const revalidate = 60

export const metadata = {
  title: 'Insights | M2PV Capital',
  description: 'Latest perspectives on energy infrastructure, renewable energy, and sustainable investment.',
  alternates: {
    canonical: '/insights',
  },
}

async function getData() {
  try {
    const [settings, insights] = await Promise.all([
      client.fetch(siteSettingsQuery),
      client.fetch(insightsQuery),
    ])
    return { settings, insights }
  } catch (error) {
    console.error('Error fetching from Sanity:', error)
    return { settings: null, insights: [] }
  }
}

export default async function InsightsPage() {
  const { settings, insights } = await getData()
  return <InsightsPageClient settings={settings} insights={insights} />
}
