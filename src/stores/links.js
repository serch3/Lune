import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const defaultLinks = [
  { id: Date.now() + 1, name: 'Nuxt',     url: 'https://nuxtjs.org',      group: 'Programming', color: '#059669' },
  { id: Date.now() + 2, name: 'daisyUI',  url: 'https://daisyui.com/',    group: 'Programming'               },
  { id: Date.now() + 3, name: 'YouTube',  url: 'https://youtube.com',      group: 'Entertainment', color: '#FF0000' },
  { id: Date.now() + 4, name: 'Reddit',   url: 'https://reddit.com',       group: 'Entertainment', color: '#FF4500' },
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
          links: [...state.links, { ...link, id: Date.now() }],
          linkChanged: state.linkChanged + 1,
        })),

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

      fetchAndAddTopSites: () => {
        if (chrome && chrome.topSites && chrome.topSites.get) {
          chrome.topSites.get((sites) => {
            const topEightSites = sites.slice(0, 8);
            const favoriteLinks = topEightSites.map((site, index) => ({
              id: Date.now() + 1000 + index,
              name: site.title,
              url: site.url,
              group: 'Favorites',
              color: '#6b7280', // Default color for favorites
            }));
            set((state) => ({
              links: [...state.links, ...favoriteLinks],
              linkChanged: state.linkChanged + 1,
            }));
          });
        } else {
          console.warn('chrome.topSites API is not available.');
        }
      },

      clearAllData: () =>
        set({
          links: defaultLinks.slice(),
          linkChanged: 0,
        }),

      // getters (as functions on the store)
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
