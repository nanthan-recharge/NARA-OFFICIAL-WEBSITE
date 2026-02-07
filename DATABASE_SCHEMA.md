# NARA Physical Library Management System - Database Schema

## Collections Structure

### 1. `library_members` Collection
Stores registered library members who can borrow physical books.

```javascript
{
  member_id: "NARA-LIB-2025-0001",           // Auto-generated unique ID
  email: "user@example.com",
  full_name: "John Doe",
  nic: "199512345678",                       // National Identity Card
  phone: "+94771234567",
  address: "123, Main Street, Colombo",
  occupation: "Researcher",
  organization: "University of Colombo",
  member_type: "student|researcher|public|staff",
  membership_date: "2025-10-23T00:00:00Z",
  membership_expiry: "2026-10-23T00:00:00Z",
  status: "active|suspended|expired",
  photo_url: "gs://bucket/members/photo.jpg",
  max_books_allowed: 5,                      // Maximum books they can borrow
  current_books_borrowed: 2,
  total_books_borrowed_lifetime: 45,
  overdue_count: 0,
  fine_balance: 0,                           // Outstanding fines in LKR
  created_at: "2025-10-23T08:00:00Z",
  updated_at: "2025-10-23T08:00:00Z"
}
```

### 2. `book_reservations` Collection
Online reservations for physical books.

```javascript
{
  reservation_id: "RES-2025-10-23-0001",
  member_id: "NARA-LIB-2025-0001",
  book_id: 123,                              // From library_catalogue
  barcode: "NARA87832798017",
  title: "Book Title",
  reservation_date: "2025-10-23T08:00:00Z",
  reservation_expiry: "2025-10-30T08:00:00Z", // 7 days to collect
  status: "pending|ready|collected|cancelled|expired",
  notification_sent: true,
  collected_date: null,
  cancelled_date: null,
  cancellation_reason: "",
  created_at: "2025-10-23T08:00:00Z",
  updated_at: "2025-10-23T08:00:00Z"
}
```

### 3. `book_loans` Collection
Active and historical book loans (checkouts).

```javascript
{
  loan_id: "LOAN-2025-10-23-0001",
  member_id: "NARA-LIB-2025-0001",
  member_name: "John Doe",
  book_id: 123,
  barcode: "NARA87832798017",
  title: "Book Title",
  checkout_date: "2025-10-23T08:00:00Z",
  due_date: "2025-11-06T08:00:00Z",         // 14 days loan period
  return_date: null,
  status: "active|returned|overdue",
  renewal_count: 0,                         // How many times renewed
  max_renewals: 2,
  days_overdue: 0,
  fine_amount: 0,                           // LKR 10 per day overdue
  fine_paid: false,
  librarian_checkout: "admin@nara.gov.lk",
  librarian_checkin: null,
  notes: "",
  created_at: "2025-10-23T08:00:00Z",
  updated_at: "2025-10-23T08:00:00Z"
}
```

### 4. `borrowing_history` Collection
Complete history of all borrowings for analytics.

```javascript
{
  history_id: "HIST-2025-10-23-0001",
  member_id: "NARA-LIB-2025-0001",
  member_name: "John Doe",
  book_id: 123,
  barcode: "NARA87832798017",
  title: "Book Title",
  material_type: "BOBP Reports",
  checkout_date: "2025-10-23T08:00:00Z",
  return_date: "2025-11-01T08:00:00Z",
  days_borrowed: 9,
  was_overdue: false,
  fine_amount: 0,
  rating: 5,                                // Member can rate after return
  review: "Excellent resource",
  created_at: "2025-11-01T08:00:00Z"
}
```

### 5. `library_fines` Collection
Tracks all fines and payments.

```javascript
{
  fine_id: "FINE-2025-10-23-0001",
  member_id: "NARA-LIB-2025-0001",
  loan_id: "LOAN-2025-10-23-0001",
  fine_type: "overdue|damage|lost",
  amount: 150,                              // LKR
  days_overdue: 15,
  status: "pending|paid|waived",
  payment_date: null,
  payment_method: "cash|card|online",
  payment_reference: "",
  waived_by: null,
  waived_reason: "",
  created_at: "2025-10-23T08:00:00Z",
  updated_at: "2025-10-23T08:00:00Z"
}
```

### 6. `library_inventory` Collection
Physical inventory tracking (extends library_catalogue).

```javascript
{
  inventory_id: "INV-2025-10-23-0001",
  book_id: 123,
  barcode: "NARA87832798017",
  physical_status: "available|on_loan|reserved|damaged|lost|under_repair",
  location: "Main Library - Shelf A-123",
  last_inventory_check: "2025-10-23T08:00:00Z",
  condition: "excellent|good|fair|poor",
  total_times_borrowed: 45,
  last_borrowed_date: "2025-10-20T08:00:00Z",
  notes: "Some wear on cover",
  created_at: "2025-10-23T08:00:00Z",
  updated_at: "2025-10-23T08:00:00Z"
}
```

### 7. `library_transactions` Collection
All library transactions log.

```javascript
{
  transaction_id: "TXN-2025-10-23-0001",
  transaction_type: "checkout|return|reserve|cancel_reservation|renew|fine_payment",
  member_id: "NARA-LIB-2025-0001",
  book_id: 123,
  barcode: "NARA87832798017",
  performed_by: "admin@nara.gov.lk",        // Librarian email
  details: {},                               // Additional transaction data
  timestamp: "2025-10-23T08:00:00Z"
}
```

### 8. `library_settings` Collection
System configuration and rules.

```javascript
{
  setting_id: "library_settings",
  loan_period_days: 14,
  max_renewals: 2,
  renewal_period_days: 14,
  max_books_per_member: 5,
  reservation_expiry_days: 7,
  overdue_fine_per_day: 10,                 // LKR
  damage_fine: 500,                         // LKR
  lost_book_fine: 2000,                     // LKR
  membership_validity_days: 365,
  operating_hours: {
    monday: "09:00-17:00",
    tuesday: "09:00-17:00",
    wednesday: "09:00-17:00",
    thursday: "09:00-17:00",
    friday: "09:00-17:00",
    saturday: "09:00-13:00",
    sunday: "Closed"
  },
  updated_at: "2025-10-23T08:00:00Z"
}
```

## Updates to Existing Collections

### Update `library_catalogue` Collection
Add physical library tracking fields:

```javascript
{
  // ... existing fields ...

  // New Physical Library Fields
  is_physical_copy: true,
  total_copies: 1,
  available_copies: 0,                      // Calculated field
  on_loan_copies: 1,
  reserved_copies: 0,
  physical_location: "Main Library - Shelf A-123",
  allow_reservation: true,
  allow_lending: true,
  lending_restrictions: "Reference only|Normal lending",

  // Statistics
  times_borrowed: 45,
  times_reserved: 12,
  average_rating: 4.5,
  total_ratings: 10
}
```

## Indexes Required

### Firestore Composite Indexes:
1. `library_members`: `[status, membership_expiry]`
2. `book_reservations`: `[member_id, status, reservation_date]`
3. `book_loans`: `[member_id, status, due_date]`
4. `book_loans`: `[status, due_date]` (for overdue books)
5. `borrowing_history`: `[member_id, checkout_date]`
6. `library_inventory`: `[physical_status, location]`
7. `library_transactions`: `[transaction_type, timestamp]`

## User Roles

### Member (Public User)
- Register for library membership
- Browse physical books catalog
- Reserve books online
- View borrowing history
- View fines and pay online
- Renew books (if eligible)
- Rate and review books

### Librarian (Staff)
- Check out books to members
- Check in returned books
- Scan QR codes for quick processing
- Manage reservations (mark as ready/collected)
- Calculate and record fines
- Search member records
- View daily transactions
- Generate reports

### Library Admin
- Manage library members (approve/suspend)
- Configure library settings
- View analytics and statistics
- Manage physical inventory
- Generate comprehensive reports
- Bulk operations on books
- Waive fines

## Workflows

### 1. Book Reservation Flow
1. User searches for physical book
2. Checks availability status
3. Clicks "Reserve Book"
4. System creates reservation (status: pending)
5. Librarian checks physical book availability
6. Updates status to "ready" + sends notification
7. User comes to library within 7 days
8. Librarian scans QR or enters member ID
9. Checks out book (reservation → loan)

### 2. Book Checkout Flow (Walk-in)
1. Member visits library
2. Librarian scans member QR code
3. Scans book QR code
4. System checks:
   - Member status (active/suspended)
   - Books borrowed count < max allowed
   - No overdue books
   - No outstanding fines
5. If all checks pass, create loan record
6. Print receipt with due date

### 3. Book Return Flow
1. Member returns book
2. Librarian scans book QR code
3. System identifies active loan
4. Calculates days borrowed
5. Checks if overdue → calculates fine
6. Updates loan status to "returned"
7. Creates borrowing history record
8. If fine: creates fine record
9. Updates book inventory status to "available"

### 4. Overdue Management
1. Daily cron job checks for overdue books
2. Sends email/SMS notifications
3. Calculates accumulated fines
4. Suspends members with >30 days overdue
5. Generates overdue reports

This schema provides a complete foundation for a professional library management system!
