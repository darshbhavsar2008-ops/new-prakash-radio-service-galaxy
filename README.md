# New Prakash Radio Service — Galaxy to showroom

A responsive React and Three.js story site for New Prakash Radio Service in Idar, Gujarat. Static frontend; no API keys or paid services.

## Run

```sh
npm install
npm run dev
npm run build
npm run preview
```

## GitHub Pages

Push the project to a GitHub repository named `new-prakash-radio-service-galaxy`, then choose **Settings → Pages → Build and deployment → GitHub Actions**. `.github/workflows/deploy.yml` builds and publishes the static site. Change `base` in `vite.config.ts` if the repository uses another name.

## Actual showroom photography needed

No showroom photo was present in the supplied workspace. The showroom and visit backdrop currently use a temporary Unsplash reference photo, clearly labeled in the page. It is not New Prakash Radio Service. Add store imagery under `public/assets/store/`, then change the `photo-parallax` and `visit-backdrop` image URLs in `src/styles/site.css` to local assets.

Recommended photographs: `entrance.jpg` (wide entrance view down the central aisle), `counters.jpg` (display islands at eye height), `television-wall.jpg` (screens and shelving), and `billing-counter.jpg`. A single high-resolution entrance view can replace the reference immediately; additional views can be used for scroll-driven transitions. Avoid wide-angle distortion and shoot around standing eye height.

## Asset and location notes

- Earth is mapped with the public Three.js example texture at runtime. The next section is a schematic map; its marker is approximate and not a verified coordinate.
- Directions opens a Google Maps address search for the supplied business name/address; it does not assert that an exact pin has been confirmed.
- Store categories are descriptive only. No stock, pricing, product models, phone number, business hours, warranties, or business history are invented.
- External runtime assets: Three.js Earth textures and Google Fonts. The temporary store reference is a photo by Raymond Yeung, [“Crowd of people in a busy electronics store”](https://unsplash.com/photos/crowd-of-people-in-a-busy-electronics-store-fRellSxhFi8), offered under the Unsplash License. Replace it with actual store imagery before presenting the site as a real showroom view.

## Structure

- `src/App.tsx` — navigation and five story chapters
- `src/components/Scenes.tsx` — Earth and actual 3D business card
- `src/hooks/useCinematicScroll.ts` — Lenis / GSAP ScrollTrigger lifecycle
- `src/styles/site.css` — visual system, responsive layouts and reduced-motion support
- `public/assets/` — approved local assets
