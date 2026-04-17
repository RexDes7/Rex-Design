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
    sameAs: [],
  };
}
