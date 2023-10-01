self.addEventListener('notificationclick', (event) => {
	event.waitUntil(
		self.clients.matchAll().then((clientList) => {
			// console.log(
			// 	'[SWORKER notification] Notification click Received.',
			// 	clientList,
			// 	event.notification.data,
			// )

			var data =
				'undefined' !== typeof event.notification['data']
					? event.notification.data
					: {}

			event.notification.close()

			if (clientList.length > 0) {
				clientList[0].focus()
				return clientList[0].postMessage({
					msg: data,
					type: 'clientList[0]',
				})
			} else {
				self.clients
					.openWindow('/profile')
					.then((c) => {
						// console.log('[SWORKER client] OpenWindow: ', c)
						return c
					})
					.then((a) => {
						return a.postMessage({
							msg: data,
							type: 'clientList - clients - c',
						})
					})
			}
		}),
	)
})