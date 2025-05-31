let intervalId = null
let currentApiKey = ''
let currentCollectionId = ''
let currentFrequency = ''

/**
 * @param {string} apiKey
 * @param {string} collectionId
 * @param {string} frequency
 * @returns {Promise<string|null>} Unsplash image URL or null on error
 */
async function fetchUnsplashImage(apiKey, collectionId, frequency) {
  if (!apiKey) return null

  let url = `https://api.unsplash.com/photos/random?client_id=${apiKey}`
  if (collectionId) {
    url += `&collections=${collectionId}`
  }

  let cacheBuster = new Date().toISOString().slice(0, 10)
  if (frequency === 'hourly') {
    cacheBuster = new Date().toISOString().slice(0, 13)
  } else if (frequency === 'weekly') {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    const day = now.getDate()
    const weekOfMonth = Math.floor((day - 1) / 7)
    cacheBuster = `${year}-M${month}-W${weekOfMonth}`
  } else if (frequency === 'manual') {
    cacheBuster = `${Date.now()}`
  }
  url += `&cache_buster=${cacheBuster}`

  try {
    const response = await fetch(url)
    if (!response.ok) {
      const errorText = await response.text()
      postMessage({
        type: 'error',
        payload: `Error fetching Unsplash image: ${response.status} ${errorText}`,
      })
      return null
    }
    const data = await response.json()
    return data.urls.regular
  } catch (err) {
    postMessage({
      type: 'error',
      payload: `Error fetching Unsplash image: ${err.message}`,
    })
    return null
  }
}

/**
 * @param {string} apiKey
 * @param {string} collectionId
 * @param {string} frequency
 */
function setupInterval(apiKey, collectionId, frequency) {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
  if (!apiKey) return

  let refreshMs = 0
  if (frequency === 'hourly') {
    refreshMs = 60 * 60 * 1000
  } else if (frequency === 'daily') {
    refreshMs = 24 * 60 * 60 * 1000
  } else if (frequency === 'weekly') {
    refreshMs = 7 * 24 * 60 * 60 * 1000
  } else {
    return
  }

  intervalId = setInterval(async () => {
    const url = await fetchUnsplashImage(apiKey, collectionId, frequency)
    if (url) {
      postMessage({ type: 'newImage', payload: url })
    }
  }, refreshMs)
}

self.onmessage = async (event) => {
  const { type, payload } = event.data

  if (type === 'INIT' || type === 'SETTINGS_UPDATED') {
    currentApiKey = payload.unsplashApiKey
    currentCollectionId = payload.unsplashCollectionId
    currentFrequency = payload.unsplashFrequency

    if (currentApiKey) {
      const url = await fetchUnsplashImage(
        currentApiKey,
        currentCollectionId,
        currentFrequency
      )
      if (url) {
        postMessage({ type: 'newImage', payload: url })
      }
    }
    setupInterval(currentApiKey, currentCollectionId, currentFrequency)
  } else if (type === 'FETCH_NOW') {
    if (currentApiKey) {
      const url = await fetchUnsplashImage(
        currentApiKey,
        currentCollectionId,
        currentFrequency
      )
      if (url) {
        postMessage({ type: 'newImage', payload: url })
      }
    }
  }
}
