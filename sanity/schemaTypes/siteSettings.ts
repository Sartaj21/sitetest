import { defineType, defineField } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero Section' },
    { name: 'thesis', title: 'Thesis Section' },
    { name: 'ecosystem', title: 'Ecosystem Section' },
    { name: 'opportunityZone', title: 'Opportunity Zone' },
    { name: 'contact', title: 'Contact & Footer' },
    { name: 'styling', title: 'Colors & Styling' },
  ],
  fields: [
    // === HERO SECTION ===
    defineField({
      name: 'heroHeadline',
      title: 'Hero Headline',
      type: 'string',
      description: 'Main headline on the hero section',
      group: 'hero',
    }),
    defineField({
      name: 'heroSubheadline',
      title: 'Hero Subheadline',
      type: 'text',
      rows: 3,
      description: 'Subheadline text below the main headline',
      group: 'hero',
    }),
    defineField({
      name: 'heroTagline',
      title: 'Hero Tagline',
      type: 'string',
      description: 'Small text above the headline (e.g., "Private Equity · Energy Infrastructure")',
      group: 'hero',
    }),

    // === THESIS SECTION ===
    defineField({
      name: 'thesisTitle',
      title: 'Thesis Section Title',
      type: 'string',
      group: 'thesis',
    }),
    defineField({
      name: 'thesisDescription',
      title: 'Thesis Description',
      type: 'text',
      rows: 4,
      group: 'thesis',
    }),
    defineField({
      name: 'stat1Value',
      title: 'Stat 1 Value',
      type: 'string',
      description: 'e.g., "$2.3T"',
      group: 'thesis',
    }),
    defineField({
      name: 'stat1Label',
      title: 'Stat 1 Label',
      type: 'string',
      description: 'e.g., "Required Grid Investment by 2035"',
      group: 'thesis',
    }),
    defineField({
      name: 'stat2Value',
      title: 'Stat 2 Value',
      type: 'string',
      group: 'thesis',
    }),
    defineField({
      name: 'stat2Label',
      title: 'Stat 2 Label',
      type: 'string',
      group: 'thesis',
    }),
    defineField({
      name: 'stat3Value',
      title: 'Stat 3 Value',
      type: 'string',
      group: 'thesis',
    }),
    defineField({
      name: 'stat3Label',
      title: 'Stat 3 Label',
      type: 'string',
      group: 'thesis',
    }),
    defineField({
      name: 'stat4Value',
      title: 'Stat 4 Value',
      type: 'string',
      description: 'e.g., "8,764" for Opportunity Zones',
      group: 'thesis',
    }),
    defineField({
      name: 'stat4Label',
      title: 'Stat 4 Label',
      type: 'string',
      group: 'thesis',
    }),
    defineField({
      name: 'statsSource',
      title: 'Stats Source Citation',
      type: 'string',
      description: 'Source text shown below stats (e.g., "Sources: IRS, DOE, NREL")',
      group: 'thesis',
    }),

    // === ECOSYSTEM SECTION ===
    defineField({
      name: 'ecosystemTitle',
      title: 'Ecosystem Section Title',
      type: 'string',
      group: 'ecosystem',
    }),
    defineField({
      name: 'ecosystemDescription',
      title: 'Ecosystem Description',
      type: 'text',
      rows: 3,
      group: 'ecosystem',
    }),
    defineField({
      name: 'rotatingWords',
      title: 'Rotating Words',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Words that rotate in "The grid powers everything except for..."',
      group: 'ecosystem',
    }),

    // === OPPORTUNITY ZONE SECTION ===
    defineField({
      name: 'opportunityZoneTitle',
      title: 'Opportunity Zone Title',
      type: 'string',
      group: 'opportunityZone',
    }),
    defineField({
      name: 'opportunityZoneSubtitle',
      title: 'Opportunity Zone Subtitle',
      type: 'string',
      description: 'Small text above title (e.g., "Tax-Advantaged Structure")',
      group: 'opportunityZone',
    }),
    defineField({
      name: 'opportunityZoneDescription',
      title: 'Opportunity Zone Description',
      type: 'text',
      rows: 3,
      group: 'opportunityZone',
    }),
    defineField({
      name: 'opportunityZoneBullets',
      title: 'Opportunity Zone Bullet Points',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List of benefits/features',
      group: 'opportunityZone',
    }),
    defineField({
      name: 'opportunityZoneStatValue',
      title: 'Opportunity Zone Stat Value',
      type: 'string',
      description: 'e.g., "8,764"',
      group: 'opportunityZone',
    }),
    defineField({
      name: 'opportunityZoneStatLabel',
      title: 'Opportunity Zone Stat Label',
      type: 'string',
      description: 'e.g., "Designated Opportunity Zones in Target States"',
      group: 'opportunityZone',
    }),
    defineField({
      name: 'opportunityZoneLearnMoreUrl',
      title: 'Learn More URL',
      type: 'url',
      description: 'Link to IRS or external resource',
      group: 'opportunityZone',
    }),
    defineField({
      name: 'opportunityZoneLearnMoreText',
      title: 'Learn More Button Text',
      type: 'string',
      description: 'e.g., "Learn More at IRS.gov"',
      group: 'opportunityZone',
    }),

    // === CONTACT & FOOTER ===
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'contactPhone',
      title: 'Contact Phone',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'contactAddress',
      title: 'Contact Address',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'footerTagline',
      title: 'Footer Tagline',
      type: 'string',
      group: 'contact',
    }),
    defineField({
      name: 'footerDisclaimer',
      title: 'Footer Disclaimer',
      type: 'text',
      rows: 2,
      description: 'Legal disclaimer text',
      group: 'contact',
    }),

    // === COLORS & STYLING ===
    defineField({
      name: 'primaryColor',
      title: 'Primary Accent Color',
      type: 'string',
      description: 'Hex color (e.g., #ffffff for white accents)',
      group: 'styling',
    }),
    defineField({
      name: 'secondaryColor',
      title: 'Secondary Color',
      type: 'string',
      description: 'Hex color for secondary elements',
      group: 'styling',
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      description: 'Main background hex color (e.g., #0c0a09 for dark)',
      group: 'styling',
    }),
    defineField({
      name: 'headingFont',
      title: 'Heading Font',
      type: 'string',
      options: {
        list: [
          { title: 'Inter (Default)', value: 'Inter' },
          { title: 'Playfair Display', value: 'Playfair Display' },
          { title: 'Montserrat', value: 'Montserrat' },
          { title: 'Poppins', value: 'Poppins' },
          { title: 'Lora', value: 'Lora' },
        ],
      },
      group: 'styling',
    }),
    defineField({
      name: 'bodyFont',
      title: 'Body Font',
      type: 'string',
      options: {
        list: [
          { title: 'Inter (Default)', value: 'Inter' },
          { title: 'Open Sans', value: 'Open Sans' },
          { title: 'Roboto', value: 'Roboto' },
          { title: 'Lato', value: 'Lato' },
          { title: 'Source Sans Pro', value: 'Source Sans Pro' },
        ],
      },
      group: 'styling',
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
