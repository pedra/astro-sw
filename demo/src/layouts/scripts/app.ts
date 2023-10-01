import { shuffle, report, server, randomize, __, __c } from "@components/Utils/utils"
import Shop from "@components/Shop/shop"
import Stage from '@components/Stage/stage'

type TVideo = {
	id?: string
	user?: string
	userImageURL?: string
	pageURL?: string
	tags?: string
	views?: string
	likes?: string
	duration?: string
	downloads?: string
	type?: string
	videos?: {
		tiny?: {
			url?: string
		}
	}
}

const App = new class AppClass {

	url = {
		video: '/data/pixabay_video.json',
		image: '/data/pixabay_image.json',
		site: 'https://pixabay.com/',
		default: '/img/og.jpg',
		vimeo: 'https://i.vimeocdn.com/video/'
	}
	videos: TVideo[] = []
	video: TVideo = {}

	// HTML elements
	splash = '#splash'
	theme = 'dark'
	theme_switcher = '#theme'
	theme_icon = '#theme span'
	theme_class = 'body'
	stage_video = '#stage video'

	constructor() {
		__(`${this.splash} button.btn-primary`).onclick = (e: any) => {
			__(this.splash).classList.remove('on')
			setTimeout(() => __(this.stage_video).play(), 100)
		}
		__(`${this.splash} button.btn-flat`).onclick = (e: any) => location.href = this.url.site

		// Theme
		this.changeTheme(localStorage.getItem('theme') || this.theme)
		__(this.theme_switcher).onclick = () => this.changeTheme()
	}

	async start() {
		const d = await server({ url: this.url.video })
		if (d.hits) {
			this.videos = shuffle(d.hits)
			this.video = this.videos[randomize(this.videos.length)]
		}

		if (navigator.serviceWorker) navigator.serviceWorker.onmessage = e => this.#message(e)

		Stage.mount(this.video)
		Shop.mount(this.videos)
	}

	#message(e: any): void {
		if (e.data.action == 'reset') {
			report('New version found!<br>Installing...')
		}
	}

	stage(id: number): void {
		const i = this.videos.findIndex((a: any) => a.id == id)
		if (i < 0) {
			report('Video not found!')
			return
		}

		this.video = this.videos[i]
		return Stage.mount(this.video)
	}

	// Change or toggle the theme
	changeTheme(v: string | null = null) {
		const t = __(this.theme_icon)
		this.theme = !v ? (t.innerHTML == 'dark_mode' ? 'light' : 'dark') : v
		t.innerHTML = this.theme + '_mode'

		__(this.theme_class).classList[this.theme == 'dark' ? 'add' : 'remove']('dark')
		localStorage.setItem('theme', this.theme)
	}
}

window.addEventListener('load', () => App.start())
export default App