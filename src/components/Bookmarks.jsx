import { useState } from 'react';
import { useLinksStore } from '../stores/links';
import { FiEdit3, FiMoreHorizontal, FiX } from 'react-icons/fi';
import AddBookmark from './AddBookmarkModal';
import { EditBookmarkModal } from './EditBookmarkModal';
import { useModal } from '../hooks/useModal';

const Bookmarks = () => {
  const { links, getUniqueGroups, deleteLink } = useLinksStore();
  const groups = getUniqueGroups();
  const { isModalOpen: isEditModalOpen, openModal: openEditModal, closeModal: closeEditModal } = useModal();
  const [selectedBookmark, setSelectedBookmark] = useState(null);

  const handleEditClick = (bookmark) => {
    setSelectedBookmark(bookmark);
    openEditModal();
  };

  const getFaviconUrl = (url) => {
    try {
      const urlObj = new URL(url);
      return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=32`;
    } catch (error) {
      console.error("Error creating favicon URL:", error);
      return 'vite.svg';
    }
  };

  return (
    <div className="mt-6 w-full max-w-5xl px-4">
      {groups.map((group) => (
        <div key={group} className="mb-5">
          <h2 className="text-xl font-semibold mb-3 text-gray-200 capitalize">{group}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {links
              .filter((link) => link.group === group)
              .map((link) => (
                <div
                  key={link.name}
                  className="card card-compact bg-base-200 shadow-md hover:shadow-lg rounded-2xl group relative hover:scale-[1.015] transition-transform duration-200"
                  style={link.color ? { backgroundColor: link.color, borderColor: link.color } : {}}
                >
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card-body items-center text-center p-2 pb-3 flex flex-col justify-start h-full relative z-10"
                  >
                    <div className="mb-1">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center bg-black bg-opacity-30 backdrop-blur">
                        <img
                          src={getFaviconUrl(link.url)}
                          alt={`${link.name} favicon`}
                          className="w-6 h-6 object-contain"
                          onError={(e) => { e.target.onerror = null; e.target.src = 'vite.svg'; }}
                        />
                      </div>
                    </div>
                    <h3 className="text-xs font-medium text-base-content break-words text-center leading-tight line-clamp-2" title={link.name}>
                      {link.name}
                    </h3>
                  </a>

                  {/* Compact Dropdown Actions */}
                  <div className="absolute top-1.5 right-1.5 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="dropdown dropdown-end">
                      <button tabIndex={0} className="btn btn-xs btn-circle btn-ghost text-white">
                        <FiMoreHorizontal size={14} />
                      </button>
                      <ul tabIndex={0} className="dropdown-content menu shadow bg-base-100 rounded-box w-40 p-2 z-[1]">
                        <li>
                          <button onClick={() => handleEditClick(link)} className="flex items-center gap-2 text-sm">
                            <FiEdit3 /> Edit
                          </button>
                        </li>
                        <li>
                          <button onClick={() => deleteLink(link.id)} className="flex items-center gap-2 text-sm text-red-500">
                            <FiX /> Delete
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
      <AddBookmark />
      {selectedBookmark && (
        <EditBookmarkModal
          bookmark={selectedBookmark}
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
        />
      )}
    </div>

  );
};

export default Bookmarks;
