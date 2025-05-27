import { useState, useEffect, useCallback } from 'react';

export const useModal = (initialState = false) => {
  const [isModalOpen, setIsModalOpen] = useState(initialState);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    if (isModalOpen) {
      window.addEventListener('keydown', handleEsc);
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isModalOpen, closeModal]);

  return { isModalOpen, openModal, closeModal };
};
