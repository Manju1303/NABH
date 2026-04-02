'use client';
import { Inp } from './FormControls';
import { useState, useEffect } from 'react';

export const BasicInfoStep = ({ data, update }: any) => {
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  };

  const validatePhone = (phone: string) => {
    return /^\d{10}$/.test(phone);
  };

  const markTouched = (f: string) => setTouched(prev => ({ ...prev, [f]: true }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      <Inp 
        label="HOSPITAL_NAME_IDENTIFIER *" 
        v={data.hospitalName} 
        set={(v: any) => { update({ hospitalName: v }); markTouched('name'); }} 
        touched={touched.name}
        error={!data.hospitalName ? "Hospital name is mandatory" : ""}
      />
      <Inp 
        label="NABH_REGISTRATION_ID *" 
        v={data.regNumber} 
        set={(v: any) => { update({ regNumber: v }); markTouched('reg'); }} 
        touched={touched.reg}
        error={!data.regNumber ? "Valid ID required" : ""}
      />
      <Inp 
        label="COMMUNICATION_EMAIL *" 
        v={data.email} 
        set={(v: any) => { update({ email: v }); markTouched('email'); }} 
        type="email" 
        touched={touched.email}
        error={data.email && !validateEmail(data.email) ? "Invalid digital mail format" : !data.email ? "Email is required" : ""}
      />
      <Inp 
        label="TELEMETRIC_PHONE *" 
        v={data.phone} 
        set={(v: any) => { update({ phone: v }); markTouched('phone'); }} 
        touched={touched.phone}
        error={data.phone && !validatePhone(data.phone) ? "ERR: Must be exactly 10 digital nodes" : !data.phone ? "Phone link required" : ""}
      />
    </div>
  );
};
