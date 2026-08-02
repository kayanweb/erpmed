# HIS Security Specification

## Data Invariants
1. **Patient Data Integrity**: Only medical staff can update patient status or clinical data.
2. **Visit Continuity**: A patient cannot have two concurrent "active" visits.
3. **Audit Log Immutability**: Audit logs once written cannot be updated or deleted by anyone.
4. **Billing Traceability**: Charges must be linked to a valid patient and visit.
5. **PII Isolation**: Contact information (phone) is restricted to medical staff.

## The Dirty Dozen Payloads

1. **Payload 1: MRN Hijacking**
   ```json
   { "id": "p1", "mrn": "EXPLOIT-001", "nameEn": "Hacker" }
   ```
   *Attack*: Attempting to update a patient's MRN (Identity Spoofing).

2. **Payload 2: Fake Audit Log Injection**
   ```json
   { "id": "log-fake", "userId": "victim-id", "action": "DELETE_RECORD" }
   ```
   *Attack*: Spoofing an audit log as another user.

3. **Payload 3: Negative Billing Charge**
   ```json
   { "id": "chg-1", "amount": -1000, "patientId": "p1" }
   ```
   *Attack*: Injecting negative amounts to drain revenue.

4. **Payload 4: Status Escalation**
   ```json
   { "id": "p1", "status": "discharged" }
   ```
   *Attack*: Discharging a patient without clinical clearance (State Shortcutting).

5. **Payload 5: Giant ID Resource Poisoning**
   ```json
   { "id": "A".repeat(1500), "nameEn": "Long ID" }
   ```
   *Attack*: ID Poisoning with oversized strings.

6. **Payload 6: Cross-Patient Record Update**
   ```json
   { "id": "rx-1", "patientId": "p2" } // Originally p1
   ```
   *Attack*: Moving a prescription from one patient to another.

7. **Payload 7: Audit Log Deletion**
   ```json
   // Request: DELETE /his_audit_logs/log-123
   ```
   *Attack*: Attempting to clear the security trail.

8. **Payload 8: PII Leak via Unfiltered List**
   ```json
   // Request: GET /patients
   ```
   *Attack*: Non-medical staff attempting to list all patients and their phones.

9. **Payload 9: Expired Token Exploitation**
   ```json
   // Request with auth.token.email_verified = false
   ```
   *Attack*: Accessing clinical data without a verified email.

10. **Payload 10: Shadow Field Injection**
    ```json
    { "id": "p1", "isVip": true, "hiddenDiscount": 99 }
    ```
    *Attack*: Injecting unmapped fields into a patient document.

11. **Payload 11: Future Timestamp Spoofing**
    ```json
    { "id": "vis-1", "startTime": "2030-01-01T00:00:00Z" }
    ```
    *Attack*: Breaking temporal integrity with future dates.

12. **Payload 12: Admin Claim Spoofing**
    ```json
    { "id": "vis-1", "status": "completed" } // Sent as user but claiming isAdmin logic
    ```
    *Attack*: Attempting an update that requires admin privileges.

## Test Runner (Logic Outline)
The `firestore.rules.test.ts` will verify:
- `his_audit_logs` is write-only for authenticated users, with no update/delete.
- `patients` fields like `mrn` are immutable.
- `charges.amount` must be `> 0`.
- All writes require `request.auth.token.email_verified == true`.
