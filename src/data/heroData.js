// Promo banner slides for the home screen hero: one full-bleed background per slide
// with a large stylised title, a streaming-service tag and a CTA — like a show's own
// key art. `palette` = [sky, glow, ground] and drives the generated landscape
// background; set `image: "/images/..."` on a slide to use a real still instead.
export const HERO_INTERVAL_MS = 8000;

export const heroSlides = [
  {
    id: 'hero-wasteland',
    tag: 'New Season',
    title: 'Wasteland Chronicles',
    accent: '#ffcf3d',
    provider: 'Prime Video',
    providerColor: '#3dc3ff',
    cta: 'Watch Now',
    palette: ['#3a2a12', '#ff9a3d', '#120a04'],
    image: null,
  },
  {
    id: 'hero-neon-circuit',
    tag: 'Series Premiere',
    title: 'Neon Circuit',
    accent: '#4dfff0',
    provider: 'Samsung TV Plus',
    providerColor: '#4d9bff',
    cta: 'Watch Now',
    palette: ['#050818', '#6a4dff', '#02030a'],
    image: null,
  },
  {
    id: 'hero-golden-coast',
    tag: 'Trending Now',
    title: 'Golden Coast',
    accent: '#ffe08a',
    provider: 'Apple TV',
    providerColor: '#d9d9d9',
    cta: 'Watch Now',
    palette: ['#2a1710', '#ffb15a', '#0d0603'],
    image: null,
  },
  {
    id: 'hero-storm-watch',
    tag: 'Live',
    title: 'Storm Watch',
    accent: '#ffffff',
    provider: 'Live TV',
    providerColor: '#ff3b4a',
    cta: 'Watch Live',
    palette: ['#071018', '#3aa0ff', '#020507'],
    image: null,
  },
];
