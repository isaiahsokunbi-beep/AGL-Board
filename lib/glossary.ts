export const GLOSSARY: Record<string, string> = {
  BVN: "Bank Verification Number — Nigeria's biometric banking identity.",
  NIN: "National Identification Number issued by NIMC.",
  LPO: "Local Purchase Order — institutional buyer procurement document.",
  NEXIM: "Nigerian Export-Import Bank.",
  ESP: "Enterprise Support Programme (Mastercard Foundation technical assistance).",
  CBA: "Community Base Advisor — field agent supporting farmer onboarding.",
  TA: "Technical Assistance provided under the ESP engagement.",
  MT: "Metric tonnes.",
};

export type GlossaryTerm = keyof typeof GLOSSARY;
