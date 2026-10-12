export interface AchievementItem {
  id: string
  title: string
  description: string
  categories: string[]
  participants: string[]
  competition: string
  date: string
  imageUrl?: string
  linkedinUrl?: string
  createdAt: string
  updatedAt: string
}

export const STATIC_ACHIEVEMENTS: AchievementItem[] = [
  {
    id: '1',
    title: 'National Robotics Competition Champions',
    description: 'Secured 1st Place in the Autonomous Navigation & Robotics challenge at the National Robotics Competition.',
    categories: ['Robotics', 'AI', 'Automation'],
    participants: ['All Team Members'],
    competition: 'National Robotics Competition',
    date: '2025-09-15',
    imageUrl: '/projects/MealIO/Screenshot 2026-10-12 114846.png',
    linkedinUrl: 'https://linkedin.com',
    createdAt: '2025-09-15T00:00:00.000Z',
    updatedAt: '2025-09-15T00:00:00.000Z',
  },
  {
    id: '2',
    title: 'IEEE Innovation Challenge Runners Up',
    description: 'Won 2nd place in the IEEE Innovation Challenge with our IoT-based smart agricultural environmental system.',
    categories: ['IoT', 'Innovation', 'Hardware'],
    participants: ['All Team Members'],
    competition: 'IEEE Innovation Challenge',
    date: '2025-06-20',
    imageUrl: '/projects/RuGrow/Screenshot 2026-10-12 115720.png',
    linkedinUrl: 'https://linkedin.com',
    createdAt: '2025-06-20T00:00:00.000Z',
    updatedAt: '2025-06-20T00:00:00.000Z',
  },
]

export default STATIC_ACHIEVEMENTS
