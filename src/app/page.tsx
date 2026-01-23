import { client } from '../../sanity/lib/client'
import { siteSettingsQuery, teamMembersQuery, sectorsQuery, insightsQuery } from '../../sanity/lib/queries'
import PageClient from './page-client'

export const revalidate = 60 // Revalidate every 60 seconds

async function getData() {
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

export default async function Home() {
  const { settings, team, sectors, insights } = await getData()
  
  return (
    <PageClient 
      settings={settings} 
      team={team} 
      sectors={sectors} 
      insights={insights} 
    />
  )
}
