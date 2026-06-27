# NARA Digital Ocean - Government Cloud Migration
## Executive Summary for Ministry Presentation

---

## QUICK COMPARISON

| Option | Setup Cost | Annual Cost | Timeline | Best For |
|--------|-----------|-------------|----------|----------|
| **Firebase (Current)** | LKR 0 | LKR 2.5M | N/A | ❌ Not ICTA compliant |
| **LGC (Recommended)** | LKR 10M | LKR 13.1M | 3-4 months | ✅ Best balance |
| **On-Premise** | LKR 35M | LKR 20M | 6-8 months | Only if existing datacenter |
| **Hybrid** | LKR 8M | LKR 9M | 4-6 months | Middle ground |

---

## RECOMMENDED: LANKA GOVERNMENT CLOUD (LGC)

### Why LGC?
- ✅ **ICTA Compliant** - Meets all government requirements
- ✅ **Cost-Effective** - LKR 64.5 million over 5 years
- ✅ **Fast Migration** - 3-4 months (vs 6-8 for on-premise)
- ✅ **Scalable** - Easy to add resources
- ✅ **Reliable** - 99.5% uptime, professional ICTA support
- ✅ **Secure** - Government-grade security, SLCERT compliant
- ✅ **Low Maintenance** - 2 staff vs 4 for on-premise

### 5-Year Total Cost: LKR 64,500,000

**Breakdown:**
- Migration (one-time): LKR 10,000,000
- Year 1-5 operating: LKR 13,100,000/year × 5 = LKR 65,500,000
- **Total**: LKR 75,500,000

---

## MIGRATION TIMELINE (LGC)

### Month 1: Infrastructure Setup
- **Week 1-2**: Apply for LGC through ICTA, get nara.gov.lk domain
- **Week 3-4**: ICTA provisions 9 virtual machines, install software
- **Developer**: Prepare migration scripts
- **Government IT**: Execute setup with ICTA support

### Month 2: Code Migration
- **Week 1-2**: Convert Firebase code to LGC-compatible code
  - Replace Firebase Auth with custom authentication
  - Convert database queries (Firestore → PostgreSQL)
  - Replace Firebase Storage with MinIO
- **Week 3**: Convert cloud functions to Express.js APIs
- **Week 4**: Testing and bug fixes
- **Developer**: Full-time coding work (320 hours)

### Month 3: Data Migration
- **Week 1**: Export 25 GB database from Firebase
- **Week 2**: Import and verify data on LGC
- **Week 3**: Migrate 150 GB of files (PDFs, images, videos)
- **Week 4**: Integration testing with NARA staff
- **Developer**: Run migration scripts, verify data integrity

### Month 4: Deployment
- **Week 1**: Staging deployment, user acceptance testing
- **Week 2**: SLCERT security audit and fixes
- **Week 3**: Production deployment (DNS cutover during maintenance window)
- **Week 4**: 24/7 monitoring, immediate support, optimization
- **Developer**: Deployment support, bug fixes

---

## COST BREAKDOWN

### One-Time Migration Cost: LKR 10,000,000

**Developer Team:**
- Code migration (320 hours @ LKR 5,000/hr): LKR 1,600,000
- Database conversion (320 hours): LKR 1,600,000
- Storage migration (160 hours): LKR 800,000
- API development (200 hours): LKR 1,000,000
- Frontend updates (240 hours): LKR 1,200,000
- Testing (160 hours): LKR 800,000
- Documentation (80 hours): LKR 400,000
- Deployment support (120 hours): LKR 600,000
- **Subtotal**: LKR 8,000,000

**Infrastructure Setup:**
- ICTA setup fees: LKR 500,000
- SSL certificates: LKR 100,000
- Training for government IT staff: LKR 700,000
- SLCERT security audit: LKR 400,000
- Contingency (15%): LKR 300,000
- **Subtotal**: LKR 2,000,000

**TOTAL MIGRATION**: **LKR 10,000,000**

### Annual Operating Cost: LKR 13,100,000/year

**LGC Cloud Services: LKR 5,000,000/year**
- Web servers (2 VMs): LKR 600,000
- API servers (2 VMs): LKR 800,000
- Database servers (2 VMs): LKR 1,200,000
- Storage server (1 VM): LKR 400,000
- Cache server (1 VM): LKR 200,000
- Backup server (1 VM): LKR 300,000
- Storage & bandwidth: LKR 1,100,000
- Load balancer, SSL, backups: LKR 400,000

**Government IT Staff: LKR 3,000,000/year**
- System administrators (2 full-time): LKR 3,000,000

**Developer Team (Ongoing Support): LKR 1,800,000/year**
- Senior developer (20 hours/month): LKR 1,200,000
- Frontend developer (10 hours/month): LKR 600,000

**Application Maintenance: LKR 2,200,000/year**
- Feature enhancements: LKR 1,000,000
- Bug fixes: LKR 500,000
- Security patches: LKR 300,000
- Performance optimization: LKR 400,000

**Third-Party APIs: LKR 900,000/year**
- NASA, Stormglass, OpenWeather, ChatGPT, etc.

**Training & Support: LKR 200,000/year**

**TOTAL ANNUAL**: **LKR 13,100,000**

---

## WHAT EACH TEAM HANDLES

### Developer Team Responsibilities ✅

**Migration Phase (3-4 months):**
- ✅ Convert all Firebase code to LGC-compatible code
- ✅ Write data migration scripts
- ✅ Test all 80+ pages
- ✅ Deploy to staging and production
- ✅ Fix bugs during migration
- ✅ Create documentation
- ✅ Train government IT staff
- **Cost**: LKR 8,000,000 (one-time)

**Ongoing Support (monthly):**
- ✅ Add new features (quarterly releases)
- ✅ Fix bugs reported by users
- ✅ Apply security patches
- ✅ Optimize performance
- ✅ Update third-party integrations
- **Cost**: LKR 1,800,000/year

**What Developer DOES NOT Handle:**
- ❌ Buy or install servers (Government IT does this)
- ❌ Manage LGC virtual machines (ICTA + Government IT)
- ❌ Configure firewalls (Government IT)
- ❌ 24/7 server monitoring (Government IT)
- ❌ Daily backups (Automated, monitored by Government IT)

### Government IT Team Responsibilities 🏛️

**Migration Phase:**
- 🏛️ Apply for LGC through ICTA
- 🏛️ Register nara.gov.lk domain
- 🏛️ Work with ICTA to provision 9 VMs
- 🏛️ Install operating systems
- 🏛️ Execute setup scripts provided by developers
- 🏛️ Configure network security and firewalls
- 🏛️ Set up monitoring dashboards
- 🏛️ Coordinate SLCERT security audit
- **Cost**: Included in LGC setup

**Ongoing Operations:**
- 🏛️ Monitor server health daily
- 🏛️ Verify backup completion
- 🏛️ Apply security patches (OS level)
- 🏛️ Manage user accounts and permissions
- 🏛️ Respond to alerts
- 🏛️ Coordinate with ICTA for support
- 🏛️ Annual SLCERT audits
- **Staff**: 2 system administrators (LKR 3M/year)

### ICTA Responsibilities (LGC Provider) 🌐

**Infrastructure:**
- 🌐 Provide LGC virtual machines
- 🌐 Manage physical datacenter
- 🌐 Network infrastructure
- 🌐 Internet connectivity
- 🌐 Power and cooling
- 🌐 Physical security
- 🌐 Hardware maintenance
- 🌐 24/7 infrastructure support
- **Cost**: LKR 5,000,000/year (included in LGC fees)

---

## TECHNICAL ARCHITECTURE (LGC)

### Current Firebase Setup → LGC Replacement

| Firebase Service | LGC Replacement | Change Required |
|-----------------|----------------|-----------------|
| **Firebase Auth** | Custom JWT + PostgreSQL | Replace auth code (40 hours) |
| **Firestore Database** | PostgreSQL 15 | Convert queries (120 hours) |
| **Firebase Storage** | MinIO (S3-compatible) | Replace storage calls (60 hours) |
| **Cloud Functions** | Express.js APIs + PM2 | Convert functions (40 hours) |
| **Firebase Hosting** | Nginx web server | Deploy static files (20 hours) |
| **Analytics** | Google Analytics | No change needed |

### LGC Virtual Machines (9 VMs Total)

**Web Servers (2 VMs) - Load Balanced**
- Hosts: React application (frontend)
- CPU: 4 cores, RAM: 8 GB, Disk: 50 GB
- Software: Nginx

**API Servers (2 VMs) - Load Balanced**
- Hosts: Node.js backend APIs
- CPU: 8 cores, RAM: 16 GB, Disk: 100 GB
- Software: Node.js, Express.js, PM2

**Database Servers (2 VMs) - Primary + Replica**
- Hosts: PostgreSQL database
- CPU: 8 cores, RAM: 32 GB, Disk: 500 GB
- Software: PostgreSQL 15

**Storage Server (1 VM)**
- Hosts: Files (PDFs, images, videos)
- CPU: 4 cores, RAM: 8 GB, Disk: 1 TB
- Software: MinIO (S3-compatible)

**Cache Server (1 VM)**
- Hosts: Session cache, API cache
- CPU: 2 cores, RAM: 8 GB, Disk: 50 GB
- Software: Redis

**Backup Server (1 VM)**
- Hosts: Daily automated backups
- CPU: 2 cores, RAM: 4 GB, Disk: 2 TB
- Software: Backup tools

**Total Resources:**
- 52 CPU cores
- 144 GB RAM
- 4.2 TB storage

---

## DATA MIGRATION DETAILS

### Database: 25 GB (45 Collections)

**Critical Collections:**
- Users: 50,000 records
- Research Papers: 1,000 papers
- Library Items: 5,000 books
- News Articles: 500 articles
- Government Services: 200 services
- (40 more collections)

**Migration Process:**
1. Export from Firestore to JSON (1 day)
2. Transform data for PostgreSQL (2 days)
3. Import to PostgreSQL (1 day)
4. Verify data integrity (1 day)

**Total Time**: 5 days

### Files: 150 GB (10,000 Files)

**File Types:**
- Research papers (PDFs): 50 GB
- Library documents: 40 GB
- Images: 40 GB
- Videos: 15 GB
- User uploads: 5 GB

**Migration Process:**
1. Download from Firebase Storage (3-5 days)
2. Upload to MinIO on LGC (2-3 days)
3. Update URLs in database (1 day)
4. Verify file access (1 day)

**Total Time**: 7-10 days

---

## RISK MITIGATION

### Top Risks & Solutions

**1. Data Loss During Migration**
- ✅ **Solution**: Multiple backups, incremental migration, validation at every step
- ✅ **Rollback**: Can revert to Firebase within 1 hour if issues occur

**2. Service Downtime**
- ✅ **Solution**: DNS cutover during low-traffic period (Saturday 11 PM - 3 AM)
- ✅ **Parallel Operation**: Both systems run simultaneously for 1 week

**3. Performance Issues**
- ✅ **Solution**: Load testing with 10,000 concurrent users before go-live
- ✅ **Monitoring**: 24/7 performance monitoring for first 2 weeks

**4. Security Vulnerabilities**
- ✅ **Solution**: SLCERT security audit before production
- ✅ **Compliance**: Penetration testing, vulnerability scanning

**5. Staff Shortage**
- ✅ **Solution**: Train 2 government IT staff (700K training budget)
- ✅ **Support**: Developer team on-call for 6 months post-launch

---

## COMPLIANCE CHECKLIST

### ICTA Guidelines v4.0 ✅
- [x] gov.lk domain (nara.gov.lk)
- [x] Hosted in Sri Lanka (LGC)
- [x] Trilingual (Sinhala, Tamil, English)
- [x] WCAG 2.1 AA accessibility
- [x] HTTPS only
- [x] All legal pages (Privacy, Terms, etc.)

### SLCERT Security ✅
- [x] Firewall configured
- [x] Intrusion detection
- [x] Encryption (TLS 1.3, AES-256)
- [x] Security audit (6-month requirement)
- [x] Penetration testing
- [x] Audit logging

### Data Protection Act 2022 ✅
- [x] Privacy policy
- [x] User consent
- [x] Data subject rights
- [x] Data breach procedures
- [x] Data retention policies

### RTI Act 2016 ✅
- [x] RTI disclosure page
- [x] Public information accessible
- [x] RTI request procedures

---

## COMPARISON: LGC vs ON-PREMISE

| Aspect | LGC | On-Premise |
|--------|-----|------------|
| **Setup Cost** | LKR 10M | LKR 35M |
| **Setup Time** | 3-4 months | 6-8 months |
| **Annual Cost** | LKR 13.1M | LKR 20M |
| **Staff Required** | 2 admins | 4 staff (admins, network, security) |
| **Electricity** | Included | LKR 6.5M/year |
| **Scalability** | Easy (add VMs) | Difficult (buy new hardware) |
| **Maintenance** | ICTA handles infrastructure | Full responsibility |
| **Reliability** | 99.5% (ICTA SLA) | 95-98% (depends on setup) |
| **Hardware Refresh** | Not needed | LKR 20M every 5 years |
| **5-Year TCO** | **LKR 64.5M** | **LKR 142M** |

**Recommendation**: LGC saves LKR 77.5 million over 5 years compared to on-premise.

---

## WHY NOT STAY ON FIREBASE?

### Issues with Current Firebase Setup:

**1. Data Sovereignty ❌**
- Data stored in Google's international servers
- Not compliant with government data policies

**2. ICTA Non-Compliance ❌**
- Not on gov.lk domain
- Not hosted in Sri Lanka
- Doesn't meet government hosting requirements

**3. Cost Escalation 💰**
- Currently FREE (Spark plan)
- Will cost LKR 2-3 million/year when scaled
- No cost control (pay per usage)

**4. Vendor Lock-In ⚠️**
- Dependent on Google
- Pricing can change anytime
- Account can be suspended

**5. Government Control ❌**
- No physical control over data
- Cannot audit infrastructure
- Subject to foreign company policies

---

## NEXT STEPS TO START MIGRATION

### This Month (January 2025)

**Week 1:**
1. **Ministry Approval** - Present this plan, get approval
2. **Budget Allocation** - Allocate LKR 23.1M (Year 1 total)
3. **Engage Developer Team** - Sign contract for migration

**Week 2:**
1. **Submit LGC Application** - Apply through ICTA (https://www.icta.lk/lgc)
2. **Request nara.gov.lk Domain** - Apply through ICTA domains team
3. **Form Project Team** - Assign government IT staff

**Week 3-4:**
1. **ICTA Processing** - Wait for LGC account approval
2. **Kick-off Meeting** - Developer team + Government IT + ICTA
3. **Detailed Planning** - Create detailed project plan

### February 2025 - May 2025

**Month 1 (February):**
- ICTA provisions VMs
- Software installation
- Developer prepares migration code

**Month 2 (March):**
- Code migration
- Testing

**Month 3 (April):**
- Data migration
- Integration testing
- UAT with NARA staff

**Month 4 (May):**
- SLCERT audit
- Production deployment
- Go-live on nara.gov.lk

---

## BUDGET REQUEST SUMMARY

### Year 1 Total Budget: LKR 23,100,000

**One-Time Costs:**
- Migration (developer team): LKR 8,000,000
- Infrastructure setup: LKR 2,000,000
- **Subtotal**: **LKR 10,000,000**

**Annual Recurring Costs:**
- LGC cloud services: LKR 5,000,000
- Government IT staff: LKR 3,000,000
- Developer ongoing support: LKR 1,800,000
- Application maintenance: LKR 2,200,000
- Third-party APIs: LKR 900,000
- Training & support: LKR 200,000
- **Subtotal**: **LKR 13,100,000**

**Year 2-5 Annual Budget: LKR 13,100,000/year**

---

## EXPECTED OUTCOMES

### Technical Outcomes ✅
- ✅ 100% feature parity with current Firebase version
- ✅ All 80+ pages working perfectly
- ✅ All 25+ admin systems operational
- ✅ 99.5% uptime (same or better than Firebase)
- ✅ < 2 second page load time maintained
- ✅ Zero data loss during migration

### Compliance Outcomes ✅
- ✅ Full ICTA Guidelines v4.0 compliance
- ✅ Data sovereignty (all data in Sri Lanka)
- ✅ SLCERT security standards met
- ✅ Pass all government audits
- ✅ Official nara.gov.lk domain

### Operational Outcomes ✅
- ✅ Government control over infrastructure
- ✅ No vendor lock-in
- ✅ Predictable costs (no usage-based surprises)
- ✅ Professional ICTA support
- ✅ Trained government IT staff

### Strategic Outcomes ✅
- ✅ Demonstrate digital government leadership
- ✅ Set example for other government agencies
- ✅ Build internal IT capacity
- ✅ Long-term sustainability
- ✅ Future-ready platform

---

## QUESTIONS & ANSWERS

**Q: Can we continue using Firebase?**
A: Not recommended. Firebase doesn't meet ICTA data sovereignty requirements and will be expensive when scaled. Migration to LGC ensures compliance and long-term cost control.

**Q: Is 3-4 months realistic?**
A: Yes. We have detailed project plan with clear milestones. LGC provisioning is fastest (vs 6-8 months for on-premise hardware).

**Q: What if something goes wrong?**
A: We can revert to Firebase within 1 hour if critical issues occur. We'll run both systems in parallel for 1 week to ensure smooth transition.

**Q: Why not on-premise to save annual costs?**
A: On-premise has higher setup cost (LKR 35M vs LKR 10M) and ongoing costs (electricity LKR 6.5M/year). Total 5-year cost is LKR 142M vs LKR 64.5M for LGC.

**Q: What about existing users?**
A: Zero impact. All 50,000+ users continue with same accounts. No re-registration needed.

**Q: Will performance be affected?**
A: No. LGC infrastructure is enterprise-grade. We'll do load testing before go-live to ensure < 2 second page loads.

**Q: Who manages the LGC servers?**
A: ICTA manages physical infrastructure (datacenter, hardware, network). Government IT manages VMs (applications, backups). Developer team maintains application code.

**Q: How often do we need SLCERT audits?**
A: Every 6 months (government requirement). Cost: LKR 400,000 per audit.

**Q: Can we add more features later?**
A: Yes! LGC is scalable. We can easily add VMs or storage as needed. Budget includes ongoing development (LKR 2.2M/year for enhancements).

**Q: What training is provided?**
A: Full training for government IT staff (2 weeks system administration + 1 week application training). Budget: LKR 700,000.

---

## APPROVAL REQUIRED

### Decision Required From:

1. **Fisheries Ministry** - Budget approval (LKR 23.1M Year 1)
2. **NARA Chairman** - Strategic direction approval
3. **NARA IT Division** - Technical implementation approval
4. **Finance Department** - Fund allocation

### Documents to Sign:

1. LGC Application (submit to ICTA)
2. Developer Team Contract (migration work)
3. Government IT Staff Assignment
4. Budget Approval (LKR 23.1M)

### Timeline to Decision:

- **This Week**: Present plan to stakeholders
- **Next Week**: Approve budget and approach
- **Week 3**: Submit LGC application
- **Week 4**: Engage developer team

**Target Go-Live Date: May 2025 (4 months from now)**

---

## CONTACT FOR QUESTIONS

**Technical Questions:**
- Developer Team Lead (to be assigned after approval)

**LGC Questions:**
- ICTA LGC Team: lgc@icta.lk / +94 11 2369099

**Security Questions:**
- SLCERT: info@cert.gov.lk / +94 11 2369073

**Domain Questions:**
- ICTA Domains: domains@icta.lk

---

**RECOMMENDATION: Approve LGC migration with LKR 23.1M Year 1 budget. Begin application process immediately to achieve May 2025 go-live.**

---

*This summary is based on detailed technical analysis in the full migration plan document (GOVERNMENT_CLOUD_MIGRATION_PLAN.md).*
