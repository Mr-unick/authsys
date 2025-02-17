
export const ROOT_URL = "http://localhost:3000/"
export const permissions =[
    'view_dashboard','view_settings','view_about','view_contact',"view_nested_dashboard","create_post",'posts_edit'
]

export const UsserData ={
    role : "Admin",
    permissions:permissions
}
export const sampleData = {
  personalInfo: {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    address: '123 Street Name, City, Country'
  },
  summary: 'Results-driven Software Engineer with 4+ years of experience in full-stack development. Specialized in building scalable web applications using modern JavaScript frameworks. Strong background in cloud technologies and microservices architecture. Proven track record of delivering high-quality solutions while mentoring junior developers and driving technical initiatives.',
  education: [
    {
      collegeName: 'XYZ University',
      degree: 'Bachelor of Science in Computer Science',
      fromYear: '2015',
      toYear: '2019',
      percentage: 85,
      achievements: [
        "Dean's List - All Semesters",
        'President of Computer Science Society'
      ]
    },
    {
      collegeName: 'ABC College',
      degree: 'Associate Degree in Information Technology',
      fromYear: '2013',
      toYear: '2015',
      percentage: 90,
      achievements: [
        'First Class Honors',
        'Best Student Project Award'
      ]
    }
  ],
  experience: [
    {
      designation: 'Software Engineer',
      company: 'TechCorp Ltd.',
      fromYear: '2020',
      toYear: 'Present',
      responsibilities: [
        'Led the development of a microservices-based e-commerce platform serving 100K+ daily users',
        'Implemented CI/CD pipelines reducing deployment time by 60%',
        'Mentored 5 junior developers and conducted technical training sessions',
        'Optimized database queries resulting in 40% improvement in application performance',
        'Architected and implemented RESTful APIs consumed by mobile and web applications'
      ]
    },
    {
      designation: 'Intern',
      company: 'DevSolutions Inc.',
      fromYear: '2019',
      toYear: '2020',
      responsibilities: [
        'Developed and maintained features for client-facing web applications',
        'Collaborated with senior developers to implement responsive designs',
        'Participated in code reviews and contributed to documentation',
        'Assisted in migrating legacy systems to modern tech stack'
      ]
    }
  ],
  projects: [
    {
      name: 'E-commerce Platform Redesign',
      duration: 'Jan 2022 - Present',
      technologies: 'React, Node.js, MongoDB, Docker, AWS',
      details: [
        'Led team of 4 developers in complete platform redesign',
        'Implemented microservices architecture using Node.js and Docker',
        'Reduced page load time by 60% through optimization techniques',
        'Integrated payment gateway processing $1M+ monthly transactions'
      ],
      link: 'https://github.com/johndoe/ecommerce-platform'
    },
    {
      name: 'Real-time Analytics Dashboard',
      duration: 'Jun 2021 - Dec 2021',
      technologies: 'React, Redux, WebSocket, D3.js, Firebase',
      details: [
        'Built real-time dashboard monitoring 50+ system metrics',
        'Implemented WebSocket connection for live data updates',
        'Created custom visualization components using D3.js',
        'Integrated authentication system with role-based access'
      ],
      link: 'https://github.com/johndoe/analytics-dashboard'
    },
    {
      name: 'Automated Testing Framework',
      duration: 'Mar 2021 - May 2021',
      technologies: 'Jest, Puppeteer, GitHub Actions, TypeScript',
      details: [
        'Developed end-to-end testing framework reducing manual testing time by 70%',
        'Implemented parallel test execution reducing CI pipeline duration',
        'Created custom test reporters for better result visualization',
        'Integrated with GitHub Actions for automated test runs'
      ]
    }
  ],
  skills: [
    'JavaScript/TypeScript',
    'React/Redux',
    'Node.js',
    'Python',
    'MongoDB',
    'PostgreSQL',
    'Docker',
    'Kubernetes',
    'AWS',
    'CI/CD',
    'Git',
    'REST APIs',
    'GraphQL',
    'Agile/Scrum',
    'Unit Testing',
    'System Design'
  ],
  certifications: [
    'AWS Certified Solutions Architect - Associate',
    'Google Cloud Certified - Associate Cloud Engineer',
    'Certified React Developer',
    'MongoDB Certified Developer',
    'Certified Scrum Master (CSM)'
  ]
};
export const GEMNIKEY= 'AIzaSyDxEib-er30XwjLmzeGn6kmVZpElqCauto'
// export const  sampleData = {
//     personalInfo: {
//       name: 'John Doe',
//       email: 'john.doe@example.com',
//       phone: '+1234567890',
//       address: '123 Street Name, City, Country'
//     },
//     education: [
//       {
//         collegeName: 'XYZ University',
//         fromYear: '2015',
//         toYear: '2019',
//         percentage: 85
//       },
//       {
//         collegeName: 'ABC College',
//         fromYear: '2013',
//         toYear: '2015',
//         percentage: 90
//       }
//     ],
//     experience: [
//       {
//         designation: 'Software Engineer',
//         fromYear: '2020',
//         toYear: 'Present',
//         company: 'TechCorp Ltd.'
//       },
//       {
//         designation: 'Intern',
//         fromYear: '2019',
//         toYear: '2020',
//         company: 'DevSolutions Inc.'
//       }
//     ],
//     skills: ['JavaScript', 'React', 'Node.js', 'HTML/CSS', 'Git', 'Docker'],
//     certifications: [
//       'Certified React Developer',
//       'AWS Certified Solutions Architect',
//       'Google Cloud Certified - Associate Cloud Engineer'
//     ]
//   };


export const SampleLeads = [
  {
    "id": "12345",
    "name": "John Doe",
    "number": "+1234567890",
    "messageCount": 42,
    "hasReminder": true,
    "status": "active",
    "lastContactTime": "2025-01-28T14:35:00Z"
  },
  {
    "id": "12346",
    "name": "Jane Smith",
    "number": "+1987654321",
    "messageCount": 15,
    "hasReminder": false,
    "status": "inactive",
    "lastContactTime": "2025-01-22T11:20:00Z"
  },
  {
    "id": "12347",
    "name": "Michael Johnson",
    "number": "+1122334455",
    "messageCount": 5,
    "hasReminder": true,
    "status": "active",
    "lastContactTime": "2025-01-25T09:10:00Z"
  },
  {
    "id": "12348",
    "name": "Emily Davis",
    "number": "+1444556677",
    "messageCount": 30,
    "hasReminder": true,
    "status": "active",
    "lastContactTime": "2025-01-27T08:05:00Z"
  },
  {
    "id": "12349",
    "name": "David Wilson",
    "number": "+1777888999",
    "messageCount": 12,
    "hasReminder": false,
    "status": "inactive",
    "lastContactTime": "2025-01-18T17:50:00Z"
  },
  {
    "id": "12350",
    "name": "Sarah Miller",
    "number": "+1002003004",
    "messageCount": 48,
    "hasReminder": true,
    "status": "active",
    "lastContactTime": "2025-01-30T13:25:00Z"
  },
  {
    "id": "12351",
    "name": "James Brown",
    "number": "+1567894321",
    "messageCount": 3,
    "hasReminder": false,
    "status": "inactive",
    "lastContactTime": "2025-01-20T12:15:00Z"
  },
  {
    "id": "12352",
    "name": "Olivia Garcia",
    "number": "+1678990321",
    "messageCount": 20,
    "hasReminder": true,
    "status": "active",
    "lastContactTime": "2025-01-26T10:40:00Z"
  },
  {
    "id": "12353",
    "name": "William Martinez",
    "number": "+1789203847",
    "messageCount": 8,
    "hasReminder": false,
    "status": "inactive",
    "lastContactTime": "2025-01-24T19:00:00Z"
  },
  {
    "id": "12354",
    "name": "Sophia Anderson",
    "number": "+1987123456",
    "messageCount": 25,
    "hasReminder": true,
    "status": "active",
    "lastContactTime": "2025-01-29T16:00:00Z"
  }
]
;

export const Stages = [
  {
    "stage": "Prospecting",
    "colour": "#3B82F6"  // Tailwind blue-500 hex equivalent
  },
  {
    "stage": "Qualification",
    "colour": "#10B981"  // Tailwind green-500 hex equivalent
  },
  {
    "stage": "NeedsAnalysis",
    "colour": "#14B8A6"  // Tailwind teal-500 hex equivalent
  },
  {
    "stage": "ProposalSent",
    "colour": "#F59E0B"  // Tailwind yellow-500 hex equivalent
  },
  {
    "stage": "Negotiation",
    "colour": "#FB923C"  // Tailwind orange-500 hex equivalent
  },
  {
    "stage": "ClosedWon",
    "colour": "#8B5CF6"  // Tailwind purple-500 hex equivalent
  },
  {
    "stage": "ClosedLost",
    "colour": "#EF4444"  // Tailwind red-500 hex equivalent
  },
  {
    "stage": "FollowUp",
    "colour": "#6B7280"  // Tailwind gray-500 hex equivalent
  }
]

export const leadDetailSample = {
  "id": "12345",
  "name": "John Doe",
  "number": "+1234567890",
  "messageCount": 42,
  "hasReminder": true,
  "status": "active",
  "lastContactTime": "2025-01-28T14:35:00Z",
  "email": "johndoe@example.com",
  "address": "123 Main St, Springfield, IL",
  "dateOfBirth": "1990-05-15",
  "preferredContactMethod": "email",
  "company": "Doe Enterprises",
  "jobTitle": "Marketing Manager",
  "language": "English",
  "leadSource": "Website",
  "lastMessageSent": "2025-01-25T10:15:00Z",
  "nextFollowUp": "2025-02-10T09:00:00Z",
  "notes": "Interested in new product launch, follow up after event",
  "isVIP": true,
  "reminder": "2025-02-05T14:00:00Z"
}


  
  export const  AUTH_CLIENT = "279388001610-3b0d7ncjdlndvpe72kovec19s8qtohto.apps.googleusercontent.com"
  export const AUTH_SECREAT = "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"


//   INSERT INTO permissions (policy_name, permission, action) 
// VALUES 

// ('roles', 'view_roles', 'view'),
// ('roles', 'update_roles', 'update'),
// ('roles', 'create_roles', 'create'),
// ('roles', 'delete_roles', 'delete'),
// ('roles', 'restore_roles', 'restore'),


// ('policy', 'view_policy', 'view'),
// ('policy', 'update_policy', 'update'),
// ('policy', 'create_policy', 'create'),
// ('policy', 'delete_policy', 'delete'),
// ('policy', 'restore_policy', 'restore'),


// ('business', 'view_business', 'view'),
// ('business', 'update_business', 'update'),
// ('business', 'create_business', 'create'),
// ('business', 'delete_business', 'delete'),
// ('business', 'restore_business', 'restore'),


// ('branches', 'view_branches', 'view'),
// ('branches', 'update_branches', 'update'),
// ('branches', 'create_branches', 'create'),
// ('branches', 'delete_branches', 'delete'),
// ('branches', 'restore_branches', 'restore'),


// ('leadstages', 'view_leadstages', 'view'),
// ('leadstages', 'update_leadstages', 'update'),
// ('leadstages', 'create_leadstages', 'create'),
// ('leadstages', 'delete_leadstages', 'delete'),
// ('leadstages', 'restore_leadstages', 'restore'),


// ('area_of_operation', 'view_area_of_operation', 'view'),
// ('area_of_operation', 'update_area_of_operation', 'update'),
// ('area_of_operation', 'create_area_of_operation', 'create'),
// ('area_of_operation', 'delete_area_of_operation', 'delete'),
// ('area_of_operation', 'restore_area_of_operation', 'restore'),


// ('users', 'view_users', 'view'),
// ('users', 'update_users', 'update'),
// ('users', 'create_users', 'create'),
// ('users', 'delete_users', 'delete'),
// ('users', 'restore_users', 'restore'),


// ('settings', 'update_settings', 'update'),
// ('settings', 'restore_settings', 'restore'),


// ('dashboard', 'view_dashboard', 'view'),


// ('leads', 'view_leads', 'view'),
// ('leads', 'update_leads', 'update'),
// ('leads', 'create_leads', 'create'),
// ('leads', 'delete_leads', 'delete'),
// ('leads', 'restore_leads', 'restore'),


// ('leaddetails', 'view_leaddetails', 'view'),
// ('leaddetails', 'update_leaddetails', 'update'),
// ('leaddetails', 'create_leaddetails', 'create'),
// ('leaddetails', 'delete_leaddetails', 'delete'),
// ('leaddetails', 'restore_leaddetails', 'restore'),


// ('personal_info', 'view_personal_info', 'view'),
// ('personal_info', 'update_personal_info', 'update'),

// ('source', 'view_source', 'view'),
// ('source', 'update_source', 'update'),


// ('freshleads', 'view_freshleads', 'view'),
// ('freshleads', 'assign_freshleads', 'assign');
