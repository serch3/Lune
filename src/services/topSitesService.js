/**
 * Get the browser’s top sites as a promise.
 * @returns {Promise<chrome.topSites.MostVisitedURL[]>}
 */
const getTopSites = () =>
  new Promise((resolve, reject) => {
    if (!chrome?.topSites?.get) {
      return reject(new Error('chrome.topSites API not available'));
    }
    chrome.topSites.get((sites) => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      resolve(Array.isArray(sites) ? sites : []);
    });
  });

/**
 * Fetch the user’s top sites and hand them off to your `addMultipleLinks` handler.
 *
 * @param {(links: Array<Object>) => void} addMultipleLinks
 * @param {Object} [opts]
 * @param {string[]} [opts.existingUrls] – URLs to skip
 * @param {number} [opts.limit=8]
 * @param {string} [opts.group='Favorites']
 * @param {string} [opts.color='#000']
 */
export async function fetchAndAddTopSites(
  addMultipleLinks,
  {
    existingUrls = [],
    limit = 8,
    group = 'Favorites',
    color = '#000',
  } = {}
) {
  try {
    const hasFetchedTopSites = localStorage.getItem('hasFetchedTopSites');
    if (hasFetchedTopSites) {
      console.info('Initial top sites fetch already performed.');
      return;
    }

    const sites = await getTopSites();
    if (sites.length === 0) {
      console.info('No top sites returned by chrome.topSites.');
      return;
    }

    // Filter out any URLs you’ve already persisted, then get the top n sites
    const uniqueNew = sites
      .filter(
        (site) =>
          site.url &&
          !existingUrls.includes(site.url)
      )
      .slice(0, limit);

    if (uniqueNew.length === 0) {
      console.info('All top sites already added; nothing new to add.');
      return;
    }

    const baseTimestamp = Date.now();
    const linksToAdd = uniqueNew.map((site, idx) => ({
      id: crypto.randomUUID?.() ?? `${baseTimestamp}-${idx}`,
      name: site.title || new URL(site.url).hostname,
      url: site.url,
      group,
      color,
    }));

    addMultipleLinks(linksToAdd);
    localStorage.setItem('hasFetchedTopSites', 'true');
    console.info(`Added ${linksToAdd.length} top‐site link(s).`);
  } catch (err) {
    console.error('fetchAndAddTopSites failed:', err);
  }
}
