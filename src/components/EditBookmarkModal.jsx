import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useLinksStore } from '@/stores/links';
import { useAlertStore } from '@/stores/alert';
import { GROUPS, COLORS } from '@/constants';
import { FiX } from 'react-icons/fi';

export function EditBookmarkModal({ bookmark, isOpen, onClose }) {
  const store = useLinksStore();
  const alertStore = useAlertStore();

  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [group, setGroup] = useState('');
  const [color, setColor] = useState('');

  useEffect(() => {
    if (bookmark) {
      setName(bookmark.name || '');
      setUrl(bookmark.url || '');
      setGroup(bookmark.group || 'Other');
      setColor(bookmark.color || '');
    }
  }, [bookmark]);

  const updateLink = () => {
    if (!bookmark) return;

    // Validate URL format
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      alertStore.setAlert('URL must start with http:// or https://', 'error');
      return;
    }
    // Validate Name and URL are not empty
    if (!name.trim() || !url.trim()) {
      alertStore.setAlert('Name and URL cannot be empty', 'error');
      return;
    }

    store.updateLink(bookmark.id, { // Uses bookmark.id now
      name,
      url,
      group: group || 'Other',
      color
    });
    alertStore.setAlert('Bookmark updated successfully!', 'success');
    onClose(); 
  };

  if (!isOpen || !bookmark) {
    return null;
  }

  return ReactDOM.createPortal(
    <div className="modal modal-open modal-bottom sm:modal-middle" role="dialog" aria-modal="true" aria-labelledby="edit-bookmark-title">
      <div className="modal-box backdrop-blur-lg shadow-2xl max-w-lg w-full flex flex-col rounded-t-2xl sm:rounded-2xl">
        {/* Header */}
        <div className="px-5 sm:px-7 py-4 sm:py-5 border-b border-neutral-700/50 flex justify-between items-center">
          <h3 id="edit-bookmark-title" className="font-semibold text-xl text-black dark:text-white">Edit Bookmark</h3>
          <button onClick={onClose} aria-label="Close edit bookmark modal" className="btn btn-sm btn-circle btn-ghost text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white">
            <FiX className="h-6 w-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-7 space-y-5 overflow-y-auto grow">
          <div>
            <label htmlFor={`bookmark-name-edit-${bookmark?.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Name</label>
            <input
              type="text"
              id={`bookmark-name-edit-${bookmark?.id}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Google"
              className="input input-bordered w-full b"
            />
          </div>
          <div>
            <label htmlFor={`bookmark-url-edit-${bookmark?.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">URL</label>
            <input
              type="url"
              required
              id={`bookmark-url-edit-${bookmark?.id}`}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              pattern="^(https?://)?([a-zA-Z0-9]([a-zA-Z0-9\-].*[a-zA-Z0-9])?\.)+[a-zA-Z].*$"
              className="input input-bordered w-full"
            />
          </div>
          <div>
            <label htmlFor={`bookmark-group-edit-${bookmark?.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Group (Optional)</label>
            <select
              id={`bookmark-group-edit-${bookmark?.id}`}
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              className="select select-bordered w-full"
            >
              <option value="">Select a group (or type a new one)</option>
              {GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            <input
              type="text"
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              placeholder="Or type a new group name"
              className="input input-bordered w-full"
            />
          </div>
          <div>
            <label htmlFor={`bookmark-color-edit-${bookmark?.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Color (Optional)</label>
            <div className="grid grid-cols-5 sm:grid-cols-7 gap-2">
              {COLORS.map(c => (
                <button
                  key={c.name}
                  type="button"
                  title={c.name}
                  onClick={() => setColor(c.color)}
                  className={`w-full h-10 rounded-lg border-2 ${color === c.color ? 'ring-2 ring-offset-2 ring-offset-gray-800 dark:ring-offset-neutral-800 ring-blue-500 border-blue-400' : 'border-gray-300 dark:border-neutral-600/80'}`}
                  style={{ backgroundColor: c.color }}
                />
              ))}
              {color && (
                <button
                  type="button"
                  onClick={() => setColor('')}
                  className="w-full h-10 rounded-lg border-2 border-gray-300 dark:border-neutral-600/80 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-neutral-700/50"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer / Actions */}
        <div className="modal-action">
          <button onClick={onClose} className="btn btn-ghost w-full sm:w-auto text-black dark:text-white">
            Cancel
          </button>
          <button
            onClick={updateLink}
            className="btn btn-primary w-full sm:w-auto"
          >
            Save Changes
          </button>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </div>,
    document.body
  );
}
