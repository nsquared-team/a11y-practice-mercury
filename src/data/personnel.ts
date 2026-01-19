// Personnel fixture data for the Mercury Mining Operations Dashboard

export type Role =
  | 'Extraction Technician'
  | 'Equipment Operator'
  | 'Safety Coordinator'
  | 'Shift Supervisor'
  | 'Maintenance Engineer'
  | 'Analyst';

export type Shift = 'Alpha' | 'Beta' | 'Gamma';

export type CertificationStatus = 'valid' | 'expiring' | 'expired';

export type PersonnelStatus = 'On Duty' | 'Off Duty' | 'On Break' | 'On Leave';

export interface Certification {
  id: string;
  name: string;
  status: CertificationStatus;
  issuedDate: Date;
  expirationDate: Date;
}

export interface Personnel {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  shift: Shift;
  status: PersonnelStatus;
  currentAssignment: string | null;
  certifications: Certification[];
  hireDate: Date;
  avatar?: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

// Helper to get full name
export function getFullName(person: Personnel): string {
  return `${person.firstName} ${person.lastName}`;
}

// Helper to get initials
export function getInitials(person: Personnel): string {
  return `${person.firstName[0]}${person.lastName[0]}`;
}

// Helper to count certifications by status
export function countCertificationsByStatus(person: Personnel, status: CertificationStatus): number {
  return person.certifications.filter(c => c.status === status).length;
}

// Helper to get days until certification expires
export function getDaysUntilExpiration(cert: Certification): number {
  const now = new Date();
  const diffTime = cert.expirationDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Generate dates relative to now
const now = new Date();
const daysAgo = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
const daysFromNow = (days: number) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

// Certification templates
const certificationTypes = [
  'Thermal Drill Operation',
  'Environmental Safety',
  'Hazardous Materials Handling',
  'Emergency Response',
  'Heavy Equipment Operation',
  'Radiation Safety',
  'First Aid & Medical',
  'Communications Systems',
  'Pressure Suit Operation',
  'Transport Vehicle Operation',
];

// Generate a certification with given parameters
function createCertification(
  id: string,
  name: string,
  issuedDaysAgo: number,
  expiresInDays: number
): Certification {
  const expirationDate = daysFromNow(expiresInDays);
  let status: CertificationStatus = 'valid';
  if (expiresInDays < 0) {
    status = 'expired';
  } else if (expiresInDays < 30) {
    status = 'expiring';
  }

  return {
    id,
    name,
    status,
    issuedDate: daysAgo(issuedDaysAgo),
    expirationDate,
  };
}

// Personnel data - 60 records
export const personnelData: Personnel[] = [
  // Alpha Shift - Supervisors and Senior Staff
  {
    id: 'P001',
    firstName: 'Elena',
    lastName: 'Rodriguez',
    email: 'e.rodriguez@mercury-ops.com',
    role: 'Shift Supervisor',
    shift: 'Alpha',
    status: 'On Duty',
    currentAssignment: 'SITE-001',
    certifications: [
      createCertification('C001', 'Thermal Drill Operation', 365, 180),
      createCertification('C002', 'Environmental Safety', 200, 165),
      createCertification('C003', 'Emergency Response', 180, 185),
      createCertification('C004', 'Heavy Equipment Operation', 300, 65),
    ],
    hireDate: daysAgo(1825),
    emergencyContact: { name: 'Carlos Rodriguez', phone: '+1-555-0101', relationship: 'Spouse' },
  },
  {
    id: 'P002',
    firstName: 'Marcus',
    lastName: 'Chen',
    email: 'm.chen@mercury-ops.com',
    role: 'Equipment Operator',
    shift: 'Alpha',
    status: 'On Duty',
    currentAssignment: 'SITE-003',
    certifications: [
      createCertification('C005', 'Heavy Equipment Operation', 400, 145),
      createCertification('C006', 'Transport Vehicle Operation', 350, 95),
      createCertification('C007', 'Pressure Suit Operation', 200, 165),
    ],
    hireDate: daysAgo(1460),
    emergencyContact: { name: 'Lin Chen', phone: '+1-555-0102', relationship: 'Parent' },
  },
  {
    id: 'P003',
    firstName: 'Aisha',
    lastName: 'Patel',
    email: 'a.patel@mercury-ops.com',
    role: 'Safety Coordinator',
    shift: 'Alpha',
    status: 'On Break',
    currentAssignment: null,
    certifications: [
      createCertification('C008', 'Environmental Safety', 365, 180),
      createCertification('C009', 'Hazardous Materials Handling', 300, 120),
      createCertification('C010', 'Emergency Response', 250, 200),
      createCertification('C011', 'First Aid & Medical', 180, 185),
      createCertification('C012', 'Radiation Safety', 200, 165),
    ],
    hireDate: daysAgo(2190),
    emergencyContact: { name: 'Raj Patel', phone: '+1-555-0103', relationship: 'Spouse' },
  },
  {
    id: 'P004',
    firstName: 'James',
    lastName: 'Okonkwo',
    email: 'j.okonkwo@mercury-ops.com',
    role: 'Extraction Technician',
    shift: 'Alpha',
    status: 'On Duty',
    currentAssignment: 'SITE-005',
    certifications: [
      createCertification('C013', 'Thermal Drill Operation', 300, 120),
      createCertification('C014', 'Pressure Suit Operation', 250, 100),
    ],
    hireDate: daysAgo(730),
    emergencyContact: { name: 'Grace Okonkwo', phone: '+1-555-0104', relationship: 'Spouse' },
  },
  {
    id: 'P005',
    firstName: 'Sofia',
    lastName: 'Andersson',
    email: 's.andersson@mercury-ops.com',
    role: 'Maintenance Engineer',
    shift: 'Alpha',
    status: 'On Duty',
    currentAssignment: 'SITE-002',
    certifications: [
      createCertification('C015', 'Heavy Equipment Operation', 400, 90),
      createCertification('C016', 'Hazardous Materials Handling', 350, 25),
      createCertification('C017', 'Communications Systems', 300, 150),
      createCertification('C018', 'Thermal Drill Operation', 280, 85),
    ],
    hireDate: daysAgo(1095),
    emergencyContact: { name: 'Erik Andersson', phone: '+1-555-0105', relationship: 'Sibling' },
  },
  {
    id: 'P006',
    firstName: 'Yuki',
    lastName: 'Tanaka',
    email: 'y.tanaka@mercury-ops.com',
    role: 'Analyst',
    shift: 'Alpha',
    status: 'On Duty',
    currentAssignment: null,
    certifications: [
      createCertification('C019', 'Communications Systems', 250, 200),
      createCertification('C020', 'Environmental Safety', 200, 165),
    ],
    hireDate: daysAgo(548),
    emergencyContact: { name: 'Kenji Tanaka', phone: '+1-555-0106', relationship: 'Parent' },
  },
  {
    id: 'P007',
    firstName: 'Mohammed',
    lastName: 'Al-Hassan',
    email: 'm.alhassan@mercury-ops.com',
    role: 'Equipment Operator',
    shift: 'Alpha',
    status: 'On Break',
    currentAssignment: 'SITE-007',
    certifications: [
      createCertification('C021', 'Heavy Equipment Operation', 365, 120),
      createCertification('C022', 'Transport Vehicle Operation', 300, 180),
      createCertification('C023', 'Pressure Suit Operation', 250, 150),
    ],
    hireDate: daysAgo(912),
    emergencyContact: { name: 'Fatima Al-Hassan', phone: '+1-555-0107', relationship: 'Spouse' },
  },
  {
    id: 'P008',
    firstName: 'Isabella',
    lastName: 'Costa',
    email: 'i.costa@mercury-ops.com',
    role: 'Extraction Technician',
    shift: 'Alpha',
    status: 'On Duty',
    currentAssignment: 'SITE-009',
    certifications: [
      createCertification('C024', 'Thermal Drill Operation', 280, 10),
      createCertification('C025', 'Environmental Safety', 250, 130),
    ],
    hireDate: daysAgo(456),
    emergencyContact: { name: 'Marco Costa', phone: '+1-555-0108', relationship: 'Parent' },
  },
  {
    id: 'P009',
    firstName: 'David',
    lastName: 'Kim',
    email: 'd.kim@mercury-ops.com',
    role: 'Extraction Technician',
    shift: 'Alpha',
    status: 'On Duty',
    currentAssignment: 'SITE-001',
    certifications: [
      createCertification('C026', 'Thermal Drill Operation', 200, 165),
      createCertification('C027', 'Radiation Safety', 180, 120),
      createCertification('C028', 'Pressure Suit Operation', 150, 200),
    ],
    hireDate: daysAgo(638),
    emergencyContact: { name: 'Jenny Kim', phone: '+1-555-0109', relationship: 'Spouse' },
  },
  {
    id: 'P010',
    firstName: 'Olivia',
    lastName: 'Wright',
    email: 'o.wright@mercury-ops.com',
    role: 'Safety Coordinator',
    shift: 'Alpha',
    status: 'On Duty',
    currentAssignment: 'SITE-003',
    certifications: [
      createCertification('C029', 'Environmental Safety', 365, 90),
      createCertification('C030', 'Emergency Response', 300, 150),
      createCertification('C031', 'First Aid & Medical', 250, 120),
      createCertification('C032', 'Hazardous Materials Handling', 200, 180),
    ],
    hireDate: daysAgo(1278),
    emergencyContact: { name: 'Thomas Wright', phone: '+1-555-0110', relationship: 'Spouse' },
  },

  // Beta Shift
  {
    id: 'P011',
    firstName: 'Alexander',
    lastName: 'Volkov',
    email: 'a.volkov@mercury-ops.com',
    role: 'Shift Supervisor',
    shift: 'Beta',
    status: 'Off Duty',
    currentAssignment: null,
    certifications: [
      createCertification('C033', 'Thermal Drill Operation', 400, 200),
      createCertification('C034', 'Environmental Safety', 365, 180),
      createCertification('C035', 'Emergency Response', 300, 150),
      createCertification('C036', 'Heavy Equipment Operation', 350, 120),
    ],
    hireDate: daysAgo(2555),
    emergencyContact: { name: 'Natasha Volkov', phone: '+1-555-0111', relationship: 'Spouse' },
  },
  {
    id: 'P012',
    firstName: 'Priya',
    lastName: 'Sharma',
    email: 'p.sharma@mercury-ops.com',
    role: 'Equipment Operator',
    shift: 'Beta',
    status: 'Off Duty',
    currentAssignment: null,
    certifications: [
      createCertification('C037', 'Heavy Equipment Operation', 300, 90),
      createCertification('C038', 'Transport Vehicle Operation', 250, 60),
    ],
    hireDate: daysAgo(821),
    emergencyContact: { name: 'Vikram Sharma', phone: '+1-555-0112', relationship: 'Spouse' },
  },
  {
    id: 'P013',
    firstName: 'Benjamin',
    lastName: 'Foster',
    email: 'b.foster@mercury-ops.com',
    role: 'Maintenance Engineer',
    shift: 'Beta',
    status: 'Off Duty',
    currentAssignment: null,
    certifications: [
      createCertification('C039', 'Heavy Equipment Operation', 365, 200),
      createCertification('C040', 'Communications Systems', 300, 165),
      createCertification('C041', 'Thermal Drill Operation', 280, 130),
    ],
    hireDate: daysAgo(1186),
    emergencyContact: { name: 'Sarah Foster', phone: '+1-555-0113', relationship: 'Spouse' },
  },
  {
    id: 'P014',
    firstName: 'Mei',
    lastName: 'Zhang',
    email: 'm.zhang@mercury-ops.com',
    role: 'Extraction Technician',
    shift: 'Beta',
    status: 'Off Duty',
    currentAssignment: null,
    certifications: [
      createCertification('C042', 'Thermal Drill Operation', 200, -15),
      createCertification('C043', 'Pressure Suit Operation', 180, 200),
    ],
    hireDate: daysAgo(365),
    emergencyContact: { name: 'Wei Zhang', phone: '+1-555-0114', relationship: 'Parent' },
  },
  {
    id: 'P015',
    firstName: 'Lucas',
    lastName: 'Fernandez',
    email: 'l.fernandez@mercury-ops.com',
    role: 'Analyst',
    shift: 'Beta',
    status: 'Off Duty',
    currentAssignment: null,
    certifications: [
      createCertification('C044', 'Communications Systems', 365, 180),
      createCertification('C045', 'Environmental Safety', 300, 150),
    ],
    hireDate: daysAgo(729),
    emergencyContact: { name: 'Maria Fernandez', phone: '+1-555-0115', relationship: 'Spouse' },
  },
  {
    id: 'P016',
    firstName: 'Emma',
    lastName: 'Nielsen',
    email: 'e.nielsen@mercury-ops.com',
    role: 'Safety Coordinator',
    shift: 'Beta',
    status: 'Off Duty',
    currentAssignment: null,
    certifications: [
      createCertification('C046', 'Environmental Safety', 400, 220),
      createCertification('C047', 'Emergency Response', 365, 180),
      createCertification('C048', 'First Aid & Medical', 300, 15),
      createCertification('C049', 'Radiation Safety', 250, 90),
    ],
    hireDate: daysAgo(1642),
    emergencyContact: { name: 'Lars Nielsen', phone: '+1-555-0116', relationship: 'Sibling' },
  },
  {
    id: 'P017',
    firstName: 'Omar',
    lastName: 'Bakari',
    email: 'o.bakari@mercury-ops.com',
    role: 'Equipment Operator',
    shift: 'Beta',
    status: 'Off Duty',
    currentAssignment: null,
    certifications: [
      createCertification('C050', 'Heavy Equipment Operation', 250, 120),
      createCertification('C051', 'Transport Vehicle Operation', 200, 90),
      createCertification('C052', 'Pressure Suit Operation', 180, 150),
    ],
    hireDate: daysAgo(547),
    emergencyContact: { name: 'Amina Bakari', phone: '+1-555-0117', relationship: 'Spouse' },
  },
  {
    id: 'P018',
    firstName: 'Natalie',
    lastName: 'Thompson',
    email: 'n.thompson@mercury-ops.com',
    role: 'Extraction Technician',
    shift: 'Beta',
    status: 'On Leave',
    currentAssignment: null,
    certifications: [
      createCertification('C053', 'Thermal Drill Operation', 365, 200),
      createCertification('C054', 'Environmental Safety', 300, 165),
    ],
    hireDate: daysAgo(912),
    emergencyContact: { name: 'Michael Thompson', phone: '+1-555-0118', relationship: 'Spouse' },
  },
  {
    id: 'P019',
    firstName: 'Hiroshi',
    lastName: 'Yamamoto',
    email: 'h.yamamoto@mercury-ops.com',
    role: 'Maintenance Engineer',
    shift: 'Beta',
    status: 'Off Duty',
    currentAssignment: null,
    certifications: [
      createCertification('C055', 'Heavy Equipment Operation', 400, 180),
      createCertification('C056', 'Thermal Drill Operation', 365, 150),
      createCertification('C057', 'Communications Systems', 300, -30),
    ],
    hireDate: daysAgo(1460),
    emergencyContact: { name: 'Yuki Yamamoto', phone: '+1-555-0119', relationship: 'Spouse' },
  },
  {
    id: 'P020',
    firstName: 'Anna',
    lastName: 'Kowalski',
    email: 'a.kowalski@mercury-ops.com',
    role: 'Extraction Technician',
    shift: 'Beta',
    status: 'Off Duty',
    currentAssignment: null,
    certifications: [
      createCertification('C058', 'Thermal Drill Operation', 200, 90),
      createCertification('C059', 'Radiation Safety', 180, 120),
    ],
    hireDate: daysAgo(456),
    emergencyContact: { name: 'Piotr Kowalski', phone: '+1-555-0120', relationship: 'Parent' },
  },

  // Gamma Shift
  {
    id: 'P021',
    firstName: 'Victoria',
    lastName: 'Santos',
    email: 'v.santos@mercury-ops.com',
    role: 'Shift Supervisor',
    shift: 'Gamma',
    status: 'Off Duty',
    currentAssignment: null,
    certifications: [
      createCertification('C060', 'Thermal Drill Operation', 450, 250),
      createCertification('C061', 'Environmental Safety', 400, 200),
      createCertification('C062', 'Emergency Response', 365, 180),
      createCertification('C063', 'Heavy Equipment Operation', 300, 150),
    ],
    hireDate: daysAgo(2920),
    emergencyContact: { name: 'Ricardo Santos', phone: '+1-555-0121', relationship: 'Spouse' },
  },
  {
    id: 'P022',
    firstName: 'Daniel',
    lastName: 'Murphy',
    email: 'd.murphy@mercury-ops.com',
    role: 'Equipment Operator',
    shift: 'Gamma',
    status: 'Off Duty',
    currentAssignment: null,
    certifications: [
      createCertification('C064', 'Heavy Equipment Operation', 365, 200),
      createCertification('C065', 'Transport Vehicle Operation', 300, 165),
    ],
    hireDate: daysAgo(1095),
    emergencyContact: { name: 'Claire Murphy', phone: '+1-555-0122', relationship: 'Spouse' },
  },
  {
    id: 'P023',
    firstName: 'Fatou',
    lastName: 'Diallo',
    email: 'f.diallo@mercury-ops.com',
    role: 'Safety Coordinator',
    shift: 'Gamma',
    status: 'Off Duty',
    currentAssignment: null,
    certifications: [
      createCertification('C066', 'Environmental Safety', 365, 180),
      createCertification('C067', 'Emergency Response', 300, 150),
      createCertification('C068', 'First Aid & Medical', 250, 120),
      createCertification('C069', 'Hazardous Materials Handling', 200, 90),
      createCertification('C070', 'Radiation Safety', 180, 60),
    ],
    hireDate: daysAgo(1825),
    emergencyContact: { name: 'Amadou Diallo', phone: '+1-555-0123', relationship: 'Spouse' },
  },
  {
    id: 'P024',
    firstName: 'Erik',
    lastName: 'Lindqvist',
    email: 'e.lindqvist@mercury-ops.com',
    role: 'Maintenance Engineer',
    shift: 'Gamma',
    status: 'Off Duty',
    currentAssignment: null,
    certifications: [
      createCertification('C071', 'Heavy Equipment Operation', 400, 220),
      createCertification('C072', 'Communications Systems', 365, 180),
      createCertification('C073', 'Thermal Drill Operation', 300, 20),
    ],
    hireDate: daysAgo(1278),
    emergencyContact: { name: 'Anna Lindqvist', phone: '+1-555-0124', relationship: 'Spouse' },
  },
  {
    id: 'P025',
    firstName: 'Rachel',
    lastName: 'Cohen',
    email: 'r.cohen@mercury-ops.com',
    role: 'Analyst',
    shift: 'Gamma',
    status: 'Off Duty',
    currentAssignment: null,
    certifications: [
      createCertification('C074', 'Communications Systems', 300, 200),
      createCertification('C075', 'Environmental Safety', 250, 165),
    ],
    hireDate: daysAgo(638),
    emergencyContact: { name: 'David Cohen', phone: '+1-555-0125', relationship: 'Spouse' },
  },
  {
    id: 'P026',
    firstName: 'Kai',
    lastName: 'Nakamura',
    email: 'k.nakamura@mercury-ops.com',
    role: 'Extraction Technician',
    shift: 'Gamma',
    status: 'Off Duty',
    currentAssignment: null,
    certifications: [
      createCertification('C076', 'Thermal Drill Operation', 250, 150),
      createCertification('C077', 'Pressure Suit Operation', 200, 180),
      createCertification('C078', 'Radiation Safety', 180, 120),
    ],
    hireDate: daysAgo(821),
    emergencyContact: { name: 'Yumi Nakamura', phone: '+1-555-0126', relationship: 'Parent' },
  },
  {
    id: 'P027',
    firstName: 'Liam',
    lastName: "O'Brien",
    email: 'l.obrien@mercury-ops.com',
    role: 'Equipment Operator',
    shift: 'Gamma',
    status: 'Off Duty',
    currentAssignment: null,
    certifications: [
      createCertification('C079', 'Heavy Equipment Operation', 365, 200),
      createCertification('C080', 'Transport Vehicle Operation', 300, 8),
    ],
    hireDate: daysAgo(547),
    emergencyContact: { name: 'Siobhan O\'Brien', phone: '+1-555-0127', relationship: 'Spouse' },
  },
  {
    id: 'P028',
    firstName: 'Amara',
    lastName: 'Osei',
    email: 'a.osei@mercury-ops.com',
    role: 'Extraction Technician',
    shift: 'Gamma',
    status: 'Off Duty',
    currentAssignment: null,
    certifications: [
      createCertification('C081', 'Thermal Drill Operation', 200, 165),
      createCertification('C082', 'Environmental Safety', 180, 130),
    ],
    hireDate: daysAgo(365),
    emergencyContact: { name: 'Kwame Osei', phone: '+1-555-0128', relationship: 'Parent' },
  },
  {
    id: 'P029',
    firstName: 'Sebastian',
    lastName: 'Weber',
    email: 's.weber@mercury-ops.com',
    role: 'Safety Coordinator',
    shift: 'Gamma',
    status: 'Off Duty',
    currentAssignment: null,
    certifications: [
      createCertification('C083', 'Environmental Safety', 365, 180),
      createCertification('C084', 'Emergency Response', 300, 150),
      createCertification('C085', 'First Aid & Medical', 250, -5),
    ],
    hireDate: daysAgo(1095),
    emergencyContact: { name: 'Marta Weber', phone: '+1-555-0129', relationship: 'Spouse' },
  },
  {
    id: 'P030',
    firstName: 'Zara',
    lastName: 'Ahmed',
    email: 'z.ahmed@mercury-ops.com',
    role: 'Maintenance Engineer',
    shift: 'Gamma',
    status: 'On Leave',
    currentAssignment: null,
    certifications: [
      createCertification('C086', 'Heavy Equipment Operation', 400, 250),
      createCertification('C087', 'Communications Systems', 365, 200),
      createCertification('C088', 'Thermal Drill Operation', 300, 165),
    ],
    hireDate: daysAgo(912),
    emergencyContact: { name: 'Hassan Ahmed', phone: '+1-555-0130', relationship: 'Sibling' },
  },

  // Additional Alpha Shift personnel
  {
    id: 'P031',
    firstName: 'Tyler',
    lastName: 'Jackson',
    email: 't.jackson@mercury-ops.com',
    role: 'Extraction Technician',
    shift: 'Alpha',
    status: 'On Duty',
    currentAssignment: 'SITE-011',
    certifications: [
      createCertification('C089', 'Thermal Drill Operation', 180, 120),
      createCertification('C090', 'Pressure Suit Operation', 150, 200),
    ],
    hireDate: daysAgo(274),
    emergencyContact: { name: 'Michelle Jackson', phone: '+1-555-0131', relationship: 'Spouse' },
  },
  {
    id: 'P032',
    firstName: 'Nina',
    lastName: 'Petrov',
    email: 'n.petrov@mercury-ops.com',
    role: 'Equipment Operator',
    shift: 'Alpha',
    status: 'On Duty',
    currentAssignment: 'SITE-013',
    certifications: [
      createCertification('C091', 'Heavy Equipment Operation', 250, 180),
      createCertification('C092', 'Transport Vehicle Operation', 200, 150),
    ],
    hireDate: daysAgo(456),
    emergencyContact: { name: 'Ivan Petrov', phone: '+1-555-0132', relationship: 'Parent' },
  },
  {
    id: 'P033',
    firstName: 'Carlos',
    lastName: 'Mendez',
    email: 'c.mendez@mercury-ops.com',
    role: 'Analyst',
    shift: 'Alpha',
    status: 'On Duty',
    currentAssignment: null,
    certifications: [
      createCertification('C093', 'Communications Systems', 200, 165),
      createCertification('C094', 'Environmental Safety', 180, 130),
    ],
    hireDate: daysAgo(365),
    emergencyContact: { name: 'Rosa Mendez', phone: '+1-555-0133', relationship: 'Spouse' },
  },
  {
    id: 'P034',
    firstName: 'Grace',
    lastName: 'Liu',
    email: 'g.liu@mercury-ops.com',
    role: 'Extraction Technician',
    shift: 'Alpha',
    status: 'On Break',
    currentAssignment: 'SITE-015',
    certifications: [
      createCertification('C095', 'Thermal Drill Operation', 300, 90),
      createCertification('C096', 'Radiation Safety', 250, 60),
      createCertification('C097', 'Pressure Suit Operation', 200, 150),
    ],
    hireDate: daysAgo(638),
    emergencyContact: { name: 'Henry Liu', phone: '+1-555-0134', relationship: 'Spouse' },
  },
  {
    id: 'P035',
    firstName: 'Hassan',
    lastName: 'Mahmoud',
    email: 'h.mahmoud@mercury-ops.com',
    role: 'Maintenance Engineer',
    shift: 'Alpha',
    status: 'On Duty',
    currentAssignment: 'SITE-017',
    certifications: [
      createCertification('C098', 'Heavy Equipment Operation', 365, 200),
      createCertification('C099', 'Communications Systems', 300, 165),
      createCertification('C100', 'Thermal Drill Operation', 280, 25),
    ],
    hireDate: daysAgo(821),
    emergencyContact: { name: 'Layla Mahmoud', phone: '+1-555-0135', relationship: 'Spouse' },
  },

  // Additional Beta Shift personnel
  {
    id: 'P036',
    firstName: 'Samantha',
    lastName: 'Brooks',
    email: 's.brooks@mercury-ops.com',
    role: 'Extraction Technician',
    shift: 'Beta',
    status: 'Off Duty',
    currentAssignment: null,
    certifications: [
      createCertification('C101', 'Thermal Drill Operation', 200, 180),
      createCertification('C102', 'Environmental Safety', 180, 150),
    ],
    hireDate: daysAgo(456),
    emergencyContact: { name: 'Robert Brooks', phone: '+1-555-0136', relationship: 'Spouse' },
  },
  {
    id: 'P037',
    firstName: 'Andrei',
    lastName: 'Popov',
    email: 'a.popov@mercury-ops.com',
    role: 'Equipment Operator',
    shift: 'Beta',
    status: 'Off Duty',
    currentAssignment: null,
    certifications: [
      createCertification('C103', 'Heavy Equipment Operation', 300, 120),
      createCertification('C104', 'Transport Vehicle Operation', 250, 90),
      createCertification('C105', 'Pressure Suit Operation', 200, 165),
    ],
    hireDate: daysAgo(729),
    emergencyContact: { name: 'Elena Popov', phone: '+1-555-0137', relationship: 'Spouse' },
  },
  {
    id: 'P038',
    firstName: 'Diana',
    lastName: 'Ross',
    email: 'd.ross@mercury-ops.com',
    role: 'Safety Coordinator',
    shift: 'Beta',
    status: 'Off Duty',
    currentAssignment: null,
    certifications: [
      createCertification('C106', 'Environmental Safety', 365, 200),
      createCertification('C107', 'Emergency Response', 300, 165),
      createCertification('C108', 'First Aid & Medical', 250, 130),
      createCertification('C109', 'Hazardous Materials Handling', 200, 12),
    ],
    hireDate: daysAgo(1095),
    emergencyContact: { name: 'Marcus Ross', phone: '+1-555-0138', relationship: 'Spouse' },
  },
  {
    id: 'P039',
    firstName: 'Javier',
    lastName: 'Gutierrez',
    email: 'j.gutierrez@mercury-ops.com',
    role: 'Analyst',
    shift: 'Beta',
    status: 'Off Duty',
    currentAssignment: null,
    certifications: [
      createCertification('C110', 'Communications Systems', 250, 180),
      createCertification('C111', 'Environmental Safety', 200, 150),
    ],
    hireDate: daysAgo(547),
    emergencyContact: { name: 'Carmen Gutierrez', phone: '+1-555-0139', relationship: 'Spouse' },
  },
  {
    id: 'P040',
    firstName: 'Kim',
    lastName: 'Nguyen',
    email: 'k.nguyen@mercury-ops.com',
    role: 'Maintenance Engineer',
    shift: 'Beta',
    status: 'Off Duty',
    currentAssignment: null,
    certifications: [
      createCertification('C112', 'Heavy Equipment Operation', 400, 220),
      createCertification('C113', 'Communications Systems', 365, 180),
      createCertification('C114', 'Thermal Drill Operation', 300, 150),
    ],
    hireDate: daysAgo(912),
    emergencyContact: { name: 'Tran Nguyen', phone: '+1-555-0140', relationship: 'Parent' },
  },

  // Additional Gamma Shift personnel
  {
    id: 'P041',
    firstName: 'Ethan',
    lastName: 'Williams',
    email: 'e.williams@mercury-ops.com',
    role: 'Extraction Technician',
    shift: 'Gamma',
    status: 'Off Duty',
    currentAssignment: null,
    certifications: [
      createCertification('C115', 'Thermal Drill Operation', 180, 150),
      createCertification('C116', 'Pressure Suit Operation', 150, 200),
    ],
    hireDate: daysAgo(274),
    emergencyContact: { name: 'Ashley Williams', phone: '+1-555-0141', relationship: 'Spouse' },
  },
  {
    id: 'P042',
    firstName: 'Mia',
    lastName: 'Schmidt',
    email: 'm.schmidt@mercury-ops.com',
    role: 'Equipment Operator',
    shift: 'Gamma',
    status: 'Off Duty',
    currentAssignment: null,
    certifications: [
      createCertification('C117', 'Heavy Equipment Operation', 250, 180),
      createCertification('C118', 'Transport Vehicle Operation', 200, -20),
    ],
    hireDate: daysAgo(456),
    emergencyContact: { name: 'Hans Schmidt', phone: '+1-555-0142', relationship: 'Parent' },
  },
  {
    id: 'P043',
    firstName: 'Robert',
    lastName: 'Taylor',
    email: 'r.taylor@mercury-ops.com',
    role: 'Safety Coordinator',
    shift: 'Gamma',
    status: 'Off Duty',
    currentAssignment: null,
    certifications: [
      createCertification('C119', 'Environmental Safety', 365, 180),
      createCertification('C120', 'Emergency Response', 300, 150),
      createCertification('C121', 'First Aid & Medical', 250, 120),
    ],
    hireDate: daysAgo(821),
    emergencyContact: { name: 'Jennifer Taylor', phone: '+1-555-0143', relationship: 'Spouse' },
  },
  {
    id: 'P044',
    firstName: 'Leila',
    lastName: 'Moradi',
    email: 'l.moradi@mercury-ops.com',
    role: 'Analyst',
    shift: 'Gamma',
    status: 'Off Duty',
    currentAssignment: null,
    certifications: [
      createCertification('C122', 'Communications Systems', 200, 165),
      createCertification('C123', 'Environmental Safety', 180, 130),
    ],
    hireDate: daysAgo(365),
    emergencyContact: { name: 'Reza Moradi', phone: '+1-555-0144', relationship: 'Parent' },
  },
  {
    id: 'P045',
    firstName: 'Joseph',
    lastName: 'Anderson',
    email: 'j.anderson@mercury-ops.com',
    role: 'Maintenance Engineer',
    shift: 'Gamma',
    status: 'Off Duty',
    currentAssignment: null,
    certifications: [
      createCertification('C124', 'Heavy Equipment Operation', 300, 120),
      createCertification('C125', 'Communications Systems', 250, 90),
      createCertification('C126', 'Thermal Drill Operation', 200, 165),
    ],
    hireDate: daysAgo(638),
    emergencyContact: { name: 'Patricia Anderson', phone: '+1-555-0145', relationship: 'Spouse' },
  },

  // More mixed personnel to reach 60
  {
    id: 'P046',
    firstName: 'Chioma',
    lastName: 'Eze',
    email: 'c.eze@mercury-ops.com',
    role: 'Extraction Technician',
    shift: 'Alpha',
    status: 'On Duty',
    currentAssignment: 'SITE-002',
    certifications: [
      createCertification('C127', 'Thermal Drill Operation', 250, 180),
      createCertification('C128', 'Radiation Safety', 200, 150),
    ],
    hireDate: daysAgo(547),
    emergencyContact: { name: 'Obinna Eze', phone: '+1-555-0146', relationship: 'Spouse' },
  },
  {
    id: 'P047',
    firstName: 'Henrik',
    lastName: 'Johansson',
    email: 'h.johansson@mercury-ops.com',
    role: 'Equipment Operator',
    shift: 'Beta',
    status: 'Off Duty',
    currentAssignment: null,
    certifications: [
      createCertification('C129', 'Heavy Equipment Operation', 365, 200),
      createCertification('C130', 'Transport Vehicle Operation', 300, 165),
      createCertification('C131', 'Pressure Suit Operation', 250, 130),
    ],
    hireDate: daysAgo(821),
    emergencyContact: { name: 'Ingrid Johansson', phone: '+1-555-0147', relationship: 'Spouse' },
  },
  {
    id: 'P048',
    firstName: 'Aaliyah',
    lastName: 'Brown',
    email: 'a.brown@mercury-ops.com',
    role: 'Analyst',
    shift: 'Gamma',
    status: 'Off Duty',
    currentAssignment: null,
    certifications: [
      createCertification('C132', 'Communications Systems', 180, 150),
      createCertification('C133', 'Environmental Safety', 150, 200),
    ],
    hireDate: daysAgo(274),
    emergencyContact: { name: 'James Brown', phone: '+1-555-0148', relationship: 'Parent' },
  },
  {
    id: 'P049',
    firstName: 'Vladimir',
    lastName: 'Kozlov',
    email: 'v.kozlov@mercury-ops.com',
    role: 'Safety Coordinator',
    shift: 'Alpha',
    status: 'On Duty',
    currentAssignment: 'SITE-006',
    certifications: [
      createCertification('C134', 'Environmental Safety', 400, 220),
      createCertification('C135', 'Emergency Response', 365, 180),
      createCertification('C136', 'First Aid & Medical', 300, 150),
      createCertification('C137', 'Radiation Safety', 250, 18),
    ],
    hireDate: daysAgo(1460),
    emergencyContact: { name: 'Svetlana Kozlov', phone: '+1-555-0149', relationship: 'Spouse' },
  },
  {
    id: 'P050',
    firstName: 'Sophia',
    lastName: 'Martinez',
    email: 's.martinez@mercury-ops.com',
    role: 'Maintenance Engineer',
    shift: 'Beta',
    status: 'Off Duty',
    currentAssignment: null,
    certifications: [
      createCertification('C138', 'Heavy Equipment Operation', 350, 180),
      createCertification('C139', 'Communications Systems', 300, 150),
      createCertification('C140', 'Thermal Drill Operation', 250, 120),
    ],
    hireDate: daysAgo(729),
    emergencyContact: { name: 'Diego Martinez', phone: '+1-555-0150', relationship: 'Spouse' },
  },
  {
    id: 'P051',
    firstName: 'Kwame',
    lastName: 'Asante',
    email: 'k.asante@mercury-ops.com',
    role: 'Extraction Technician',
    shift: 'Gamma',
    status: 'Off Duty',
    currentAssignment: null,
    certifications: [
      createCertification('C141', 'Thermal Drill Operation', 200, 165),
      createCertification('C142', 'Pressure Suit Operation', 180, 200),
    ],
    hireDate: daysAgo(456),
    emergencyContact: { name: 'Abena Asante', phone: '+1-555-0151', relationship: 'Spouse' },
  },
  {
    id: 'P052',
    firstName: 'Ingrid',
    lastName: 'Hansen',
    email: 'i.hansen@mercury-ops.com',
    role: 'Equipment Operator',
    shift: 'Alpha',
    status: 'On Break',
    currentAssignment: 'SITE-008',
    certifications: [
      createCertification('C143', 'Heavy Equipment Operation', 300, 120),
      createCertification('C144', 'Transport Vehicle Operation', 250, 90),
    ],
    hireDate: daysAgo(638),
    emergencyContact: { name: 'Olaf Hansen', phone: '+1-555-0152', relationship: 'Spouse' },
  },
  {
    id: 'P053',
    firstName: 'Chen',
    lastName: 'Wei',
    email: 'c.wei@mercury-ops.com',
    role: 'Analyst',
    shift: 'Beta',
    status: 'Off Duty',
    currentAssignment: null,
    certifications: [
      createCertification('C145', 'Communications Systems', 365, 200),
      createCertification('C146', 'Environmental Safety', 300, 165),
    ],
    hireDate: daysAgo(547),
    emergencyContact: { name: 'Ming Wei', phone: '+1-555-0153', relationship: 'Spouse' },
  },
  {
    id: 'P054',
    firstName: 'Abdul',
    lastName: 'Rahman',
    email: 'a.rahman@mercury-ops.com',
    role: 'Safety Coordinator',
    shift: 'Gamma',
    status: 'Off Duty',
    currentAssignment: null,
    certifications: [
      createCertification('C147', 'Environmental Safety', 350, 180),
      createCertification('C148', 'Emergency Response', 300, 150),
      createCertification('C149', 'First Aid & Medical', 250, 5),
    ],
    hireDate: daysAgo(912),
    emergencyContact: { name: 'Fatima Rahman', phone: '+1-555-0154', relationship: 'Spouse' },
  },
  {
    id: 'P055',
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'e.davis@mercury-ops.com',
    role: 'Maintenance Engineer',
    shift: 'Alpha',
    status: 'On Duty',
    currentAssignment: 'SITE-010',
    certifications: [
      createCertification('C150', 'Heavy Equipment Operation', 400, 220),
      createCertification('C151', 'Communications Systems', 365, 180),
      createCertification('C152', 'Thermal Drill Operation', 300, -10),
    ],
    hireDate: daysAgo(1095),
    emergencyContact: { name: 'Michael Davis', phone: '+1-555-0155', relationship: 'Spouse' },
  },
  {
    id: 'P056',
    firstName: 'Takeshi',
    lastName: 'Sato',
    email: 't.sato@mercury-ops.com',
    role: 'Extraction Technician',
    shift: 'Beta',
    status: 'Off Duty',
    currentAssignment: null,
    certifications: [
      createCertification('C153', 'Thermal Drill Operation', 250, 180),
      createCertification('C154', 'Radiation Safety', 200, 150),
      createCertification('C155', 'Pressure Suit Operation', 180, 200),
    ],
    hireDate: daysAgo(638),
    emergencyContact: { name: 'Yoko Sato', phone: '+1-555-0156', relationship: 'Spouse' },
  },
  {
    id: 'P057',
    firstName: 'Gabrielle',
    lastName: 'Dubois',
    email: 'g.dubois@mercury-ops.com',
    role: 'Equipment Operator',
    shift: 'Gamma',
    status: 'Off Duty',
    currentAssignment: null,
    certifications: [
      createCertification('C156', 'Heavy Equipment Operation', 300, 165),
      createCertification('C157', 'Transport Vehicle Operation', 250, 130),
    ],
    hireDate: daysAgo(547),
    emergencyContact: { name: 'Pierre Dubois', phone: '+1-555-0157', relationship: 'Spouse' },
  },
  {
    id: 'P058',
    firstName: 'Ivan',
    lastName: 'Petrov',
    email: 'i.petrov@mercury-ops.com',
    role: 'Analyst',
    shift: 'Alpha',
    status: 'On Duty',
    currentAssignment: null,
    certifications: [
      createCertification('C158', 'Communications Systems', 200, 165),
      createCertification('C159', 'Environmental Safety', 180, 130),
    ],
    hireDate: daysAgo(365),
    emergencyContact: { name: 'Olga Petrov', phone: '+1-555-0158', relationship: 'Spouse' },
  },
  {
    id: 'P059',
    firstName: 'Maria',
    lastName: 'Garcia',
    email: 'm.garcia@mercury-ops.com',
    role: 'Safety Coordinator',
    shift: 'Beta',
    status: 'Off Duty',
    currentAssignment: null,
    certifications: [
      createCertification('C160', 'Environmental Safety', 365, 200),
      createCertification('C161', 'Emergency Response', 300, 165),
      createCertification('C162', 'First Aid & Medical', 250, 130),
      createCertification('C163', 'Hazardous Materials Handling', 200, 90),
    ],
    hireDate: daysAgo(821),
    emergencyContact: { name: 'Juan Garcia', phone: '+1-555-0159', relationship: 'Spouse' },
  },
  {
    id: 'P060',
    firstName: 'Patrick',
    lastName: 'O\'Connor',
    email: 'p.oconnor@mercury-ops.com',
    role: 'Maintenance Engineer',
    shift: 'Gamma',
    status: 'Off Duty',
    currentAssignment: null,
    certifications: [
      createCertification('C164', 'Heavy Equipment Operation', 350, 180),
      createCertification('C165', 'Communications Systems', 300, 150),
      createCertification('C166', 'Thermal Drill Operation', 250, 120),
    ],
    hireDate: daysAgo(729),
    emergencyContact: { name: 'Siobhan O\'Connor', phone: '+1-555-0160', relationship: 'Spouse' },
  },
];

// Get all certifications across all personnel (flattened)
export function getAllCertifications(): (Certification & { personnelId: string; personnelName: string })[] {
  return personnelData.flatMap(person =>
    person.certifications.map(cert => ({
      ...cert,
      personnelId: person.id,
      personnelName: getFullName(person),
    }))
  );
}

// Filter personnel by various criteria
export function filterPersonnel(
  data: Personnel[],
  filters: {
    search?: string;
    roles?: Role[];
    shifts?: Shift[];
    statuses?: PersonnelStatus[];
  }
): Personnel[] {
  return data.filter(person => {
    // Search filter
    if (filters.search) {
      const query = filters.search.toLowerCase();
      const fullName = getFullName(person).toLowerCase();
      if (!fullName.includes(query) && !person.email.toLowerCase().includes(query) && !person.id.toLowerCase().includes(query)) {
        return false;
      }
    }

    // Role filter
    if (filters.roles && filters.roles.length > 0) {
      if (!filters.roles.includes(person.role)) {
        return false;
      }
    }

    // Shift filter
    if (filters.shifts && filters.shifts.length > 0) {
      if (!filters.shifts.includes(person.shift)) {
        return false;
      }
    }

    // Status filter
    if (filters.statuses && filters.statuses.length > 0) {
      if (!filters.statuses.includes(person.status)) {
        return false;
      }
    }

    return true;
  });
}

// Get personnel by shift for schedule view
export function getPersonnelByShift(shift: Shift): Personnel[] {
  return personnelData.filter(person => person.shift === shift);
}

// Get statistics
export function getPersonnelStats() {
  const total = personnelData.length;
  const byShift = {
    Alpha: personnelData.filter(p => p.shift === 'Alpha').length,
    Beta: personnelData.filter(p => p.shift === 'Beta').length,
    Gamma: personnelData.filter(p => p.shift === 'Gamma').length,
  };
  const byStatus = {
    'On Duty': personnelData.filter(p => p.status === 'On Duty').length,
    'Off Duty': personnelData.filter(p => p.status === 'Off Duty').length,
    'On Break': personnelData.filter(p => p.status === 'On Break').length,
    'On Leave': personnelData.filter(p => p.status === 'On Leave').length,
  };
  const byRole = {
    'Extraction Technician': personnelData.filter(p => p.role === 'Extraction Technician').length,
    'Equipment Operator': personnelData.filter(p => p.role === 'Equipment Operator').length,
    'Safety Coordinator': personnelData.filter(p => p.role === 'Safety Coordinator').length,
    'Shift Supervisor': personnelData.filter(p => p.role === 'Shift Supervisor').length,
    'Maintenance Engineer': personnelData.filter(p => p.role === 'Maintenance Engineer').length,
    'Analyst': personnelData.filter(p => p.role === 'Analyst').length,
  };

  const allCerts = getAllCertifications();
  const certsByStatus = {
    valid: allCerts.filter(c => c.status === 'valid').length,
    expiring: allCerts.filter(c => c.status === 'expiring').length,
    expired: allCerts.filter(c => c.status === 'expired').length,
  };

  return { total, byShift, byStatus, byRole, certsByStatus };
}

// Available roles for forms
export const availableRoles: Role[] = [
  'Extraction Technician',
  'Equipment Operator',
  'Safety Coordinator',
  'Shift Supervisor',
  'Maintenance Engineer',
  'Analyst',
];

// Available shifts for forms
export const availableShifts: Shift[] = ['Alpha', 'Beta', 'Gamma'];

// Available certification types for forms
export const availableCertificationTypes = certificationTypes;
