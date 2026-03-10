'use client';

import { Card, CardBody } from '@heroui/react';
import { Icon } from '@iconify/react';
import { ScoreLevel } from '@/features/audit/domain/interfaces/audit';
import { useTranslation } from '@/shared/ui/hooks/useTranslation';

interface ActionPlanProps {
  level: ScoreLevel;
}

interface WeekPlan {
  week: number;
  objetivo: string;
  acciones: string[];
  feature: string;
}

const PLAN_TITLE_KEYS: Record<ScoreLevel, string> = {
  [ScoreLevel.CRITICO]: 'audit_action_plan_critico_title',
  [ScoreLevel.REGULAR]: 'audit_action_plan_regular_title',
  [ScoreLevel.BUENO]: 'audit_action_plan_bueno_title',
  [ScoreLevel.EXCELENTE]: 'audit_action_plan_excelente_title',
};

const PLAN_DESC_KEYS: Record<ScoreLevel, string> = {
  [ScoreLevel.CRITICO]: 'audit_action_plan_critico_description',
  [ScoreLevel.REGULAR]: 'audit_action_plan_regular_description',
  [ScoreLevel.BUENO]: 'audit_action_plan_bueno_description',
  [ScoreLevel.EXCELENTE]: 'audit_action_plan_excelente_description',
};

const WEEKLY_PLANS: Record<ScoreLevel, WeekPlan[]> = {
  [ScoreLevel.CRITICO]: [
    {
      week: 1,
      objetivo: 'Rescatar la presencia b\u00e1sica',
      acciones: [
        'Optimizar bio, foto de perfil y enlace',
        'Publicar 3 posts de presentaci\u00f3n',
        'Crear primeras 3 historias destacadas',
      ],
      feature: 'Generador de Bio IA',
    },
    {
      week: 2,
      objetivo: 'Establecer ritmo de publicaci\u00f3n',
      acciones: [
        'Publicar 4 posts variados (imagen, carrusel, reel)',
        'Responder todos los comentarios',
        'Interactuar con 10 cuentas del sector',
      ],
      feature: 'Calendario de Contenido IA',
    },
    {
      week: 3,
      objetivo: 'Activar engagement',
      acciones: [
        'Crear 2 Reels con tendencias del sector',
        'Usar CTAs en cada publicaci\u00f3n',
        'Lanzar primera encuesta en Stories',
      ],
      feature: 'Creador de Reels IA',
    },
    {
      week: 4,
      objetivo: 'Medir y ajustar',
      acciones: [
        'Revisar m\u00e9tricas de las 3 semanas',
        'Identificar top 3 posts por engagement',
        'Replicar formatos exitosos',
      ],
      feature: 'Anal\u00edtica Inteligente',
    },
  ],
  [ScoreLevel.REGULAR]: [
    {
      week: 1,
      objetivo: 'Fortalecer los fundamentos',
      acciones: [
        'Auditar y mejorar bio con CTA claro',
        'Definir 3 pilares de contenido',
        'Crear plantillas visuales consistentes',
      ],
      feature: 'Estrategia de Contenido IA',
    },
    {
      week: 2,
      objetivo: 'Diversificar formatos',
      acciones: [
        'Publicar 2 Reels educativos',
        'Crear 1 carrusel de valor',
        'Experimentar con Instagram Lives',
      ],
      feature: 'Generador de Contenido IA',
    },
    {
      week: 3,
      objetivo: 'Escalar interacci\u00f3n',
      acciones: [
        'Implementar estrategia de hashtags optimizada',
        'Crear serie de contenido semanal',
        'Colaborar con 1 cuenta complementaria',
      ],
      feature: 'Optimizador de Hashtags IA',
    },
    {
      week: 4,
      objetivo: 'Convertir seguidores en clientes',
      acciones: [
        'Crear embudo de Stories a enlace',
        'Publicar testimonios de clientes',
        'A/B testing de horarios de publicaci\u00f3n',
      ],
      feature: 'Automatizaci\u00f3n de Ventas IA',
    },
  ],
  [ScoreLevel.BUENO]: [
    {
      week: 1,
      objetivo: 'Optimizar lo que funciona',
      acciones: [
        'Analizar top 10 posts y replicar patrones',
        'Optimizar horarios de publicaci\u00f3n',
        'Refinar voz de marca',
      ],
      feature: 'Anal\u00edtica Avanzada IA',
    },
    {
      week: 2,
      objetivo: 'Escalar contenido de video',
      acciones: [
        'Crear 3 Reels con formato trending',
        'Reutilizar contenido exitoso en nuevos formatos',
        'Implementar series de contenido',
      ],
      feature: 'Estudio de Reels IA',
    },
    {
      week: 3,
      objetivo: 'Expandir alcance',
      acciones: [
        'Lanzar campa\u00f1a de colaboraciones',
        'Crear contenido compartible (saves-focused)',
        'Optimizar SEO de Instagram en captions',
      ],
      feature: 'Motor de Crecimiento IA',
    },
    {
      week: 4,
      objetivo: 'Automatizar y escalar',
      acciones: [
        'Configurar respuestas autom\u00e1ticas inteligentes',
        'Programar contenido del pr\u00f3ximo mes',
        'Establecer KPIs mensuales',
      ],
      feature: 'Automatizaci\u00f3n Total IA',
    },
  ],
  [ScoreLevel.EXCELENTE]: [
    {
      week: 1,
      objetivo: 'Innovar en formatos',
      acciones: [
        'Experimentar con nuevas funciones de Instagram',
        'Crear contenido tipo "behind the scenes"',
        'Lanzar serie exclusiva para seguidores fieles',
      ],
      feature: 'Laboratorio de Contenido IA',
    },
    {
      week: 2,
      objetivo: 'Monetizaci\u00f3n avanzada',
      acciones: [
        'Crear embudo de ventas en Stories + Highlights',
        'Lanzar promoci\u00f3n exclusiva para seguidores',
        'Implementar seguimiento de conversiones',
      ],
      feature: 'Suite de Conversi\u00f3n IA',
    },
    {
      week: 3,
      objetivo: 'Construir comunidad premium',
      acciones: [
        'Crear canal de difusi\u00f3n de Instagram',
        'Organizar evento en vivo para comunidad',
        'Desarrollar programa de embajadores',
      ],
      feature: 'Gestor de Comunidad IA',
    },
    {
      week: 4,
      objetivo: 'Liderar el sector',
      acciones: [
        'Publicar estudio/insight \u00fanico del sector',
        'Crear contenido colaborativo con l\u00edderes',
        'Planificar estrategia del pr\u00f3ximo trimestre',
      ],
      feature: 'Planificador Estrat\u00e9gico IA',
    },
  ],
};

const WEEK_ICONS: string[] = [
  'solar:flag-outline',
  'solar:rocket-outline',
  'solar:graph-up-outline',
  'solar:medal-ribbons-star-outline',
];

export function ActionPlan({ level }: ActionPlanProps) {
  const { t } = useTranslation('audit');
  const weeks = WEEKLY_PLANS[level];

  return (
    <section className="flex flex-col gap-bewe-4">
      {/* Title and description */}
      <div className="flex flex-col gap-bewe-2">
        <h3 className="text-h2 font-inter text-base-oscura">
          {t(PLAN_TITLE_KEYS[level])}
        </h3>
        <p className="text-body font-inter text-base-oscura/70">
          {t(PLAN_DESC_KEYS[level])}
        </p>
      </div>

      {/* Week cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-bewe-4">
        {weeks.map((week, index) => (
          <Card key={week.week} className="border border-primary-100">
            <CardBody className="flex flex-col gap-bewe-3 p-bewe-5">
              {/* Week header */}
              <div className="flex items-center gap-bewe-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-100">
                  <Icon
                    icon={WEEK_ICONS[index] ?? 'solar:star-outline'}
                    className="text-primary-500"
                    width={18}
                    height={18}
                  />
                </div>
                <span className="text-small font-inter font-bold text-primary-500 uppercase tracking-wide">
                  Semana {week.week}
                </span>
              </div>

              {/* Objetivo */}
              <h4 className="text-body font-inter font-bold text-base-oscura">
                {week.objetivo}
              </h4>

              {/* Acciones */}
              <ul className="flex flex-col gap-bewe-2">
                {week.acciones.map((accion, i) => (
                  <li key={i} className="flex items-start gap-bewe-2">
                    <Icon
                      icon="solar:check-read-outline"
                      className="text-semantic-success shrink-0 mt-0.5"
                      width={16}
                      height={16}
                    />
                    <span className="text-small font-inter text-base-oscura/70">
                      {accion}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Feature de BeweOS */}
              <div className="flex items-center gap-bewe-2 mt-auto pt-bewe-3 border-t border-primary-100">
                <Icon
                  icon="solar:magic-stick-3-outline"
                  className="text-primary-400 shrink-0"
                  width={16}
                  height={16}
                />
                <span className="text-small font-inter font-medium text-primary-500">
                  {week.feature}
                </span>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </section>
  );
}
