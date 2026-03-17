# DriveEase Dashboard Actions

## Current State
Dashboard has three tabs: Inquiries, Rides, Drivers. Data is static. Action buttons are non-functional.

## Requested Changes (Diff)

### Add
- Confirm Booking button on inquiry and ride rows
- Cancel Ride button with confirm dialog
- Remove Driver button with confirm dialog
- Send Feedback modal on inquiry rows
- Toast notifications for all actions

### Modify
- Move all data to React state for live mutations
- Inquiry table: Confirm + Send Feedback buttons
- Rides table: Confirm + Cancel buttons
- Drivers table: Remove Driver button

### Remove
- Non-functional View/Edit placeholder buttons

## Implementation Plan
1. useState for INQUIRIES, RIDES, DRIVERS
2. Confirm action sets status to Confirmed
3. Cancel ride with AlertDialog, sets Cancelled
4. Remove driver with AlertDialog, removes from array
5. Send Feedback Dialog with textarea + success toast
6. Sonner toasts for all outcomes
