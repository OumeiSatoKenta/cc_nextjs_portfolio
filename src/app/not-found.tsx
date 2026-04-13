import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ページが見つかりません',
};

export default function NotFound() {
  return (
    <section className="px-16 py-40 text-center">
      <h1 className="text-display-hero text-vercel-black">404</h1>
      <p className="mt-16 text-body-large text-gray-600">ページが見つかりませんでした</p>
    </section>
  );
}
