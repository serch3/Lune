import { FiEdit3, FiMoreHorizontal, FiX } from 'react-icons/fi';
import { useSettingsStore } from '@/stores/settings';

const getFaviconUrl = (url, size = 32) => {
  try {
    const urlObj = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=${size}`;
  } catch {
    return 'vite.svg';
  }
};

export function BookmarkItem({ link, group, handleEditClick, deleteLink }) {
  const iconBackgroundColor = useSettingsStore((state) => state.iconBackgroundColor) || '#000000';
  const getIconBgClass = () => {
    return 'shadow-sm';
  };

  const getIconStyle = () => {
    return { backgroundColor: iconBackgroundColor };
  };

  if (group === 'Favorites') {
    return (
      <div
        className="p-2 rounded-lg hover:bg-gray-700/40 transition-colors duration-150 flex flex-col items-center relative group h-full"
        style={link.color ? { boxShadow: `0 0 0 1.5px ${link.color}99` } : {}}
      >
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center text-center w-full h-full justify-start"
        >
          <div 
            className={`mb-1.5 w-9 h-9 rounded-md flex items-center justify-center ${getIconBgClass()}`}
            style={getIconStyle()}
          >
            <img
              src={getFaviconUrl(link.url)}
              alt={`${link.name} favicon`}
              className="w-5 h-5 object-contain"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'vite.svg';
              }}
            />
          </div>
          <h3
            className="text-xs font-medium text-base-content break-words text-center leading-tight line-clamp-2"
            title={link.name}
          >
            {link.name}
          </h3>
        </a>
        <div className="absolute top-0.5 right-0.5 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="dropdown dropdown-end">
            <button
              tabIndex={0}
              className="btn btn-xs btn-circle btn-ghost text-gray-300 hover:text-white"
            >
              <FiMoreHorizontal size={14} style={{ pointerEvents: 'none' }} />
            </button>
            <ul
              tabIndex={0}
              className="dropdown-content menu shadow bg-base-100 rounded-box w-40 p-2 z-1"
            >
              <li>
                <button
                  onClick={() => handleEditClick(link)}
                  className="flex items-center gap-2 text-sm"
                >
                  <FiEdit3 /> Edit
                </button>
              </li>
              <li>
                <button
                  onClick={() => deleteLink(link.id)}
                  className="flex items-center gap-2 text-sm text-red-500"
                >
                  <FiX /> Delete
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="card card-compact bg-base-200 shadow-md hover:shadow-lg rounded-2xl group relative hover:scale-[1.015] transition-transform duration-200 h-full"
      style={
        link.color
          ? {
              backgroundColor: link.color,
              borderColor: link.color,
            }
          : {}
      }
    >
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="card-body items-center text-center p-1 pb-1.5 flex flex-col justify-start h-full relative z-10"
      >
        <div className="mb-1">
          <div 
            className={`w-9 h-9 rounded-full flex items-center justify-center ${getIconBgClass()}`}
            style={getIconStyle()}
          >
            <img
              src={getFaviconUrl(link.url)}
              alt={`${link.name} favicon`}
              className="w-6 h-6 object-contain"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'vite.svg';
              }}
            />
          </div>
        </div>
        <h3
          className="text-xs font-medium text-base-content break-words text-center leading-tight line-clamp-2"
          title={link.name}
        >
          {link.name}
        </h3>
      </a>
      <div className="absolute top-1.5 right-1.5 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="dropdown dropdown-end">
          <button
            tabIndex={0}
            className="btn btn-xs btn-circle btn-ghost text-white"
          >
            <FiMoreHorizontal size={14} style={{ pointerEvents: 'none' }} />
          </button>
          <ul
            tabIndex={0}
            className="dropdown-content menu shadow bg-base-100 rounded-box w-40 p-2 z-1"
          >
            <li>
              <button
                onClick={() => handleEditClick(link)}
                className="flex items-center gap-2 text-sm"
              >
                <FiEdit3 /> Edit
              </button>
            </li>
            <li>
              <button
                onClick={() => deleteLink(link.id)}
                className="flex items-center gap-2 text-sm text-red-500"
              >
                <FiX /> Delete
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
