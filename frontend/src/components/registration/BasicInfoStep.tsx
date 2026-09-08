'use client';
import { Inp, PhoneInp } from './FormControls';
import { useState } from 'react';

export const BasicInfoStep = ({ data, update }: any) => {
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .trim()
      .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  };

  const validatePhone = (phone: string) => {
    // Strictly exactly 10 numeric digits, starting with 6, 7, 8, or 9 (Indian mobile) or 10 digits
    return /^[6-9]\d{9}$/.test(phone) || /^\d{10}$/.test(phone);
  };

  const markTouched = (f: string) => setTouched(prev => ({ ...prev, [f]: true }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      <Inp 
        label="Hospital Name *" 
        v={data.hospitalName} 
        set={(v: any) => { update({ hospitalName: v }); markTouched('name'); }} 
        touched={touched.name}
        error={!data.hospitalName ? "Hospital name is mandatory" : ""}
      />
      <Inp 
        label="NABH Registration ID *" 
        v={data.regNumber} 
        set={(v: any) => { update({ regNumber: v }); markTouched('reg'); }} 
        touched={touched.reg}
        error={!data.regNumber ? "Valid ID required" : ""}
      />
      <Inp 
        label="Email Address *" 
        v={data.email} 
        set={(v: any) => { update({ email: v.trim() }); markTouched('email'); }} 
        type="email" 
        touched={touched.email}
        error={data.email && !validateEmail(data.email) ? "Invalid email format (e.g. name@domain.com)" : !data.email ? "Email is required" : ""}
      />
      <PhoneInp 
        label="Phone Number *" 
        v={data.phone} 
        set={(v: any) => { update({ phone: v }); markTouched('phone'); }} 
        touched={touched.phone}
        error={data.phone && !validatePhone(data.phone) ? "Must be a valid 10-digit number (digits 0-9 only, no letters/symbols)" : !data.phone ? "Phone number is required" : ""}
      />
    </div>
  );
};

