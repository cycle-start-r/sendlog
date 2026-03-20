# Sendlog - Climbing Training Log App

> "Send" is climbing slang for completing a climb. Sendlog is your training diary.

---

## 1. Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router), TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | Auth.js (NextAuth v5) |
| Styling | Tailwind CSS + shadcn/ui |
| Charts | Recharts |
| Forms | React Hook Form + Zod |
| Deployment | Vercel |

---

## 2. Core Data Models

### User
Account holder. Email + hashed password for credentials auth, OAuth account linking.

Fields: `id`, `email`, `name`, `image`, `createdAt`, `updatedAt`

### Session
A single trip to the gym or crag — the container for all activity on a given day.

Fields:
- `id`, `userId` (FK), `date`
- `location` — gym name or crag name
- `locationType` — enum: `GYM | OUTDOOR`
- `climbingType` — enum: `BOULDERING | SPORT | TRAD | MULTI_PITCH | TOP_ROPE`
- `durationMinutes` (optional)
- `notes` (optional)
- `energyLevel` — Int 1-5 (self-reported fatigue/energy)
- `createdAt`, `updatedAt`

### Climb
A single route or boulder problem attempted or completed within a session.

Fields:
- `id`, `sessionId` (FK), `userId` (FK — denormalized for efficient per-user queries)
- `name` (optional — gym routes often have no name)
- `gradeSystem` — enum: `V_SCALE | FONT | YDS | FRENCH`
- `grade` — String (handles V0, 5.12a, 7b+, etc.)
- `gradeNormalized` — Float (numeric 0-100 scale for sorting/charting, computed on write)
- `style` — enum: `BOULDER | SPORT | TRAD | TOP_ROPE`
- `outcome` — enum: `SEND | FLASH | ONSIGHT | ATTEMPT | PROJECT`
- `attempts` (Int, default 1)
- `isProject` (Boolean)
- `rating` (Int 1-5, optional — personal enjoyment)
- `notes` (optional)
- `betaVideo` (optional URL)
- `createdAt`, `updatedAt`

### TrainingNote
Free-form journal entry for hangboard workouts, strength training, injuries, etc.

Fields:
- `id`, `userId` (FK), `date`
- `category` — enum: `HANGBOARD | STRENGTH | CARDIO | FLEXIBILITY | MENTAL | INJURY | GOAL | GENERAL`
- `content` — String (markdown supported)
- `tags` — String[]
- `createdAt`, `updatedAt`

### Goal
A structured climbing goal with a target and deadline.

Fields:
- `id`, `userId` (FK)
- `title`, `description` (optional)
- `targetGrade`, `gradeSystem` (optional)
- `targetDate` (optional)
- `isCompleted` (Boolean), `completedAt` (optional)
- `createdAt`, `updatedAt`

---

## 3. Features & Screens

### Dashboard
- "Log a Session" quick-action
- Recent sessions list (last 5)
- This week's stats: sessions, total climbs, hardest send
- Active projects count
- Streak indicator

### Log Session Flow (multi-step form)
1. Session details: date, location, type, duration, energy level
2. Add climbs: grade system picker, grade input with autocomplete, outcome, attempts
3. Session notes
4. Confirm and save

### Session Detail
- Climbs grouped by outcome (Sends, Flashes, Attempts)
- Edit/delete individual climbs
- Session notes

### Progress Dashboard
- **Grade Pyramid** — bar chart of sends across grade bands (30/90/365 days)
- **Volume Chart** — sessions/week and climbs/session over time
- **Hardest Send Over Time** — peak grade by month line chart
- **Activity Calendar** — GitHub-style contribution heat map
- Filter by discipline and date range

### Projects Board
- List of `isProject = true` climbs
- Last attempt date, total attempts
- Mark as sent action

### Training Journal
- Chronological `TrainingNote` entries
- Filter by category
- Markdown editor
- Tag-based search

### Goals
- Active goals with progress indicators
- Create/edit with grade target and deadline
- Archive/complete

### Settings
- Default grade system preference (V-scale, Font, YDS, French)
- Export all data as JSON
- Account deletion

---

## 4. File Structure

```
sendlog/
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
│
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (app)/                     # Authenticated route group
│   │   │   ├── layout.tsx             # App shell: sidebar, header
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── sessions/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── progress/page.tsx
│   │   │   ├── projects/page.tsx
│   │   │   ├── journal/page.tsx
│   │   │   ├── goals/page.tsx
│   │   │   └── settings/page.tsx
│   │   ├── api/auth/[...nextauth]/route.ts
│   │   ├── layout.tsx
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── ui/                        # shadcn/ui primitives
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── MobileNav.tsx
│   │   ├── sessions/
│   │   │   ├── SessionCard.tsx
│   │   │   ├── SessionForm.tsx
│   │   │   └── ClimbList.tsx
│   │   ├── climbs/
│   │   │   ├── ClimbForm.tsx
│   │   │   ├── GradeInput.tsx         # Smart grade picker with autocomplete
│   │   │   └── OutcomeBadge.tsx
│   │   ├── charts/
│   │   │   ├── GradePyramid.tsx
│   │   │   ├── VolumeChart.tsx
│   │   │   ├── ActivityCalendar.tsx
│   │   │   └── ProgressLine.tsx
│   │   ├── goals/GoalCard.tsx
│   │   └── journal/JournalEditor.tsx
│   │
│   ├── lib/
│   │   ├── prisma.ts                  # Prisma client singleton
│   │   ├── auth.ts                    # Auth.js config
│   │   ├── grades.ts                  # Grade normalization utilities
│   │   ├── validations/
│   │   │   ├── session.ts             # Zod schemas
│   │   │   ├── climb.ts
│   │   │   └── user.ts
│   │   └── utils.ts                   # cn(), formatDate, etc.
│   │
│   ├── actions/                       # React Server Actions
│   │   ├── sessions.ts
│   │   ├── climbs.ts
│   │   ├── goals.ts
│   │   └── journal.ts
│   │
│   ├── hooks/
│   │   ├── useGradeSystem.ts
│   │   └── useDebounce.ts
│   │
│   └── types/index.ts
│
├── public/icons/
├── .env.example
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 5. Implementation Phases

### Phase 1 — Foundation
- Scaffold Next.js 15 + TypeScript + Tailwind
- Configure shadcn/ui
- Prisma schema + initial migration
- Auth.js with credentials (register/login)
- App shell (sidebar, header, mobile nav)
- Dev seed data

### Phase 2 — Core Logging
- Session list and detail pages
- Multi-step new session form
- `GradeInput` with autocomplete
- Climb logging within sessions
- Server Actions for CRUD

### Phase 3 — Progress & Analytics
- Grade normalization utility (`src/lib/grades.ts`)
- Grade Pyramid chart
- Volume over time chart
- Activity calendar heat map
- Progress dashboard page

### Phase 4 — Secondary Features
- Projects board
- Training journal with markdown editor
- Goals feature
- Settings + data export

### Phase 5 — Polish & Deploy
- Mobile responsiveness
- Loading skeletons
- Error boundaries
- Vercel deployment + managed Postgres (Neon or Supabase)

---

## 6. Key Design Decisions

**Grade stored as string + normalized float**: Grades like "V7", "5.12a", "7b+" don't fit a single numeric column. Raw string preserves fidelity; normalized float enables sorting and charting without repeated parsing.

**Server Actions over REST**: At this scale, Server Actions reduce boilerplate significantly. A dedicated API is not needed unless mobile clients are added later.

**No separate backend service**: Next.js + Vercel handles everything. One deployment, simple ops.

**shadcn/ui copied into project**: Full control over styling, no version lock-in from a component library dependency.

**Denormalized `userId` on `Climb`**: Enables efficient queries like "all V7 sends by user" without joining through `Session`.
