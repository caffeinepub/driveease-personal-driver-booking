# DriveEase - Personal Driver Booking

## Current State
- DriversPage has name search + sort controls, no location filtering
- LiveDriversPage has no filtering at all — shows all 20 live drivers
- Both pages have `city` and `state` fields on each driver object

## Requested Changes (Diff)

### Add
- State dropdown filter on DriversPage (derived from unique states in driver list)
- City dropdown filter on DriversPage (derived from cities in selected state, or all cities if no state selected)
- State dropdown filter on LiveDriversPage
- City dropdown filter on LiveDriversPage
- "Clear filters" / reset option in both filter UIs
- Result count update reflecting current filtered results

### Modify
- DriversPage filter row: add State and City selects alongside existing search and sort
- LiveDriversPage header: add State and City selects
- Filter logic: state filter narrows city options; both filters narrow driver list

### Remove
- Nothing removed

## Implementation Plan
1. DriversPage: add `stateFilter` and `cityFilter` state; derive unique states from driver list; derive cities filtered by selected state; apply both filters in the existing `filtered` pipeline
2. Add State and City `<Select>` dropdowns with "All States" / "All Cities" default options
3. LiveDriversPage: same pattern — add `stateFilter` and `cityFilter` state; filter `LIVE_DRIVERS` before rendering; add dropdowns in header area
4. Add `data-ocid` markers on new filter controls
