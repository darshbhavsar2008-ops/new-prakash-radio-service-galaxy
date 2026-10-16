# New Prakash Radio Service — Galaxy to showroom

A responsive React and Three.js story site for New Prakash Radio Service in Idar, Gujarat. It moves from a cinematic globe and location chapter into a scroll-controlled, five-zone virtual electronics showroom, then ends at a directions panel. Static frontend; no API keys or paid services.

## Run

```sh
npm install
npm run dev
npm run build
npm run preview
```

## GitHub Pages

Push the project to a GitHub repository named `new-prakash-radio-service-galaxy`, then choose **Settings → Pages → Build and deployment → GitHub Actions**. `.github/workflows/deploy.yml` builds and publishes the static site. Change `base` in `vite.config.ts` if the repository uses another name.

## Virtual showroom and real store assets

No photo, measurement, or floor plan of the actual shop was present in the supplied workspace. The walkthrough is an illustrative retail concept, not an accurate digital twin of New Prakash Radio Service. Its scroll-controlled route is arranged as entrance → smartphones and tablets → television wall → cooling and appliances → billing counter. Product screens and fixtures are conceptual; no stock, brands, specifications, or availability are claimed.

For a photorealistic version that matches the real shop, add photos under `public/assets/store/`: `entrance.jpg` (standing eye-height view down the central aisle), `counters.jpg` (display islands), `television-wall.jpg` (TVs and shelving), and `billing-counter.jpg`. A floor plan or a few room measurements would let the virtual layout follow the actual store. Avoid extreme wide-angle distortion.

## Asset and location notes

- Earth is mapped with the public Three.js example texture at runtime. The next section is a schematic map; its marker is approximate and not a verified coordinate.
- Directions opens a Google Maps address search for the supplied business name/address; it does not assert that an exact pin has been confirmed.
- Store categories are descriptive only. No stock, pricing, product models, phone number, business hours, warranties, or business history are invented.
- The 3D showroom is generated from lightweight Three.js geometry and procedural materials; the walkthrough advances only with scroll and has a non-WebGL fallback. Earth textures and Google Fonts load from their public sources at runtime.

## Structure

- `src/App.tsx` — navigation and five story chapters
- `src/components/Scenes.tsx` — Earth, 3D business card, and scroll-controlled virtual showroom
- `src/hooks/useCinematicScroll.ts` — Lenis / GSAP ScrollTrigger lifecycle
- `src/styles/site.css` — visual system, responsive layouts and reduced-motion support
- `public/assets/` — approved local assets
