import { ProjectCard } from '@/components/projects/ProjectCard';
import type { Project } from '@/types';

interface FeaturedProjectsProps {
  projects: Project[];
}

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  const featured = projects.filter((p) => p.featured);

  return (
    <div className="grid gap-32 md:grid-cols-2">
      {featured.map((project) => (
        <ProjectCard
          key={project.id}
          title={project.title}
          description={project.description}
          technologies={project.technologies}
          githubUrl={project.githubUrl}
          liveUrl={project.liveUrl}
          highlights={project.highlights}
          metrics={project.metrics}
          linkLabel={project.linkLabel}
          thumbnail={project.thumbnail}
        />
      ))}
    </div>
  );
}
