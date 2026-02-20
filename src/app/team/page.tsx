import { client } from '../../../sanity/lib/client'
import { siteSettingsQuery, teamMembersQuery } from '../../../sanity/lib/queries'
import TeamPageClient from './page-client'

export const revalidate = 60

export const metadata = {
  title: 'Team | M2PV Capital',
  description: 'Meet the experienced professionals behind M2PV Capital — leaders in energy infrastructure and private equity.',
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

export default async function TeamPage() {
  const { settings, team } = await getData()
  return <TeamPageClient settings={settings} team={team} />
}
