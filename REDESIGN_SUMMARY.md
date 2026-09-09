# Microshift - Warm Editorial Redesign

## Overview
Successfully transformed Microshift from a dark tech interface to a warm, grounding editorial design with a calm, therapeutic aesthetic.

## Color Palette Changes

### Before (Dark Tech)
- Background: `#0A0A0B` (near-black)
- Cards: `#121316` (dark gray)
- Text: `#ffffff` (white)
- Accents: Bright greens, ambers, and matrix-style colors

### After (Warm Editorial)
- **Background**: `#FBF9F5` (warm linen)
- **Cards**: `#F2EFE9` (cream) with `#E5E0D8` borders
- **Primary Text**: `#1A1918` (deep espresso/charcoal)
- **Secondary Text**: `#6E6B65` (muted taupe)
- **Accent**: `#C26D53` (terracotta)
- **Code/Metadata**: `#5C6662` (soft sage-green mono)

## Typography
- **Display Font**: Instrument Serif (elegant, editorial)
- **Body Font**: Inter (clean, modern sans-serif)
- **Mono Font**: JetBrains Mono (for code and metadata)

## Key Design Changes

### 1. Global Styling
- Removed all glowing effects and matrix-style animations
- Replaced dark backgrounds with warm linen tones
- Softened borders and shadows for a calmer feel
- Removed green pulse effects from status indicators

### 2. Component Updates
- **Header**: Clean, minimal with warm background
- **Cards**: Cream-colored with subtle borders
- **Buttons**: Espresso primary, ghost buttons with warm borders
- **Forms**: Light inputs with taupe placeholders
- **Orb**: Warm sage-green with soft animations

### 3. UX Improvement
- **Session Mode**: When user clicks "decode it" and enters an active session, the homepage sections (Science, Log, IsIsNot) are automatically hidden
- **Focus Mode**: User can focus entirely on their intervention without distractions
- **Automatic Restore**: Sections reappear when session completes or user returns to input mode

## Files Modified

### Core Files
- `index.html` - Updated title and fonts
- `src/index.css` - Complete color scheme overhaul
- `src/data.ts` - Updated mechanism and emotion colors
- `src/App.tsx` - Added session state management

### Component Files
- `src/components/chrome.tsx` - Header, Footer, SectionHead, MechTag
- `src/components/tool.tsx` - Main tool interface with warm colors
- `src/components/widgets.tsx` - All 14 intervention widgets
- `src/components/orb.tsx` - Breathing orb visualization
- `src/components/sections.tsx` - Science, Log, IsIsNot sections
- `src/components/SciencePage.tsx` - Research page with warm styling

## Mechanism Colors (Warm Palette)
- **Safety**: `#7BA89F` (sage green)
- **Clarity**: `#8BA7B8` (soft blue)
- **Affect**: `#D4896F` (warm peach)
- **Agency**: `#C9A876` (warm amber)
- **Self**: `#C28B8B` (muted rose)
- **Connection**: `#A89BC2` (soft lavender)
- **Meaning**: `#9B8AA6` (warm plum)

## Build Status
✅ Build successful - 41 modules transformed
✅ All TypeScript errors resolved
✅ All components using warm editorial palette
✅ Session state management working correctly

## Design Philosophy
The new design prioritizes:
- **Calm & Grounding**: Warm, earthy tones that feel therapeutic
- **Editorial Elegance**: Serif display font with clean sans-serif body
- **Clarity**: High contrast between text and background without harshness
- **Focus**: Minimal distractions, especially during active sessions
- **Accessibility**: Proper contrast ratios maintained throughout

## Next Steps
The application is ready for use with the new warm editorial design. All 14 interventions are fully functional with the new color scheme, and the UX improvement ensures users can focus on their emotional regulation work without distractions.
