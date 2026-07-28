/**
 * Schema.org микроразметка для SEO
 * Используется для улучшения отображения в поисковой выдаче (сниппеты)
 */

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'REX DESIGN',
    alternateName: 'РЕХ ДИЗАЙН',
    url: 'https://rex-dsgn.vercel.app',
    logo: 'https://rex-dsgn.vercel.app/images/portrait.svg',
    description: 'Профессиональная дизайн студия. Брендинг, веб-дизайн, типографика, UI/UX.',
    founder: {
      '@type': 'Person',
      name: 'Апарян Рафаэль',
      jobTitle: 'Ведущий дизайнер',
    },
    foundingDate: '2020',
    areaServed: 'RU',
    serviceType: ['Брендинг', 'Веб-дизайн', 'Типографика', 'UI/UX', 'Инфографика', 'Полиграфия'],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+7-902-212-10-44',
      contactType: 'customer service',
      availableLanguage: 'Russian',
    },
    sameAs: [
      'https://www.behance.net/rafaelaparyan',
    ],
  };
}

export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'REX DESIGN',
    url: 'https://rex-dsgn.vercel.app',
    description: 'Профессиональная дизайн студия',
    inLanguage: 'ru-RU',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://rex-dsgn.vercel.app/cases?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generatePersonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Апарян Рафаэль',
    jobTitle: 'Ведущий дизайнер',
    worksFor: {
      '@type': 'Organization',
      name: 'REX DESIGN',
    },
    url: 'https://rex-dsgn.vercel.app',
    sameAs: [
      'https://www.behance.net/rafaelaparyan',
    ],
  };
}

/**
 * Микроразметка для страницы услуг (ProfessionalService)
 */
export function generateProfessionalServiceSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'REX DESIGN',
    image: 'https://rex-dsgn.vercel.app/og-image.svg',
    description: 'Профессиональные услуги дизайна: брендинг, веб-дизайн, типографика, UI/UX',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Ульяновск',
      addressCountry: 'RU',
    },
    priceRange: '$$',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Услуги дизайна',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Брендинг',
            description: 'Разработка фирменного стиля, логотипа, брендбука',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Веб-дизайн',
            description: 'Дизайн сайтов, лендингов, интернет-магазинов',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'UI/UX Дизайн',
            description: 'Проектирование пользовательских интерфейсов',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Типографика',
            description: 'Разработка шрифтовых решений',
          },
        },
      ],
    },
  };
}

/**
 * Микроразметка BreadcrumbList для навигации
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Микроразметка FAQPage для страницы с вопросами и ответами
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Микроразметка для портфолио/кейсов (CreativeWorkSeries)
 */
export function generatePortfolioSchema(projects: Array<{
  name: string;
  description: string;
  url: string;
  image: string;
  dateCreated: string;
}>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Портфолио работ REX DESIGN',
    description: 'Кейсы и проекты студии дизайна REX DESIGN',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: projects.map((project, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'CreativeWork',
          name: project.name,
          description: project.description,
          url: project.url,
          image: project.image,
          dateCreated: project.dateCreated,
          author: {
            '@type': 'Person',
            name: 'Апарян Рафаэль',
          },
        },
      })),
    },
  };
}

/**
 * Микроразметка для отдельного кейса (CreativeWork)
 */
export function generateProjectSchema(project: {
  name: string;
  description: string;
  url: string;
  image: string;
  dateCreated: string;
  keywords?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.name,
    description: project.description,
    url: project.url,
    image: project.image,
    dateCreated: project.dateCreated,
    author: {
      '@type': 'Person',
      name: 'Апарян Рафаэль',
      url: 'https://rex-dsgn.vercel.app',
    },
    publisher: {
      '@type': 'Organization',
      name: 'REX DESIGN',
    },
    keywords: project.keywords?.join(', ') || '',
    inLanguage: 'ru-RU',
  };
}

/**
 * Микроразметка LocalBusiness для локального SEO
 */
export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'REX DESIGN',
    image: 'https://rex-dsgn.vercel.app/og-image.svg',
    description: 'Студия дизайна в Ульяновске. Брендинг, веб-дизайн, типографика.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Ульяновск',
      addressRegion: 'Ульяновская область',
      addressCountry: 'RU',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 54.3141,
      longitude: 48.4031,
    },
    url: 'https://rex-dsgn.vercel.app',
    telephone: '+79022121044',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
    priceRange: '$$',
    acceptsReservations: true,
  };
}
