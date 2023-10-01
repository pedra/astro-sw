import App from "@layouts/scripts/app"
import { __, convTime } from "@components/Utils/utils"

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

class StageClass {

	node: any = null

	constructor() {
		this.node = document.querySelector('#stage')
	}

	mount(video: TVideo): void {
		this.node.innerHTML =
			`
		<div class="stg-media" id="stg-${video.id}">
			<div class="stg-video" id="stg-video">
				<video autoplay loop>
  					<source src="${video.videos?.tiny?.url}" type="video/mp4">
						Your browser does not support the video tag.
				</video>
			</div>
		</div>
		<div class="stg-title" id="stg-title">
			<div class="stg-link" onclick="location.href='${video.pageURL}'">
				<img src="${video.userImageURL != "" ? video.userImageURL : App.url.default}"/>
				<h1>${video.user}</h1>
			</div>
				${this.#buildInfo(video)}
				<div class="stg-description">${video.tags}</div>
		</div>`

		window.scrollTo({ top: 0, behavior: 'smooth' })
		__('video').focus()
	}

	#buildInfo({ views, likes, duration, downloads, type }: TVideo): string {
		return '<div class="stg-info">' +
			`<div title="views"><span class="material-symbols-outlined">visibility</span>${views}</div>` +
			`<div title="likes"><span class="material-symbols-outlined">thumb_up</span>${likes}</div>` +
			`<div title="duration"><span class="material-symbols-outlined">schedule</span>${duration}s</div>` +
			`<div title="downloads"><span class="material-symbols-outlined">download</span>${downloads}</div>` +
			`<div title="quality" class="quality">${type}</div></div>`
	}
}

const Stage = new StageClass()
export default Stage