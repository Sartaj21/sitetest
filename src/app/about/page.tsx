import { client } from '../../../sanity/lib/client'
import { siteSettingsQuery, teamMembersQuery } from '../../../sanity/lib/queries'
import AboutPageClient from './page-client'

export const revalidate = 60

export const metadata = {
    
  title: 'About | M2PV Capital',
  description: 'Learn about M2PV Capital — a leading energy infrastructure investment firm focused on the American Southwest.',
}

async function getData() {
  try {
    const [settings, team] = await Promise.all([
      client.fetch(siteSettingsQuery),
      client.fetch(teamMembersQuery),
    ])
    return { settings, team }
  } catch (error) {
    console.error('Error fetching from Sanity:', error)
    return { settings: null, team: [] }
  }
}

export default async function AboutPage() {
  const { settings, team } = await getData()
  return <AboutPageClient settings={settings} team={team} />
}
