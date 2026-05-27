import { useMemo, useState } from 'react';
import { useLinksStore } from '../stores/links';
import AddBookmark from './AddBookmarkModal';
import { EditBookmarkModal } from './EditBookmarkModal';
import { useModal } from '../hooks/useModal';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { BookmarkItem } from './BookmarkItem';
import { FiSearch, FiX } from 'react-icons/fi';

const Bookmarks = () => {
  const { links, getUniqueGroups, deleteLink, updateLinkGroupAndPosition, addLink } = useLinksStore();
  const groups = getUniqueGroups();
  const {
    isModalOpen: isEditModalOpen,
    openModal: openEditModal,
    closeModal: closeEditModal,
  } = useModal();
  const [selectedBookmark, setSelectedBookmark] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const isFiltering = searchTerm.trim().length > 0;

  const filteredLinks = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return links;

    return links.filter((link) => {
      const haystack = [link.name, link.url, link.group].join(' ').toLowerCase();
      return haystack.includes(term);
    });
  }, [links, searchTerm]);

  const visibleGroups = useMemo(
    () => groups.filter((group) => filteredLinks.some((link) => link.group === group)),
    [groups, filteredLinks]
  );

  const handleEditClick = (bookmark) => {
    setSelectedBookmark(bookmark);
    openEditModal();
  };

  const onDragEnd = (result) => {
    if (isFiltering) return;
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
        <div className="mb-5 rounded-2xl border border-white/10 bg-black/20 backdrop-blur-md px-4 py-3 shadow-lg">
          <label className="flex items-center gap-3">
            <FiSearch className="text-gray-400 shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search bookmarks, URLs, or groups"
              className="w-full bg-transparent outline-none placeholder:text-gray-500 text-gray-100"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="btn btn-ghost btn-xs btn-circle text-gray-400 hover:text-white"
                aria-label="Clear bookmark search"
              >
                <FiX />
              </button>
            )}
          </label>
          <div className="mt-2 text-xs text-gray-400 flex items-center justify-between gap-3">
            <span>
              {filteredLinks.length} bookmark{filteredLinks.length === 1 ? '' : 's'} shown
            </span>
            {searchTerm && <span>Filtering by “{searchTerm}”</span>}
          </div>
          {isFiltering && (
            <p className="mt-2 text-xs text-amber-300/90">
              Reordering is disabled while filtering so bookmark positions stay consistent.
            </p>
          )}
        </div>

        {visibleGroups.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-black/10 px-6 py-10 text-center text-gray-300">
            <p className="text-lg font-medium">No bookmarks match your search.</p>
            <p className="mt-2 text-sm text-gray-400">Try a different keyword or clear the filter.</p>
          </div>
        ) : (
          visibleGroups.map((group) => (
            <Droppable droppableId={group} key={group} type="BOOKMARK">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  onDragOver={(e) => {
                    // Allow dropping external items (like bookmarks from the browser)
                    if (e.dataTransfer.types.includes('text/uri-list') || e.dataTransfer.types.includes('text/plain')) {
                      e.preventDefault();
                    }
                  }}
                  onDrop={(e) => {
                    let url = e.dataTransfer.getData('URL') || e.dataTransfer.getData('text/uri-list') || e.dataTransfer.getData('text/plain');
                    if (url) {
                      // Extract the first valid http/https URL if there are multiple lines (e.g., text/uri-list)
                      const urlMatch = url.match(/https?:\/\/[^\s]+/);
                      if (urlMatch) {
                        url = urlMatch[0];
                        e.preventDefault();
                        let name = 'New Bookmark';
                        const html = e.dataTransfer.getData('text/html');
                        if (html) {
                          const match = html.match(/<a[^>]*>(.*?)<\/a>/i);
                          if (match && match[1]) {
                            name = match[1].replace(/<[^>]+>/g, '').trim() || name;
                          }
                        }
                        addLink({ name, url, group, color: '' });
                      }
                    }
                  }}
                  className={`mb-5 p-1.5 rounded-md ${
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
                    {filteredLinks
                      .filter((link) => link.group === group)
                      .map((link, index) => (
                        <Draggable draggableId={link.id} index={index} key={link.id} isDragDisabled={isFiltering}>
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
                              <BookmarkItem
                                link={link}
                                group={group}
                                handleEditClick={handleEditClick}
                                deleteLink={deleteLink}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))
        )}
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
