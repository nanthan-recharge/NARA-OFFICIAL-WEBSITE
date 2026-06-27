const en = {
  meta: {
    title: 'Emergency Response Network - NARA Digital Ocean',
    description:
      'Coordinate Sri Lanka\'s emergency readiness with emergency contact shortcuts, evidence intake, and rapid reporting tools managed by NARA\'s Emergency Response Network.',
    keywords:
      'NARA emergency response, tsunami warning Sri Lanka, disaster reporting, environmental incident, coastal emergencies, rapid response'
  },
  hero: {
    badge: 'Coastal Emergency Intelligence',
    subheading: 'Always-On Readiness',
    title: 'Protecting Sri Lanka\'s Coastline',
    highlight: 'through rapid response',
    description:
      'Our Emergency Response Network helps coastal communities, harbour users, and environmental observers reach the right emergency line first, then share location, evidence, and follow-up details with NARA.',
    primaryCta: { label: 'Report an Emergency', icon: 'AlertOctagon' },
    secondaryCta: { label: 'Open Command Console', icon: 'LayoutDashboard' },
    leftStat: { value: '24/7', label: 'Coordinated Monitoring' },
    rightStat: { value: '18', label: 'Regional Cells' },
    image: '/assets/emergency/hero-1.webp',
    images: [
      '/assets/emergency/hero-1.webp',
      '/assets/emergency/hero-2.webp',
      '/assets/emergency/hero-3.webp',
      '/assets/emergency/hero-4.webp',
      '/assets/emergency/hero-5.webp'
    ]
  },
  quickActions: [
    {
      id: 'emergency-call',
      title: 'Immediate Threat',
      summary: 'Life-threatening events, maritime distress, or tsunami indicators.',
      primary: { label: 'Call DMC 117', icon: 'PhoneCall', href: 'tel:117' },
      secondary: { label: 'Report Emergency Now', icon: 'Radio', href: '#emergency-reporting' }
    },
    {
      id: 'environmental',
      title: 'Environmental Damage',
      summary: 'Oil spills, chemical discharge, coral bleaching, or illegal dumping.',
      primary: { label: 'Log Environmental Incident', icon: 'Droplets', href: '#environmental-reporting' },
      secondary: { label: 'Download Field Checklists', icon: 'ClipboardList', href: '#preparedness' }
    },
    {
      id: 'complaint-support',
      title: 'Complaint / Service Support',
      summary: 'Non-urgent public complaints, service concerns, and follow-up requests.',
      primary: { label: 'Submit Complaint', icon: 'MessageSquareWarning', href: '#non-emergency-reporting' },
      secondary: { label: 'Emergency Directory', icon: 'PhoneCall', href: '#contacts' }
    }
  ],
  reporting: {
    emergency: {
      title: 'Emergency Incident Intake',
      description:
        'Dispatch teams log critical incidents with integrated geolocation, category routing, and bilingual acknowledgements sent to field teams, police, navy, and harbour masters.',
      targetResponse: 'Public intake with reference number',
      form: {
        title: 'Submit Emergency Report',
        fields: [
          { id: 'name', type: 'text', label: 'Reporting Officer / Caller Name', placeholder: 'Enter full name', required: true },
          { id: 'contact', type: 'tel', label: 'Contact Number / Radio Call Sign', placeholder: '+94 XX XXX XXXX or VHF channel', required: true },
          {
            id: 'incidentType',
            type: 'select',
            label: 'Incident Type',
            placeholder: 'Select incident category',
            required: true,
            options: [
              'Search and rescue',
              'Maritime collision / distress',
              'Tsunami or seismic trigger',
              'Severe weather impact',
              'Fire / explosion',
              'Other critical event'
            ]
          },
          { id: 'location', type: 'text', label: 'Exact Location / GPS Coordinates', placeholder: 'Lat, Long or locality', required: true },
          { id: 'description', type: 'textarea', label: 'Situation Summary', placeholder: 'Describe the emergency, affected people, and visible risks', required: true },
          { id: 'resources', type: 'textarea', label: 'Resources Requested', placeholder: 'Boats, medical teams, hazmat unit, evacuation support' },
          { id: 'attachments', type: 'file', label: 'Attach Evidence (images, video, docs)' }
        ],
        submitLabel: 'Send Emergency Report',
        acknowledgement:
          'Emergency report received. Keep calling DMC 117, Police 119, or ambulance 1990 for immediate danger while NARA reviews the submitted details.'
      }
    },
    nonEmergency: {
      title: 'Non-Emergency Support',
      description:
        'Report near-miss events, infrastructure issues, navigation hazards, or community concerns so we can schedule preventative action without triggering emergency mobilisation.',
      supportText: 'Public complaints and support requests are logged for review and follow-up.',
      form: {
        title: 'Log Non-Emergency Issue',
        fields: [
          { id: 'name', type: 'text', label: 'Reporter Name / Organisation', placeholder: 'Enter name or division', required: true },
          { id: 'email', type: 'email', label: 'Email / Contact (optional)', placeholder: 'yourname@nara.gov.lk' },
          {
            id: 'category',
            type: 'select',
            label: 'Issue Category',
            placeholder: 'Select issue category',
            required: true,
            options: [
              'Damaged buoy, beacon, or light',
              'Blocked navigation channel',
              'Community infrastructure risk',
              'Harbour equipment maintenance',
              'Fisher safety briefing request',
              'Other support request'
            ]
          },
          { id: 'location', type: 'text', label: 'Location / Facility', placeholder: 'Harbour, GN division, coordinates', required: true },
          { id: 'details', type: 'textarea', label: 'Details', placeholder: 'Describe the situation, potential impacts, suggested action', required: true },
          { id: 'preferredDate', type: 'date', label: 'Preferred Follow-up Date' }
        ],
        submitLabel: 'Submit Support Request',
        acknowledgement: 'Complaint/support request received. Keep the reference number for follow-up with NARA.'
      }
    },
    environmental: {
      title: 'Environmental Impact & Damage Reporting',
      description:
        'Provide scientific-grade evidence for pollution events, coral bleaching, fish mortality, or illegal extraction so enforcement and restoration teams can react quickly.',
      hotline: 'For urgent public safety risks call DMC 117 or Police 119 first. Submit evidence here for NARA review.',
      form: {
        title: 'Environmental Incident Intake',
        fields: [
          {
            id: 'impactType',
            type: 'select',
            label: 'Impact Type',
            placeholder: 'Select impact type',
            required: true,
            options: [
              'Oil / chemical spill',
              'Mangrove destruction',
              'Coral bleaching event',
              'Fish kill / algal bloom',
              'Illegal sand extraction',
              'Marine mammal stranding',
              'Other environmental damage'
            ]
          },
          { id: 'detectedOn', type: 'datetime-local', label: 'Detection Time', required: true },
          { id: 'location', type: 'text', label: 'Location / Reef / River Mouth', placeholder: 'Describe site and coordinates', required: true },
          { id: 'extent', type: 'text', label: 'Affected Area / Scale', placeholder: 'Approximate area, volume, length, or percentage' },
          { id: 'currentStatus', type: 'textarea', label: 'Current Situation', placeholder: 'What is happening now? Tides, weather, continuing discharge, etc.', required: true },
          { id: 'samples', type: 'textarea', label: 'Samples Collected / Laboratory Support Needed', placeholder: 'Water samples, tissue, photographic evidence, drone footage' },
          { id: 'attachments', type: 'file', label: 'Attach Photos, Drone Imagery, Lab Results' }
        ],
        supportText: 'NARA will review the evidence and route it to relevant authorities where applicable.',
        submitLabel: 'Report Environmental Impact',
        acknowledgement:
          'Environmental incident received. Keep the reference number and stay reachable for verification or follow-up questions.'
      }
    }
  },
  alerts: {
    title: 'Emergency Notices',
    viewArchiveLabel: 'Review active alerts',
    items: [
      {
        id: 'alert-001',
        title: 'Immediate danger: call first',
        severity: 'critical',
        description: 'For life-threatening danger, call DMC 117, Police 119, or ambulance 1990 before submitting an online report.',
        location: 'Sri Lanka',
        timestamp: 'Public guidance',
        affectedAreas: ['National emergency lines'],
        canDismiss: false,
        hasMap: true
      },
      {
        id: 'alert-002',
        title: 'Attach evidence for faster triage',
        severity: 'high',
        description: 'For coastal pollution, fish kills, illegal dumping, or reef damage, include photos, GPS/location details, time observed, and contact information.',
        location: 'Marine and coastal areas',
        timestamp: 'Evidence checklist',
        affectedAreas: ['Photos', 'Location', 'Time observed'],
        canDismiss: false,
        hasMap: false
      },
      {
        id: 'alert-003',
        title: 'Complaints and service requests',
        severity: 'medium',
        description: 'Use the complaint/support tab for non-urgent concerns. Save the reference number shown after submission for follow-up.',
        location: 'NARA public services',
        timestamp: 'Service guidance',
        affectedAreas: ['Complaints', 'Support', 'Follow-up'],
        canDismiss: true,
        hasMap: false
      }
    ]
  },
  systemStatus: {
    systems: [
      {
        name: 'Immediate Emergency Contacts',
        status: 'operational',
        icon: 'PhoneCall',
        primaryMetricLabel: 'Call first',
        primaryMetric: '117 / 119',
        secondaryMetricLabel: 'Medical',
        secondaryMetric: '1990',
        description: 'National emergency numbers are visible in the hero, reporting hub, and directory.',
        statusMessage: 'Use phone lines first when life, property, or public safety is at immediate risk.'
      },
      {
        name: 'Online Report Intake',
        status: 'operational',
        icon: 'ClipboardList',
        primaryMetricLabel: 'Forms',
        primaryMetric: '3',
        secondaryMetricLabel: 'Receipt',
        secondaryMetric: 'Reference ID',
        description: 'Emergency, environmental, and complaint/support reports use focused forms.',
        statusMessage: 'Submissions return a public reference number for follow-up.'
      },
      {
        name: 'Preparedness Downloads',
        status: 'operational',
        icon: 'FileDown',
        primaryMetricLabel: 'PDFs',
        primaryMetric: '4',
        secondaryMetricLabel: 'Format',
        secondaryMetric: 'Mobile ready',
        description: 'Evacuation, environmental, community drill, and map reference PDFs are downloadable.'
      },
      {
        name: 'Staff Review Access',
        status: 'maintenance',
        icon: 'ShieldCheck',
        primaryMetricLabel: 'Read',
        primaryMetric: 'Admin only',
        secondaryMetricLabel: 'Rules',
        secondaryMetric: 'Configured',
        description: 'Public submissions are create-only; staff roles manage review and follow-up.',
        statusMessage: 'Deploy Firestore rules with the hosting update before relying on live submissions.'
      }
    ]
  },
  contacts: {
    title: 'Joint Operations Contacts',
    description:
      'Use national emergency lines first for immediate danger, then share evidence and follow-up details through NARA channels.',
    items: [
      {
        name: 'Disaster Management Centre',
        description: 'National disaster call centre for urgent disaster coordination.',
        availability: '24/7',
        languages: ['සිංහල', 'தமிழ்', 'English'],
        priority: true,
        icon: 'Shield',
        iconColor: 'text-red-600',
        bgColor: 'bg-red-100',
        phones: [
          { label: 'Disaster Hotline', number: '117' }
        ]
      },
      {
        name: 'Sri Lanka Police Emergency',
        description: 'Emergency police response for immediate public safety threats.',
        availability: '24/7',
        languages: ['සිංහල', 'தமிழ்', 'English'],
        icon: 'BadgeAlert',
        iconColor: 'text-blue-600',
        bgColor: 'bg-blue-100',
        phones: [
          { label: 'Police Emergency', number: '119' }
        ]
      },
      {
        name: 'Ambulance / Medical Emergency',
        description: 'Immediate medical emergency and ambulance support.',
        availability: '24/7',
        languages: ['සිංහල', 'தமிழ்', 'English'],
        icon: 'Ambulance',
        iconColor: 'text-green-600',
        bgColor: 'bg-green-100',
        phones: [
          { label: 'Ambulance', number: '1990' }
        ]
      },
      {
        name: 'NARA Marine Reporting Desk',
        description: 'Marine and coastal evidence, complaints, and service follow-up.',
        availability: 'Office hours / online reports 24/7',
        languages: ['සිංහල', 'தமிழ்', 'English'],
        icon: 'Waves',
        iconColor: 'text-cyan-600',
        bgColor: 'bg-cyan-100',
        phones: [
          { label: 'NARA main line', number: '+94 11 252 1000' }
        ],
        email: 'info@nara.ac.lk'
      }
    ]
  },
  preparedness: {
    title: 'Preparedness & Training Library',
    description:
      'Issue-ready resources reviewed quarterly with updated SOPs, checklists, language packs, and community drill templates.',
    items: [
      {
        title: 'Coastal Evacuation Field Guide',
        type: 'guide',
        description: 'Step-by-step playbook for GN officers and harbour masters covering multi-lingual announcements, evacuation route management, and post-event roll call.',
        targetAudience: 'GN officers, Harbour masters',
        languages: ['සිංහල', 'தமிழ்', 'English'],
        duration: '1 page',
        fileSize: 'PDF',
        keyTopics: ['Evac route setup', 'Special needs assistance', 'Communications log'],
        formats: [
          { type: 'pdf', url: '/assets/preparedness/evacuation-guide.pdf' }
        ],
        previewUrl: '/assets/preparedness/evacuation-guide.pdf',
        lastUpdated: 'Jun 27, 2026',
        version: '1.0'
      },
      {
        title: 'Environmental Impact Rapid Assessment Checklist',
        type: 'checklist',
        description: 'Field-ready checklist for logging pollution events, sample collection, drone imagery capture, and regulatory notifications.',
        targetAudience: 'Environmental officers, field teams',
        languages: ['English'],
        duration: '1 page',
        fileSize: 'PDF',
        keyTopics: ['Sampling', 'Stakeholder alerting', 'GIS tagging'],
        formats: [
          { type: 'pdf', url: '/assets/preparedness/environmental-checklist.pdf' }
        ],
        previewUrl: '/assets/preparedness/environmental-checklist.pdf',
        lastUpdated: 'Jun 27, 2026',
        version: '1.0'
      },
      {
        title: 'Community Alert Drill Quick Reference',
        type: 'checklist',
        description: 'One-page quick reference for planning and evaluating coastal alert drills with inclusive messaging.',
        targetAudience: 'Local authorities, School leads',
        languages: ['සිංහල', 'தமிழ்', 'English'],
        duration: '1 page',
        fileSize: 'PDF',
        keyTopics: ['Drill design', 'Feedback capture', 'Media coordination'],
        formats: [
          { type: 'pdf', url: '/assets/preparedness/community-siren-drill.pdf' }
        ],
        previewUrl: '/assets/preparedness/community-siren-drill.pdf',
        lastUpdated: 'Jun 27, 2026',
        version: '1.0'
      }
    ]
  },
  situationRoom: {
    title: 'Choose the Right Emergency Channel',
    description:
      'For immediate danger, call first. For evidence, environmental reports, or service complaints, use the focused form and keep the reference number.',
    actions: [
      { label: 'Call DMC 117', icon: 'PhoneCall', href: 'tel:117' },
      { label: 'Submit Complaint / Support', icon: 'MessageSquareWarning', href: '#non-emergency-reporting' },
      { label: 'Download Evacuation Reference', icon: 'Archive', href: '/assets/preparedness/evacuation-map-quick-reference.pdf' }
    ]
  },
  environmentWatch: {
    title: 'Environmental Intelligence Layer',
    description:
      'Reference datasets and public observations can support coral health, mangrove stress, water quality, and fish mortality review workflows.',
    stats: [
      { label: 'Coral watch sites', value: '128', trend: '+8 this month' },
      { label: 'Mangrove sensors', value: '74', trend: '+4 deployments' },
      { label: 'Water quality alerts', value: '12', trend: '3 active' }
    ],
    cta: { label: 'View Environmental Dashboard', icon: 'Globe2', href: '/environmental-intelligence' }
  }
};

export default en;
