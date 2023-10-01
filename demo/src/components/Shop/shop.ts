import App from "@layouts/scripts/app"
import { __, _a, _al, report } from "@components/Utils/utils"

type TVideo = {
	id: string
	user: string
	user_id: number
	userImageURL: string
	picture_id: string
	pageURL: string
	tags: string
	views: string
	likes: string
	duration: string
	downloads: string
	type: string
	comments: string
	videos: {
		tiny: {
			url: string
			width: number
			height: number
			size: number
		}
	}
}

class ShopClass {

	videos: TVideo[] = []
	node: any = null
	imageSize: string = '_640x360.jpg'

	constructor() {
		this.node = document.querySelector('.shop #gallery')
	}

	mount(videos: any) {
		this.node.innerHTML = ''
		videos.forEach((v: TVideo) => {
			this.node.innerHTML += `
			<div class="glr-item" id="v-${v.id}">
				<div class="glr-media">
					<div class="glr-user">
						<div class="glr-user-content">
							<img loading="lazy" src="${v.userImageURL != "" ? v.userImageURL : App.url.default}"/>
							<span>${v.user}</span>
						</div>
					</div>					
					<img loading="lazy" src="${App.url.vimeo + v.picture_id + this.imageSize}" alt="${v.user}">
				</div>
				<div class="glr-content">
					<div class="glr-content-title">
						<a href="${v.pageURL}" class="glr-link" id="glr-link-${v.id}">
							<span class="material-symbols-outlined">play_circle</span>
						</a>
					${this.#buildInfo(v)}
					</div>
					<div class="glr-content-description">${v.tags}</div>
				</div>
			</div>`
		})
		setTimeout(() => this.#addListener(), 100)
	}

	#buildInfo({ views, likes, duration, downloads, comments, type }: TVideo): string {
		return '<div class="glr-content-info">' +
			`<div title="views"><span class="material-symbols-outlined">visibility</span>${views}</div>` +
			`<div title="likes"><span class="material-symbols-outlined">thumb_up</span>${likes}</div>` +
			`<div title="duration"><span class="material-symbols-outlined">schedule</span>${duration}s</div>` +
			`<div title="downloads"><span class="material-symbols-outlined">download</span>${downloads}</div>` +
			`<div title="comments"><span class="material-symbols-outlined">chat</span>${comments}</div>` +
			`<div title="quality" class="quality">${type}</div></div>`
	}

	#addListener(): void {
		_al('.glr-link', (e: any) => {
			e.preventDefault()
			let vid = e.currentTarget.id.replace('glr-link-', '')
			return App.stage(vid)
		})
	}
}

const Shop = new ShopClass()
export default Shop