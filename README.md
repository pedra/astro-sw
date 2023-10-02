<img align="right" src="https://billrocha.netlify.app/Handmade.png" alt="Hand Made">

# ⚡Astro-sw
Astro Service Worker integration for plain (vanilla) Javascript files.

## Installation

```
npx astro add astro-sw
```

## Getting started
	
Create a directory to contain your Service Worker files at path: ```./src/sw/```.
	
The Astro-sw plugin will load and concatenate the contents of the files contained in this directory and copy the result to ```./public/sw.js``` during development mode and to the path ```./dist/sw.js``` on build.

> The original files are not processed: just copied and concatenated. The developer needs to follow the rules defined for the API (see [MDN: Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)).

In build mode, files generated by Astro (and other integrations) will be scanned and added to the ASSETS array, injected into the service worker file (```./dist/sw.js```) for use in the browser cache. Optionally, the generated file can be processed with ```uglify-js``` and ```javascript-obfuscator```.
	
Some parameters can be configured in your application's ```astro.config.mjs```:
	
```javascript
import { defineConfig } from 'astro/config';
import sw from 'astro-sw'
	
const sw_config = {
    dir: './src/sw',        // path of files to be concatenated (default: './src/sw')
    order: [                // optional concatenation ordering (files with ".js" extension only)
        'cache', 
        'push/click.js',
        'fetch',
        // ... 
    ],	
    filename: 'sw.js',      // final filename (default: 'sw.js')
    auto: true,             // generate cache version automatically (default: true)
    obfuscate: false,       // build only: add obfuscation (default: false)
    uglify: false,          // build only: add uglify (default: false)
}

export default defineConfig({
    integrations: [			
        sw(sw_config),      // or just sw(), if you want to use the defaults
    ]
});
```

If no configuration is added, the default values will be assumed.

If Astro-sw does not find the ```./src/sw``` directory (configurable), it will load a ```sample.js``` file with the basics of a service worker: cache + fetch.

### ASSETS constant
	
An ASSETS constant is added by Astro-sw to list the files to be cached in the client's browser. In "dev" mode this array will be empty.
	
If you need to add files to the list, use "push" on this array:
	
```ASSETS.push( 'file' );```
	
Any file accessible by the browser in "dev" mode can be added. Your service worker must use ASSETS to populate the browser's cache.
	
In "production" mode, after the build, ASSETS will be AUTOMATICALLY populated with the files generated by Astro Builder in the ```./dist``` folder.

### CACHE constant

Astro-sw adds to the top of the service worker file a constant called "CACHE" that stores the automatically generated version, based on the timestamp at compile time.

In the browser, this version names the cache, giving you control over updating the cache.

You can generate your own CACHE constant containing the version by disabling automatic generation in the configuration (astro.config.mjs).

```javascript
...
export default defineConfig({
     integrations: [
         sw({ auto: false })
         ...
```

## Collaborators

If you are interested in collaborating with the development of this extension, you are **very welcome**!

Please, if you find bugs or if you have suggestions for improvements and addition of other features, open issues and add PRs. Thank you from the bottom of my heart ❤!

## TODO:

- [ ] Add WorkBox support.
- [x] Create a demo application (see the "[demo](https://github.com/pedra/astro-sw/tree/main/demo)" directory). ✔
- [x] Short [video](https://youtu.be/oOn-HDZxdY4) for quick demonstration. ✔
- [ ] Create a video tutorial to answer all your questions with:
	- Use of CACHE in browsers
	- Controlled Fetch
	- Use of advanced push notification
	- Background sync
	- etc.

## License

[MIT](https://mit-license.org) © [Bill Rocha](https://billrocha.netlify.com)

---
_This software was written by human hands.._ <img align="left" src="https://billrocha.netlify.app/handmade_32.png" alt="Hand Made">
