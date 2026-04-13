import { Timeline } from '@/components/about/Timeline';
import { SkillGrid } from '@/components/about/SkillGrid';
import { careers } from '@/data/career';
import { skills } from '@/data/skills';
import { educations } from '@/data/education';

export default function AboutPage() {
  return (
    <>
      <section className="mx-auto max-w-[1200px] px-16 py-40 md:px-32" aria-label="経歴">
        <h1 className="text-display-hero text-vercel-black">About</h1>
        <p className="mt-16 text-body-large text-gray-600">経歴とスキルセット</p>
      </section>

      <section className="mx-auto max-w-[1200px] px-16 pb-40 md:px-32" aria-label="職務経歴">
        <h2 className="text-section-heading text-vercel-black">Career</h2>
        <div className="mt-32">
          <Timeline careers={careers} />
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-16 pb-40 md:px-32" aria-label="スキル">
        <h2 className="text-section-heading text-vercel-black">Skills</h2>
        <div className="mt-32">
          <SkillGrid skills={skills} />
        </div>
      </section>

      {educations.length > 0 && (
        <section
          className="mx-auto max-w-[1200px] px-16 pb-40 md:px-32"
          aria-label="学歴・資格"
        >
          <h2 className="text-section-heading text-vercel-black">Education</h2>
          <ul className="mt-32 flex flex-col gap-16">
            {educations.map((edu) => (
              <li
                key={`${edu.type}-${edu.title}`}
                className="rounded-comfortable bg-pure-white p-32 shadow-subtle-card"
              >
                <h3 className="text-card-title text-vercel-black">{edu.title}</h3>
                {edu.institution && (
                  <p className="mt-8 text-body-small text-gray-600">{edu.institution}</p>
                )}
                <time dateTime={edu.date} className="mt-4 block font-geist-mono text-caption text-gray-500">
                  {edu.date}
                </time>
                {edu.description && (
                  <p className="mt-8 text-body-small text-gray-600">{edu.description}</p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
