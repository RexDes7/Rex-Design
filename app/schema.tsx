const BASE_URL = 'https://rex-dsgn.vercel.app'

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'REX DESIGN',
    alternateName: 'Rex Design',
    url: BASE_URL,
    logo: `${BASE_URL}/icon.svg`,
    image: `${BASE_URL}/og-image.png`,
    description: 'Профессиональный дизайнер Рафаэль Апарян. Брендинг, веб-дизайн, типографика, UI/UX, инфографика, полиграфия. 150+ проектов с 2020 года.',
    founder: {
      '@type': 'Person',
      name: 'Апарян Рафаэль',
      jobTitle: 'Ведущий дизайнер',
      url: `${BASE_URL}/about`,
    },
    founderDate: '2020',
    foundingDate: '2020',
    areaServed: {
      '@type': 'Country',
      name: 'Россия',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Ульяновск',
      addressCountry: 'RU',
    },
    priceRange: '₽₽',
    serviceType: ['Брендинг', 'Веб-дизайн', 'Типографика', 'UI/UX', 'Инфографика', 'Полиграфия', '2D-анимация', 'Самописные сайты'],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Услуги дизайна',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Брендинг',
            description: 'Создание уникальной айдентики и фирменного стиля',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Веб-дизайн',
            description: 'Проектирование современных интерфейсов',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Инфографика',
            description: 'Визуализация данных для маркетплейсов',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Полиграфия',
            description: 'Дизайн печатной продукции и макетов',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: '2D-анимация',
            description: 'Покадровая анимация для проектов',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Самописный сайт под ключ',
            description: 'Разработка сайтов с нуля на чистом коде',
          },
        },
      ],
    },
    sameAs: [
      'https://behance.net/arhiv24',
      'https://t.me/RLC_W',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'rafaelaparyan@yandex.ru',
      telephone: '+7-902-212-10-44',
      availableLanguage: ['Russian'],
    },
  }
}

export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'REX DESIGN',
    alternateName: 'Rex Design — портфолио дизайнера',
    url: BASE_URL,
    description: 'Портфолио дизайнера Рафаэля Апаряна. Брендинг, веб-дизайн, типографика, UI/UX. 150+ проектов с 2020 года.',
    inLanguage: 'ru-RU',
    publisher: {
      '@type': 'Organization',
      name: 'REX DESIGN',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${BASE_URL}/cases?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}

export function generatePersonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Апарян Рафаэль',
    alternateName: 'Rafael Aparyan',
    jobTitle: 'Мультидисциплинарный дизайнер',
    description: 'Мультидисциплинарный дизайнер из Ульяновска. 6 лет опыта, 150+ проектов. Брендинг, веб-дизайн, типографика, UI/UX.',
    url: `${BASE_URL}/about`,
    image: `${BASE_URL}/og-image.png`,
    worksFor: {
      '@type': 'Organization',
      name: 'REX DESIGN',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Ульяновск',
      addressCountry: 'RU',
    },
    nationality: {
      '@type': 'Country',
      name: 'Россия',
    },
    knowsAbout: ['Брендинг', 'Веб-дизайн', 'Типографика', 'UI/UX дизайн', 'Инфографика', 'Полиграфия', '2D-анимация'],
    sameAs: [
      'https://behance.net/arhiv24',
      'https://t.me/RLC_W',
    ],
    email: 'mailto:rafaelaparyan@yandex.ru',
  }
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${BASE_URL}${item.url}`,
    })),
  }
}

export function generateProfilePageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: 'Апарян Рафаэль',
      jobTitle: 'Мультидисциплинарный дизайнер',
      url: `${BASE_URL}/about`,
    },
  }
}

export function generateContactPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Контакты — REX DESIGN',
    url: `${BASE_URL}/contact`,
    description: 'Свяжитесь с дизайнером Рафаэлем Апаряном. Email, Telegram, телефон. Открыт к новым проектам.',
  }
}
