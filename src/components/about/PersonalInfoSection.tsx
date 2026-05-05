import type { PersonalInfo } from '@/types';

interface PersonalInfoSectionProps {
  info: PersonalInfo;
}

export function PersonalInfoSection({ info }: PersonalInfoSectionProps) {
  return (
    <div className="flex flex-col gap-32">
      <div className="rounded-comfortable bg-pure-white p-32 shadow-subtle-card">
        <span className="inline-block rounded-pill bg-badge-cloud-bg px-10 py-3 font-medium text-badge-cloud-text text-caption">
          資質タイプ
        </span>
        <h3 className="mt-12 text-card-title text-vercel-black">{info.type}</h3>
        <p className="mt-12 text-body-small text-gray-600">{info.typeDescription}</p>
      </div>

      <div>
        <h4 className="text-card-title-light text-vercel-black">上位 3 つの資質</h4>
        <ul className="mt-16 grid gap-16 md:grid-cols-3">
          {info.topQualities.map((q) => (
            <li
              key={q.title}
              className="flex flex-col gap-8 rounded-comfortable bg-pure-white p-32 shadow-subtle-card"
            >
              <h5 className="text-card-title text-vercel-black">{q.title}</h5>
              <p className="text-body-small text-gray-600">{q.description}</p>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="text-card-title-light text-vercel-black">自己認識</h4>
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
    </div>
  );
}
