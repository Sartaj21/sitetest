import { groq } from 'next-sanity'

export const siteSettingsQuery = groq`*[_type == "siteSettings"][0]`

export const teamMembersQuery = groq`*[_type == "teamMember"] | order(order asc) {
  _id,
  name,
  title,
  bio,
  image,
  linkedIn,
  order
}`

export const sectorsQuery = groq`*[_type == "sector"] | order(order asc) {
  _id,
  name,
  shortDescription,
  fullDescription,
  icon,
  stats,
  order
}`

export const insightsQuery = groq`*[_type == "insight"] | order(order asc) {
  _id,
  title,
  category,
  excerpt,
  date,
  readTime,
  featured,
  order
}`
