import type { PersonalInfo } from '@/types';

interface PersonalInfoSectionProps {
  info: PersonalInfo;
}

export function PersonalInfoSection({ info }: PersonalInfoSectionProps) {
  return (
    <div className="flex flex-col gap-32">
      <div>
        <h3 className="text-sub-heading-large text-vercel-black">資質タイプ</h3>
        <div className="mt-16 rounded-comfortable bg-pure-white p-32 shadow-subtle-card">
          <p className="font-semibold text-card-title text-vercel-black">{info.type}</p>
          <p className="mt-12 text-body-small text-gray-600">{info.typeDescription}</p>
        </div>
      </div>

      <div>
        <h3 className="text-sub-heading-large text-vercel-black">上位 3 つの資質</h3>
        <ul className="mt-16 grid gap-16 md:grid-cols-3">
          {info.topQualities.map((q) => (
            <li
              key={q.title}
              className="flex flex-col gap-8 rounded-comfortable bg-pure-white p-32 shadow-subtle-card"
            >
              <h4 className="text-card-title text-vercel-black">{q.title}</h4>
              <p className="text-body-small text-gray-600">{q.description}</p>
            </li>
          ))}
        </ul>
      </div>

      {info.source && (
        <p className="text-caption text-gray-500">
          出典:{' '}
          <a
            href={info.source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-link-blue hover:underline"
          >
            {info.source.name}
          </a>{' '}
          による適性診断
        </p>
      )}

      <div>
        <h3 className="text-sub-heading-large text-vercel-black">自己認識</h3>
        <ul className="mt-16 flex flex-col gap-8">
          {info.selfAwareness.map((item) => (
            <li
              key={item}
              className="rounded-comfortable bg-pure-white p-16 text-body-small text-gray-600 shadow-subtle-card"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
