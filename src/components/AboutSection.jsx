import React from 'react';
import { Building2, MapPin, Calendar, Globe, Briefcase } from 'lucide-react';

export default function AboutSection({ data, financials }) {
  const profile = financials?.profile || {};
  
  // Prefer stockData.description (Yahoo Finance) over financials.profile.description (Finnhub)
  const description = data?.description || profile.description || '';

  // Prefer stockData.employees (Yahoo Finance) over financials.profile.employees (Finnhub)
  const employeesCount = data?.employees || profile.employees || 0;

  const details = [
    { label: 'IPO Year', value: profile.founded || '—', icon: <Calendar size={14} /> },
    { label: 'Employees', value: employeesCount > 0 ? employeesCount.toLocaleString() : '—', icon: <Building2 size={14} /> },
    { label: 'Industry', value: data?.industry || profile.industry || '—', icon: <Briefcase size={14} /> },
    { label: 'Country', value: profile.hq || '—', icon: <MapPin size={14} /> },
  ];

  return (
    <div className="bg-surface p-8 rounded-3xl border border-border shadow-none mb-6 font-['DM_Sans']">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-primary tracking-tight">About {data?.companyName || profile.name || 'Company'}</h3>
        <div className="flex gap-2">
          {data?.sector && (
            <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full uppercase tracking-wider border border-primary/20">
              {data.sector}
            </span>
          )}
          {data?.industry && (
            <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full uppercase tracking-wider border border-primary/20">
              {data.industry}
            </span>
          )}
        </div>
      </div>
      
      {description && (
        <p className="text-sm text-muted leading-relaxed mb-8 max-w-4xl">
          {description}
        </p>
      )}

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
