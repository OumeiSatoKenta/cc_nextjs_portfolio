import { ProjectCard } from '@/components/projects/ProjectCard';
import { AnimateOnScroll } from '@/components/ui/AnimateOnScroll';
import { projects } from '@/data/projects';

export default function ProjectsPage() {
  return (
    <>
      <section className="mx-auto max-w-[1200px] px-16 py-40 md:px-32" aria-label="プロジェクト">
        <AnimateOnScroll>
          <h1 className="text-display-hero text-vercel-black">Projects</h1>
          <p className="mt-16 text-body-large text-gray-600">公開プロジェクト一覧</p>
        </AnimateOnScroll>
      </section>

      <section
        className="mx-auto max-w-[1200px] px-16 pb-40 md:px-32"
        aria-label="プロジェクト一覧"
      >
        <div className="grid gap-32 md:grid-cols-2">
          {projects.map((project, index) => (
            <AnimateOnScroll key={project.id} delay={index * 100}>
              <ProjectCard
                title={project.title}
                description={project.description}
                technologies={project.technologies}
                githubUrl={project.githubUrl}
                liveUrl={project.liveUrl}
                highlights={project.highlights}
              />
            </AnimateOnScroll>
          ))}
        </div>
      </section>
    </>
  );
}
