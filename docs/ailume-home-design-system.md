# Ailume Home Design System Reference

Source of truth:
- Figma file: `6LYu9LdBldvi9IoUHanvbJ`
- Home node: `93:84`
- Figma page/frame name: `Homepage`
- Code reference: `index.html`, `styles.css`

Use this file before implementing or reviewing any new Ailume page. It captures the Home page system so future pages can reuse the same visual logic without re-deriving basics from scratch. If a task includes a specific Figma URL, Figma MCP still overrides this document for that target node.

## MCP Baseline

Figma MCP direct section data from Home node `93:84`:

| Section | Figma node | Size | Layout | Padding | Gap |
|---|---:|---:|---|---:|---:|
| Homepage | `93:84` | `1440 x 8996` | Vertical | `0` | `0` |
| Header | `93:96` | `1440 x 80` | Horizontal | `20 40 20 40` | `360` |
| Hero | `93:95` | `1440 x 748` | Horizontal | `64 40 64 40` | `175` |
| Logo band | `120:103` | `1440 x 143` | Absolute/none | `0` | `0` |
| Why AILUME? | `93:152` | `1440 x 987` | Vertical | `128 40 128 40` | `64` |
| Divider after Why | `93:180` | `1362 x 0` | Line | aligns at `x + 39/40` | n/a |
| What we deliver | `93:181` | `1440 x 857` | Vertical | `128 40 64 40` | `64` |
| How we work | `93:267` | `1440 x 828` | Horizontal | `64 40 64 40` | `228` |
| Outcomes | `93:229` | `1440 x 656` | Vertical | `64 39 64 39` | `64` |
| Middle media section | `112:1903` | `1440 x 1846` | Absolute/none | `0` | `0` |
| Divider before Proof | `98:8640` | `1362 x 0` | Line | aligns at `x + 39/40` | n/a |
| Proof | `93:322` | `1440 x 536` | Vertical | `64 39 64 39` | `64` |
| FAQ | `93:349` | `1440 x 1743` | Absolute/none | `0` | `0` |
| Footer | `93:431` | `1440 x 572` | Absolute/none | `0` | `0` |

Important interpretation:
- On the Home Figma frame, the active page gutter is `40px` on both sides.
- The primary visible content line is `1360px` wide on a `1440px` frame.
- Figma divider lines are `1362px`, visually matching the content line plus stroke rounding.
- Several code containers currently use `width: calc(100% - 80px)`.
- Home page rhythm is built from `64px` and `128px`, not arbitrary section spacing.

## Foundation Tokens

Current CSS token source lives in `:root` in `styles.css`. Prefer these token names instead of hardcoded values unless the target Figma node has a specific override.

### Color

Core:
- `--brand-primary: #044ab3`
- `--page-bg: #fff`
- `--surface-base: #fff`
- `--surface-subtle: #f5f5f7`
- `--surface-hover: #f3f3f3`
- `--surface-elevated: #fff`
- `--neutral-0: #fff`
- `--neutral-100: #000`

Opacity neutrals:
- `--neutral-70: rgba(0, 0, 0, 0.7)`
- `--neutral-60: rgba(0, 0, 0, 0.6)`
- `--neutral-50: rgba(0, 0, 0, 0.5)`
- `--neutral-35: rgba(0, 0, 0, 0.35)`

Lines:
- `--line-soft: rgba(0, 0, 0, 0.1)`
- `--line-strong: rgba(0, 0, 0, 0.14)`

Gradient patterns:
- Use brand-to-purple gradients sparingly, primarily for CTA or metric emphasis.
- Existing metric text gradient: `linear-gradient(90deg, #8b85e9 0%, #0b55b8 100%)`.
- Blog inline CTA gradient from Figma: `#044ab3 -> #4272c7 -> #a19fe2`.

Dark mode:
- Dark theme is opt-in via `html[data-theme="dark"]`.
- Do not create one-off dark colors for new sections. Extend existing dark theme rules only when needed.

### Typography

Font family:
- Primary: `"Suisse Intl", Arial, Helvetica, sans-serif`
- Weights available: `300`, `400`, `500`, `600`, `700`
- Default page text weight: `400`
- Headings and main CTAs: `500`

Text scale:

| Token | Size | Line height | Use |
|---|---:|---:|---|
| `--font-h1` | `56px` | `--lh-h1: 1.1` | Home hero display, large proof metric |
| `--font-h2` | `48px` | `--lh-h2: 1.1` | Major section headings |
| `--font-h3` | `32px` | `--lh-h3: 1.2` | Dense explanatory heading, deliver intro |
| `--font-h4` | `22px` | `--lh-h4: 1.3` | Card titles, row titles |
| `--font-body-l` | `18px` | `--lh-body-l: 1.6` | Lead copy, FAQ questions |
| `--font-body-m` | `16px` | `--lh-body-m: 1.5` | Standard body, card descriptions |
| `--font-body-s` | `14px` | `--lh-body-s: 1.6` | Nav, logos caption, small metadata |
| `--font-btn-l` | `16px` | `--lh-btn-l: 1.6` | Primary page CTA |
| `--font-btn-s` | `14px` | `--lh-btn-s: 1.4` | Header CTA, compact buttons |
| `--font-tag` | `12px` | `--lh-tag: 1.6` | Section tags, chips |

Letter spacing:
- Headings: `--ls-heading: -0.02em`
- Tags/chips: `0.72px` or `0.06em`
- Do not use negative tracking on body copy unless matching a Figma node.

Heading rules:
- H1/H2 should be `font-weight: 500`.
- Keep Home rhythm: large section heading plus a constrained paragraph.
- Do not let headings span full container width by default. Use explicit `max-width`.
- Preferred heading widths:
  - Hero text column: `513px`
  - Hero description: `499px`
  - Centered section heading: `620-640px`
  - Dense explanatory copy: `820-860px`
  - FAQ heading: `360px`

### Spacing

Spacing tokens:
- `--space-1: 8px`
- `--space-2: 12px`
- `--space-3: 16px`
- `--space-4: 24px`
- `--space-5: 32px`
- `--space-6: 40px`
- `--space-7: 48px`
- `--space-8: 56px`
- `--space-9: 64px`
- `--space-10: 72px`
- `--space-11: 80px`
- `--space-12: 96px`
- `--space-13: 120px`
- `--section-gap-md: 64px`
- `--section-gap-lg: 128px`

Home spacing logic:
- Page gutter at desktop: `40px`.
- Standard section internal vertical padding: `64px` or `128px`.
- Standard section-to-content gap: `64px`.
- Card grid gap: `16px`.
- Deliver rows gap: `12px`.
- Copy group gaps: `16px`, `24px`, `32px`, `36px`, `40px`.
- Do not invent `20px`, `28px`, `44px`, `45px`, or `92px` unless inherited from an existing Home pattern or exact Figma MCP node.

Special Home values already present:
- Logos bottom padding: `44px`.
- Logos row top: `45px`.
- Why section code padding: `88px 40px 92px`; Figma baseline is `128px 40px`.
- Deliver divider margin before heading: `127px`.
- Final CTA vertical padding: `80px 20px`.

## Grid And Alignment

### Desktop Grid

Figma Home:
- Frame width: `1440px`
- Left/right gutter: `40px`
- Main content width: `1360px`

CSS helpers:
- `--page-max: 1360px`
- `--site-max-width: 1520px`
- `--home-media-width: 672px`
- `--desktop-power-line: 760px`
- `--desktop-power-line-title: 652px`

Use these rules:
- For Home-derived pages, use `width: calc(100% - 80px); margin: 0 auto;`.
- At 1440px viewport, important content should sit within `40px` gutters.
- Keep repeated section dividers aligned to content line, not viewport edge.
- Hero and two-column sections use a strong left text column and right media column.
- Right media column usually width `672px`.
- Text column in hero/About style usually `513px`.
- Desktop "power line" is the left column boundary: `760px`.

Preferred desktop layouts:

Hero:
```css
grid-template-columns: minmax(0, var(--desktop-power-line)) minmax(0, 1fr);
column-gap: 0;
```

Two-column visual:
```css
grid-template-columns: minmax(0, calc(100% - var(--home-media-width))) minmax(0, var(--home-media-width));
column-gap: 0;
```

Three-card grid:
```css
grid-template-columns: repeat(3, minmax(0, 1fr));
gap: var(--space-3);
```

Cases grid:
```css
grid-template-columns: repeat(12, minmax(0, 1fr));
gap: 64px 16px;
```

FAQ:
```css
grid-template-columns: minmax(0, var(--desktop-power-line)) minmax(0, 1fr);
column-gap: 0;
```

Blog/article:
- Sidebar/content: `352px minmax(0, 885px)`
- Gap: `80px`
- Content CTA width follows `885px` column.

### Power Line Rules

Always check:
- Header logo left edge aligns with page gutter.
- Header CTA right edge aligns with page gutter.
- Hero right image right edge aligns with content line.
- Two-column media edges align with Hero media edges when the page uses Home rhythm.
- Section titles align with their intended column, not arbitrary center.
- Dividers span the content line and do not drift outside the grid.

If a page "feels off", measure these first:
- Container left x
- Container right x
- Hero media right x
- Primary CTA x
- First section divider x/width

## Component Patterns

### Header

Figma MCP:
- Header frame: `1440 x 80`
- Padding: `20px 40px`
- Layout: horizontal

CSS:
- `.site-header`: height `77px`, padding `0 40px`, border-bottom `1px solid var(--line-soft)`.
- `.header-inner`: height `76px`, max-width `var(--site-max-width)`, `space-between`.
- Logo: `120 x 20`.
- Nav height: `40px`.
- Nav gap: `16px`.
- Nav link: height `40px`, padding `0 12px`, radius `7px`, font `14px / 1.6`.
- Header CTA: min-height `40px`, radius `7px`, padding `4px 4px 4px 16px`, icon `32px`.

Rules:
- Header left/right alignment must follow page gutter.
- Do not center header inside a narrower article column.
- Use existing `.header-cta` and `.cta-icon` behavior.

### Section Tag

Pattern:
```html
<div class="section-tag">
  <span class="tag-cube" aria-hidden="true"></span>
  <span>Label</span>
</div>
```

CSS:
- Font: `12px / 1.6`, weight `500`, uppercase.
- Color: `--brand-primary`.
- Gap: `8px`.
- Cube: `9 x 9`, `--brand-primary`.

Rules:
- Tags sit `16px` above the heading in most sections.
- Centered sections use `justify-content: center`.
- Left sections use `justify-content: flex-start`.
- Do not replace tag cube with a bullet, dot, or custom SVG.

### Hero

Figma MCP:
- Hero frame: `1440 x 748`
- Padding: `64px 40px`
- Layout: horizontal

CSS:
- Desktop container: `width: calc(100% - 80px)`, max `var(--site-max-width)`.
- Padding: `64px 0` at desktop.
- Text column max: `513px`.
- Media: `672 x 620`, radius `8`.
- Heading: `56px / 1.1`, weight `500`.
- Description: `18px / 1.6`, max `499px`.
- CTA: height `48px`, icon `40px`.

Rules:
- Hero is an actual product/page entry, not a marketing split-card.
- Media should be right-aligned to the same line as lower media sections.
- Keep title line breaks intentional.

### Logos Band

Figma MCP:
- Logo band frame: `1440 x 143`.

CSS:
- Container: `width: calc(100% - 80px)`.
- Bottom padding: `44px`.
- Divider: bottom border.
- Caption line: grid `1fr auto 1fr`, gap `20px`.
- Caption font: `14px / 1.6`, neutral 60.
- Logo row top margin: `45px`.
- Logo images: `clamp(128px, 11vw, 158px) x 30px`.

Rules:
- This block should be reused unchanged on pages that need the Home brand rhythm.
- Do not change caption typography per page.
- Keep line/caption centered between horizontal rules.

### Centered Intro And Card Grid

Used by Why and Outcomes.

Heading:
- Section tag centered.
- H2: `48px / 1.1`, weight `500`, max `620-640px`.
- Paragraph: `18px / 1.6`, max `620-624px`, margin top `18-30px`.

Three-card grid:
- Grid: `repeat(3, minmax(0, 1fr))`.
- Gap: `16px`.
- Image/card radius: `8px`.
- Card title: `22px / 1.3`, margin top `24px`.
- Card body: `16px / 1.5`, margin top `12px`, max `360px`.

Rules:
- Do not put cards inside a bigger decorative card.
- Keep card media aspect ratios fixed.
- Avoid one-off paddings inside repeated items.

### Deliver Rows

Layout:
- Container width: content line.
- Top divider before section.
- Heading max width: `860px`.
- H2: `32px / 1.2`.
- Row min-height: `116px`.
- Row background: `--surface-subtle`.
- Row radius: `8px`.
- Row padding: `28px 32px`.
- Row columns at wide desktop: `36px / 652px / 388px / flexible / 184px`.
- Row gap: `20px` columns, `12px` rows.

Typography:
- Index: `22px / 1.3`, neutral 45.
- Title: `22px / 1.3`, weight `500`.
- Description: `16px / 1.5`, max `388-520px`.
- Link: `14px / 1.4`, icon `24px`.

Rules:
- Deliver rows are dense operational rows, not cards.
- Keep row controls right-aligned.
- Use the same animated mini icon.

### Two-Column Process Section

Layout:
- Desktop grid uses text/power-line plus `672px` media.
- Section padding: `64px 0`.
- Text h2 max: `500px`.
- Text paragraph max: `500px`, margin top `36px`, `18px / 1.6`.
- Link margin top: `40px`.
- Media max: `672px`, radius `8`, surface-subtle.

Rules:
- If a page has a process/workflow block, align media to Hero media width.
- Do not stretch media vertically unless Figma specifies fixed dimensions.

### Outcome / Proof Cards

Outcome cards:
- Min-height: `232px`.
- Padding: `32px`.
- Border: `1px solid var(--line-soft)`.
- Radius: `8px`.
- Internal divider at `top: 132px`, left/right `32px`.
- Icon: `48px`, black fill, radius `4px`.

Proof metric cards:
- Min-height: `250px`.
- Padding: `32px`.
- Border: `1px solid rgba(0,0,0,0.1)`.
- Internal divider at `top: 132px`.
- Metric value: `56px / 1.1`, gradient fill.

Rules:
- Use internal divider lines to structure cards.
- Do not vertically center all content in these cards; they use top/bottom tension.

### FAQ

Layout:
- Desktop: left heading column and right FAQ list.
- Section top padding: `128px - 1px` where bordered.
- FAQ question: `18px / 1.6`, weight `500`.
- Details padding: `28px 0`.
- Divider between items: `1px rgba(0,0,0,0.12)`.
- Plus/minus icon: `32px`, graphic size `18px`.
- Answer: margin top `16px`, max `640px`, `16px / 1.5`.
- Animation: height transition `520ms var(--ease-out-expo)`.

Rules:
- FAQ questions must match Figma text and order for page-specific designs.
- Use `details/summary` semantics.
- Keep icon and question baseline aligned.

### Final CTA And Footer

Final CTA:
- Background: black.
- Min-height: `440px`.
- Padding: `80px 20px`.
- Heading max: `560px`, `48px / 1.1`.
- Body: margin `18px 0 28px`, `16px / 1.5`, white 70%.
- Light CTA: height `40px`, text `14px / 1.4`, icon `24px`.

Footer:
- Height: `54px`.
- Padding: `0 40px`.
- Background: black.
- Top border: white 12%.
- Text: `14px / 1.6`, white 65%.

Rules:
- Final CTA must be present after FAQ when Figma page includes it.
- Footer remains quiet and compact.

## Motion And Interaction

Easing:
- `--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1)`
- `--ease-soft: cubic-bezier(0.22, 1, 0.36, 1)`
- `--ease-glow: cubic-bezier(0.19, 1, 0.22, 1)`

Standard interactions:
- Text links/buttons use `.line-reveal` vertical text swap.
- Arrow icons animate by replacing the visible arrow with an `::after` arrow moving in from bottom-left.
- Primary CTA itself should not jump or translate unless Figma explicitly requires it.
- Image cards scale to `1.025` on hover.
- FAQ expands with height animation.

Do not:
- Add glow/shadow by default.
- Move arrows when a Figma/Halo reference says arrows should stay fixed.
- Add hover effects that change layout.

## Responsive Rules

Breakpoints currently used:
- `1280px`: desktop grid/power-line layout activates.
- `1440px`: deliver row wide layout.
- `1024px`, `900px`, `767px`, `640px`: page-specific reductions.

Desktop:
- Preserve `40px` gutters and power lines.
- Use fixed media widths where Figma does.

Tablet:
- Collapse complex two-column sections only when content starts to compress.
- Keep `32-40px` page gutters.
- Card grids can become two columns before one column.

Mobile:
- Page gutters usually `24px`.
- Hero media stacks below copy.
- Buttons remain at stable heights.
- Avoid viewport-width font scaling; use explicit clamp only where existing system already uses it.
- Text must not overlap or overflow buttons/cards.

## Future Page Implementation Workflow

Use this workflow for every new page or major section:

1. Identify source:
   - If the user provides a Figma URL, call Figma MCP first.
   - If MCP full context fails, use `get_screenshot`, `get_metadata`, or narrow `use_figma` calls.
   - If there is no target Figma URL, use this Home reference plus existing About/Process implementations.

2. Define page grid:
   - Set desktop container to Home content line unless Figma says otherwise.
   - Check left/right gutters before styling details.
   - Decide whether the section is full-width, content-line, article-column, or two-column media.

3. Map type roles:
   - H1/H2/H3/H4 must come from the typography table.
   - Tags use `.section-tag`.
   - Body copy uses body M/L roles.
   - Chips use tag role.

4. Map spacing:
   - Use `64px` and `128px` for section rhythm.
   - Use the `8px` spacing scale inside components.
   - Preserve explicit Figma distances if MCP returns them.

5. Map components:
   - Reuse existing header, CTA, tag, card, FAQ, final CTA, footer, mini icon patterns.
   - Only add a new component if Figma requires a new structure.

6. Verify power lines:
   - Header logo and CTA edges.
   - Hero copy/media.
   - First divider.
   - Main section title.
   - Repeated card grid.
   - Final CTA and footer.

7. Verify visual states:
   - Hover.
   - Focus-visible.
   - Dark theme where global styles apply.
   - Mobile layout.
   - No text overflow.

8. Sync generated/public copies:
   - If editing source HTML/CSS, mirror required files into `public`.
   - Verify the served file, not only the source file.

## Review Checklist

Before saying a page is done:
- [ ] Figma MCP was used when a Figma URL was provided.
- [ ] Home design system file was checked for shared rhythm.
- [ ] Desktop gutter is correct.
- [ ] Header/logo/CTA are on the grid.
- [ ] Hero media aligns with lower media blocks.
- [ ] Section tags use cube, uppercase, `12px / 1.6`.
- [ ] Heading sizes match the typography table.
- [ ] Body text width is intentionally constrained.
- [ ] Section vertical spacing uses `64px`/`128px` rhythm.
- [ ] Cards use `8px` radius or explicit Figma value.
- [ ] Dividers are present where Figma has them.
- [ ] Hover states do not shift layout.
- [ ] FAQ and Final CTA are present when in Figma.
- [ ] `public` copy is synced.

## Known Caveat

Figma MCP full `get_design_context` for the Home node can return `504` because the page is large. In that case, use the direct-section data above and run smaller Figma MCP calls for the specific section being implemented. Do not replace Figma with screenshot guessing when a precise target node is available.
