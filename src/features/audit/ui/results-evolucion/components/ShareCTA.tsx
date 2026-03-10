'use client';

import { motion } from 'framer-motion';
import { useTranslation } from '@/shared/ui/hooks/useTranslation';

interface ShareCTAProps {
  username: string;
  currentScore: number;
  previousScore: number;
}

export function ShareCTA({ username, currentScore, previousScore }: ShareCTAProps) {
  const { t } = useTranslation('audit');
  const delta = currentScore - previousScore;

  const handleShare = () => {
    // TODO: Generate visual for Stories
    // For now, use Web Share API as fallback
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: t('audit_share_title', 'Mi Instagram Score'),
        text: `Mi Instagram Score subió ${delta > 0 ? '+' : ''}${delta} puntos. De ${previousScore} a ${currentScore}. ${t('audit_share_message')}`,
        url: typeof window !== 'undefined' ? window.location.href : '',
      }).catch(() => {
        // User cancelled or share failed — no action needed
      });
    }
  };

  const handleReaudit = () => {
    // Navigate back to input — for now scroll to top
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.7 }}
      className="flex flex-col items-center gap-bewe-5 py-bewe-7 text-center"
    >
      {/* Celebratory heading */}
      <div className="flex flex-col items-center gap-bewe-2">
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, delay: 0.9 }}
          className="text-4xl"
          role="img"
          aria-label="celebration"
        >
          {'\uD83C\uDF1F'}
        </motion.span>

        <h3 className="text-h2 font-inter font-semibold text-base-oscura">
          Tu Instagram crecio. Muestraselo al mundo.
        </h3>

        <p className="text-body font-inter text-base-superficie max-w-md">
          @{username} paso de {previousScore} a {currentScore} puntos.
          {delta > 0
            ? ' Comparte tu progreso con tu audiencia.'
            : ' Sigue trabajando para mejorar tu score.'}
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-bewe-3 w-full max-w-md">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleShare}
          className="w-full sm:w-auto flex-1 px-bewe-6 py-bewe-3 rounded-xl bg-base-oscura text-white text-button font-inter font-semibold hover:bg-base-superficie transition-colors"
        >
          Compartir mi resultado
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleReaudit}
          className="w-full sm:w-auto flex-1 px-bewe-6 py-bewe-3 rounded-xl border-2 border-base-oscura text-base-oscura text-button font-inter font-semibold hover:bg-gray-50 transition-colors"
        >
          Volver a auditar en 30 dias
        </motion.button>
      </div>
    </motion.section>
  );
}
