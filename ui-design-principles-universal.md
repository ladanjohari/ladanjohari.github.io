# UI Design Principles — Platform-Agnostic Skill Reference

Source: distilled from Apple's WWDC25 Liquid Glass system (Session 356), translated into universal design language. Use this in any design, code, or audit session regardless of platform — web, Android, iOS, cross-platform, Figma, or native.

Core idea: great interface design creates a unified, coherent relationship between surface, content, and interaction — across every device, screen size, and input mode — through a consistent set of shape, material, and structural decisions.

Three pillars: **Design Language** (the visual foundation), **Structure** (how navigation and content are organized), **Continuity** (how experiences carry across contexts and devices).

---

## 1. Design Language

### Color
Define a palette that works across light, dark, and high-contrast modes — not just one appearance. Tokens (named color variables) should be semantic (e.g., `color-primary-action`, `color-surface-elevated`) rather than raw values (e.g., `#0A84FF`). This lets the same component automatically adapt to any appearance mode without manual overrides.

### Typography
Bold, left-aligned text creates clearer hierarchy at decision moments — alerts, onboarding, confirmation screens. Centered text has its place (empty states, hero moments) but weakens readability when used as a default for informational content. Apply typographic weight to create focal points, not just decoration.

### Shape & Concentricity — the most structurally significant principle

Shapes should be internally consistent and relate to their containers. Three shape types to distinguish in any design system:

**Fixed shapes** — a constant corner radius regardless of context. Use for standalone elements that don't nest inside other shaped containers.

**Capsules** — corner radius equals exactly half the element's height. A 32px-tall button gets a 16px radius. This is not approximate — "almost a capsule" reads as an error, not a choice.

**Concentric shapes** — radius is calculated by subtracting padding from the parent's radius, so nested elements share a common visual center. Formula: `inner radius = outer radius − padding`. Use this whenever a shape sits inside another shape (an icon inside a card, a thumbnail inside a list row, a button inside a panel).

**Why concentricity matters:** mismatched radii between nested shapes are one of the most common "something looks off but I can't say why" problems in UI. Concentric shapes eliminate that tension automatically.

**Practical rules:**
- An element that looks "pinched" (corners too tight relative to its container) or "flared" (corners too round relative to its container) has a concentricity problem — fix the inner or outer radius.
- Near screen or container edges: use a capsule with extra margin so the shape clears the edge cleanly.
- For components that must work both nested and standalone: define a concentric radius and a fallback radius — concentric applies when nested, fallback when standalone.
- Apply these rules in any tool: Figma auto-layout, CSS border-radius, Jetpack Compose shape tokens, SwiftUI clipShape.

---

## 2. Structure

### Layered surfaces
Well-structured interfaces use a **functional surface layer** that floats above content — providing navigation, actions, and status — without competing with content for attention. This layer should:
- Be unobtrusive until needed
- Separate clearly from scrollable content beneath it
- Use material (translucency, blur, elevation, shadow — platform-appropriate) to signal its role, not a hard opaque background

On web: `backdrop-filter: blur()` with a semi-transparent background approximates this.
On Android: Material Design elevation + surface tints serve the same role.
On iOS/macOS: system glass material is built in.
In Figma: simulate with a blurred fill layer and reduced opacity.

### Spatial relationships
Every surface should visibly relate to the element that triggered it. A contextual menu should emerge from the button that opened it, not from a fixed screen position. An action panel should anchor to the item it acts on. This "springs from source" principle makes interactions feel grounded and predictable rather than arbitrary.

Audit question: if I covered up the trigger element and showed only the surface/panel, could the user identify where it came from? If not, the spatial relationship is broken.

### Material as a depth and focus signal
Surface material should communicate navigation depth:
- **Modal / interrupting task** (requires completion before proceeding): stronger material, dimmed background, centered attention. The background dimming signals "this must be resolved."
- **Parallel / non-modal task** (can be dismissed and resumed): lighter material, no background dim, content remains visible.
- **Deepening focus** (user is moving into a task): material becomes slightly more opaque and the surface may grow subtly — signaling increased engagement without a hard context switch.

Don't use material decoratively. It should always mean something about depth, focus, or hierarchy.

### Navigation bars and toolbars
- **Remove decorative borders and backgrounds** added to give buttons visual weight. In a well-structured interface, grouping and layout carry hierarchy — decoration is a crutch.
- **Group by function and frequency**: items used together should be visually grouped; primary actions should be visually separate from secondary ones.
- **One primary action per bar** — tinted, clearly distinct. Every other action is neutral. Two tinted actions compete and neither wins.
- **Don't mix persistent and contextual controls** in the same bar. A nav bar that sometimes shows screen-specific actions (like a checkout button) and sometimes shows persistent navigation is structurally ambiguous.
- If a bar feels crowded: remove non-essential items, move secondary actions into an overflow menu, and group what remains by function.

### Primary navigation (tab bars, nav drawers, sidebars)
- Structure it to reflect the information architecture of the product — not your feature release schedule.
- Add a dedicated Search entry when content isn't immediately browsable (this becomes essential before users realize they need it).
- Persistent navigation (tabs, sidebar) should never host screen-specific or contextual actions — only global navigation.

### Scroll edge effects
When scrollable content passes beneath a persistent surface (nav bar, tab bar, floating action area), provide a visual transition — not a hard edge. This is a **functional signal**, not a decoration:
- It tells the user content is beneath the floating surface
- It preserves legibility of the floating controls
- It should only appear when there is actually content below the fold — not as a permanent style treatment

Two intensities: subtle (most touch UIs, content-dense views) and strong (desktop UIs, text-heavy views where a harder boundary is needed for legibility). Don't use both in the same view.

---

## 3. Continuity

Continuity means a person moving between devices — or resizing a window — feels like they're **continuing** a task, not starting over. Design decisions (layout, hierarchy, interaction patterns) should carry across form factors.

Practically: design your component anatomy once, and let each platform/device be a different **expression** of that anatomy, not a separate design.

### The three device roles (platform-neutral)

| Device class | Interaction character | Design priority |
|---|---|---|
| Narrow / single-column (phone, small viewport) | Focused, vertical, one thing at a time | Clarity, minimum viable surface, touch-first |
| Wide / multi-column (desktop, large viewport) | Expansive, spatial, parallel tasks | Efficiency, density, keyboard/pointer |
| Medium / adaptive (tablet, resizable window) | Bridges both — where your design learns to scale | The hardest context; where architecture decisions become visible |

The medium breakpoint is the diagnostic one. If a design falls apart at a tablet/medium viewport, the anatomy wasn't well-defined to begin with.

### Shared vocabulary
- Use the same icons, labels, and interaction patterns across all contexts. Familiarity compounds — seeing the same symbol on phone, desktop, and tablet reinforces recognition faster than any onboarding.
- Not every action has an unambiguous icon. When in doubt, use a text label. "Edit" is clearer than a pencil. "Select" is clearer than a checkmark. Reserve icon-only affordances for actions with genuinely universal visual shorthand (close/×, back/←, search/🔍).
- When several related actions share a concept (e.g., multiple share destinations), use one symbol to introduce the group and text labels to differentiate the options. Don't invent variant icons for each.

### Shared anatomy — the core continuity principle
A component's anatomy should be identical across platforms even when its visual form changes.

Example: a session row in a list has the same anatomy everywhere — status indicator, name, metadata, action. On desktop it's a compact inline row. On mobile it's a taller touch-friendly row. On a notification it's a condensed one-liner. Same anatomy, different expression.

Define the anatomy first. Let platform conventions determine the expression. This is how cross-platform consistency becomes maintainable rather than a manual syncing exercise.

**Audit question:** if I listed every instance of a component across all breakpoints and platforms, would they all share the same core pieces in the same roles? If elements appear in one context but not another without a clear reason, the anatomy is incomplete.

---

## Universal Audit Checklist

Run this against any interface, in any design tool or codebase:

**Shape**
- [ ] Every shape is intentionally one of three types: fixed, capsule, or concentric. No "almost capsule" shapes.
- [ ] Nested shapes use concentric radii (inner = outer − padding). No mismatched corner radii between a container and its contents.
- [ ] Shapes near edges have appropriate clearance — not clipped or flush against a boundary.

**Material / Surface**
- [ ] The persistent navigation layer uses material appropriate to the platform — not a hard opaque background.
- [ ] Modal surfaces include a background dimming signal. Non-modal surfaces don't.
- [ ] Material is functional (communicating depth/focus), not decorative.

**Structure**
- [ ] Navigation bars contain no decorative borders or backgrounds added only for weight.
- [ ] There is one and only one primary tinted action per bar/toolbar.
- [ ] Persistent and contextual controls are in separate areas — not mixed in the same bar.
- [ ] Scroll edge effects appear only where content scrolls under a floating surface.
- [ ] Each contextual surface (popover, panel, sheet) has a visible spatial relationship to the element that triggered it.

**Typography**
- [ ] Decision-moment text (alerts, confirmations, onboarding steps) is bold and left-aligned.
- [ ] Typographic hierarchy comes from weight and size, not just color.

**Continuity**
- [ ] Every component has a defined anatomy (the list of its parts and their roles).
- [ ] Each platform/breakpoint expression of the component uses the same anatomy, not a different set of parts.
- [ ] The same icons and labels appear in the same roles across all contexts.
- [ ] Text labels replace icon-only affordances wherever the icon's meaning is ambiguous.
- [ ] The design is tested at the medium breakpoint (tablet/resizable window) — if it breaks here, the anatomy needs work.

**Interaction**
- [ ] Touch targets on touch interfaces are minimum 44×44px.
- [ ] Keyboard-dependent interactions (shortcuts, hover states) have visible touch/tap equivalents.
- [ ] Every interactive element has `touch-action: manipulation` (web) or equivalent to remove tap delay.
- [ ] Primary actions are operable without a keyboard on all form factors.

---

## How to use this skill in a Claude session

Drop this file alongside any design or code task. Useful prompts:

**For a design audit:**
> "Read [this design / this file] and run it against the checklist in the design principles skill. Tell me which items fail and what the specific fix is."

**For a new component:**
> "I'm designing [X]. Using the design principles skill, define the component anatomy first, then suggest how it should express across mobile, desktop, and tablet."

**For a responsive fix:**
> "The layout breaks at tablet width. Using the continuity principles in the skill, diagnose why and suggest a fix based on shared anatomy."

**For a shape audit:**
> "Check every border-radius value in [this file]. Flag any that should be capsules (radius ≠ height/2) or that are nested without using concentric radii."

**For a toolbar/navigation review:**
> "Using the structure principles in the skill, audit the navigation bars in [this design]. Flag: mixed persistent/contextual controls, more than one tinted action, decorative borders, and crowded bars."
