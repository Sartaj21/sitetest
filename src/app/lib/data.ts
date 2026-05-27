import { client } from '../../../sanity/lib/client'
import { siteSettingsQuery, teamMembersQuery, sectorsQuery } from '../../../sanity/lib/queries'

export const revalidate = 60

export async function fetchSiteData() {
  try {
    const [settings, team, sectors] = await Promise.all([
      client.fetch(siteSettingsQuery),
      client.fetch(teamMembersQuery),
      client.fetch(sectorsQuery),
    ])
    return { settings, team, sectors }
  } catch (error) {
    console.error('Error fetching from Sanity:', error)
    return { settings: null, team: [], sectors: [] }
  }
}
