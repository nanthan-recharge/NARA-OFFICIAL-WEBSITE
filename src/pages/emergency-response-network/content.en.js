const en = {
  meta: {
    title: 'Emergency Response Network - NARA Digital Ocean',
    description:
      'Coordinate Sri Lanka\'s emergency readiness with real-time alerts, multi-agency communication, and rapid reporting tools managed by NARA\'s Emergency Response Network.',
    keywords:
      'NARA emergency response, tsunami warning Sri Lanka, disaster reporting, environmental incident, coastal emergencies, rapid response'
  },
  hero: {
    badge: 'Coastal Emergency Intelligence',
    subheading: 'Always-On Readiness',
    title: 'Protecting Sri Lanka\'s Coastline',
    highlight: 'through rapid response',
    description:
      'Our Emergency Response Network unites harbours, coastal communities, naval units, and environmental teams with real-time intelligence, bilingual alerting, and streamlined reporting for every incident category.',
    primaryCta: { label: 'Report an Emergency', icon: 'AlertOctagon' },
    secondaryCta: { label: 'Open Command Console', icon: 'LayoutDashboard' },
    leftStat: { value: '24/7', label: 'Coordinated Monitoring' },
    rightStat: { value: '18', label: 'Regional Cells' },
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&h=900&fit=crop&auto=format&q=80',
    images: [
      'https://images.unsplash.com/photo-1526481280695-3c46917d3e05?w=1600&h=900&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1570032257804-55cdb2fad6cf?w=1600&h=900&fit=crop&auto=format&q=80',
      'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=1600&h=900&fit=crop&auto=format&q=80'
    ]
  },
  quickActions: [
    {
      id: 'emergency-call',
      title: 'Immediate Threat',
      summary: 'Life-threatening events, maritime distress, or tsunami indicators.',
      primary: { label: 'Call 117 Coast Guard', icon: 'PhoneCall', href: 'tel:117' },
      secondary: { label: 'Push SOS to Maritime Network', icon: 'Radio', href: '#emergency-reporting' }
    },
    {
      id: 'environmental',
      title: 'Environmental Damage',
      summary: 'Oil spills, chemical discharge, coral bleaching, or illegal dumping.',
      primary: { label: 'Log Environmental Incident', icon: 'Droplets', href: '#environmental-reporting' },
      secondary: { label: 'Download Field Checklists', icon: 'ClipboardList', href: '#preparedness' }
    },
    {
      id: 'admin-console',
      title: 'Command & Analytics',
      summary: 'Authorised officers manage alerts, data streams, and multilingual messaging.',
      primary: { label: 'Open Admin Panel', icon: 'ShieldCheck', href: '/admin' },
      secondary: { label: 'View Operational Reports', icon: 'FileSpreadsheet', href: '#situation-room' }
    }
  ],
  reporting: {
    emergency: {
      title: 'Emergency Incident Intake',
      description:
        'Dispatch teams log critical incidents with integrated geolocation, category routing, and bilingual acknowledgements sent to field teams, police, navy, and harbour masters.',
      targetResponse: 'Average dispatch time: < 5 minutes',
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
          'Incident received. A bilingual dispatcher will contact you within 3 minutes. Track the response in the live console or hotline 1990.'
      }
    },
    nonEmergency: {
      title: 'Non-Emergency Support',
      description:
        'Report near-miss events, infrastructure issues, navigation hazards, or community concerns so we can schedule preventative action without triggering emergency mobilisation.',
      supportText: 'Dedicated coordination desk responds within 24 business hours.',
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
        acknowledgement: 'Support ticket created. You will receive a follow-up plan within 24 business hours.'
      }
    },
    environmental: {
      title: 'Environmental Impact & Damage Reporting',
      description:
        'Provide scientific-grade evidence for pollution events, coral bleaching, fish mortality, or illegal extraction so enforcement and restoration teams can react quickly.',
      hotline: 'Direct environmental duty officer: +94 11 452 7777',
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
        supportText: 'Automatically alerts CEA, Coast Conservation Department, and Marine Police partners.',
        submitLabel: 'Report Environmental Impact',
        acknowledgement:
          'Environmental enforcement unit alerted. Field team dispatch and partner notifications (CEA, Coast Conservation, Marine Police) are being coordinated.'
      }
    }
  },
  alerts: {
    title: 'Live Alert Feed',
    viewArchiveLabel: 'View alert archive',
    items: [
      {
        id: 'alert-001',
        title: 'Tsunami Advisory – Southern Coast',
        severity: 'critical',
        description: '10 cm sea-level displacement detected at Dondra Point buoy. Fisher fleets instructed to remain in harbour; siren test in progress.',
        location: 'Matara, Hambantota, Galle',
        timestamp: 'Updated 2 mins ago',
        affectedAreas: ['Dondra', 'Hambantota', 'Tangalle'],
        canDismiss: false,
        hasMap: true
      },
      {
        id: 'alert-002',
        title: 'Oil Slick Monitoring – Trincomalee',
        severity: 'high',
        description: 'Satellite and drone imagery confirm a 1.5 km surface sheen drifting south. Environmental teams deploying booms with navy support.',
        location: 'Trincomalee Harbour',
        timestamp: 'Updated 14 mins ago',
        affectedAreas: ['Trincomalee Bay', 'Kuchchaveli'],
        canDismiss: false,
        hasMap: true
      },
      {
        id: 'alert-003',
        title: 'Community Evacuation Drill',
        severity: 'medium',
        description: 'Scheduled tsunami evacuation drill for Moratuwa coastal GN divisions at 15:00. Loudspeaker announcements in Sinhala and Tamil underway.',
        location: 'Moratuwa Coast',
        timestamp: 'Updated 45 mins ago',
        affectedAreas: ['Angulana', 'Koralawella'],
        canDismiss: true,
        hasMap: false
      }
    ]
  },
  systemStatus: {
    systems: [
      {
        name: 'National Tsunami Buoy Network',
        status: 'operational',
        icon: 'Waves',
        uptime: '99.92%',
        responseTime: '4.2s',
        lastCheck: '10:12 today',
        nextMaintenance: 'Feb 14, 2025',
        description: 'Deep-ocean sensors streaming to Disaster Management Center.',
        statusMessage: 'All 12 buoys transmitting within thresholds.'
      },
      {
        name: 'Harbour Command Radio Mesh',
        status: 'degraded',
        icon: 'RadioReceiver',
        uptime: '97.4%',
        responseTime: '6.8s',
        lastCheck: '09:55 today',
        nextMaintenance: 'Jan 05, 2025',
        description: 'Secure VHF / LTE hybrid for harbour masters.',
        statusMessage: 'Galle repeater running on backup power, engineers en route.'
      },
      {
        name: 'Incident Dashboard & Analytics',
        status: 'operational',
        icon: 'LayoutDashboard',
        uptime: '100%',
        responseTime: '1.8s',
        lastCheck: 'Continuous',
        description: 'Command center data visualisation and tasking suite.'
      },
      {
        name: 'Community Siren Network',
        status: 'maintenance',
        icon: 'Megaphone',
        uptime: '95.2%',
        responseTime: '12.4s',
        lastCheck: 'Yesterday 18:30',
        nextMaintenance: 'Dec 28, 2024',
        description: '215 coastal sirens with solar backup.',
        statusMessage: 'Kalutara south siren battery replacement scheduled tonight.'
      }
    ]
  },
  contacts: {
    title: 'Joint Operations Contacts',
    description:
      'Reach the correct operations cell instantly. All numbers route to bilingual responders with satellite-failover telephony.',
    items: [
      {
        name: 'National Emergency Operations Centre',
        description: 'Primary 24/7 command desk coordinating disaster response.',
        availability: '24/7',
        languages: ['සිංහල', 'தமிழ்', 'English'],
        priority: true,
        icon: 'Shield',
        iconColor: 'text-red-600',
        bgColor: 'bg-red-100',
        phones: [
          { label: 'Hotline', number: '+94 11 307 7777' },
          { label: 'Satellite', number: '+881 633 550 120' }
        ],
        email: 'neoc@nara.gov.lk'
      },
      {
        name: 'Navy Maritime Rescue Coordination',
        description: 'Distress alerts, SAR tasking, and harbour evacuations.',
        availability: '24/7',
        languages: ['English', 'සිංහල'],
        icon: 'Anchor',
        iconColor: 'text-blue-600',
        bgColor: 'bg-blue-100',
        phones: [
          { label: 'SAR Desk', number: '+94 11 385 1234' },
          { label: 'VHF', number: 'Channel 16' }
        ],
        email: 'mrcc@sln.gov.lk'
      },
      {
        name: 'Environmental Rapid Response Unit',
        description: 'Oil spills, chemical discharge, coral and mangrove incidents.',
        availability: '05:30 – 22:00',
        languages: ['සිංහල', 'தமிழ்', 'English'],
        icon: 'Droplet',
        iconColor: 'text-green-600',
        bgColor: 'bg-green-100',
        phones: [
          { label: 'Duty Officer', number: '+94 11 452 7777' }
        ],
        email: 'env-response@nara.gov.lk'
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
        duration: '64 pages',
        downloads: '4,812',
        rating: '4.9',
        fileSize: '12 MB',
        keyTopics: ['Evac route setup', 'Special needs assistance', 'Communications log'],
        formats: [
          { type: 'pdf', url: '/assets/preparedness/evacuation-guide.pdf' }
        ],
        previewUrl: '#',
        lastUpdated: 'Nov 12, 2024',
        version: '2.3'
      },
      {
        title: 'Environmental Impact Rapid Assessment Checklist',
        type: 'checklist',
        description: 'Field-ready checklist for logging pollution events, sample collection, drone imagery capture, and regulatory notifications.',
        targetAudience: 'Environmental officers, Coast Guard',
        languages: ['English'],
        duration: '6 pages',
        downloads: '2,103',
        rating: '4.8',
        fileSize: '2 MB',
        keyTopics: ['Sampling', 'Stakeholder alerting', 'GIS tagging'],
        formats: [
          { type: 'pdf', url: '/assets/preparedness/environmental-checklist.pdf' }
        ],
        lastUpdated: 'Oct 05, 2024',
        version: '1.8'
      },
      {
        title: 'Community Siren Drill Tutorial',
        type: 'video',
        description: '10-minute walkthrough on planning and evaluating quarterly tsunami siren drills with inclusive messaging.',
        targetAudience: 'Local authorities, School leads',
        languages: ['සිංහල', 'தமிழ்'],
        duration: '10 min',
        downloads: '1,587',
        rating: '4.7',
        fileSize: 'Streaming',
        keyTopics: ['Drill design', 'Feedback capture', 'Media coordination'],
        formats: [
          { type: 'mp4', url: 'https://www.youtube.com/watch?v=example' }
        ],
        previewUrl: 'https://www.youtube.com/watch?v=example',
        lastUpdated: 'Sep 27, 2024',
        version: '1.1'
      }
    ]
  },
  situationRoom: {
    title: 'Situation Room & Analytics',
    description:
      'Authorised officers can launch the full emergency dashboard, manage multilingual push notifications, and download post-event analytics.',
    actions: [
      { label: 'Launch Command Dashboard', icon: 'Activity', href: '/admin/dashboard' },
      { label: 'Manage Alert Translations', icon: 'Languages', href: '/admin/content' },
      { label: 'Download After-Action Reports', icon: 'Archive', href: '#preparedness' }
    ]
  },
  environmentWatch: {
    title: 'Environmental Intelligence Layer',
    description:
      'Near-real-time datasets overlay coral health, mangrove stress, air and water quality, and fish mortality trends to anticipate incidents before they escalate.',
    stats: [
      { label: 'Coral watch sites', value: '128', trend: '+8 this month' },
      { label: 'Mangrove sensors', value: '74', trend: '+4 deployments' },
      { label: 'Water quality alerts', value: '12', trend: '3 active' }
    ],
    cta: { label: 'View Environmental Dashboard', icon: 'Globe2', href: '/environmental-intelligence' }
  }
};

export default en;
