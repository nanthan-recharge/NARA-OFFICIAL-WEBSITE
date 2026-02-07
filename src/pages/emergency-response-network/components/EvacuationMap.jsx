import React, { useMemo, useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { cn } from '../../../utils/cn';

const REGIONS = [
  { value: 'colombo', label: 'Colombo District', coordinates: '6.9271,79.8612' },
  { value: 'galle', label: 'Galle District', coordinates: '6.0535,80.2210' },
  { value: 'hambantota', label: 'Hambantota District', coordinates: '6.1241,81.1185' },
  { value: 'kalutara', label: 'Kalutara District', coordinates: '6.5854,79.9607' },
  { value: 'matara', label: 'Matara District', coordinates: '5.9549,80.5550' },
  { value: 'puttalam', label: 'Puttalam District', coordinates: '8.0362,79.8283' }
];

const MAP_VIEWS = [
  { value: 'evacuation', label: 'Evacuation Routes' },
  { value: 'safe-zones', label: 'Safe Zones' },
  { value: 'risk-areas', label: 'Risk Areas' },
  { value: 'facilities', label: 'Emergency Facilities' }
];

const MAP_LEGEND = [
  { color: 'bg-rose-500', label: 'High Risk Zones', icon: 'AlertTriangle' },
  { color: 'bg-amber-500', label: 'Medium Risk Zones', icon: 'AlertCircle' },
  { color: 'bg-emerald-500', label: 'Safe Zones', icon: 'Shield' },
  { color: 'bg-sky-500', label: 'Evacuation Routes', icon: 'Navigation' },
  { color: 'bg-violet-500', label: 'Emergency Facilities', icon: 'Building2' }
];

const EMERGENCY_FACILITIES = [
  {
    name: 'Colombo General Hospital',
    type: 'Medical Facility',
    distance: '2.3 km',
    capacity: '500+ beds',
    contact: '+94 11 269 1111'
  },
  {
    name: 'Galle Face Green Assembly Point',
    type: 'Assembly Point',
    distance: '1.8 km',
    capacity: '5000+ people',
    contact: '+94 11 243 7335'
  },
  {
    name: 'Mount Lavinia Emergency Shelter',
    type: 'Shelter',
    distance: '4.2 km',
    capacity: '1000+ people',
    contact: '+94 11 271 5221'
  }
];

const EvacuationMap = () => {
  const [selectedRegion, setSelectedRegion] = useState('colombo');
  const [mapView, setMapView] = useState('evacuation');

  const coordinates = useMemo(() => {
    return REGIONS.find(region => region.value === selectedRegion)?.coordinates ?? REGIONS[0].coordinates;
  }, [selectedRegion]);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/85 shadow-[0px_45px_90px_rgba(2,6,23,0.55)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_55%)]" />

      <div className="relative border-b border-white/10 px-6 py-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1 text-[11px] font-cta uppercase tracking-[0.3em] text-white/60">
              <Icon name="Navigation" size={14} />
              Evacuation Planning
            </span>
            <h2 className="text-2xl font-headline font-bold text-white">
              Interactive Evacuation Maps
            </h2>
            <p className="text-sm font-body text-white/60">
              Switch between routes, safe zones, and facility overlays backed by live command updates.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              iconName="Printer"
              className="text-white hover:bg-white/10"
              onClick={() => window.print()}
            >
              Print Map
            </Button>
            <Button
              variant="secondary"
              size="sm"
              iconName="Download"
              className="border-white/20 text-white"
            >
              Download PDF
            </Button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Select
            label="Select Region"
            options={REGIONS}
            value={selectedRegion}
            onChange={setSelectedRegion}
          />
          <Select
            label="Map View"
            options={MAP_VIEWS}
            value={mapView}
            onChange={setMapView}
          />
        </div>
      </div>

      <div className="relative grid grid-cols-1 gap-6 p-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40" style={{ height: '500px' }}>
            <iframe
              width="100%"
              height="100%"
              loading="lazy"
              title={`Evacuation Map - ${REGIONS.find(r => r.value === selectedRegion)?.label}`}
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${coordinates}&z=12&output=embed`}
              className="border-0"
            />

            <div className="absolute top-4 left-4 rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-xs text-white shadow-lg">
              <div className="flex items-center gap-2">
                <Icon name="Map" size={14} className="text-cyan-300" />
                <span className="font-cta-medium text-white">
                  {REGIONS.find(r => r.value === selectedRegion)?.label}
                </span>
              </div>
              <div className="mt-1 text-[11px] text-white/60">
                View: {MAP_VIEWS.find(v => v.value === mapView)?.label}
              </div>
            </div>

            <div className="absolute top-4 right-4 rounded-xl border border-rose-500/40 bg-rose-500/20 px-3 py-2 text-xs font-cta text-rose-100 animate-pulse">
              <div className="flex items-center gap-2">
                <Icon name="AlertTriangle" size={14} />
                <span>Live Emergency Mode</span>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4">
            <h3 className="text-xs font-cta-medium uppercase tracking-[0.3em] text-white/60 mb-3">
              Map Legend
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs text-white/60 md:grid-cols-3">
              {MAP_LEGEND.map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className={cn('h-3 w-3 rounded-full', item.color)}></div>
                  <Icon name={item.icon} size={12} className="text-white/40" />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-headline font-bold text-white">
            Nearby Emergency Facilities
          </h3>
          {EMERGENCY_FACILITIES.map((facility) => (
            <div key={facility.name} className="rounded-2xl border border-white/10 bg-black/25 p-4 text-white/70">
              <div className="mb-2 flex items-start justify-between">
                <h4 className="text-sm font-cta-medium text-white">{facility.name}</h4>
                <span className="rounded-full border border-cyan-500/30 bg-cyan-500/15 px-3 py-1 text-[11px] font-cta uppercase tracking-[0.25em] text-cyan-100">
                  {facility.type}
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <Icon name="MapPin" size={12} className="text-white/40" />
                  <span>{facility.distance}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Users" size={12} className="text-white/40" />
                  <span>{facility.capacity}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Phone" size={12} className="text-white/40" />
                  <span className="font-mono text-white/70">{facility.contact}</span>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => window.open(`tel:${facility.contact}`, '_self')}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Icon name="Phone" size={12} className="mr-1" />
                  Call
                </Button>
                <Button
                  variant="ghost"
                  size="xs"
                  className="text-white hover:bg-white/10"
                  onClick={() => window.open(`https://maps.google.com/?q=${facility.name.replace(/\s/g, '+')}`)}
                >
                  <Icon name="Navigation" size={12} className="mr-1" />
                  Directions
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EvacuationMap;
