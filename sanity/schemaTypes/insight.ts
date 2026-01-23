import { defineType, defineField } from 'sanity'

export const insight = defineType({
  name: 'insight',
  title: 'Insight',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Market Analysis', value: 'Market Analysis' },
          { title: 'Investment Thesis', value: 'Investment Thesis' },
          { title: 'Industry Report', value: 'Industry Report' },
          { title: 'Policy Update', value: 'Policy Update' },
        ],
      },
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      description: 'Short preview text',
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'string',
      description: 'Display date (e.g., "Q4 2024")',
    }),
    defineField({
      name: 'readTime',
      title: 'Read Time',
      type: 'string',
      description: 'e.g., "5 min read"',
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Show as featured insight',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
    },
  },
})
