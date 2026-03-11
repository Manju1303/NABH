'use client';

import { useState } from 'react';
import { Search, BookOpen, ShieldCheck, HeartPulse, FileCheck, ClipboardCheck, Stethoscope } from 'lucide-react';

const NABH_STANDARDS = [
  {
    code: 'PC.1',
    version: 'v3.0',
    title: 'Patient Rights',
    description: 'Hospital should maintain and display standards related to patient rights',
    category: 'Patient Centered Care',
    subcategory: 'Patient Rights and Education',
    keyRequirements: [
      'Written patient rights policy in place',
      'Rights communicated in understandable language',
      'Grievance redressal mechanism',
      'Patient information in local language',
    ],
    requiredDocs: ['Patient Rights Charter', 'Grievance Register', 'Patient Feedback Forms'],
    applicability: 'All hospitals',
    icon: <ShieldCheck className="w-6 h-6" />,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
  },
  {
    code: 'PC.2',
    version: 'v3.0',
    title: 'Clinical Assessment',
    description: 'Patients should undergo appropriate clinical assessment and diagnostic evaluation',
    category: 'Patient Centered Care',
    subcategory: 'Care of Patients',
    keyRequirements: [
      'Initial assessment within defined timeframe',
      'Documented clinical findings',
      'Reassessment protocols in place',
      'Diagnostic evaluation guidelines followed',
    ],
    requiredDocs: ['Assessment Templates', 'Clinical Protocols', 'Reassessment Forms'],
    applicability: 'All hospitals',
    icon: <Stethoscope className="w-6 h-6" />,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
  },
  {
    code: 'HIC.1',
    version: 'v3.0',
    title: 'Infection Control Program',
    description: 'Hospital should have an effective infection control program',
    category: 'Hospital Infection Control',
    subcategory: 'Infection Control Program',
    keyRequirements: [
      'Infection control committee established',
      'Regular surveillance and monitoring',
      'Hand hygiene compliance audits',
      'Antibiotic stewardship program',
    ],
    requiredDocs: ['IC Committee Minutes', 'Surveillance Reports', 'Hand Hygiene Audit Reports'],
    applicability: 'All hospitals',
    icon: <HeartPulse className="w-6 h-6" />,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
  },
  {
    code: 'HIC.2',
    version: 'v3.0',
    title: 'Sterilization Standards',
    description: 'Adequate sterilization and disinfection procedures should be in place',
    category: 'Hospital Infection Control',
    subcategory: 'Sterilization and Disinfection',
    keyRequirements: [
      'CSSD unit operational',
      'Biological indicator testing',
      'Chemical indicator protocols',
      'Sterilization logs maintained',
    ],
    requiredDocs: ['Sterilization Logs', 'Biological Indicator Reports', 'CSSD SOPs'],
    applicability: 'All hospitals',
    icon: <ClipboardCheck className="w-6 h-6" />,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
  },
  {
    code: 'QM.1',
    version: 'v3.0',
    title: 'Quality Improvement',
    description: 'Hospital should have a structured quality improvement program',
    category: 'Quality Management',
    subcategory: 'Quality Improvement Program',
    keyRequirements: [
      'Quality indicators defined and monitored',
      'Root cause analysis for adverse events',
      'Continuous improvement methodology',
      'Regular quality committee meetings',
    ],
    requiredDocs: ['Quality Indicator Dashboard', 'RCA Reports', 'Quality Committee Minutes'],
    applicability: 'All hospitals',
    icon: <FileCheck className="w-6 h-6" />,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
  },
  {
    code: 'QM.2',
    version: 'v3.0',
    title: 'Patient Safety Program',
    description: 'Comprehensive patient safety program should be implemented',
    category: 'Quality Management',
    subcategory: 'Patient Safety',
    keyRequirements: [
      'Patient safety committee formed',
      'Incident reporting system active',
      'Medication safety protocols',
      'Fall prevention measures in place',
    ],
    requiredDocs: ['Safety Committee Minutes', 'Incident Reports', 'Medication Error Logs'],
    applicability: 'All hospitals',
    icon: <ShieldCheck className="w-6 h-6" />,
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/20',
  },
];

const CATEGORIES = ['All Categories', 'Patient Centered Care', 'Hospital Infection Control', 'Quality Management'];

export default function StandardsPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [expandedCode, setExpandedCode] = useState<string | null>(null);

  const filtered = NABH_STANDARDS.filter(s => {
    const matchesSearch = search.length === 0 ||
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.code.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'All Categories' || s.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const totalCategories = new Set(NABH_STANDARDS.map(s => s.category)).size;
  const totalRequirements = NABH_STANDARDS.reduce((sum, s) => sum + s.keyRequirements.length, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      <header className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="w-8 h-8 text-indigo-400" />
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400">
            NABH Standards Documentation
          </h1>
        </div>
        <p className="text-slate-400 font-light">Complete reference guide for NABH Accreditation Standards Version 3.0</p>
      </header>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search standards by title, code, or description..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
        >
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <p className="text-sm text-slate-500">Found {filtered.length} standards</p>

      {/* Standards List */}
      <div className="space-y-4">
        {filtered.map(std => (
          <div key={std.code} className={`glass-card border ${std.border} overflow-hidden transition-all`}>
            <button
              onClick={() => setExpandedCode(expandedCode === std.code ? null : std.code)}
              className="w-full text-left p-6 flex items-start gap-4 cursor-pointer hover:bg-slate-900/30 transition-colors"
            >
              <div className={`p-3 rounded-xl ${std.bg} shrink-0`}>
                {std.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`font-mono text-sm font-bold ${std.color}`}>{std.code}</span>
                  <span className="text-xs text-slate-600 bg-slate-800 px-2 py-0.5 rounded">{std.version}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mt-1">{std.title}</h3>
                <p className="text-sm text-slate-400 mt-1">{std.description}</p>
                <div className="flex gap-2 mt-2 flex-wrap">
                  <span className="text-xs text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">{std.category}</span>
                  <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded">{std.subcategory}</span>
                </div>
              </div>
            </button>

            {expandedCode === std.code && (
              <div className="border-t border-slate-800 p-6 bg-slate-950/30 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 bg-indigo-500 rounded-full"></span> Key Requirements
                    </h4>
                    <ul className="space-y-2">
                      {std.keyRequirements.map((req, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                          <span className="text-slate-600 mt-0.5">•</span> {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span> Required Documentation
                    </h4>
                    <ul className="space-y-2">
                      {std.requiredDocs.map((doc, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                          <FileCheck className="w-4 h-4 text-slate-600 mt-0.5 shrink-0" /> {doc}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-300 mb-1">Applicability</h4>
                  <p className="text-sm text-slate-500">{std.applicability}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Stats Footer */}
      <div className="grid grid-cols-3 gap-4 pt-4">
        <div className="glass-card p-4 text-center border border-slate-800">
          <p className="text-2xl font-bold text-indigo-400">{totalCategories}</p>
          <p className="text-xs text-slate-500 mt-1">Categories</p>
        </div>
        <div className="glass-card p-4 text-center border border-slate-800">
          <p className="text-2xl font-bold text-emerald-400">{NABH_STANDARDS.length}</p>
          <p className="text-xs text-slate-500 mt-1">Total Standards</p>
        </div>
        <div className="glass-card p-4 text-center border border-slate-800">
          <p className="text-2xl font-bold text-amber-400">{totalRequirements}</p>
          <p className="text-xs text-slate-500 mt-1">Requirements</p>
        </div>
      </div>
    </div>
  );
}
