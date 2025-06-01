import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const defaultLinks = [
  { id: crypto.randomUUID(), name: 'Nuxt',     url: 'https://nuxtjs.org',       group: 'Development', color: 'rgba(5, 150, 105, 0.7)' },
  { id: crypto.randomUUID(), name: 'daisyUI',  url: 'https://daisyui.com/',     group: 'Development'  , color: 'rgb(246, 169, 59, 0.7)' },
  { id: crypto.randomUUID(), name: 'YouTube',  url: 'https://youtube.com',      group: 'Social media', color: 'rgba(255, 0, 0, 0.7)' },
  { id: crypto.randomUUID(), name: 'X',        url: 'https://x.com',      group: 'Social media', color: 'rgb(16, 16, 16, 0.7)' },
  { id: crypto.randomUUID(), name: 'Steam',    url: 'https://store.steampowered.com', group: 'Gaming', color: 'rgb(0, 44, 97, 0.7)' },
]

export const useLinksStore = create(
  persist(
    (set, get) => ({
      linkChanged: 0,
      defaultLinks,
      links: defaultLinks.slice(),

      // actions
      addLink: (link) =>
        set((state) => ({
          links: [...state.links, { ...link, id: crypto.randomUUID() }],
          linkChanged: state.linkChanged + 1,
        })),

      addMultipleLinks: (newLinks) =>
        set((state) => {
          const existingUrls = new Set(state.links.map(link => link.url));
          const filteredNewLinks = newLinks.filter(link => !existingUrls.has(link.url));
          if (filteredNewLinks.length === 0) {
            return state;
          }
          return {
            links: [...state.links, ...filteredNewLinks],
            linkChanged: state.linkChanged + filteredNewLinks.length,
          };
        }),

      deleteLink: (id) =>
        set((state) => ({
          links: state.links.filter((l) => l.id !== id),
          linkChanged: state.linkChanged + 1,
        })),

      updateLink: (id, newLinkData) =>
        set((state) => {
          const idx = state.links.findIndex((l) => l.id === id)
          if (idx === -1) return {}
          const updated = [...state.links]
          updated[idx] = { ...updated[idx], ...newLinkData }
          return { links: updated, linkChanged: state.linkChanged + 1 }
        }),

      clearAllData: () =>
        set({
          links: defaultLinks.slice(),
          linkChanged: 0,
        }),

      getLinks: () => get().links,
      getUniqueGroups: () => [...new Set(get().links.map((l) => l.group))],
    }),
    {
      name: 'links-storage',  // localStorage key
      partialize: (state) => ({
        links: state.links,
        linkChanged: state.linkChanged,
      }),
    }
  )
)
