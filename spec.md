# DriveEase

## Current State
LocationPicker uses dark backgrounds for all elements. No save address feature.

## Requested Changes (Diff)

### Add
- Save Address button when a location is selected
- Label input to save address (Home/Work/Other)
- Saved addresses as quick-select chips above search
- LocalStorage persistence

### Modify
- All dark backgrounds in LocationPicker to white/light
- Input, dropdown, address display, map placeholder to white theme

### Remove
- Dark oklch(0.10 0 0) backgrounds from LocationPicker

## Implementation Plan
1. Update LocationPicker.tsx with white theme and save address feature
