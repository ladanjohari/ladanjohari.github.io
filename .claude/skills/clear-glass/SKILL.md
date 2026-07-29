---
name: clear-glass
description: Recipe for the Clear Glass visual identity (locked for the Gray Area piece, July 2026) - CSS for realistic clear-glass slabs laid on top of UI, color-under-glass, light + dark room variants, and the glide/sweep animations. Load whenever building or editing glass-material UI for Ladan's projects, when she says "clear glass", "the lens", "glass slab", "H direction", or wants this effect in a new project.
---

# Clear Glass — material + motion recipe

Extracted from the Gray Area exhibition identity work (~/projects/gray-area/grayarea-clear-glass-v4.html and -v5.html are the verified references; open them in a browser to see everything below live). The look originates from Apple's WWDC25 design-resources pages: glass as a REAL OBJECT lying on top of the interface, read through its bright edges and the color underneath it — never a blur-style painted on pixels.

## The concept that makes it ours

**The lens sits over whatever needs you.** One clear slab = the room's (or app's) attention. It rests on the element that needs a human, and it is never in two places. When a new question appears: the element turns amber FIRST, then the slab glides to it. Cause, then attention.

## Core grammar (do not change)

- Motion = working (sweep shimmer, no color)
- Color = exception: amber `#F29A18` = question waiting; green `#2FB74A` = done today. Nothing else gets color.
- Working sweep, light room: `linear-gradient(90deg,#C7CBD3 0%,#E8EAEE 45%,#C7CBD3 60%)`; dark room: `#2E3038 / #565B68 / #2E3038`.

## The glass slab — light room (bg #E9EAED)

Glass on a bright surface reads by its SHADOWS and bright top edge:

```css
.glass{
  border-radius:33px; /* fully capsule; radius = height/2 */
  background:linear-gradient(115deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.04) 42%, rgba(255,255,255,0.13) 100%);
  backdrop-filter:blur(1.5px) saturate(140%);
  box-shadow:
    inset 0 2px 2px rgba(255,255,255,0.95),   /* bright top rim  */
    inset 2px 0 2px rgba(255,255,255,0.5),    /* bright left rim */
    inset 0 -3px 4px rgba(70,75,95,0.14),     /* dark bottom rim */
    inset -3px 0 4px rgba(70,75,95,0.08),
    0 16px 32px rgba(70,75,95,0.22);          /* cast shadow     */
}
.glass:after{ /* curved highlight streak */
  content:"";position:absolute;left:12%;top:9%;width:52%;height:26%;border-radius:50%;
  background:rgba(255,255,255,0.6);filter:blur(5px);transform:rotate(-6deg);
}
```

## The glass slab — dark room (bg #101014)

Same geometry, flipped physics: glass in the dark reads by BRIGHT EDGES; color beneath becomes emissive:

```css
.glass-dark{
  background:linear-gradient(115deg, rgba(255,255,255,0.16), rgba(255,255,255,0.03) 42%, rgba(255,255,255,0.1));
  backdrop-filter:blur(1.5px) saturate(150%);
  box-shadow:
    inset 0 1.5px 1px rgba(255,255,255,0.55),
    inset 1.5px 0 1px rgba(255,255,255,0.3),
    inset 0 -2.5px 4px rgba(0,0,0,0.45),
    0 0 0 .5px rgba(255,255,255,0.25),   /* hairline outline replaces cast shadow as the main edge */
    0 18px 34px rgba(0,0,0,0.5);
}
/* highlight streak drops to rgba(255,255,255,0.28) */
/* bars gain glow: box-shadow:0 0 26px rgba(242,154,24,0.5) on amber, 0 0 22px rgba(52,199,89,0.35) on green */
```

## Color-under-glass (the gate card)

Put a blurred color blob BEHIND the glass card in DOM order (not z-index:-1 — see gotchas), then let the card's backdrop-filter pick it up:

```html
<div class="gateWrap">            <!-- position:relative -->
  <div class="amberBlob"></div>   <!-- position:absolute, the color -->
  <div class="gate">...</div>     <!-- the glass, painted after = on top -->
</div>
```
```css
.amberBlob{width:170px;height:130px;border-radius:50%;
  background:radial-gradient(circle,#FFB23E 0%, rgba(255,178,62,0.4) 55%, transparent 75%);
  filter:blur(18px);}
.gate{background:linear-gradient(115deg, rgba(255,255,255,0.5), rgba(255,255,255,0.22) 50%, rgba(255,255,255,0.4));
  backdrop-filter:blur(7px) saturate(140%); /* same inset-rim shadow pattern as the slab */}
```

## Motion

1. **The glide** — slab travels to the element that needs a human:
```css
.demoGlass{transition:top .75s cubic-bezier(.32,1.35,.35,1);} /* slight overshoot = physical */
```
JS: flip the amber class on the new bar immediately, then set the slab's `top`. Color first, lens follows.
2. **The sweep** (working): `background-size:220% 100%; animation:sweep 2.4s ease-in-out infinite;` with `@keyframes sweep{0%{background-position:110% 0}100%{background-position:-110% 0}}`.
3. Cheap everywhere: transform/opacity/background-position only. No layout animation.

## Blueprint garnish (light room only)

Faint drafting-table grid + crosshairs, from the WWDC reference:
```css
background:repeating-linear-gradient(90deg, rgba(80,90,110,0.05) 0 1px, transparent 1px 120px),
           repeating-linear-gradient(0deg,  rgba(80,90,110,0.05) 0 1px, transparent 1px 120px);
```

## Gotchas (each cost a debugging round)

- **Never use `z-index:-1` pseudo-elements for rims/glows behind glass.** Inside any ancestor stacking context they paint behind the ancestor's background and vanish. For gradient rims use the masked-border trick: `padding:1.5px` + `mask:linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); mask-composite:exclude;` (see ~/projects/gray-area/grayarea-visual-directions-v2.html, Prism direction).
- **Milkiness kills the "clear" read.** If color under the slab isn't clearly visible, lower the white gradient alphas (0.22/0.04/0.13 was the sweet spot) and keep backdrop blur at 1.5px, never more than 3px.
- **True refraction (edges bending what's underneath) is NOT achievable in CSS.** Apple pre-renders it in 3D. Don't chase it; the rim + streak + color-under-glass carries the illusion. If one hero shot truly needs it, use a pre-rendered video/image.
- White "working" elements vanish on light backgrounds — the light room uses the gray sweep gradient instead of white.
- The macOS screen-recording filename trap (unrelated but recurring): filenames contain U+202F before "AM/PM"; glob (`Screen*mov`) instead of typing the space.

## Where this is used

- Gray Area x Modal exhibition identity (locked July 13, 2026): v5 = canonical, v1-v4 = archived options. All Gray Area files live in ~/projects/gray-area (private, outside this repo).
- Related but distinct: portfolio-ui skill (session-indicator repo) = the dark opacity-hierarchy system; this skill is the glass-material system. They share the amber/green semantics.
