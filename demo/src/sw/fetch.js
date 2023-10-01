const CONFIG = '/config'
self.addEventListener('fetch', (event) => {
	const {
		request,
		request: { url, method }
	} = event

	// Save||load json data in Cache Storage CONFIG
	if (url.match(CONFIG)) {
		if (method === 'POST') {
			request
				.json()
				.then((body) =>
					caches
						.open(CACHE)
						.then((cache) =>
							cache.put(
								CONFIG,
								new Response(JSON.stringify(body)),
							)
						)
				)
			return event.respondWith(new Response('{}'))
		} else {
			return event.respondWith(
				caches
					.match(CONFIG)
					.then((response) => response || new Response('{}'))
			)
		}
	} else {
		// Get & save request in Cache Storage
		if (method !== 'POST') {
			event.respondWith(
				caches.open(CACHE).then(async (cache) => {

					let response = await cache.match(event.request)
					if (response) return response

					// To fix 'chrome-extension'
					if (url.startsWith('chrome-extension') ||
						url.includes('extension') ||
						!(url.indexOf('http') === 0))
						return await fetch(event.request)

					response = await cache.match(event.request.url += 'index.html')
					if (response) return response

					response = await cache.match(event.request.url += '/index.html')
					if (response) return response

					response = await fetch(event.request)

					// To save the request in the cache.
					// 👇 It can cause problems if not carefully filtered.
					if (ASSETS.length > 0 && (
						url.startsWith('https://cdn.pixabay.com') ||
						url.startsWith('https://fonts.g'))) cache.put(event.request, response.clone())

					return response
				})
			)
		}
	}
})