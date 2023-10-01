self.addEventListener('install', e =>
	e.waitUntil(
		caches.open(CACHE).then((cache) => {
			console.log(`[SWORKER install] caching "${CACHE}"`)
			cache.addAll(ASSETS)
		}).then(() => {
			sendMessage({ text: 'install' })
			self.skipWaiting()
		})
	)
)

self.addEventListener('activate', e =>
	e.waitUntil(
		caches.keys().then(async (ks) => {
			for (const k of ks) {
				if (k !== CACHE) {
					console.log(`[SWORKER removing] cache "${k}"`)
					await caches.delete(k)
				}
			}
			sendMessage({ text: 'activate', action: 'reset' })
			self.clients.claim()
		})
	)
)