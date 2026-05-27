import { groq } from 'next-sanity'

export const siteSettingsQuery = groq`*[_type == "siteSettings"][0]`

export const teamMembersQuery = groq`*[_type == "teamMember"] | order(order asc) {
  _id,
  name,
  title,
  role,
  bio,
  education,
  image,
  imagePosition,
  linkedIn,
  order
}`

export const sectorsQuery = groq`*[_type == "sector"] | order(order asc) {
  _id,
  name,
  shortDescription,
  fullDescription,
  coverImage,
  icon,
  stats,
  order
}`
