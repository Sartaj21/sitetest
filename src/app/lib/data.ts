import { client } from '../../../sanity/lib/client'
import { siteSettingsQuery, teamMembersQuery, sectorsQuery, insightsQuery } from '../../../sanity/lib/queries'

export const revalidate = 60

export async function fetchSiteData() {
  try {
    const [settings, team, sectors, insights] = await Promise.all([
      client.fetch(siteSettingsQuery),
      client.fetch(teamMembersQuery),
      client.fetch(sectorsQuery),
      client.fetch(insightsQuery),
    ])
    return { settings, team, sectors, insights }
  } catch (error) {
    console.error('Error fetching from Sanity:', error)
    return { settings: null, team: [], sectors: [], insights: [] }
  }
}
