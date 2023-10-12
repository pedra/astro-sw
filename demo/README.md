<img align="right" src="https://billrocha.netlify.app/Handmade.png" alt="Hand Made">

# Hello!!

## Welcome to **NotFlix⚡**!

This demo application was created with a “clean” version of **Astro** to demonstrate the operation of the "**Astro-sw**" integration, which helps in the development of a **service work** for web applications, such as websites and PWAs.

It is a video site that uses **Pixabay** and, because it is videos, has a high network consumption. The issue is alleviated with the service worker intercepting the loading of images and videos from Pixabay, writing them to the browser cache. The next accesses will therefore be made locally without consuming the network.

> See this demo running at https://astrosw-demo.netlify.app and watch this [short video](https://youtu.be/oOn-HDZxdY4) that shows the **astro-sw** plugin in action.

## Installation

Open a terminal on your system and clone this Github repository, with the following command:

```
git clone https://github.com/pedra/astro-sw.git
```
Enter the folder created by the previous command and install the dependencies.

```
npm install
```
After installation, start the application in development mode.

```
npm run dev
```
Open your internet browser to the address "http://localhost" and you can study, modify and use this project.

## 👀 Want to learn more?

### Service Worker

Find a lot of information about **Service Workers** in the Mozzila documentation (see [MDN: Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)).

### Astro
I (highly) recommend studying and using **Astro** in your **next frontend projects**. **Astro** easily integrates with React, Svelte, Vue, Preact, Alpinejs, Solid-js, Lit and pure Javascript or TypeScript.

Feel free to check out [Astro.build](https://astro.build), the [documentation](https://docs.astro.build) or head over to the [Discord server](https://astro.build/chat).

### Pixabay
**Pixabay** is an incredible [website](https://pixabay.com) with free images, videos and audios in a community format: you can upload and download content freely. The list of videos used in this application were obtained through its free [API](https://pixabay.com/pt/service/about/api).

## License

[MIT](https://mit-license.org) © [Bill Rocha](https://billrocha.netlify.com)

_This software was written by human hands.._ <img align="left" src="https://billrocha.netlify.app/handmade_32.png" alt="Hand Made">