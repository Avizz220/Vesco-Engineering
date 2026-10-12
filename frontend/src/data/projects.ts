import { Project } from '@/types'

/**
 * Static Projects Database
 * 
 * To add a new project:
 * 1. Create a folder under `frontend/public/projects/<ProjectName>/`.
 * 2. Put your project image and details in that folder.
 * 3. Add an entry to the `STATIC_PROJECTS` array below with the corresponding fields.
 * 4. Save the file. The new project will automatically appear across the site!
 */
export const STATIC_PROJECTS: Project[] = [
  {
    id: 'mealio',
    title: 'MealIO – Automated Robot for Domestic Food Preparation',
    description: 'MealIO is a smart domestic cooking robot designed to automate ingredient dispensing, stirring, liquid control, and key meal preparation tasks. It integrates ESP32-S3 and Arduino control, sensors, a touchscreen interface, and a Flutter mobile app, supported by Proteus simulation and SolidWorks 3D design.',
    technologies: ['ESP32-S3', 'Arduino Uno', 'MicroPython', 'Embedded C/C++', 'Proteus', 'SolidWorks', 'Flutter'],
    imageUrl: '/projects/MealIO/Screenshot 2026-10-12 114846.png',
    category: 'Embedded Systems',
    contributors: ['Team project'],
    githubUrl: '',
    linkedInUrl: 'https://lnkd.in/p/gM8Bi7rP',
    liveUrl: 'https://youtu.be/UJhQOITn-Qk?si=xuZ46UStweB7ZU8F',
    youtubeUrl: 'https://youtu.be/UJhQOITn-Qk?si=xuZ46UStweB7ZU8F',
    createdAt: '2026-02-01T00:00:00.000Z',
    updatedAt: '2026-02-01T00:00:00.000Z',
  },
  {
    id: 'rugrow',
    title: 'RuGrow – IoT-Based Smart Plant Growing System (Version 1.0.0)',
    description: 'RuGrow is an innovative IoT-based automated plant-growing system designed as an alternative to traditional greenhouses. It integrates ESP32-S3, Arduino-based linear actuator control, environmental sensors, and Azure AI Custom Vision for plant recognition, fruit detection, and disease identification. The system automatically manages watering, temperature, humidity, and artificial lighting based on real-time sensor data, with live monitoring through the RuGrow App.',
    technologies: ['ESP32-S3', 'Arduino Uno', 'Embedded C/C++', 'IoT', 'CNC V4 Shield', 'Linear Actuators', 'Environmental Sensors', 'Azure AI Custom Vision', 'Machine Learning', 'Image Processing', 'Automation'],
    imageUrl: '/projects/RuGrow/Screenshot 2026-10-12 115720.png',
    category: 'IoT & Machine Learning',
    contributors: ['Project Team Members'],
    githubUrl: '',
    linkedInUrl: 'https://lnkd.in/p/gSHrp865',
    liveUrl: 'https://youtu.be/uHmxOS7jr5s?si=yD5XBm7BjXX6NTsC',
    youtubeUrl: 'https://youtu.be/uHmxOS7jr5s?si=yD5XBm7BjXX6NTsC',
    createdAt: '2026-01-25T00:00:00.000Z',
    updatedAt: '2026-01-25T00:00:00.000Z',
  },
  {
    id: 'brandorax',
    title: 'BrandoraX – Full-Stack Online Retail & Clothing Platform',
    description: 'BrandoraX is a full-stack e-commerce web application independently developed as an online retail and clothing platform. Built using React.js, Node.js, Express.js, and MySQL, the system features a responsive user interface, RESTful APIs, secure user authentication, protected routes, and optimized database operations. It incorporates bcrypt password hashing, SQL injection prevention, and relational database design to provide a secure, efficient, and maintainable shopping platform.',
    technologies: ['React.js', 'Node.js', 'Express.js', 'MySQL', 'JavaScript', 'bcrypt', 'SQL'],
    imageUrl: '/projects/BandoraX/Screenshot 2026-10-12 120331.png',
    category: 'Web Development',
    contributors: ['Individual Project (Sole Developer)'],
    githubUrl: '',
    linkedInUrl: '',
    liveUrl: '',
    createdAt: '2026-01-20T00:00:00.000Z',
    updatedAt: '2026-01-20T00:00:00.000Z',
  },
  {
    id: 'elechub',
    title: 'ELEC-HUB – Integrated Electrical Installation Design Platform',
    description: 'ELEC-HUB is an integrated electrical installation design platform developed by undergraduates of the Department of Electrical and Information Engineering, Faculty of Engineering, University of Ruhuna. It brings load calculations, BS 7671-based circuit breaker and cable selection with documented verification, standard-symbol single-line diagrams, 3D cable installation visualisation, engineer’s estimates, and project management into one environment. Designed to make electrical design faster, more transparent, and accessible to engineers and students across Sri Lanka. Launching soon.',
    technologies: ['Electrical Installation Design', 'BS 7671', 'Load Calculations', 'Circuit Breaker Selection', 'Cable Sizing', 'Single-Line Diagrams', '3D Visualisation'],
    imageUrl: '/projects/Elechub/Screenshot 2026-10-12 121221.png',
    category: 'Electrical Engineering',
    contributors: ['Dept. of Electrical and Information Engineering, University of Ruhuna'],
    githubUrl: '',
    linkedInUrl: 'https://lnkd.in/p/gYh-aVZM',
    liveUrl: 'https://youtu.be/mR8PdD_89KQ?si=V_WeSij0OBiD5f8S',
    youtubeUrl: 'https://youtu.be/mR8PdD_89KQ?si=V_WeSij0OBiD5f8S',
    createdAt: '2026-01-15T00:00:00.000Z',
    updatedAt: '2026-01-15T00:00:00.000Z',
  },
  {
    id: 'ims',
    title: 'Internship Management System',
    description: 'The Internship Management System is a web-based platform developed to digitize and streamline internship-related activities for the Faculty of Engineering and the Engineering Education Center. The system provides a centralized platform for managing students, staff members, company partnerships, internship opportunities, applications, approvals, official letters, documents, and reports. It reduces manual paperwork, improves communication between students, companies, and administrators, and provides a more organized and transparent internship management process. The application consists of a secure Spring Boot REST API backend and a Next.js frontend with role-based access control and JWT authentication.',
    technologies: ['Next.js', 'Spring Boot', 'Java', 'REST API', 'JWT Authentication', 'PostgreSQL', 'Tailwind CSS'],
    imageUrl: '/projects/ims/Screenshot 2026-10-12 121441.png',
    category: 'Web Development',
    contributors: ['Faculty of Engineering & EEC Team'],
    githubUrl: '',
    linkedInUrl: '',
    liveUrl: '',
    createdAt: '2026-01-10T00:00:00.000Z',
    updatedAt: '2026-01-10T00:00:00.000Z',
  },
]

export default STATIC_PROJECTS
