import React from 'react';
import { Building2, Users, MapPin, Calendar, Globe } from 'lucide-react';

export default function AboutSection({ data, financials }) {
  const profile = financials?.profile || {};
  const description = profile.description || data?.description || `No description available for ${data?.companyName || 'this company'}.`;

  const details = [
    { label: 'CEO', value: profile.ceo || '—', icon: <Users size={14} /> },
    { label: 'Founded', value: profile.founded || '—', icon: <Calendar size={14} /> },
    { label: 'Employees', value: profile.employees?.toLocaleString() || '—', icon: <Building2 size={14} /> },
    { label: 'HQ', value: profile.hq || '—', icon: <MapPin size={14} /> },
  ];

  return (
    <div className="bg-surface p-8 rounded-3xl border border-border shadow-none mb-6 font-['DM_Sans']">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-primary tracking-tight">About {data?.companyName || profile.name || 'Company'}</h3>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full uppercase tracking-wider border border-primary/20">
            {data?.sector || profile.industry || 'N/A'}
          </span>
          <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full uppercase tracking-wider border border-primary/20">
            {data?.industry || 'N/A'}
          </span>
        </div>
      </div>
      
      <p className="text-sm text-muted leading-relaxed mb-8 max-w-4xl">
        {description}
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
        {details.map((detail, idx) => (
          <div key={idx} className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-muted">
              {detail.icon}
              <span className="text-[11px] font-bold uppercase tracking-widest">{detail.label}</span>
            </div>
            <span className="text-sm font-bold text-primary">{detail.value}</span>
          </div>
        ))}
      </div>

      {profile.website && (
        <a 
          href={profile.website} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-flex items-center gap-2 text-primary text-sm font-bold hover:underline"
        >
          <Globe size={16} />
          Visit Official Website
        </a>
      )}
    </div>
  );
}
