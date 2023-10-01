// GetElementById
export const __ = (e: string, b: any = false) => (b ? b : document).querySelector(e) || false
export const _a = (e: string, b: any = false) => (b ? b : document).querySelectorAll(e) || false

// Add Event Listener from click 
export const __c = (e: string, f: any, b: any = false, v: string = 'click'): void => {
	let c = __(e, b)
	if (!c) return
	c.addEventListener(v, f)
}
export const _al = (e: string, f: any, b: any = false, v: string = 'click'): void => {
	let c = _a(e, b)
	if (!c) return
	c.forEach((x: any) => x.addEventListener(v, f))
}

// Teste: _al('.glr-item', e => console.log('Clicou em :', __('h2', e.currentTarget).innerText))

// Converte um INTEIRO para a base 36 ou gera um randômico usando a DATA atual (timestamp)
export const random = (n?: number): string => ('number' == typeof n ? n : new Date().getTime()).toString(36)
export const randomize = (max: any): number => Math.floor(Math.random() * parseInt(max + 0))

// Returns a day of the year - days(new Date(1691969022601))
// @ts-ignore
export const yearDay = (d: any): number => Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24)

// Mostra mensagem na tela
export const report = (
	text: string,
	type: string = '',
	extra: any = null,
	tempo: number | any = null
): void => {
	extra = extra || null
	tempo = tempo || 2000 + text.length * 40
	type = 'rep-' + ((type == 'info' || type == 'i') ? "info" : (type == 'warn' || type == 'w') ? "warn" : "alert")

	const id = random()
	const c = document.createElement('DIV')
	c.className = `rep-content ${type}`
	c.id = id
	c.innerHTML = '<span class="material-symbols-outlined">close</span>' + text
	c.onclick = function (e: any): void {
		// @ts-ignore
		const x = e.target?.nodeName == 'I' ? e.target?.parentElement : e.target
		x.classList.remove('active')
		setTimeout(() => x.remove(), 400)
	}

	__('#report')?.appendChild(c)

	setTimeout(function () {
		document.getElementById(id)?.classList.add('active')
		setTimeout(function () {
			const e = document.getElementById(id)
			if (e) {
				e.classList.remove('active')
				setTimeout(() => e.remove(), 400)
			}
		}, tempo)
	}, 500)
}

// Convert PT1H2M3S (Youtube) to Date string
export const convTime = (a: string): any => {
	const i = a.toUpperCase()
	const r = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/
	let h = 0, m = 0, s = 0, t = 0, o = ''

	if (r.test(i)) {
		const matches: any = r.exec(i)
		if (matches[1]) h = Number(matches[1])
		if (matches[2]) m = Number(matches[2])
		if (matches[3]) s = Number(matches[3])
		t = h * 3600 + m * 60 + s
		o = (h < 1 ? '' : h + ':') + (h > 0 && m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s
	}
	return [t, o]
}

/* server({
		url     : 'https://site.com',
		data?   : { param: value, param: value ...} | undefined | null,
		method? : 'get' | 'post' | null < default GET >
	})
*/
type TServer = {
	url: string
	data?: any
	method?: string
}

type TSConfig = {
	method: string
	headers: {
		'Content-Type': string
	}
	body?: string
}
export const server = async ({ url, data, method }: TServer): Promise<boolean | any> => {
	const config: TSConfig = {
		method: method && method.toLowerCase() == 'post' ? 'POST' : 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	}

	data = data || {}

	if (config.method == 'GET') {
		url += Object.keys(data).length > 0 ? '?' + new URLSearchParams(data).toString() : ''
	} else {
		config.body = JSON.stringify(data)
	}

	let f = await fetch(url, config)
	return !f.ok ? false : await f.json()
}


// Array shuffle
export const shuffle = (a: any) => {
	let i = a.length, j, x = []

	// While there remain elements to shuffle.
	while (i > 0) {

		// Pick a remaining element.
		j = Math.floor(Math.random() * i)
		i--

		// And swap it with the current element.
		x = a[i]
		a[i] = a[j]
		a[j] = x
	}
	return a
}
