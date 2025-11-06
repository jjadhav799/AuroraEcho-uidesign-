import { http, HttpResponse } from 'msw';
import { DropdownOptions } from '@/types/engagement';

export const handlers = [
  http.get('/api/options', () => {
    const options: DropdownOptions = {
      billingClients: [
        'Acme Corporation',
        'Global Enterprises',
        'Innovation Labs',
        'Strategic Partners',
        'Future Systems',
      ],
      sensitivities: [
        'Confidential',
        'Highly Confidential',
        'Public',
        'Internal Only',
      ],
      engagementTypes: [
        'Consulting',
        'Implementation',
        'Support',
        'Training',
        'Audit',
      ],
      allocatedServices: [
        'Cloud Infrastructure',
        'Security Services',
        'Data Analytics',
        'Application Development',
        'IT Strategy',
      ],
      hostingPlatforms: [
        'AWS',
        'Azure',
        'Google Cloud',
        'On-Premise',
        'Hybrid',
      ],
      preferredTemplates: [
        'Standard Agreement',
        'MSA Template',
        'SOW Template',
        'Custom Template',
      ],
      countries: [
        'United States',
        'United Kingdom',
        'Canada',
        'Germany',
        'France',
        'Australia',
        'Japan',
      ],
      currencies: [
        'USD',
        'EUR',
        'GBP',
        'CAD',
        'AUD',
        'JPY',
      ],
      billingTypes: [
        'Time & Materials',
        'Fixed Price',
        'Retainer',
        'Milestone-Based',
      ],
      contractingEntities: [
        'iAurora Inc.',
        'iAurora Europe Ltd.',
        'iAurora Asia Pte.',
      ],
      arbitrationOptions: [
        'Yes',
        'No',
        'Optional',
      ],
      dataCenterLocations: [
        'US East',
        'US West',
        'EU Central',
        'Asia Pacific',
        'UK South',
      ],
    };

    return HttpResponse.json(options);
  }),

  http.get('/api/clients', () => {
    return HttpResponse.json([
      { id: 1, name: 'Acme Corporation', industry: 'Technology', status: 'Active' },
      { id: 2, name: 'Global Enterprises', industry: 'Finance', status: 'Active' },
    ]);
  }),

  http.get('/api/engagements', () => {
    return HttpResponse.json([
      { id: 1, name: 'Cloud Migration Project', client: 'Acme Corporation', status: 'Active' },
    ]);
  }),

  http.post('/api/engagements', async ({ request }) => {
    const data = await request.json() as Record<string, unknown>;
    return HttpResponse.json({ id: Date.now(), ...data }, { status: 201 });
  }),

  http.get('/api/engagement-details/:id', ({ params }) => {
    return HttpResponse.json({
      id: params.id,
      name: 'Cloud Migration Project',
      engagementNo: 'ENG-2024-001',
      hCode: 'H-CM-001',
      clientName: 'Acme Corporation',
    });
  }),

  http.get('/api/service-lines', () => {
    return HttpResponse.json([
      { id: '1', name: 'Cloud Infrastructure' },
      { id: '2', name: 'Security Services' },
      { id: '3', name: 'Data Analytics' },
      { id: '4', name: 'Application Development' },
      { id: '5', name: 'IT Strategy' },
    ]);
  }),

  http.get('/api/tasks', () => {
    return HttpResponse.json([
      { id: '1', name: 'Architecture Design', serviceLineId: '1' },
      { id: '2', name: 'Implementation', serviceLineId: '1' },
      { id: '3', name: 'Migration', serviceLineId: '1' },
      { id: '4', name: 'Security Assessment', serviceLineId: '2' },
      { id: '5', name: 'Penetration Testing', serviceLineId: '2' },
      { id: '6', name: 'Compliance Review', serviceLineId: '2' },
      { id: '7', name: 'Data Modeling', serviceLineId: '3' },
      { id: '8', name: 'ETL Development', serviceLineId: '3' },
      { id: '9', name: 'Dashboard Creation', serviceLineId: '3' },
      { id: '10', name: 'Code Review', serviceLineId: '4' },
      { id: '11', name: 'Feature Development', serviceLineId: '4' },
      { id: '12', name: 'Testing', serviceLineId: '4' },
      { id: '13', name: 'Strategic Planning', serviceLineId: '5' },
      { id: '14', name: 'Vendor Evaluation', serviceLineId: '5' },
      { id: '15', name: 'Roadmap Development', serviceLineId: '5' },
    ]);
  }),

  http.post('/api/time-entries', async ({ request }) => {
    const data = await request.json() as Record<string, unknown>;
    return HttpResponse.json({ id: Date.now(), ...data }, { status: 201 });
  }),

  http.get('/api/time-entries/weekly', () => {
    return HttpResponse.json({
      totalHours: 40.5,
      entries: [
        {
          id: '1',
          date: new Date('2025-01-15'),
          project: 'iAurora Web Revamp',
          hCode: 'H-001',
          serviceLine: 'Web Development',
          task: 'Frontend Development',
          startTime: '09:00',
          endTime: '12:30',
          duration: 3.5,
          billableHours: 3.0,
          nonBillableHours: 0.5,
          engagementId: 'ENG-001',
        },
        {
          id: '2',
          date: new Date('2025-01-15'),
          project: 'Claims ETL Migration',
          hCode: 'H-002',
          serviceLine: 'Backend Development',
          task: 'API Integration',
          startTime: '14:00',
          endTime: '17:00',
          duration: 3,
          billableHours: 3.0,
          nonBillableHours: 0,
          engagementId: 'ENG-002',
        },
        {
          id: '3',
          date: new Date('2025-01-16'),
          project: 'Fraud Analytics PoC',
          hCode: 'H-003',
          serviceLine: 'UI/UX Design',
          task: 'Wireframing',
          startTime: '10:00',
          endTime: '13:00',
          duration: 3,
          billableHours: 2.5,
          nonBillableHours: 0.5,
          engagementId: 'ENG-003',
        },
        {
          id: '4',
          date: new Date('2025-01-16'),
          project: 'iAurora Web Revamp',
          hCode: 'H-001',
          serviceLine: 'Testing',
          task: 'QA Testing',
          startTime: '15:00',
          endTime: '18:30',
          duration: 3.5,
          billableHours: 3.5,
          nonBillableHours: 0,
          engagementId: 'ENG-001',
        },
        {
          id: '5',
          date: new Date('2025-01-17'),
          project: 'Claims ETL Migration',
          hCode: 'H-002',
          serviceLine: 'Database Design',
          task: 'Schema Development',
          startTime: '09:30',
          endTime: '12:00',
          duration: 2.5,
          billableHours: 2.0,
          nonBillableHours: 0.5,
          engagementId: 'ENG-002',
        },
        {
          id: '6',
          date: new Date('2025-01-17'),
          project: 'Retail App QA Suite',
          hCode: 'H-004',
          serviceLine: 'Testing',
          task: 'Automation Testing',
          startTime: '14:00',
          endTime: '18:00',
          duration: 4,
          billableHours: 4.0,
          nonBillableHours: 0,
          engagementId: 'ENG-004',
        },
        {
          id: '7',
          date: new Date('2025-01-18'),
          project: 'MES Integration',
          hCode: 'H-005',
          serviceLine: 'Backend Development',
          task: 'System Integration',
          startTime: '09:00',
          endTime: '13:00',
          duration: 4,
          billableHours: 3.5,
          nonBillableHours: 0.5,
          engagementId: 'ENG-005',
        },
        {
          id: '8',
          date: new Date('2025-01-18'),
          project: 'Data Lake Implementation',
          hCode: 'H-006',
          serviceLine: 'Database Design',
          task: 'Data Modeling',
          startTime: '14:30',
          endTime: '17:30',
          duration: 3,
          billableHours: 3.0,
          nonBillableHours: 0,
          engagementId: 'ENG-006',
        },
        {
          id: '9',
          date: new Date('2025-01-19'),
          project: 'iAurora Web Revamp',
          hCode: 'H-001',
          serviceLine: 'Web Development',
          task: 'Backend API',
          startTime: '10:00',
          endTime: '14:00',
          duration: 4,
          billableHours: 4.0,
          nonBillableHours: 0,
          engagementId: 'ENG-001',
        },
        {
          id: '10',
          date: new Date('2025-01-19'),
          project: 'Fraud Analytics PoC',
          hCode: 'H-003',
          serviceLine: 'Data Analytics',
          task: 'Dashboard Creation',
          startTime: '15:00',
          endTime: '19:00',
          duration: 4,
          billableHours: 3.5,
          nonBillableHours: 0.5,
          engagementId: 'ENG-003',
        },
        {
          id: '11',
          date: new Date('2025-01-20'),
          project: 'Claims ETL Migration',
          hCode: 'H-002',
          serviceLine: 'Backend Development',
          task: 'ETL Development',
          startTime: '09:00',
          endTime: '12:00',
          duration: 3,
          billableHours: 3.0,
          nonBillableHours: 0,
          engagementId: 'ENG-002',
        },
        {
          id: '12',
          date: new Date('2025-01-20'),
          project: 'Retail App QA Suite',
          hCode: 'H-004',
          serviceLine: 'Testing',
          task: 'Performance Testing',
          startTime: '13:30',
          endTime: '17:00',
          duration: 3.5,
          billableHours: 3.0,
          nonBillableHours: 0.5,
          engagementId: 'ENG-004',
        },
      ],
    });
  }),
];
