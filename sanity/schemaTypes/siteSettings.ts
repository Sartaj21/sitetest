import { defineType, defineField } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'heroHeadline',
      title: 'Hero Headline',
      type: 'string',
      description: 'Main headline on the hero section',
    }),
    defineField({
      name: 'heroSubheadline',
      title: 'Hero Subheadline',
      type: 'text',
      rows: 3,
      description: 'Subheadline text below the main headline',
    }),
    defineField({
      name: 'thesisTitle',
      title: 'Thesis Section Title',
      type: 'string',
    }),
    defineField({
      name: 'thesisDescription',
      title: 'Thesis Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'stat1Value',
      title: 'Stat 1 Value',
      type: 'string',
      description: 'e.g., "$2.3T"',
    }),
    defineField({
      name: 'stat1Label',
      title: 'Stat 1 Label',
      type: 'string',
      description: 'e.g., "Required Grid Investment by 2035"',
    }),
    defineField({
      name: 'stat2Value',
      title: 'Stat 2 Value',
      type: 'string',
    }),
    defineField({
      name: 'stat2Label',
      title: 'Stat 2 Label',
      type: 'string',
    }),
    defineField({
      name: 'stat3Value',
      title: 'Stat 3 Value',
      type: 'string',
    }),
    defineField({
      name: 'stat3Label',
      title: 'Stat 3 Label',
      type: 'string',
    }),
    defineField({
      name: 'ecosystemTitle',
      title: 'Ecosystem Section Title',
      type: 'string',
    }),
    defineField({
      name: 'ecosystemDescription',
      title: 'Ecosystem Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'rotatingWords',
      title: 'Rotating Words',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Words that rotate in "The grid powers everything except for..."',
    }),
    defineField({
      name: 'opportunityZoneTitle',
      title: 'Opportunity Zone Title',
      type: 'string',
    }),
    defineField({
      name: 'opportunityZoneDescription',
      title: 'Opportunity Zone Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
    }),
    defineField({
      name: 'contactPhone',
      title: 'Contact Phone',
      type: 'string',
    }),
    defineField({
      name: 'contactAddress',
      title: 'Contact Address',
      type: 'string',
    }),
    defineField({
      name: 'footerTagline',
      title: 'Footer Tagline',
      type: 'string',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Site Settings',
      }
    },
  },
})
