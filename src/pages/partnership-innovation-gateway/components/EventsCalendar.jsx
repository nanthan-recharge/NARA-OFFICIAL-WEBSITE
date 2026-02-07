import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EventsCalendar = () => {
  const [selectedMonth, setSelectedMonth] = useState('2024-12');
  const [selectedEvent, setSelectedEvent] = useState(null);

  const months = [
    { value: '2024-10', label: 'October 2024' },
    { value: '2024-11', label: 'November 2024' },
    { value: '2024-12', label: 'December 2024' },
    { value: '2025-01', label: 'January 2025' },
    { value: '2025-02', label: 'February 2025' },
    { value: '2025-03', label: 'March 2025' }
  ];

  const events = [
    {
      id: 1,
      title: "International Ocean Science Conference 2024",
      type: "Conference",
      date: "2024-12-15",
      endDate: "2024-12-18",
      location: "Singapore",
      venue: "Marina Bay Sands Convention Centre",
      description: "Premier international conference bringing together ocean scientists, researchers, and industry leaders to discuss latest developments in marine science and technology.",
      naraParticipation: "Keynote Speaker",
      speakers: ["Dr. Samantha Perera", "Dr. Rajesh Fernando"],
      topics: ["Climate Change Impacts", "Marine Technology", "Sustainable Fisheries"],
      registrationDeadline: "2024-11-30",
      website: "https://oceanscience2024.org",
      cost: "$850 - $1,200",
      audience: "Researchers, Scientists, Industry Professionals",
      expectedAttendees: "2,500+",
      partnershipOpportunities: [
        "Research collaboration discussions",
        "Technology showcase opportunities",
        "Funding partnership meetings"
      ]
    },
    {
      id: 2,
      title: "Marine Technology Innovation Summit",
      type: "Summit",
      date: "2024-12-08",
      endDate: "2024-12-09",
      location: "Tokyo, Japan",
      venue: "Tokyo International Forum",
      description: "Two-day summit focusing on cutting-edge marine technologies, autonomous systems, and digital ocean solutions.",
      naraParticipation: "Technology Showcase",
      speakers: ["Dr. Nimal Jayawardena"],
      topics: ["Autonomous Underwater Vehicles", "AI in Marine Science", "Ocean Monitoring"],
      registrationDeadline: "2024-11-25",
      website: "https://marinetech-summit.jp",
      cost: "$650 - $900",
      audience: "Technology Developers, Engineers, Investors",
      expectedAttendees: "1,200+",
      partnershipOpportunities: [
        "Technology licensing discussions",
        "Joint development projects",
        "Investment opportunities"
      ]
    },
    {
      id: 3,
      title: "Indo-Pacific Partnership Forum",
      type: "Forum",
      date: "2025-01-22",
      endDate: "2025-01-24",
      location: "Colombo, Sri Lanka",
      venue: "BMICH Convention Centre",
      description: "Regional forum for strengthening partnerships in marine research, conservation, and sustainable development across the Indo-Pacific region.",
      naraParticipation: "Host Organization",
      speakers: ["Dr. Kumari Silva", "Dr. Samantha Perera", "Dr. Rajesh Fernando"],
      topics: ["Regional Cooperation", "Marine Conservation", "Blue Economy"],
      registrationDeadline: "2025-01-10",
      website: "https://indopacific-forum.lk",
      cost: "$450 - $650",
      audience: "Government Officials, Researchers, NGOs",
      expectedAttendees: "800+",
      partnershipOpportunities: [
        "Regional partnership agreements",
        "Capacity building programs",
        "Policy collaboration initiatives"
      ]
    },
    {
      id: 4,
      title: "Blue Economy Investment Conference",
      type: "Conference",
      date: "2025-02-12",
      endDate: "2025-02-14",
      location: "Dubai, UAE",
      venue: "Dubai World Trade Centre",
      description: "International conference connecting investors, entrepreneurs, and researchers in the blue economy sector.",
      naraParticipation: "Panel Discussion",
      speakers: ["Dr. Nimal Jayawardena"],
      topics: ["Sustainable Aquaculture", "Marine Biotechnology", "Ocean Energy"],
      registrationDeadline: "2025-01-28",
      website: "https://blueeconomy-invest.ae",
      cost: "$1,100 - $1,500",
      audience: "Investors, Entrepreneurs, Policy Makers",
      expectedAttendees: "1,800+",
      partnershipOpportunities: [
        "Investment partnerships",
        "Commercial collaborations",
        "Market expansion opportunities"
      ]
    },
    {
      id: 5,
      title: "Coral Restoration Workshop Series",
      type: "Workshop",
      date: "2025-03-05",
      endDate: "2025-03-07",
      location: "Maldives",
      venue: "Marine Research Centre",
      description: "Intensive workshop on coral restoration techniques, biotechnology applications, and monitoring protocols.",
      naraParticipation: "Training Provider",
      speakers: ["Dr. Samantha Perera", "Dr. Kumari Silva"],
      topics: ["Coral Biology", "Restoration Techniques", "Monitoring Protocols"],
      registrationDeadline: "2025-02-20",
      website: "https://coral-workshop.mv",
      cost: "$550 - $750",
      audience: "Marine Biologists, Conservationists, Students",
      expectedAttendees: "150+",
      partnershipOpportunities: [
        "Research collaborations",
        "Training partnerships",
        "Conservation project development"
      ]
    },
    {
      id: 6,
      title: "Ocean Data Analytics Symposium",
      type: "Symposium",
      date: "2025-03-18",
      endDate: "2025-03-19",
      location: "San Francisco, USA",
      venue: "Moscone Center",
      description: "Symposium on big data analytics, machine learning, and AI applications in ocean science and marine research.",
      naraParticipation: "Research Presentation",
      speakers: ["Dr. Rajesh Fernando"],
      topics: ["Big Data Analytics", "Machine Learning", "Predictive Modeling"],
      registrationDeadline: "2025-03-05",
      website: "https://ocean-data-symposium.org",
      cost: "$750 - $1,000",
      audience: "Data Scientists, Researchers, Tech Professionals",
      expectedAttendees: "1,000+",
      partnershipOpportunities: [
        "Data sharing agreements",
        "Technology partnerships",
        "Joint research projects"
      ]
    }
  ];

  const filteredEvents = events?.filter(event => 
    event?.date?.startsWith(selectedMonth?.substring(0, 7))
  );

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'Conference': return 'text-primary bg-primary/10';
      case 'Summit': return 'text-accent bg-accent/10';
      case 'Forum': return 'text-success bg-success/10';
      case 'Workshop': return 'text-warning bg-warning/10';
      case 'Symposium': return 'text-secondary bg-secondary/10';
      default: return 'text-text-secondary bg-muted';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start?.toDateString() === end?.toDateString()) {
      return formatDate(startDate);
    }
    
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-warning/10 rounded-full mb-6">
            <Icon name="Calendar" size={32} className="text-warning" />
          </div>
          <h2 className="font-headline text-3xl lg:text-4xl font-bold text-text-primary mb-4">
            Events & Conferences
          </h2>
          <p className="font-body text-lg text-text-secondary max-w-3xl mx-auto">
            Join NARA researchers at international conferences, workshops, and partnership events. Discover opportunities for collaboration and knowledge exchange.
          </p>
        </div>

        {/* Month Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {months?.map((month) => (
            <Button
              key={month?.value}
              variant={selectedMonth === month?.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedMonth(month?.value)}
            >
              {month?.label}
            </Button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {filteredEvents?.map((event) => (
            <div key={event?.id} className="bg-card rounded-lg p-6 ocean-depth-shadow hover:shadow-lg transition-all duration-300">
              {/* Event Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-cta-medium ${getEventTypeColor(event?.type)}`}>
                      {event?.type}
                    </span>
                    <span className="text-sm font-cta text-text-secondary">
                      {event?.naraParticipation}
                    </span>
                  </div>
                  <h3 className="font-cta text-lg font-semibold text-text-primary mb-2">
                    {event?.title}
                  </h3>
                </div>
                <div className="text-right">
                  <div className="font-cta text-sm font-medium text-primary">
                    {formatDateRange(event?.date, event?.endDate)}
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center space-x-2 mb-3">
                <Icon name="MapPin" size={16} className="text-text-secondary" />
                <span className="font-body text-sm text-text-secondary">
                  {event?.location} • {event?.venue}
                </span>
              </div>

              {/* Description */}
              <p className="font-body text-sm text-text-secondary mb-4 line-clamp-2">
                {event?.description}
              </p>

              {/* Topics */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {event?.topics?.slice(0, 3)?.map((topic, index) => (
                    <span key={index} className="inline-block px-2 py-1 bg-muted text-text-secondary text-xs font-cta rounded">
                      {topic}
                    </span>
                  ))}
                  {event?.topics?.length > 3 && (
                    <span className="inline-block px-2 py-1 bg-muted text-text-secondary text-xs font-cta rounded">
                      +{event?.topics?.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Event Details */}
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <span className="font-cta text-text-secondary">Cost:</span>
                  <p className="font-body text-text-primary">{event?.cost}</p>
                </div>
                <div>
                  <span className="font-cta text-text-secondary">Attendees:</span>
                  <p className="font-body text-text-primary">{event?.expectedAttendees}</p>
                </div>
              </div>

              {/* NARA Speakers */}
              <div className="mb-4">
                <span className="font-cta text-sm text-text-secondary">NARA Speakers: </span>
                <span className="font-body text-sm text-text-primary">
                  {event?.speakers?.join(', ')}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedEvent(event)}
                >
                  <Icon name="Info" size={16} className="mr-2" />
                  View Details
                </Button>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm">
                    <Icon name="ExternalLink" size={16} />
                  </Button>
                  <Button variant="default" size="sm">
                    <Icon name="Calendar" size={16} className="mr-2" />
                    Register
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-card rounded-lg p-8 ocean-depth-shadow">
          <div className="text-center mb-8">
            <h3 className="font-headline text-2xl font-bold text-text-primary mb-4">
              Upcoming Registration Deadlines
            </h3>
            <p className="font-body text-text-secondary">
              Don't miss these important registration deadlines for upcoming events.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events?.slice(0, 3)?.map((event) => (
              <div key={event?.id} className="bg-warning/5 border border-warning/20 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="Clock" size={16} className="text-warning" />
                  <span className="font-cta text-sm font-medium text-warning">
                    Deadline: {formatDate(event?.registrationDeadline)}
                  </span>
                </div>
                <h4 className="font-cta text-sm font-semibold text-text-primary mb-1">
                  {event?.title}
                </h4>
                <p className="font-body text-xs text-text-secondary">
                  {event?.location} • {formatDateRange(event?.date, event?.endDate)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Button variant="default" size="lg" className="mr-4">
            <Icon name="Plus" size={20} className="mr-2" />
            Submit Event Proposal
          </Button>
          <Button variant="outline" size="lg">
            <Icon name="Bell" size={20} className="mr-2" />
            Subscribe to Updates
          </Button>
        </div>
      </div>
      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-cta-medium ${getEventTypeColor(selectedEvent?.type)}`}>
                      {selectedEvent?.type}
                    </span>
                    <span className="text-sm font-cta text-text-secondary">
                      {selectedEvent?.naraParticipation}
                    </span>
                  </div>
                  <h2 className="font-headline text-2xl font-bold text-text-primary mb-2">
                    {selectedEvent?.title}
                  </h2>
                  <div className="flex items-center space-x-4 text-sm text-text-secondary">
                    <div className="flex items-center space-x-1">
                      <Icon name="Calendar" size={16} />
                      <span>{formatDateRange(selectedEvent?.date, selectedEvent?.endDate)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="MapPin" size={16} />
                      <span>{selectedEvent?.location}</span>
                    </div>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedEvent(null)}
                >
                  <Icon name="X" size={20} />
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="mb-6">
                    <h3 className="font-cta text-lg font-semibold text-text-primary mb-3">About This Event</h3>
                    <p className="font-body text-text-secondary">{selectedEvent?.description}</p>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-cta text-lg font-semibold text-text-primary mb-3">Key Topics</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedEvent?.topics?.map((topic, index) => (
                        <span key={index} className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-cta rounded-full">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-cta text-lg font-semibold text-text-primary mb-3">Partnership Opportunities</h3>
                    <ul className="space-y-2">
                      {selectedEvent?.partnershipOpportunities?.map((opportunity, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Icon name="ArrowRight" size={16} className="text-primary mt-0.5 flex-shrink-0" />
                          <span className="font-body text-text-secondary">{opportunity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <div className="bg-muted/50 rounded-lg p-4 mb-6">
                    <h3 className="font-cta text-lg font-semibold text-text-primary mb-4">Event Details</h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="font-cta text-text-secondary">Venue:</span>
                        <p className="font-body text-text-primary">{selectedEvent?.venue}</p>
                      </div>
                      <div>
                        <span className="font-cta text-text-secondary">Cost:</span>
                        <p className="font-body text-text-primary">{selectedEvent?.cost}</p>
                      </div>
                      <div>
                        <span className="font-cta text-text-secondary">Expected Attendees:</span>
                        <p className="font-body text-text-primary">{selectedEvent?.expectedAttendees}</p>
                      </div>
                      <div>
                        <span className="font-cta text-text-secondary">Target Audience:</span>
                        <p className="font-body text-text-primary">{selectedEvent?.audience}</p>
                      </div>
                      <div>
                        <span className="font-cta text-text-secondary">Registration Deadline:</span>
                        <p className="font-body text-text-primary">{formatDate(selectedEvent?.registrationDeadline)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-cta text-sm font-medium text-text-primary mb-2">NARA Speakers</h4>
                    <ul className="space-y-1">
                      {selectedEvent?.speakers?.map((speaker, index) => (
                        <li key={index} className="font-body text-sm text-text-secondary">
                          {speaker}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <Button variant="default" fullWidth>
                      <Icon name="ExternalLink" size={16} className="mr-2" />
                      Visit Event Website
                    </Button>
                    <Button variant="outline" fullWidth>
                      <Icon name="Calendar" size={16} className="mr-2" />
                      Register Now
                    </Button>
                    <Button variant="ghost" fullWidth>
                      <Icon name="Share" size={16} className="mr-2" />
                      Share Event
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default EventsCalendar;