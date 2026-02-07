# NARA Library System - Backend API

A comprehensive RESTful API for the NARA Integrated Library System (ILS) built with Node.js, Express, and PostgreSQL.

## Features

- 📚 **Cataloguing** - Complete bibliographic records management
- 🔄 **Circulation** - Check-out, check-in, renewals, and holds
- 👥 **Patron Management** - User profiles and categories
- 📦 **Acquisitions** - Order tracking and supplier management
- 📰 **Serials** - Journal subscription management
- 🔍 **Full-Text Search** - PostgreSQL-powered search with ranking
- 📊 **Reports & Analytics** - Comprehensive reporting system
- 🔐 **Firebase Authentication** - Secure token-based authentication
- 🔒 **Role-Based Access Control** - Admin, librarian, and patron roles

## Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- Firebase Admin SDK credentials

## Installation

1. **Install dependencies:**
   ```bash
   cd backend/library-api
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure:
   - Database connection details
   - Firebase Admin SDK credentials
   - SMTP settings for email notifications
   - Fine rates and borrowing limits

3. **Create PostgreSQL database:**
   ```bash
   createdb nara_library
   ```

4. **Run database migrations:**
   ```bash
   npm run migrate
   ```

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Catalogue Management
- `GET /api/catalogue` - Get all items
- `GET /api/catalogue/:id` - Get item by ID
- `GET /api/catalogue/barcode/:barcode` - Get item by barcode
- `POST /api/catalogue` - Create new item (librarian/admin)
- `PUT /api/catalogue/:id` - Update item (librarian/admin)
- `DELETE /api/catalogue/:id` - Delete item (admin)
- `POST /api/catalogue/bulk/import` - Bulk import items
- `GET /api/catalogue/material-types/all` - Get all material types
- `GET /api/catalogue/generate/barcode` - Generate unique barcode

### Circulation
- `POST /api/circulation/checkout` - Check out item
- `POST /api/circulation/checkin` - Check in item
- `POST /api/circulation/renew/:transactionId` - Renew item
- `GET /api/circulation/active-loans` - Get all active loans
- `GET /api/circulation/overdue` - Get overdue items
- `GET /api/circulation/history` - Get transaction history
- `POST /api/circulation/holds` - Place hold on item
- `GET /api/circulation/holds` - Get all holds
- `GET /api/circulation/fines` - Get all fines
- `POST /api/circulation/fines/:fineId/pay` - Pay fine
- `POST /api/circulation/fines/:fineId/waive` - Waive fine

### Patron Management
- `GET /api/patrons` - Get all patrons (librarian/admin)
- `GET /api/patrons/:id` - Get patron by ID
- `GET /api/patrons/firebase/:uid` - Get patron by Firebase UID
- `POST /api/patrons` - Create patron (librarian/admin)
- `PUT /api/patrons/:id` - Update patron
- `DELETE /api/patrons/:id` - Delete patron (admin)
- `GET /api/patrons/:id/statistics` - Get patron statistics
- `GET /api/patrons/categories/all` - Get patron categories
- `GET /api/patrons/generate/patron-number` - Generate patron number

### Acquisitions
- `GET /api/acquisitions` - Get all acquisitions
- `POST /api/acquisitions` - Create acquisition order
- `PUT /api/acquisitions/:id` - Update acquisition
- `GET /api/acquisitions/:id/items` - Get acquisition items
- `POST /api/acquisitions/:id/items` - Add item to acquisition
- `GET /api/acquisitions/suppliers/all` - Get all suppliers
- `POST /api/acquisitions/suppliers` - Create supplier
- `GET /api/acquisitions/reports/budget` - Get budget report

### Serials
- `GET /api/serials` - Get all serials
- `POST /api/serials` - Create serial subscription
- `PUT /api/serials/:id` - Update serial
- `GET /api/serials/:id/issues` - Get serial issues
- `POST /api/serials/:id/issues` - Create serial issue
- `GET /api/serials/:id/issues/missing` - Get missing issues
- `POST /api/serials/:id/issues/:issueId/claim` - Claim missing issue
- `GET /api/serials/renewals/upcoming` - Get upcoming renewals

### Search
- `GET /api/search?q=query` - Full-text search
- `POST /api/search/advanced` - Advanced search with filters
- `GET /api/search/facets` - Get search facets
- `GET /api/search/suggestions?q=query` - Get autocomplete suggestions
- `GET /api/search/popular` - Get popular items
- `GET /api/search/new-arrivals` - Get new arrivals
- `GET /api/search/related/:itemId` - Get related items

### Reports
- `GET /api/reports/dashboard` - Dashboard statistics
- `GET /api/reports/circulation/daily` - Daily circulation report
- `GET /api/reports/circulation/monthly` - Monthly circulation report
- `GET /api/reports/circulation/yearly` - Yearly circulation report
- `GET /api/reports/collection/statistics` - Collection statistics
- `GET /api/reports/collection/most-borrowed` - Most borrowed items
- `GET /api/reports/patrons/statistics` - Patron statistics
- `GET /api/reports/patrons/top-borrowers` - Top borrowers
- `GET /api/reports/financial/fines` - Fines report
- `GET /api/reports/overdue/summary` - Overdue summary
- `POST /api/reports/export/pdf` - Export report to PDF
- `POST /api/reports/export/csv` - Export report to CSV

### Settings
- `GET /api/settings` - Get all settings (admin)
- `GET /api/settings/:key` - Get setting by key (admin)
- `PUT /api/settings/:key` - Update setting (admin)
- `POST /api/settings/bulk` - Bulk update settings (admin)

## Authentication

All protected endpoints require a Firebase ID token in the Authorization header:

```
Authorization: Bearer <firebase-id-token>
```

### User Roles

- **Admin** - Full access to all endpoints
- **Librarian** - Access to cataloguing, circulation, and patron management
- **Library Admin** - Full library system access
- **Patron** - Access to personal account and public catalogue

## Database Schema

The system uses PostgreSQL with the following main tables:

- `bibliographic_records` - Catalogue items
- `patrons` - Library users
- `patron_categories` - User types with borrowing rules
- `circulation_transactions` - Check-out/in records
- `holds_reservations` - Item holds
- `fines` - Overdue fines
- `acquisitions` - Purchase orders
- `suppliers` - Vendor information
- `serials` - Journal subscriptions
- `serial_issues` - Individual journal issues
- `material_types` - Book, journal, map, etc.
- `library_settings` - System configuration
- `audit_log` - Action tracking

## Error Handling

API responses follow this format:

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

## Security Features

- Firebase token verification on all protected endpoints
- Role-based access control (RBAC)
- SQL injection prevention with parameterized queries
- CORS configuration
- Rate limiting
- Helmet.js security headers
- Audit logging for all actions

## Development

### Project Structure
```
backend/library-api/
├── config/
│   └── database.js          # PostgreSQL connection
├── controllers/
│   ├── catalogueController.js
│   ├── circulationController.js
│   ├── patronsController.js
│   ├── acquisitionsController.js
│   ├── serialsController.js
│   ├── searchController.js
│   ├── reportsController.js
│   └── settingsController.js
├── middleware/
│   └── auth.js              # Firebase authentication
├── routes/
│   ├── catalogue.js
│   ├── circulation.js
│   ├── patrons.js
│   ├── acquisitions.js
│   ├── serials.js
│   ├── search.js
│   ├── reports.js
│   └── settings.js
├── migrations/
│   ├── 001_initial_schema.sql
│   └── run-migrations.js
├── server.js                # Main Express app
├── package.json
└── .env
```

## Deployment

### DigitalOcean App Platform

1. Push code to Git repository
2. Create new App in DigitalOcean
3. Connect repository
4. Set environment variables
5. Add PostgreSQL managed database
6. Deploy

### Manual Deployment

1. Set up server with Node.js and PostgreSQL
2. Clone repository
3. Install dependencies: `npm install --production`
4. Set environment variables
5. Run migrations: `npm run migrate`
6. Start with PM2: `pm2 start server.js --name nara-library-api`

## Monitoring

- Check server health: `GET /health`
- View logs: `pm2 logs nara-library-api`
- Monitor database: Check PostgreSQL logs

## Support

For issues or questions, contact the NARA IT team.

## License

Proprietary - National Aquatic Resources Research & Development Agency (NARA)

