'use client';

import { Icon } from '@iconify/react';

const SOURCES = [
  {
    name: 'Rival IQ',
    report: '2025 Social Media Industry Benchmark Report',
    url: 'https://www.rivaliq.com/blog/social-media-industry-benchmark-report/',
  },
  {
    name: 'Socialinsider',
    report: '2025 Instagram Benchmarks',
    url: 'https://www.socialinsider.io/social-media-benchmarks/instagram',
  },
  {
    name: 'Hootsuite',
    report: 'Average Engagement Rates by Industry',
    url: 'https://blog.hootsuite.com/average-engagement-rate/',
  },
  {
    name: 'Sprout Social',
    report: '2025 Content Benchmarks by Industry',
    url: 'https://sproutsocial.com/insights/social-media-benchmarks-by-industry/',
  },
  {
    name: 'Metricool',
    report: '2025 Social Media Benchmark Report',
    url: 'https://metricool.com/press-release-metricool-2025-social-media-benchmark-report/',
  },
];

export function BenchmarkSources() {
  return (
    <div className="reveal">
      {/* Header */}
      <div className="text-center flex flex-col items-center" style={{ marginBottom: 32 }}>
        <p
          className="font-inter text-base-oscura"
          style={{ fontSize: 32, fontWeight: 700, lineHeight: 1.3, maxWidth: 520, letterSpacing: '-0.02em', marginBottom: 12 }}
        >
          ¿De dónde salen los{' '}
          <span className="font-merriweather italic" style={{ fontWeight: 500, color: '#60A5FA' }}>
            benchmarks
          </span>
          ?
        </p>
        <p className="font-inter text-gray-500" style={{ fontSize: 15, lineHeight: 1.5, maxWidth: 520 }}>
          Los benchmarks por sector se basan en datos publicados por los referentes más reconocidos en análisis de redes sociales.
        </p>
      </div>

      {/* Source cards */}
      <div className="flex flex-col gap-3">
        {SOURCES.map((source) => (
          <a
            key={source.name}
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-[16px] border border-gray-200 bg-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
            style={{ padding: '18px 24px' }}
          >
            <div>
              <p className="font-inter text-base-oscura" style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.3 }}>
                {source.name}
              </p>
              <p className="font-inter text-gray-400" style={{ fontSize: 13, marginTop: 2 }}>
                {source.report}
              </p>
            </div>
            <Icon icon="solar:arrow-right-up-outline" width={18} height={18} color="#60A5FA" className="shrink-0" />
          </a>
        ))}
      </div>
    </div>
  );
}
