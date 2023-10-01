self.addEventListener('push', (event) => {
	event.waitUntil(
		self.clients.matchAll().then((clientList) => {
			console.log(
				`[SWORKER push] Push had this data: "${event.data.text()}"`,
			)

			var focused = clientList.some((client) => {
				client.postMessage({ msg: event.data.json(), type: 'push' })
				return client.focused
			})

			var msg = {
				title: 'error',
				body: 'Ocorreu um erro no envio de notificação!',
			}
			try {
				msg = event.data.json()
			} finally { /* empty */ }

			// Focus ...
			if (focused) {
				msg.body += "You're still here, thanks!"
			} else if (clientList.length > 0) {
				msg.body +=
					"You haven't closed the page, click here to focus it!"
			} else {
				msg.body +=
					'You have closed the page, click here to re-open it!'
			}

			const title = msg.title
			const options = {
				body: msg.body || 'New message from the server',
				icon: msg.icon || '/icon/android-chrome-192x192.png',
				badge: msg.badge || '/icon/favicon-32x32.png',
				image: msg.image || '/img/og.jpg',
				vibrate: msg.vibrate || [],
				data: JSON.parse(
					'undefined' == typeof msg['data'] ? false : msg['data'],
				),
			}

			return self.registration.showNotification(title, options)
		}),
	)
})

