import { useState } from 'react';
import { useLinksStore } from '../stores/links';
import AddBookmark from './AddBookmarkModal';
import { EditBookmarkModal } from './EditBookmarkModal';
import { useModal } from '../hooks/useModal';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { BookmarkItem } from './BookmarkItem';

const Bookmarks = () => {
  const { links, getUniqueGroups, deleteLink, updateLinkGroupAndPosition, addLink } = useLinksStore();
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
