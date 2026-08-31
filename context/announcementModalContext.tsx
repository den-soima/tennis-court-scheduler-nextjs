'use client';

import { createContext, ReactNode, useContext, useState } from 'react';

type AnnouncementModalContextType = {
  isOpen: boolean;
  openAnnouncementModal: () => void;
  closeAnnouncementModal: () => void;
};

const AnnouncementModalContext = createContext<AnnouncementModalContextType | undefined>(undefined);

export function AnnouncementModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AnnouncementModalContext.Provider
      value={{
        isOpen,
        openAnnouncementModal: () => setIsOpen(true),
        closeAnnouncementModal: () => setIsOpen(false),
      }}
    >
      {children}
    </AnnouncementModalContext.Provider>
  );
}

export function useAnnouncementModal() {
  const context = useContext(AnnouncementModalContext);

  if (!context) {
    throw new Error('useAnnouncementModal must be used within an AnnouncementModalProvider');
  }

  return context;
}
