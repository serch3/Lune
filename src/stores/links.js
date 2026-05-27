import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * @typedef {Object} Link
 * @property {string} id
 * @property {string} name
 * @property {string} url
 * @property {string} group
 * @property {string} color
 */

const createLink = (partial) => ({
  id: crypto.randomUUID(),
  name: partial.name,
  url: partial.url,
  group: partial.group,
  color: partial.color,
});

const normalizeUrl = (url) => {
  try {
    const normalized = new URL(url);
    normalized.hash = '';
    normalized.search = '';
    normalized.hostname = normalized.hostname.toLowerCase();
    normalized.pathname = normalized.pathname.replace(/\/+$/, '') || '/';
    return normalized.toString();
  } catch {
    return (url || '').trim().toLowerCase().replace(/\/+$/, '');
  }
};

const isDuplicateLink = (links, candidate, ignoreId) => {
  const candidateUrl = normalizeUrl(candidate.url);
  const candidateName = candidate.name.trim().toLowerCase();

  return links.some((link) => {
    if (ignoreId && link.id === ignoreId) return false;
    return (
      normalizeUrl(link.url) === candidateUrl ||
      link.name.trim().toLowerCase() === candidateName
    );
  });
};

const defaultLinks = [
  createLink({
    name: 'Nuxt',
    url: 'https://nuxtjs.org',
    group: 'Development',
    color: 'rgba(5, 150, 105, 1)',
  }),
  createLink({
    name: 'daisyUI',
    url: 'https://daisyui.com/',
    group: 'Development',
    color: 'rgb(246, 169, 59, 1)',
  }),
  createLink({
    name: 'YouTube',
    url: 'https://youtube.com',
    group: 'Entertainment',
    color: 'rgba(255, 0, 0, 1)',
  }),
  createLink({
    name: 'X',
    url: 'https://x.com',
    group: 'Entertainment',
    color: 'rgb(0, 0, 0, 1)',
  }),
  // createLink({
  //   name: 'Apple Music',
  //   url: 'https://music.apple.com',
  //   group: 'Entertainment',
  //   color: 'rgb(244, 63, 94, 1)',
  // }),
  createLink({
    name: 'Spotify',
    url: 'https://open.spotify.com',
    group: 'Entertainment',
    color: 'rgb(34, 197, 94, 1)',
  }),
];

const computeTargetIndex = (allLinks, targetGroup, positionInGroup) => {
  const groupItems = allLinks.filter((l) => l.group === targetGroup);
  if (groupItems.length === 0) {
    const uniqueGroups = [...new Set(allLinks.map((l) => l.group))];
    const groupIndexInOrder = uniqueGroups.indexOf(targetGroup);
    if (groupIndexInOrder === -1) {
      return allLinks.length;
    }
    const nextGroup = uniqueGroups[groupIndexInOrder + 1];
    if (!nextGroup) {
      return allLinks.length;
    }
    const firstNextGroupIdx = allLinks.findIndex((l) => l.group === nextGroup);
    return firstNextGroupIdx !== -1 ? firstNextGroupIdx : allLinks.length;
  }
  const targetSibling = groupItems[positionInGroup];
  if (targetSibling) {
    return allLinks.findIndex((l) => l.id === targetSibling.id);
  }
  const lastOfGroup = allLinks
    .map((l, idx) => ({ link: l, idx }))
    .filter(({ link }) => link.group === targetGroup)
    .pop();
  if (lastOfGroup) {
    return lastOfGroup.idx + 1;
  }
  return allLinks.length;
};

export const useLinksStore = create(
  persist(
    (set, get) => ({
      linkChanged: 0,
      defaultLinks: defaultLinks.slice(),
      links: defaultLinks.slice(),

      addLink: (linkData) =>
        set((state) => {
          const candidate = {
            name: linkData.name || '',
            url: linkData.url || '',
          };

          if (isDuplicateLink(state.links, candidate)) {
            return {};
          }

          return {
            links: [...state.links, createLink(linkData)],
            linkChanged: state.linkChanged + 1,
          };
        }),

      addMultipleLinks: (newLinks) =>
        set((state) => {
          const existingLinks = [...state.links];
          const filtered = [];

          for (const link of newLinks) {
            if (!link?.name || !link?.url) continue;
            if (isDuplicateLink(existingLinks, link)) continue;
            filtered.push(link);
            existingLinks.push(link);
          }

          if (filtered.length === 0) {
            return {};
          }
          const itemsWithIds = filtered.map((l) => createLink(l));
          return {
            links: [...state.links, ...itemsWithIds],
            linkChanged: state.linkChanged + itemsWithIds.length,
          };
        }),

      deleteLink: (id) =>
        set((state) => ({
          links: state.links.filter((l) => l.id !== id),
          linkChanged: state.linkChanged + 1,
        })),

      updateLink: (id, newLinkData) =>
        set((state) => {
          const idx = state.links.findIndex((l) => l.id === id);
          if (idx === -1) return {};

          const candidate = {
            name: newLinkData.name ?? state.links[idx].name,
            url: newLinkData.url ?? state.links[idx].url,
          };

          if (isDuplicateLink(state.links, candidate, id)) {
            return {};
          }

          const updatedLinks = [...state.links];
          updatedLinks[idx] = { ...updatedLinks[idx], ...newLinkData };
          return {
            links: updatedLinks,
            linkChanged: state.linkChanged + 1,
          };
        }),

      updateLinkGroupAndPosition: (linkId, source, destination) => {
        if (!destination) return;
        set((state) => {
          const all = [...state.links];
          const removeIdx = all.findIndex((l) => l.id === linkId);
          if (removeIdx === -1) return {};
          const [moved] = all.splice(removeIdx, 1);
          moved.group = destination.droppableId;
          const insertAt = computeTargetIndex(
            all,
            destination.droppableId,
            destination.index
          );
          all.splice(insertAt, 0, moved);
          return {
            links: all,
            linkChanged: state.linkChanged + 1,
          };
        });
      },

      clearAllData: () =>
        set({
          links: defaultLinks.slice(),
          linkChanged: 0,
        }),

      exportLinks: () => {
        const payload = {
          timestamp: Date.now(),
          data: get().links,
        };
        return JSON.stringify(payload, null, 2);
      },

      importLinks: (jsonString) => {
        try {
          const parsed = JSON.parse(jsonString);
          if (!parsed.data || !Array.isArray(parsed.data)) {
            throw new Error('Invalid format: “data” array missing.');
          }
          const imported = [];
          const seen = [...get().links];

          for (const item of parsed.data) {
            if (!item.id || !item.url || !item.name || !item.group) {
              throw new Error('Every link must have id, name, url, and group.');
            }

            if (isDuplicateLink(seen, item)) {
              continue;
            }

            seen.push(item);
            imported.push(item);
          }
          if (imported.length > 0) {
            set((state) => ({
              links: [...state.links, ...imported],
              linkChanged: state.linkChanged + 1,
            }));
          }
          return { success: true, importedCount: imported.length };
        } catch (err) {
          return { success: false, message: err.message };
        }
      },

      getLinks: () => get().links,

      getUniqueGroups: () => [...new Set(get().links.map((l) => l.group))],
    }),
    {
      name: 'links-storage',
      partialize: (state) => ({
        links: state.links,
        linkChanged: state.linkChanged,
      }),
    }
  )
);
