import type { Career } from '@/types';
import { TimelineItem } from './TimelineItem';

interface TimelineProps {
  careers: Career[];
}

export function Timeline({ careers }: TimelineProps) {
  return (
    <div className="flex flex-col">
      {careers.map((career, index) => (
        <TimelineItem
          key={`${career.company}-${career.period.start}`}
          company={career.company}
          role={career.role}
          period={career.period}
          description={career.description}
          achievements={career.achievements}
          technologies={career.technologies}
          isLast={index === careers.length - 1}
        />
      ))}
    </div>
  );
}
