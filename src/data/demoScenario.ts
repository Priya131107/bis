import type { DemoScenario } from '../types';

// Fixed demo scenario: Domestic Electric Water Heater / Small Manufacturer / Rajasthan
export const demoScenario: DemoScenario = {
  productName: 'Domestic Electric Storage Water Heater (15 Litre)',
  businessType: 'Small Manufacturer (MSME)',
  location: 'Jaipur, Rajasthan',
  standardId: 'std-001',
  stages: ['stage-01', 'stage-02', 'stage-03', 'stage-04', 'stage-05', 'stage-06', 'stage-07', 'stage-08'],
  gaps: [
    'Test report from BIS-recognised laboratory not yet obtained',
    'Thermal cut-off device not yet validated against IS 302-2-201 Amendment 3',
    'Factory quality control plan not documented',
    'Pressure relief valve specification not confirmed against standard requirements',
    'BIS application (Form V) not submitted',
  ],
  testingRequirements: [
    'Dielectric strength test (1250V for 1 min) — BIS-recognised NABL lab required',
    'Leakage current test (< 0.5 mA at operating temperature)',
    'Thermal cutout verification test',
    'Temperature rise test (thermostat-controlled surface)',
    'Water tightness test (1.5× working pressure for 1 hour)',
    'Pressure test on tank and components',
    'Insulation resistance test (≥ 1 MΩ)',
  ],
  recommendedServices: ['svc-001', 'svc-003', 'svc-008'],
  actionPlan: [
    'Step 1: Purchase IS 302-2-201 (latest amendment) from BIS Standards Portal — ₹ 800 approx.',
    'Step 2: Prepare product technical file — design drawings, BoM, circuit diagram, thermostat spec sheet.',
    'Step 3: Identify and engage a BIS-recognised laboratory for all mandatory tests (estimated 3–4 weeks).',
    'Step 4: Address gap — validate thermal cut-off device against Amendment 3 temperature limits before lab testing.',
    'Step 5: Document factory QC plan and inspection records aligned with IS 302-2-201 requirements.',
    'Step 6: Submit online application (Form V) on Manak Online portal with test report and technical dossier.',
    'Step 7: Prepare facility for BIS factory inspection — ensure equipment calibration records are current.',
    'Step 8: On licence grant, affix BIS mark per the licence conditions. Begin post-certification surveillance programme.',
  ],
};

// Pre-built assistant answers for the demo journey
export const demoAssistantAnswers = {
  classification: {
    id: 'ans-demo-01',
    query: 'My company manufactures 15-litre domestic electric water heaters in Rajasthan. Which Indian Standard applies?',
    answerText: `Your product — a domestic electric storage water heater — falls under **IS 302-2-201**, which is the mandatory Indian Standard for safety of household electric storage water heaters. This is a **mandatory BIS certification** product, meaning you must obtain a BIS ISI licence before selling it in the Indian market.

The standard covers storage water heaters with rated voltage not exceeding 250V (single-phase) and a storage capacity typically up to 35 litres, which matches your 15-litre product. Certification is granted under the **Product Certification Scheme (ISI Mark)** administered by BIS under the Bureau of Indian Standards Act, 2016.`,
    reasoning: `The query mentions a domestic electric storage water heater. IS 302-2-201 is the designated Indian Standard for this product category under the mandatory certification order (MCO) for household electrical appliances. The product capacity (15 L) falls within the scope of IS 302-2-201. The manufacturing location (Rajasthan) determines the relevant BIS Regional Office (Jaipur, Northern Regional Office).`,
    matchedStandards: [
      { standardId: 'std-001', confidence: 'high' as const },
      { standardId: 'std-007', confidence: 'possible' as const },
    ],
    nextSteps: [
      { label: 'Save IS 302-2-201 to my list', actionType: 'save' as const, payload: 'std-001' },
      { label: 'Start Compliance Journey for this product', actionType: 'service' as const, payload: '/compliance' },
      { label: 'Find a BIS-recognised test laboratory', actionType: 'service' as const, payload: 'svc-003' },
      { label: 'View IS 302-2-201 full requirements', actionType: 'service' as const, payload: '/standards/std-001' },
    ],
  },
  testing: {
    id: 'ans-demo-02',
    query: 'What tests does my water heater need to pass for BIS certification?',
    answerText: `For IS 302-2-201 certification, your 15-litre water heater must pass **7 mandatory tests**, all conducted at a BIS-recognised laboratory. The most critical tests are:

1. **Dielectric strength test** — 1250V applied for 1 minute; verifies insulation integrity.
2. **Leakage current test** — Must be < 0.5 mA at operating temperature.
3. **Thermal cutout verification** — Confirms the automatic thermal safety device trips within specified limits.
4. **Water tightness test** — Product is pressurised to 1.5× working pressure for 1 hour.
5. **Temperature rise test** — Verifies thermostat limits the surface temperature within safe bounds.

Amendment 3 (April 2023) introduced stricter thermostat temperature limits, so ensure your samples are built to the latest design before submitting to the lab.`,
    reasoning: `IS 302-2-201 Section 20 specifies the dielectric strength test; Section 19 the leakage current test; Section 9 the thermal cut-off device verification; Section 22 water tightness; and Section 11 temperature rise. All are mandatory type tests that must be passed on production-representative samples at a BIS-recognised (NABL-accredited) laboratory.`,
    matchedStandards: [
      { standardId: 'std-001', confidence: 'high' as const },
    ],
    nextSteps: [
      { label: 'Add all tests to my compliance checklist', actionType: 'checklist' as const, payload: 'std-001-tests' },
      { label: 'Find BIS-recognised laboratory (Testing service)', actionType: 'service' as const, payload: 'svc-003' },
      { label: 'Set reminder: prepare samples before lab visit', actionType: 'reminder' as const },
    ],
  },
};
