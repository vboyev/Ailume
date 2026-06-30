# Ailume Implementation Rules

- For any task that references a Figma URL or asks to implement a Figma design, use Figma MCP first.
- Treat Figma MCP output as the source of truth for layout, spacing, typography, image mapping, and alignment.
- Do not implement Figma-sourced sections from memory, screenshots, or approximation when the Figma node is available.
- If `get_design_context` fails, retry with lighter Figma MCP calls such as `get_screenshot` or `get_metadata`, and state the MCP failure clearly.
- Keep Home and About as visual references for shared site rhythm, but prefer the referenced Figma node for the target page.
- Before implementing or reviewing any Ailume page, read `docs/ailume-home-design-system.md` and use it as the local reference for shared Home-derived typography, colors, spacing, grid, power lines, component rhythm, and verification checklist.
- When a target page has its own Figma node, that node still overrides `docs/ailume-home-design-system.md`; use the local reference only for shared system decisions and missing/common patterns.
