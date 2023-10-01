// Receive messages from the main script.
self.onmessage = function (e) {
	if (e.data.action === 'skipWaiting') {
		self.skipWaiting()
	}
	if (e.data.action === 'update') {
		self.registration.update()
	}
	if (e.data.action === 'sync') {
		self.registration.sync.register('sync-news')
			.then(() => {
				// ...
			})
	}
	sendMessage({ type: 'receive', msg: e.data })
}

// Send a message to the main script.
function sendMessage(message) {
	self.clients.matchAll().then(a => {
		if (a[0]) {
			self.clients.get(a[0].id).then(client => {
				client.postMessage(message)
			})
		}
	})
}
