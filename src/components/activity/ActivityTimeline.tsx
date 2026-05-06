import { ActivityCard } from '@/components/activity/ActivityCard';
import { AnimateOnScroll } from '@/components/ui/AnimateOnScroll';
import type { Activity } from '@/types';

interface ActivityTimelineProps {
  activities: Activity[];
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  const sorted = [...activities].sort((a, b) => b.date.localeCompare(a.date));
  const grouped = new Map<string, Activity[]>();
  for (const activity of sorted) {
    const year = activity.date.slice(0, 4);
    const list = grouped.get(year);
    if (list) {
      list.push(activity);
    } else {
      grouped.set(year, [activity]);
    }
  }
  const years = Array.from(grouped.keys());

  return (
    <div className="mx-auto max-w-[1200px] px-16 pb-40 md:px-32">
      <div className="flex flex-col gap-48">
        {years.map((year) => {
          const yearActivities = grouped.get(year) ?? [];
          return (
            <AnimateOnScroll key={year}>
              <section aria-label={`${year} 年の活動`}>
                <h2 className="text-section-heading text-vercel-black">{year}</h2>
                <ul className="mt-24 grid gap-24 md:grid-cols-2">
                  {yearActivities.map((activity) => (
                    <li key={activity.id} className="h-full">
                      <ActivityCard activity={activity} />
                    </li>
                  ))}
                </ul>
              </section>
            </AnimateOnScroll>
          );
        })}
      </div>
    </div>
  );
}
