'use client';

import { Icon } from '@iconify/react';

const TOOLS = [
  {
    icon: 'solar:calculator-outline',
    iconColor: '#F59E0B',
    iconBg: 'rgba(245,158,11,0.08)',
    name: 'Calculadora de Crecimiento e Impacto de IA',
    description: 'Descubre cuánto dinero está perdiendo tu negocio por no implementar inteligencia artificial.',
    url: '#',
    cta: 'Calcular impacto',
  },
  {
    icon: 'solar:chart-square-outline',
    iconColor: '#0EA5E9',
    iconBg: 'rgba(14,165,233,0.08)',
    name: 'Comparador de Competencia',
    description: 'Conoce en qué posición estás frente a tu competencia y qué puedes mejorar.',
    url: '#',
    cta: 'Comparar ahora',
  },
];

export function MoreTools() {
  return (
    <div className="text-center">
      <p
        className="font-inter text-base-oscura"
        style={{ fontSize: 'clamp(20px, 4vw, 26px)', fontWeight: 700, lineHeight: 1.3, letterSpacing: '-0.02em', marginBottom: 8 }}
      >
        Descubre más herramientas{' '}
        <span className="font-merriweather italic" style={{ fontWeight: 500, color: '#2FBE8A' }}>
          gratuitas
        </span>
      </p>
      <p className="font-inter text-gray-500" style={{ fontSize: 14, lineHeight: 1.5, marginBottom: 32 }}>
        Herramientas interactivas para llevar tu negocio al siguiente nivel.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ maxWidth: 680, margin: '0 auto' }}>
        {TOOLS.map((tool) => (
          <a
            key={tool.name}
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-start rounded-[20px] border border-gray-200 bg-white text-left transition-all hover:-translate-y-1 hover:shadow-lg"
            style={{ padding: 'clamp(20px, 4vw, 28px)', textDecoration: 'none' }}
          >
            <div
              className="flex items-center justify-center rounded-2xl"
              style={{ width: 44, height: 44, backgroundColor: tool.iconBg, marginBottom: 16 }}
            >
              <Icon icon={tool.icon} width={22} height={22} color={tool.iconColor} />
            </div>

            <p className="font-inter text-base-oscura" style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.3, marginBottom: 8 }}>
              {tool.name}
            </p>

            <p className="font-inter text-gray-500 flex-1" style={{ fontSize: 13, lineHeight: 1.5, marginBottom: 16 }}>
              {tool.description}
            </p>

            <span
              className="inline-flex items-center gap-1.5 font-inter"
              style={{ fontSize: 13, fontWeight: 600, color: tool.iconColor }}
            >
              {tool.cta}
              <Icon icon="solar:arrow-right-outline" width={14} height={14} />
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
