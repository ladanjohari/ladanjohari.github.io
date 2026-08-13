# Trails hover preview

Source of truth for the Trails clip in Selected Work on the homepage.

```
assets/previews/trails-frame.mp4        light
assets/previews/trails-frame-dark.mp4   dark
```

One animation file, two palettes. `animation.html` is light by default and
switches to dark with `?theme=dark`, so the two clips can never drift apart.
Earlier versions of this clip lived as two separate copies in
`process/hover-prototype-options-v3.html` (light) and
`process/hover-prototypes-dark.html` (dark). Those are archives now, keep them
for reference but do not regenerate from them.

## Regenerate

```
cd assets/previews/trails-previews
node capture.js         # light  -> ../trails-frame.mp4
node capture.js dark    # dark   -> ../trails-frame-dark.mp4
```

Puppeteer is installed once, in `../SI-previews`. Output is 392x244 CSS at 2x,
so 784x488, 20fps, 10 seconds, h264 crf18. The page background is baked into
the corners of the rounded stage: `#F7F6F3` light, `#1A1A1A` dark.

## The choreography

10 second loop. The cursor clicks the red marker on the spine, the red passage
in each document lights up and a beam connects them. Then it clicks the green
marker, red clears, and the green pair lights up instead.

## The one rule that matters

A relation beam must pinch to the height of **its own** marker where it crosses
the spine. Each band is drawn as an eight point polygon that narrows to the
marker's exact y range between x=90 and x=100, and the thread inside it is a
two segment path whose junction sits on the marker's centre.

```
green marker  y 35 to 39, centre (95, 37)
red marker    y 50 to 55, centre (95, 52.5)
```

Get this wrong and the clip lies: the shipped version until August 2026 drew
the green band as a straight quad from one passage to the other, which crossed
the spine at y 48 to 63, dead on the red marker. Clicking green appeared to
connect the passages to the red line.
