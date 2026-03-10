'use client';

import { motion } from 'framer-motion';
import { GradientLoader } from './GradientLoader';
import { LoadingMessages } from './LoadingMessages';

interface LoadingScreenProps {
  username: string;
  profilePicUrl?: string;
  variant?: 'standard' | 'new' | 'returning';
}

export function LoadingScreen({ username, profilePicUrl, variant = 'standard' }: LoadingScreenProps) {
  return (
    <motion.div
      className="flex min-h-screen flex-col items-center justify-center bg-soft-aqua"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative flex items-center justify-center">
        <GradientLoader />
        {profilePicUrl && (
          <img
            src={profilePicUrl}
            alt={`@${username}`}
            className="absolute w-16 h-16 rounded-full object-cover"
          />
        )}
      </div>

      <p className="mt-bewe-4 text-body font-inter font-medium text-base-oscura">
        @{username}
      </p>

      <LoadingMessages variant={variant} />
    </motion.div>
  );
}
