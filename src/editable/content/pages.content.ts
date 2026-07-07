import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const pagesContent = {
  home: {
    metadata: {
      title: 'Stories worth reading, curated by our community',
      description: 'A home for handpicked articles, creator voices, and stories from writers around the world.',
      openGraphTitle: 'Stories worth reading, curated by our community',
      openGraphDescription: 'A home for handpicked articles, creator voices, and stories from writers around the world.',
      keywords: ['stories', 'articles', 'publishing', 'creators'],
    },
    hero: {
      badge: 'Top Picks',
      title: ['Hand', 'Picked'],
      description: 'A curated stream of stories, essays, and creator features from the community.',
      primaryCta: { label: 'Start Writing', href: '/create' },
      secondaryCta: { label: 'Explore Content', href: '/article' },
      searchPlaceholder: 'Search stories, topics, and creators',
      focusLabel: 'Focus',
      featureCardBadge: 'today on the site',
      featureCardTitle: 'Fresh stories from creators you should know.',
      featureCardDescription: 'A rotating look at what the community is reading and writing right now.',
    },
    intro: {
      badge: 'The community',
      title: 'A home for readers, writers, and the stories worth telling.',
      paragraphs: [
        'This is a publishing space for creators who care about their craft — essays, features, guides, and the pieces that deserve a second read.',
        'Follow along, discover new voices, and give your favorite stories the audience they deserve.',
        'Whether you are here to read or to publish, the community keeps the best work in view.',
      ],
      sideBadge: 'At a glance',
      sidePoints: [
        'A curated home for original writing.',
        'Editor picks and community favorites in one place.',
        'A calm reading experience without noise.',
        'Publishing tools that stay out of your way.',
      ],
      primaryLink: { label: 'Browse stories', href: '/article' },
      secondaryLink: { label: 'Start writing', href: '/create' },
    },
    cta: {
      badge: 'Share your voice',
      title: 'Got a story worth telling?',
      description: 'Publish your writing and reach readers who care about thoughtful, well-crafted work.',
      primaryCta: { label: 'Submit Your Story', href: '/create' },
      secondaryCta: { label: 'Contact us', href: '/contact' },
    },
    taskSection: {
      heading: 'Latest {label}',
      descriptionSuffix: 'Browse the newest posts in this section.',
    },
  },
  about: {
    badge: 'Our Story',
    title: 'A calmer, clearer way to explore content.',
    description: `${slot4BrandConfig.siteName} is built to make long-form reading, visual discovery, and supporting resources feel like one unified experience.`,
    paragraphs: [
      'Instead of splitting everything into disconnected pages, the platform keeps related content easy to move through and easy to understand.',
      'Whether someone starts with an article, listing, image post, or resource page, they can continue exploring without losing context.',
    ],
    values: [
      {
        title: 'Reading-first experience',
        description: 'We prioritize clarity, pacing, and structure so people can read, browse, and discover without noise.',
      },
      {
        title: 'Connected content surfaces',
        description: 'Articles, visual posts, listings, resources, and profiles stay connected so discovery feels natural across the site.',
      },
      {
        title: 'Simple and trustworthy',
        description: 'We focus on clean navigation and clear page structure to help visitors find useful content faster.',
      },
    ],
  },
  contact: {
    eyebrow: `Contact ${slot4BrandConfig.siteName}`,
    title: 'A support page that matches the product, not a generic contact form.',
    description: 'Tell us what you are trying to publish, fix, or launch. We will route it through the right lane instead of forcing every request into the same support bucket.',
    formTitle: 'Send a message',
  },

  search: {
    metadata: {
      title: 'Search',
      description: 'Search across stories, creators, and topics.',
    },
    hero: {
      badge: 'Search',
      title: 'Find the story you are looking for.',
      description: 'Search by keyword, topic, or category across every published piece.',
      placeholder: 'Search stories, topics, or authors',
    },
    resultsTitle: 'Latest stories',
  },
  create: {
    metadata: {
      title: 'Create',
      description: 'Create and submit new content for the site.',
    },
    locked: {
      badge: 'Creator access',
      title: 'Login to create new content.',
      description: 'Use your account to open the publishing workspace and create posts for the active sections of this site.',
    },
    hero: {
      badge: 'Publishing workspace',
      title: 'Create content for every active section.',
      description: 'Choose the content type, add details, and prepare a clean post with images, links, summary, and body content.',
    },
    formTitle: 'Content details',
    submitLabel: 'Submit content',
    successTitle: 'Content submitted successfully.',
  },
  auth: {
    login: {
      metadataDescription: 'Login page for this site.',
      badge: 'Member access',
      title: 'Welcome back to your publishing space.',
      description: 'Login to continue browsing, managing submissions, and creating new content from your account.',
      formTitle: 'Login',
      submitLabel: 'Continue',
      noAccount: 'No account matched these details. Create an account first, then login.',
      success: 'Login successful. Redirecting...',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: 'Signup page for this site.',
      badge: 'Site access',
      title: 'Create your account and start publishing.',
      description: 'Create an account to access the publishing workspace, save details, and submit content through the site.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account created successfully. Redirecting...',
      loginCta: 'Login',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'Related articles',
      fallbackTitle: 'Article details',
    },
    listing: {
      relatedTitle: 'Related listings',
      fallbackTitle: 'Listing details',
    },
    image: {
      relatedTitle: 'Related visuals',
      fallbackTitle: 'Image details',
    },
    profile: {
      relatedTitle: 'Suggested articles',
      fallbackDescription: 'Profile details will appear here once available.',
      visitButton: 'Visit Official Site',
    },
  },
} as const
