'use client';
import { Tog } from './FormControls';

export const HRTrainingStep = ({ data, update }: any) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Tog label="Scope of Services Training? *" c={data.trainingScope} set={(v: any) => update({ trainingScope: v })} />
    <Tog label="Safe Lab Practices Training?" c={data.trainingLab} set={(v: any) => update({ trainingLab: v })} />
    <Tog label="Safe Imaging Training?" c={data.trainingImaging} set={(v: any) => update({ trainingImaging: v })} />
    <Tog label="Child Abduction Prevention?" c={data.trainingAbduction} set={(v: any) => update({ trainingAbduction: v })} />
    <Tog label="Infection Control Training? *" c={data.trainingInfection} set={(v: any) => update({ trainingInfection: v })} />
    <Tog label="Fire Mock Drills Conducted? *" c={data.fireDrills} set={(v: any) => update({ fireDrills: v })} />
    <Tog label="Spill Management Training? *" c={data.trainingSpill} set={(v: any) => update({ trainingSpill: v })} />
    <Tog label="Safety Education Training?" c={data.trainingSafety} set={(v: any) => update({ trainingSafety: v })} />
    <Tog label="Needle Stick Injury Protocol?" c={data.trainingNeedle} set={(v: any) => update({ trainingNeedle: v })} />
    <Tog label="Medication Error Training?" c={data.trainingMedication} set={(v: any) => update({ trainingMedication: v })} />
  </div>
);
