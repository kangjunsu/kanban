# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Kanban board application built with vanilla HTML, CSS, and JavaScript. Features drag-and-drop functionality for moving task cards between columns (TO-DO, IN-PROGRESS, DONE).

## Architecture

**Single-Page Application**
- Pure client-side implementation with no build process
- Three separate files follow separation of concerns:
  - `index.html`: DOM structure with data attributes for column identification
  - `style.css`: Flexbox-based layout with drag state visual feedback
  - `script.js`: HTML5 Drag and Drop API implementation

**Drag-and-Drop Flow**
1. Event listeners registered on card elements (`dragstart`, `dragend`) and column elements (`dragover`, `dragenter`, `dragleave`, `drop`)
2. Global `draggedCard` variable tracks the currently dragged element
3. CSS classes (`.dragging`, `.drag-over`) provide visual feedback during drag operations
4. Card counts automatically update after each drop operation

**State Management**
- No persistent storage (in-memory only)
- Card counts calculated via DOM queries (`querySelectorAll('.card').length`)
- New cards always added to TO-DO column by default

## Development Commands

**Run the application:**
```bash
# Open in browser directly
open index.html

# Or use a local server
python3 -m http.server 8000
# Then navigate to http://localhost:8000
```

**Validation (manual testing in browser):**
- Drag cards between columns and verify position changes
- Click "새 카드 추가" button and verify new card appears in TO-DO
- Check card counts update correctly after each operation
- Test responsive layout by resizing browser window

**No Playwright for verification** - use manual browser testing only.

## Git Workflow

**Always use merge** - never rebase. When pulling changes:
```bash
git pull origin main
# If conflicts occur, resolve and commit
```

## Important Constraints

- **Do not read parent directories** - this codebase is isolated to the current folder only
- Files outside `day03/` are not relevant to this project
- No build tools, transpilers, or package managers required

## Code Style

- Vanilla JavaScript (no frameworks or libraries)
- Event-driven architecture with dedicated handler functions
- Semantic HTML with `data-*` attributes for element identification
- Mobile-responsive design with media query breakpoint at 768px
