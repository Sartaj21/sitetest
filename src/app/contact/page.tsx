import { client } from '../../../sanity/lib/client'
import { siteSettingsQuery } from '../../../sanity/lib/queries'
import ContactPageClient from './page-client'

export const revalidate = 60

export const metadata = {
  title: 'Contact | M2PV Capital',
  description: 'Get in touch with M2PV Capital for investor relations and partnership inquiries.',
}

async function getData() {
  try {
    const settings = await client.fetch(siteSettingsQuery)
    return { settings }
  } catch (error) {
    console.error('Error fetching from Sanity:', error)
    return { settings: null }
  }
}

export default async function ContactPage() {
  const { settings } = await getData()
  return <ContactPageClient settings={settings} />
}
