import { readdirSync, readFileSync, writeFileSync, existsSync, statSync } from 'node:fs'
import { join, resolve, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import pkg from 'javascript-obfuscator'
const { obfuscate } = pkg
import { minify } from 'uglify-js'

const PluginName: string = 'Astro-sw'

export type TConfig = {
	dir: string
	order: []
	filename: string
	auto: boolean
	register: boolean
	obfuscate: boolean
	uglify: boolean
	outDir: string
	publicDir: string
	mode: string
}

export type TSWConfig = {
	dir?: string
	order?: []
	filename?: string
	auto?: boolean
	register?: boolean
	obfuscate?: boolean
	uglify?: boolean
}

const conf: TConfig = {
	dir: './src/sw',
	order: [],
	filename: 'sw.js',
	auto: true,
	register: true,
	obfuscate: false,
	uglify: true,
	outDir: './dist',
	publicDir: './public',
	mode: 'dev'
}

export function getConfig(): TConfig {
	return conf
}

function init(cfg: TSWConfig, outDir: string, publicDir: string, mode: string): void {
	conf.dir = resolve(undefined !== cfg.dir ? cfg.dir : conf.dir)

	if (undefined !== cfg.order) conf.order = cfg.order
	if (undefined !== cfg.filename) conf.filename = cfg.filename
	if (undefined !== cfg.auto) conf.auto = Boolean(cfg.auto)
	if (undefined !== cfg.register) conf.register = Boolean(cfg.register)
	if (undefined !== cfg.obfuscate) conf.obfuscate = Boolean(cfg.obfuscate)
	if (undefined !== cfg.uglify) conf.uglify = Boolean(cfg.uglify)

	conf.outDir = fileURLToPath(outDir)
	conf.publicDir = fileURLToPath(publicDir)
	conf.mode = mode === "build" ? 'build' : 'dev'

	if (conf.mode == 'dev') createSw()
}

/** Mounting the serviceWorker in "dev" mode
 * 1. Generate the CACHE version (auto = true)
 * 2. Create an empty ASSETS array 
 * 3. Concatenate the "parts" files (dir = './src/sw' by default)
 * 4. Save to ./public/sw.js (filename = 'sw.js' by default)
 */
function createSw(): void {
	const out: string = createCache() + createAssets() + getSwContent()
	writeFileSync(join(conf.publicDir, conf.filename), out)
}

function getSwContent(): string {
	const files: string[] = conf.order.length > 0 ? conf.order : treeFiles(conf.dir, conf.dir, '.js')

	// Fallback to sw_sample.js 😱
	if (files.length == 0) {
		const sf: string = resolve(fileURLToPath(new URL("./sample.js", import.meta.url)))
		if (!existsSync(sf)) throw new Error(`[astrojs-sw] ERROR: Reinstall plugin!`)
		return readFileSync(sf).toString()
	}

	let out: string = ''
	files.map(f => {
		const pf: string = join(conf.dir, f.split('.').pop() == 'js' ? f : f + '.js')
		if (!existsSync(pf)) throw new Error(`[astrojs-sw] ERROR: File "${pf}" not found`)
		out += (conf.mode == 'dev' ? `\n/*\n\t${PluginName}\n\tFile: ${pf}\n*/\n` : '') +
			`${readFileSync(pf).toString()}\n`
	})
	return out
}

function createCache(): string {
	return conf.auto === false ? '' :
		`const CACHE='cache-${new Date().getTime()}${conf.mode == 'build' ? '-pro' : '-dev'}';\n`
}


// Build functions ---------------------------------------------------------------------------------------
function createAssets(): string {
	let out: string = 'const ASSETS=['
	if (conf.mode == 'dev') return out + '];\n'

	const list: string[] = treeFiles(conf.outDir, conf.outDir)
	out += "\n\t'/',\n"
	list.map(f => out += `\t'${f}',\n`)

	return out + '];\n'
}

// Scan the build directory (./dist)
function treeFiles(
	dir: string,
	removeDir: string = '',
	ext: boolean | string = false,
	depth: number = 1000
): string[] {

	if (depth < 1) return []
	const list: string[] = []

	existsSync(dir) && readdirSync(dir).forEach((file: string) => {
		let base: string = `${dir}/${file}`

		if (statSync(base).isDirectory()) {
			const obj: string[] = treeFiles(base, removeDir, ext, depth - 1)
			obj.map((o: string) => list.push(o.replace(removeDir, '')))
		} else if (ext === false || ext === extname(base)) {
			list.push(base.replace(removeDir, ''))
		}
	})

	return list
}

/** Mounting the serviceWorker in "build" mode
 * 1. Generate the CACHE version (auto = true)
 * 2. Scan the "./dist" directory and create a list of files for ASSETS
 * 3. Concatenate the "part" files
 * 4. Save to "./dist/sw.js" (filename = 'sw.js' by default)
 */
function buildSw(): void {
	let out: string = createCache() + createAssets() + getSwContent()

	if (conf.obfuscate !== false) out = obfuscate(out).getObfuscatedCode()
	if (conf.uglify !== false) out = minify(out, { toplevel: true }).code

	writeFileSync(join(conf.outDir, conf.filename), out)
}

// Astro "createPlugin" ----------------------------------------------------------------------------------
function createPlugin(swConfig: TSWConfig = {}): any {
	return ({
		name: PluginName,
		hooks: {
			"astro:config:setup": ({ config, command, injectScript }) => {

				init(swConfig, config.outDir, config.publicDir, command)

				// Inject "serviceWorker registry"
				if (conf.register !== false)
					injectScript(
						"head-inline",
						`'serviceWorker' in navigator && navigator.serviceWorker.register('/${conf.filename}')`
					)
			},

			"astro:build:done": buildSw
		}
	})
}

export default createPlugin
