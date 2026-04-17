import ProjectCard from '@/components/ProjectCard'
import SkillCard from '@/components/SkillCard'
import ManifestoCard from '@/components/ManifestoCard'
import ContactForm from '@/components/ContactForm'
import { projects, skills, manifestoPrinciples } from '@/lib/data'
import styles from './page.module.css'

export default function ComponentTestPage() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>COMPONENT VERIFICATION</h1>
        <p className={styles.subtitle}>Testing all components with correct props</p>

        {/* ProjectCard Tests */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>1. ProjectCard Component</h2>
          <div className={styles.projectGrid}>
            <ProjectCard project={projects[0]} />
            <ProjectCard project={projects[1]} />
            <ProjectCard project={projects[2]} />
          </div>
          <div className={styles.checkList}>
            <h3>✓ Verify:</h3>
            <ul>
              <li>Images display with grayscale filter</li>
              <li>Hover transitions image from grayscale to color (500ms)</li>
              <li>Card has hard shadow and translate on hover</li>
              <li>Title, description, category, and year display correctly</li>
              <li>Wide variant spans 2 columns on desktop</li>
              <li>Responsive behavior at mobile breakpoints</li>
            </ul>
          </div>
        </section>

        {/* SkillCard Tests */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>2. SkillCard Component</h2>
          <div className={styles.skillGrid}>
            {skills.map((skill) => (
              <SkillCard key={skill.name} skill={skill} />
            ))}
          </div>
          <div className={styles.checkList}>
            <h3>✓ Verify:</h3>
            <ul>
              <li>Material Symbols icons display correctly</li>
              <li>Skill names are uppercase</li>
              <li>Hover changes background to primary color (#ffd709)</li>
              <li>3px solid black border</li>
              <li>Responsive sizing on mobile</li>
            </ul>
          </div>
        </section>

        {/* ManifestoCard Tests */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>3. ManifestoCard Component</h2>
          <div className={styles.manifestoGrid}>
            {manifestoPrinciples.map((principle) => (
              <ManifestoCard key={principle.title} principle={principle} />
            ))}
          </div>
          <div className={styles.checkList}>
            <h3>✓ Verify:</h3>
            <ul>
              <li>Icons display correctly</li>
              <li>Hover changes background to primary color</li>
              <li>Hard shadow effects present</li>
              <li>Active state removes shadow (translate 1px)</li>
              <li>Title and description display correctly</li>
            </ul>
          </div>
        </section>

        {/* ContactForm Tests */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>4. ContactForm Component</h2>
          <div className={styles.formContainer}>
            <ContactForm />
          </div>
          <div className={styles.checkList}>
            <h3>✓ Verify:</h3>
            <ul>
              <li>All fields render (name, contact, budget, description)</li>
              <li>Focus states apply primary color background</li>
              <li>4px bottom borders on inputs</li>
              <li>Budget dropdown has 3 options</li>
              <li>Submit button has black background</li>
              <li>Validation errors display correctly</li>
              <li>Required field validation works</li>
              <li>Email format validation works</li>
              <li>Form labels are properly associated with inputs</li>
            </ul>
          </div>
        </section>

        {/* Responsive Tests */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>5. Responsive Behavior</h2>
          <div className={styles.checkList}>
            <h3>✓ Test at breakpoints:</h3>
            <ul>
              <li>Mobile (320px - 640px): Single column layouts, reduced font sizes</li>
              <li>Tablet (640px - 768px): 2 column grids where appropriate</li>
              <li>Desktop (768px+): Full grid layouts, optimal spacing</li>
              <li>Navigation collapses to mobile menu on small screens</li>
              <li>Touch targets are at least 44px on mobile</li>
            </ul>
          </div>
        </section>

        {/* Hover and Focus States */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>6. Interactive States</h2>
          <div className={styles.checkList}>
            <h3>✓ Verify hover states:</h3>
            <ul>
              <li>Navigation links: Primary color background</li>
              <li>Footer social links: Italic + scale(1.05)</li>
              <li>ProjectCard: Translate + hard shadow + image color</li>
              <li>SkillCard: Primary color background</li>
              <li>ManifestoCard: Primary color background</li>
              <li>Form inputs: Primary color background on focus</li>
              <li>Buttons: Hard shadow enhancement</li>
            </ul>
            <h3>✓ Verify active states:</h3>
            <ul>
              <li>Buttons: Translate(1px, 1px) + shadow removal</li>
              <li>Cards: Appropriate active feedback</li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  )
}
