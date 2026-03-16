'use client';

import { Icon } from '@iconify/react';
import { useTranslation } from '@/shared/ui/hooks/useTranslation';
import { proxyImageUrl } from '@/features/audit/ui/_shared/utils/proxy-image';
import { SectionLabel } from './InsightsSection';

interface LindaFeaturesProps {
  username: string;
  profilePicUrl?: string;
}

export function LindaFeatures({ username, profilePicUrl }: LindaFeaturesProps) {
  const { t } = useTranslation('audit');

  return (
    <div>
      <div className="flex flex-col" style={{ gap: 64 }}>
        {/* Feature 1 — Content creation */}
        <FeatureRow direction="normal">
          <FeatureText
            badgeIcon="solar:gallery-minimalistic-outline"
            badgeLabel={t('audit_arranque_feat1_badge')}
            badgeBg="#DFEDFE"
            badgeColor="#487CBB"
            title={t('audit_arranque_feat1_title')}
            desc={t('audit_arranque_feat1_desc')}
          />
          <PostSimulation username={username} profilePicUrl={profilePicUrl} />
        </FeatureRow>

        {/* Feature 2 — Auto replies (inverted) */}
        <FeatureRow direction="inverted">
          <FeatureText
            badgeIcon="solar:chat-round-dots-outline"
            badgeLabel={t('audit_arranque_feat2_badge')}
            badgeBg="#D6F6EB"
            badgeColor="#279E73"
            title={t('audit_arranque_feat2_title')}
            desc={t('audit_arranque_feat2_desc')}
          />
          <ChatSimulation />
        </FeatureRow>

        {/* Feature 3 — CRM inteligente */}
        <FeatureRow direction="normal">
          <FeatureText
            badgeIcon="solar:users-group-rounded-outline"
            badgeLabel={t('audit_arranque_feat3_badge')}
            badgeBg="#FEF3C7"
            badgeColor="#D97706"
            title={t('audit_arranque_feat3_title')}
            desc={t('audit_arranque_feat3_desc')}
          />
          <CrmSimulation />
        </FeatureRow>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Feature layout                                                      */
/* ------------------------------------------------------------------ */

function FeatureRow({ direction, children }: { direction: 'normal' | 'inverted'; children: React.ReactNode }) {
  const dirClass = direction === 'inverted' ? 'sm:flex-row-reverse' : 'sm:flex-row';
  return (
    <div className={`reveal flex flex-col ${dirClass} gap-12 items-center`}>
      {children}
    </div>
  );
}

function FeatureText({ badgeIcon, badgeLabel, badgeBg, badgeColor, title, desc }: {
  badgeIcon: string; badgeLabel: string; badgeBg: string; badgeColor: string; title: string; desc: string;
}) {
  return (
    <div className="flex-1 min-w-0">
      <div
        className="mb-3 inline-flex items-center gap-1.5 rounded-full font-inter"
        style={{ fontSize: 14, fontWeight: 500, padding: '6px 16px', backgroundColor: badgeBg, color: badgeColor }}
      >
        <Icon icon={badgeIcon} width={14} height={14} />
        {badgeLabel}
      </div>
      <h3 className="font-inter text-base-oscura" style={{ fontSize: 24, fontWeight: 600, lineHeight: 1.3, marginBottom: 8 }}>
        {title}
      </h3>
      <p className="font-inter text-gray-500" style={{ fontSize: 16, lineHeight: 1.5 }}>
        {desc}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Post simulation                                                     */
/* ------------------------------------------------------------------ */

function PostSimulation({ username, profilePicUrl }: { username: string; profilePicUrl?: string }) {
  const proxiedPic = proxyImageUrl(profilePicUrl);

  return (
    <div
      className="w-full sm:w-[360px] shrink-0 rounded-[20px] border border-gray-200 bg-white overflow-hidden"
      style={{ boxShadow: '0 4px 24px rgba(10,37,64,0.06)' }}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5" style={{ padding: '12px 16px' }}>
        {proxiedPic ? (
          <img
            src={proxiedPic}
            alt={`@${username}`}
            className="rounded-full object-cover"
            style={{ width: 32, height: 32 }}
          />
        ) : (
          <div className="flex items-center justify-center rounded-full" style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #B0D2FC, #9AE9CC)' }}>
            <Icon icon="solar:user-circle-outline" width={18} height={18} color="#0A2540" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <span className="font-inter text-base-oscura" style={{ fontSize: 13, fontWeight: 600 }}>@{username}</span>
        </div>
        <div
          className="inline-flex items-center gap-1 rounded-full font-inter"
          style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', backgroundColor: '#D6F6EB', color: '#279E73' }}
        >
          <Icon icon="solar:magic-stick-3-outline" width={10} height={10} />
          Linda
        </div>
      </div>

      {/* Body — photo */}
      <div
        className="relative flex flex-col justify-end"
        style={{
          height: 240,
          backgroundImage: 'url(/sim-beauty.avif)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: 16,
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)' }} />
        <p className="relative font-inter text-white" style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.3, marginBottom: 4 }}>
          Nuestro tratamiento facial más pedido: hidratación profunda con resultados desde la primera sesión
        </p>
        <span className="relative font-inter" style={{ fontSize: 12, color: '#93C5FD', fontWeight: 600 }}>
          Conoce nuestros tratamientos →
        </span>
      </div>

      {/* Caption */}
      <div style={{ padding: '12px 16px' }}>
        <p className="font-inter text-gray-600" style={{ fontSize: 12, lineHeight: 1.5 }}>
          ¿Ya lo probaste? Cuéntanos tu experiencia en los comentarios
        </p>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 border-t border-gray-100" style={{ padding: '10px 16px' }}>
        <StatChip icon="solar:heart-outline" value="147" />
        <StatChip icon="solar:chat-round-dots-outline" value="38" />
        <StatChip icon="solar:square-share-line-outline" value="12" />
      </div>
    </div>
  );
}

function StatChip({ icon, value }: { icon: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1 font-inter text-gray-500" style={{ fontSize: 12, fontWeight: 600 }}>
      <Icon icon={icon} width={14} height={14} />
      {value}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Chat simulation                                                     */
/* ------------------------------------------------------------------ */

const CHAT_MESSAGES = [
  { from: 'user', text: 'Hola! Vi tu post del tratamiento facial. ¿Qué incluye?' },
  { from: 'linda', text: '¡Hola! Gracias por escribirnos 😊 Incluye limpieza profunda, mascarilla hidratante y sérum personalizado según tu tipo de piel.' },
  { from: 'user', text: '¿Y cuánto cuesta el tratamiento?' },
  { from: 'linda', text: 'El tratamiento de hidratación profunda tiene un valor de $120.000. ¿Te gustaría conocer más detalles o tienes alguna otra pregunta?' },
  { from: 'user', text: 'Suena genial, quiero más info' },
];

function ChatSimulation() {
  return (
    <div
      className="w-full sm:w-[360px] shrink-0 rounded-[20px] border border-gray-200 bg-white overflow-hidden"
      style={{ boxShadow: '0 4px 24px rgba(10,37,64,0.06)' }}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-gray-100" style={{ padding: '12px 16px' }}>
        <span className="inline-block rounded-full arranque-dot-pulse" style={{ width: 8, height: 8, backgroundColor: '#34D399' }} />
        <span className="font-inter text-base-oscura" style={{ fontSize: 13, fontWeight: 600 }}>Linda activa en mensajes</span>
      </div>

      {/* Messages */}
      <div className="flex flex-col gap-2" style={{ padding: 16, maxHeight: 280, overflow: 'hidden' }}>
        {CHAT_MESSAGES.map((msg, i) => (
          <div
            key={i}
            className={`arranque-chat-bubble max-w-[85%] rounded-[14px] font-inter ${msg.from === 'user' ? 'self-start' : 'self-end'}`}
            style={{
              padding: '8px 12px',
              fontSize: 12,
              lineHeight: 1.4,
              backgroundColor: msg.from === 'user' ? '#F1F5F9' : '#D6F6EB',
              color: msg.from === 'user' ? '#64748B' : '#1D7454',
              animationDelay: `${i * 1.2}s`,
            }}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 flex items-center gap-1.5" style={{ padding: '10px 16px' }}>
        <Icon icon="solar:clock-circle-outline" width={12} height={12} color="#34D399" />
        <span className="font-inter" style={{ fontSize: 11, color: '#2FBE8A', fontWeight: 600 }}>
          Respondido en 8 segundos · Contacto registrado
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CRM simulation                                                      */
/* ------------------------------------------------------------------ */

const CRM_CONTACTS = [
  { name: 'Beatriz Cortés', status: 'Cliente', statusColor: '#059669', statusBg: 'rgba(52,211,153,0.1)', tags: ['Cliente frecuente', 'VIP', 'Piel sensible'], potential: 'Alta', potentialColor: '#059669' },
  { name: 'Roberto Garrido', status: 'Prospecto', statusColor: '#487CBB', statusBg: 'rgba(96,165,250,0.1)', tags: ['Interesado en promociones', 'WhatsApp'], potential: 'Alta', potentialColor: '#059669' },
  { name: 'Juan Gonzales', status: 'Lead', statusColor: '#D97706', statusBg: 'rgba(251,191,36,0.1)', tags: ['Instagram', 'Servicio de masaje'], potential: 'Media', potentialColor: '#D97706' },
  { name: 'María Díaz', status: 'Cliente', statusColor: '#059669', statusBg: 'rgba(52,211,153,0.1)', tags: ['Frecuente', 'Piel sensible'], potential: 'Alta', potentialColor: '#059669' },
];

function CrmSimulation() {
  return (
    <div
      className="w-full sm:w-[360px] shrink-0 rounded-[20px] border border-gray-200 bg-white overflow-hidden"
      style={{ boxShadow: '0 4px 24px rgba(10,37,64,0.06)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between" style={{ padding: '12px 16px', borderBottom: '1px solid #F1F5F9' }}>
        <div className="flex items-center gap-2">
          <span className="font-inter text-base-oscura" style={{ fontSize: 13, fontWeight: 700 }}>Contactos</span>
          <span className="font-inter text-gray-400" style={{ fontSize: 11 }}>25</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="rounded-full font-inter" style={{ fontSize: 9, fontWeight: 600, padding: '3px 10px', backgroundColor: '#0A2540', color: '#fff' }}>
            <Icon icon="solar:user-plus-outline" width={10} height={10} className="inline mr-1" style={{ verticalAlign: '-1px' }} />
            Nuevo
          </div>
        </div>
      </div>

      {/* Column headers */}
      <div className="grid font-inter text-gray-400" style={{ gridTemplateColumns: '1fr auto auto', padding: '8px 16px', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid #F8FAFC' }}>
        <span>Contacto</span>
        <span style={{ width: 64, textAlign: 'center' }}>Estado</span>
        <span style={{ width: 48, textAlign: 'right' }}>Potencial</span>
      </div>

      {/* Rows */}
      <div className="flex flex-col">
        {CRM_CONTACTS.map((c, i) => (
          <div
            key={i}
            className="grid items-center"
            style={{ gridTemplateColumns: '1fr auto auto', padding: '10px 16px', borderBottom: i < CRM_CONTACTS.length - 1 ? '1px solid #F8FAFC' : 'none' }}
          >
            <div>
              <span className="font-inter text-base-oscura" style={{ fontSize: 12, fontWeight: 600 }}>{c.name}</span>
              <div className="flex gap-1 mt-1">
                {c.tags.map((tag, j) => (
                  <span key={j} className="font-inter rounded" style={{ fontSize: 9, fontWeight: 500, padding: '1px 6px', backgroundColor: '#F1F5F9', color: '#64748B' }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <span
              className="font-inter rounded-full text-center"
              style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', width: 64, backgroundColor: c.statusBg, color: c.statusColor }}
            >
              {c.status}
            </span>
            <span className="font-inter text-right" style={{ fontSize: 11, fontWeight: 700, width: 48, color: c.potentialColor }}>
              {c.potential}
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-center gap-1.5 border-t border-gray-100" style={{ padding: '10px 16px' }}>
        <Icon icon="solar:magic-stick-3-outline" width={12} height={12} color="#34D399" />
        <span className="font-inter" style={{ fontSize: 11, color: '#2FBE8A', fontWeight: 600 }}>
          Contactos etiquetados automáticamente por Linda
        </span>
      </div>
    </div>
  );
}
