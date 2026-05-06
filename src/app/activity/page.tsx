import type { Metadata } from 'next';
import { ActivityTimeline } from '@/components/activity/ActivityTimeline';
import { AnimateOnScroll } from '@/components/ui/AnimateOnScroll';
import { activities } from '@/data/activities';

export const metadata: Metadata = {
  title: '活動履歴',
  description: 'コミュニティ運営・登壇・執筆など継続している社外活動の履歴',
};

export default function ActivityPage() {
  return (
    <>
      <section className="mx-auto max-w-[1200px] px-16 py-40 md:px-32" aria-label="活動履歴">
        <AnimateOnScroll>
          <h1 className="text-display-hero text-vercel-black">活動履歴</h1>
          <p className="mt-16 text-body-large text-gray-600">
            コミュニティ運営・登壇・執筆など、継続している社外活動の履歴です。
          </p>
        </AnimateOnScroll>
      </section>

      <ActivityTimeline activities={activities} />
    </>
  );
}
