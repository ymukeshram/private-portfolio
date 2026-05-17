# Security Specification

## Data Invariants
1. **Admin Exclusive Write**: Only `ymukeshram@gmail.com` with a verified email can create, update, or delete data.
2. **Public Read**: Anyone can read certifications and internships.
3. **Data Integrity**: All fields must match the schema defined in `firebase-blueprint.json`.
4. **Timestamp Integrity**: `createdAt` must be a server timestamp on creation.

## The Dirty Dozen Payloads (Rejection Tests)
1. **Anonymous Write**: Attempt to add an internship without auth.
2. **Non-Admin Write**: Attempt to add a certification with a standard user account.
3. **Admin Email Spoof**: Attempt to write with `email: 'ymukeshram@gmail.com'` but `email_verified: false`.
4. **Shadow Field Injection**: Attempt to add an internship with an extra field `isFake: true`.
5. **Path Poisoning**: Attempt to use an extremely long string as a document ID.
6. **Type Mismatch**: Sending `technologies` as a string instead of an array.
7. **Empty Required Fields**: Creating a certification without an `organization`.
8. **Resource Exhaustion**: Sending a 1MB string in the `description` field.
9. **Identity Spoofing**: Attempting to update a document but changing the `createdAt` timestamp.
10. **Malicious Link**: Providing a `certificateUrl` that is actually a script or extremely long.
11. **Terminal State Break**: (Not applicable here as we don't have statuses, but could be "changing non-updatable fields").
12. **Orphaned Write**: (Not applicable here as there are no relations).

## Test Runner (Draft Logic)
The `firestore.rules` will be evaluated against these payloads to ensure `PERMISSION_DENIED`.
