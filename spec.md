# DriveEase - Driver Registration with Admin Approval & SMS

## Current State
- Driver registration is entirely frontend-only (4-step form, no backend call)
- Registration data is saved only to localStorage with a fake app ID
- No DriverRegistration type or status field in the backend
- Admin dashboard has tabs: Bookings, Enquiries, Drivers
- No Driver Approval Requests section in dashboard
- No pending driver count stat
- Driver login has no status check

## Requested Changes (Diff)

### Add
- `DriverRegistration` type in backend with fields: id, name, phone, email, city, state, experience, licenseNumber, aadhaarNumber, about, status (#pending | #approved | #rejected), createdAt
- Backend functions: `submitDriverRegistration`, `getPendingRegistrations`, `getAllRegistrations`, `approveDriverRegistration`, `rejectDriverRegistration`, `getDriverRegistrationByPhone`
- HTTP outcall for SMS notification on approval (Fast2SMS or mock)
- "Driver Approval Requests" tab in dashboard with table: Name, Mobile, License, Aadhaar, Status, Approve/Reject buttons
- "Pending Drivers" stat card in dashboard
- Driver login status check: if #pending show "Your profile is under verification", only allow #approved drivers

### Modify
- `RegisterDriverPage.tsx`: replace fake setTimeout with real `actor.submitDriverRegistration()` call; success screen shows pending approval message
- `DashboardPage.tsx`: add 4th tab "Driver Approvals", add pending drivers stat card, wire approve/reject to backend
- Driver login flow: check registration status before allowing access

### Remove
- Fake localStorage-only driver registration flow

## Implementation Plan
1. Add DriverRegistration type + CRUD functions to main.mo
2. Add HTTP outcall for SMS in main.mo (triggered on approve)
3. Update RegisterDriverPage to call backend submitDriverRegistration
4. Update DashboardPage: new tab + stat card + approve/reject actions
5. Add driver login status check component/logic
6. Validate and deploy
