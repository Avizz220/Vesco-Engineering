export interface Course {
  id: string
  title: string
  category: string
  instructor: string
  duration: string
  level: string
  price: string
  description: string
  imageUrl: string | null
  learningOutcomes: string[]
  createdAt: string
  updatedAt: string
}

export const STATIC_COURSES: Course[] = [
  {
    id: '1',
    title: 'Embedded Systems & Microcontroller Firmware',
    category: 'Embedded Systems',
    instructor: 'Vesco Engineering Team',
    duration: '8 Weeks',
    level: 'Intermediate',
    price: 'Free / Internal',
    description: 'Comprehensive hands-on training on STM32, ESP32, bare-metal C, and RTOS development for modern embedded hardware.',
    imageUrl: '/projects/MealIO/Screenshot 2026-10-12 114846.png',
    learningOutcomes: [
      'STM32 and ARM Cortex-M architecture',
      'FreeRTOS task management and synchronization',
      'Peripheral communication (I2C, SPI, UART, CAN)',
      'Low power optimization and hardware debugging'
    ],
    createdAt: '2025-01-10T00:00:00.000Z',
    updatedAt: '2025-01-10T00:00:00.000Z',
  },
  {
    id: '2',
    title: 'IoT Architecture & Cloud Edge Integration',
    category: 'IoT & Machine Learning',
    instructor: 'Vesco Engineering Team',
    duration: '6 Weeks',
    level: 'Intermediate',
    price: 'Free / Internal',
    description: 'Master end-to-end IoT sensor nodes, MQTT telemetry, telemetry pipelines, and edge machine learning deployment.',
    imageUrl: '/projects/RuGrow/Screenshot 2026-10-12 115720.png',
    learningOutcomes: [
      'Edge sensor telemetry and data acquisition',
      'MQTT / HTTP secure data transport',
      'Cloud dashboards and time-series analytics',
      'Edge impulse and lightweight ML inference'
    ],
    createdAt: '2025-02-15T00:00:00.000Z',
    updatedAt: '2025-02-15T00:00:00.000Z',
  },
  {
    id: '3',
    title: 'PCB Design & Hardware Prototyping',
    category: 'Electrical Engineering',
    instructor: 'Vesco Engineering Team',
    duration: '6 Weeks',
    level: 'Beginner to Advanced',
    price: 'Free / Internal',
    description: 'From schematic capture to multi-layer PCB layout, signal integrity routing, and fabrication-ready Gerber generation.',
    imageUrl: '/projects/Elechub/Screenshot 2026-10-12 121221.png',
    learningOutcomes: [
      'Schematic capture and component selection',
      'Multi-layer routing and ground planes',
      'Design for Manufacturability (DFM)',
      'SMD assembly and laboratory testing'
    ],
    createdAt: '2025-03-01T00:00:00.000Z',
    updatedAt: '2025-03-01T00:00:00.000Z',
  }
]

export default STATIC_COURSES
