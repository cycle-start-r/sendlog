# Sendlog — Climbing Log App Prompt

Build me a **self-contained single HTML file** called `sendlog.html` — a mobile-first climbing training log app. No frameworks, no CDN, no build step. Pure HTML + CSS + vanilla JS. All data stored in `localStorage`.

## Design

- **Dark theme**: background `#0f1012`, cards `#141618`, borders `#1e2022`
- **Monospace font**: `'SF Mono', 'Fira Code', 'Roboto Mono', monospace`
- **ALL CAPS labels** with `letter-spacing: 0.1em`, small font size (10-11px)
- **Logo**: "sendlog" in serif font (Georgia), cream/tan color `#e8e0d0`, with small "v2" in monospace gray beside it
- **Stats line** under logo: "X climbs · Y sessions" in muted gray
- Mobile max-width 480px, centered

## Navigation

Four top-level text tabs, horizontally:

1. **LOG** — gym climb entry form
2. **OUTDOOR** — outdoor climb entry form
3. **STATS** — charts and stats dashboard
4. **+ GYM** — manage gym list

Active tab: white text + 2px bottom border. Inactive: gray `#555`.

## LOG Tab (Gym Climbing Form)

**Type toggle** at top: `[ROPE] [BOULDER]` — pill-style toggle, selected = filled dark bg

### Form fields (when ROPE selected):

| Field | UI Element | Details |
|-------|-----------|---------|
| DATE | Tappable date display | Shows formatted date like "Mar 8, 2026", opens native date picker on tap |
| ANCHOR # | Text input | Placeholder "e.g. 128". This is the route/anchor identifier number |
| BOLTS (ROUTE HEIGHT) | Range slider (4–10) + text input | Slider for quick entry, text input below with placeholder "or type exact #" for values outside slider range |
| HIGH POINT (BOLT #) | Range slider (1–10) + text input | Same pattern. This is how high the climber got on the route |
| GRADE | Pill grid | YDS grades for rope: 5.6, 5.7, 5.8, 5.9, 5.10-, 5.10, 5.10+, 5.11-, 5.11, 5.11+, 5.12-, 5.12, 5.12+, 5.13-, 5.13, 5.13+ |
| STYLE | Pill selector | `lead`, `toprope`, `boulder` |
| ENERGY LEVEL | Pill selector | `low`, `med`, `high` |
| GYM | Pill selector | List of saved gyms. Also a `detect` button (placeholder for geolocation) |

### When BOULDER selected:
- Hide ANCHOR #, BOLTS, HIGH POINT fields
- Grade pills switch to V-scale: VB, V0, V1, V2, V3, V4, V5, V6, V7, V8, V9, V10, V11, V12
- Style auto-selects "boulder"

### Pill styling:
- Rounded (`border-radius: 20px`), outlined with `#2a2d30` border
- Selected: filled bg `#2a2d30`, brighter border `#4a4d50`, white text
- Unselected: no bg, gray border, muted text

**SAVE CLIMB** button at bottom — green-tinted (`bg: #1e3a2a`, text: `#4ade80`)

### Send logic:
- For rope: a climb is a **send** (top-out) when `highPoint >= bolts`
- For boulder: add a send/attempt toggle

## OUTDOOR Tab

Similar form but for outdoor climbing:
- DATE, LOCATION (text), ROUTE NAME (text)
- GRADE (same pill grid based on rope/boulder toggle)
- OUTCOME: `send`, `attempt`, `project`
- ENERGY LEVEL

## STATS Tab

### Summary cards at top (2-column grid + 1 full-width):

| Card | Value | Label |
|------|-------|-------|
| Left | Hardest grade attempted (e.g. "5.13-") | "grade attempted" |
| Right | Count of top-outs | "top-outs" |
| Full width | "AVG COMPLETION" header, big percentage, "bolt progress" label | Average (highPoint / bolts × 100) across all rope climbs |

### Charts (all rendered as inline SVG, no libraries):

#### 1. GRADE PROGRESSION
- **Type**: Multi-line chart
- **X-axis**: Session dates
- **Y-axis**: Grade (labeled as .10+, .11, .11+, .12-, etc. — drop the "5" prefix)
- **Lines**: Green solid + dots = rope sends (hardest per session), Green dashed = rope attempts, Orange dots = boulder sends
- **Subtitle**: "hardest send per session"

#### 2. COMPLETION TREND
- **Type**: Line chart with dots
- **X-axis**: Session dates
- **Y-axis**: 0% – 100%
- **Line**: Yellow/gold color (`#e8c84a`)
- **Subtitle**: "avg % of route finished per session"
- **Value**: Average (highPoint / bolts) for all rope climbs in that session

#### 3. VOLUME
- **Type**: Bar chart
- **X-axis**: Session dates
- **Y-axis**: Count (0 to max)
- **Bars**: Steel blue (`#3a5a7a`)
- **Subtitle**: "climbs per session"

#### 4. GRADE PYRAMID
- **Type**: Horizontal bar chart
- **Rows**: One per grade (sorted low to high)
- **Two overlapping bars per row**: Dark bar = total attempts, olive/gold bar (`#8a7a00`) = sends
- **Label left**: Grade. **Label right**: "sends/attempts" (e.g. "4/4", "0/7")
- **Subtitle**: "attempts vs sends by grade"
- **Legend**: squares for "attempts" and "sends"

### Chart styling:
- Chart background: `#141618` with `#1e2022` border, rounded 8px
- Grid lines: `#1e2022`
- Axis labels: `#444`, 8px monospace
- Adequate padding so labels don't clip

## + GYM Tab

- List of saved gyms
- "ADD GYM" text input + ADD button
- Default gyms: CRG watertown, CRG stoneham, CRG alewife, CRG randolph, CRG south boston, CRG quincy, BBP somerville, other

## Data Model

Each climb stored in localStorage as JSON array:

```json
{
  "id": 1732526523000,
  "date": "2025-11-25",
  "type": "rope",
  "anchor": "120",
  "bolts": 7,
  "highPoint": 3,
  "grade": "5.12-",
  "style": "lead",
  "energyLevel": "med",
  "gym": "CRG watertown",
  "isOutdoor": false
}
```

Boulder climbs omit `anchor`, `bolts`, `highPoint`.

Outdoor climbs add `location`, `routeName`, `outcome`.

## Pre-loaded Demo Data

Embed this real climbing data so the stats page has content on first load. Only load if localStorage is empty.

```
Date        | Anchor | Grade | Gym        | Bolts | High Pt | Style   | Energy
11/25/2025  | 120    | 5.12- | watertown  | 7     | 3       | lead    | med
11/25/2025  | 131    | 5.10- | watertown  | 11    | 11      | lead    | med
11/25/2025  | 128    | 5.10+ | watertown  | 10    | 7       | lead    | med
11/25/2025  | 127    | 5.11  | watertown  | 10    | 2       | lead    | med
11/25/2025  | 133    | 5.12- | watertown  | 9     | 2       | lead    | med
11/26/2025  | 136    | 5.10+ | watertown  | 9     | 9       | lead    | med
11/26/2025  | 128    | 5.11+ | watertown  | 10    | 3       | lead    | med
11/26/2025  | 119    | 5.1   | watertown  | 8     | 8       | lead    |
11/26/2025  | 126    | 5.10+ | watertown  | 9     | 6       | lead    | med
11/28/2025  | 128    | 5.10+ | watertown  | 10    | 7       | lead    | med
11/28/2025  | 127    | 5.10+ | watertown  | 10    | 9       | lead    | med
11/28/2025  | 126    | 5.11+ | watertown  | 10    | 3       | lead    | med
11/28/2025  | 128    | 5.12  | watertown  | 10    | 4       | lead    | med
11/28/2025  | 130    | 5.12  | watertown  | 10    | 4       | lead    | med
11/28/2025  | 134    | 5.10+ | watertown  | 10    | 10      | lead    | med
12/9/2025   | 130    | 5.12- | watertown  | 10    | 4       | lead    | med
12/9/2025   | 135    | 5.11  | watertown  | 10    | 10      | lead    | med
12/9/2025   | 131    | 5.12  | watertown  | 10    | 5       | lead    | med
12/9/2025   | 121    | 5.11- | watertown  | 8     | 8       | toprope | med
12/11/2025  | 126    | 5.11  | watertown  | 9     | 6       | lead    | med
12/10/2025  | 128    | 5.12  | watertown  | 10    | 4       | lead    | med
12/11/2025  | 128    | 5.12  | watertown  | 10    | 4       | lead    | med
12/11/2025  | 131    | 5.10- | watertown  | 10    | 10      | lead    | med
12/14/2025  | 131    | 5.10- | watertown  | 10    | 10      | lead    |
12/14/2025  | 132    | 5.11  | watertown  | 10    | 5       | lead    | med
12/14/2025  | 131    | 5.12  | watertown  | 10    | 6       | lead    | med
12/14/2025  | 128    | 5.12  | watertown  | 10    | 4       | lead    | med
12/16/2025  | 139    | 5.9   | watertown  | 8     | 8       | lead    | med
12/16/2025  | 73     | 5.11+ | watertown  | 6     | 6       | lead    |
12/18/2025  | 138    | 5.12- | watertown  | 9     | 5       | lead    | Low
1/6/2026    | 136    | 5.10- | watertown  | 10    | 10      | lead    | med
1/6/2026    | 127    | 5.11- | watertown  | 10    | 10      | lead    | med
1/6/2026    | 136    | 5.13- | watertown  | 8     | 2       | lead    | med
```

## Toast notifications

Show a small toast at bottom center for save confirmations. Green-tinted, auto-dismiss after 2 seconds.

## Important

- Everything in ONE HTML file, zero dependencies
- Must work offline — no CDN, no fetch calls
- Mobile-first, touch-friendly (large tap targets for pills)
- Charts drawn with inline SVG (no canvas, no chart library)
- localStorage persistence — data survives page reload
- Clean, minimal, dark aesthetic matching a terminal/hacker vibe
