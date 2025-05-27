import { useEffect, useState } from 'react';
import { useSettingsStore } from '@/stores/settings';

function getImageSrc(userImage, localUserImage) {
  if (localUserImage && localUserImage.trim() !== '') {
    return localUserImage;
  }
  return userImage && userImage.trim() !== ''
    ? userImage
    : `https://picsum.photos/seed/picsum/1920/1080`;
}

export default function BackgroundImageDisplay() {
  const store = useSettingsStore();
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    // Prioritize localBackgroundImage, then backgroundImage from store, then image, then random
    const localImage = store.localBackgroundImage;
    const primaryImage = store.backgroundImage;
    const secondaryImage = store.image;
    setImageUrl(getImageSrc(primaryImage || secondaryImage, localImage));
  }, [store.image, store.backgroundImage, store.localBackgroundImage]);

  if (!imageUrl) return null;

  return (
    <div
      className="fixed inset-0 w-full h-full -z-10 bg-cover bg-center transition-all duration-1000 ease-in-out"
      style={{
        backgroundImage: `url(${imageUrl})`,
        filter: 'blur(3px) brightness(0.6)',
        transform: 'scale(1.05)',
        opacity: store.imageOpacity / 100, 
      }}
    />
  );
}
