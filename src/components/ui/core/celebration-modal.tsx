//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { useViewportSize } from '@mantine/hooks';
import { IconCircleCheckFilled } from '@tabler/icons-react';
import React, { useEffect } from 'react';
import Confetti from 'react-confetti';

type CelebrationModalProps = {
  open: boolean;
  text?: string;
  duration?: number; // in ms
  onClose: () => void;
};

export const CelebrationModal = ({
  open,
  text = 'Registration Successful!',
  duration = 2000,
  onClose,
}: CelebrationModalProps) => {
  const { width, height } = useViewportSize();

  useEffect(() => {
    if (open) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [open, duration, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <Confetti
        width={width}
        height={height}
        numberOfPieces={200}
        recycle={false}
      />
      <div className="flex flex-col items-center rounded-xl bg-white p-8 shadow-xl">
        <IconCircleCheckFilled size={64} className="mb-4 text-green-500" />
        <div className="text-center text-xl font-semibold">{text}</div>
      </div>
    </div>
  );
};
