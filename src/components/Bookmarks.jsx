import { useState } from 'react';
import { useLinksStore } from '../stores/links';
import { FiEdit3, FiMoreHorizontal, FiX } from 'react-icons/fi';
import AddBookmark from './AddBookmarkModal';
import { EditBookmarkModal } from './EditBookmarkModal';
import { useModal } from '../hooks/useModal';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const Bookmarks = () => {
  const { links, getUniqueGroups, deleteLink, updateLinkGroupAndPosition } = useLinksStore();
  const groups = getUniqueGroups();
  const {
    isModalOpen: isEditModalOpen,
    openModal: openEditModal,
    closeModal: closeEditModal,
  } = useModal();
  const [selectedBookmark, setSelectedBookmark] = useState(null);

  const handleEditClick = (bookmark) => {
    setSelectedBookmark(bookmark);
    openEditModal();
  };

  const getFaviconUrl = (url, size = 32) => {
    try {
      const urlObj = new URL(url);
      return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=${size}`;
    } catch {
      return 'vite.svg';
    }
  };

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    updateLinkGroupAndPosition(draggableId, source, destination);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="mt-6 w-full max-w-5xl px-4">
        {groups.map((group) => (
          <Droppable droppableId={group} key={group} type="BOOKMARK">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`mb-2.5 p-1.5 rounded-md ${
                  snapshot.isDraggingOver ? 'bg-gray-700/30' : ''
                }`}
              >
                <h2 className="text-xl font-semibold mb-3 text-gray-200 capitalize">
                  {group}
                </h2>
                <div
                  className={`grid ${
                    group === 'Favorites'
                      ? 'gap-2 grid-cols-4 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8 xl:grid-cols-10'
                      : 'gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
                  }`}
                >
                  {links
                    .filter((link) => link.group === group)
                    .map((link, index) => (
                      <Draggable draggableId={link.id} index={index} key={link.id}>
                        {(providedDraggable, snapshotDraggable) => (
                          <div
                            ref={providedDraggable.innerRef}
                            {...providedDraggable.draggableProps}
                            {...providedDraggable.dragHandleProps}
                            className={`transition-shadow duration-150 ${
                              snapshotDraggable.isDragging
                                ? 'shadow-2xl scale-105'
                                : ''
                            }`}
                          >
                            {group === 'Favorites' ? (
                              <div
                                className="p-2 rounded-lg hover:bg-gray-700/40 transition-colors duration-150 flex flex-col items-center relative group h-full"
                                style={
                                  link.color
                                    ? { boxShadow: `0 0 0 1.5px ${link.color}99` }
                                    : {}
                                }
                              >
                                <a
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex flex-col items-center text-center w-full h-full justify-start"
                                >
                                  <div className="mb-1.5 w-9 h-9 rounded-md flex items-center justify-center bg-black bg-opacity-10 backdrop-blur-sm">
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
                                      className="dropdown-content menu shadow bg-base-100 rounded-box w-40 p-2 z-[1]"
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
                            ) : (
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
                                    <div className="w-9 h-9 rounded-full flex items-center justify-center bg-black bg-opacity-30 backdrop-blur">
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
                                      className="dropdown-content menu shadow bg-base-100 rounded-box w-40 p-2 z-[1]"
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
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
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
    </DragDropContext>
  );
};

export default Bookmarks;
