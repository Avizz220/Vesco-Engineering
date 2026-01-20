import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@vesco.com' },
    update: {},
    create: {
      email: 'admin@vesco.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  })

  console.log('✅ Created admin user:', admin.email)

  // Create sample projects
  const projects = [
    {
      title: 'Autonomous Robot',
      description: 'An autonomous navigation robot using computer vision and machine learning for obstacle detection and path planning.',
      technologies: ['Python', 'ROS', 'OpenCV', 'TensorFlow'],
      category: 'Robotics',
      featured: true,
    },
    {
      title: 'IoT Smart Home System',
      description: 'Complete smart home automation system with mobile app control and voice commands integration.',
      technologies: ['Arduino', 'React Native', 'Firebase', 'MQTT'],
      category: 'IoT',
      featured: true,
    },
    {
      title: 'AI-Powered Chatbot',
      description: 'Natural language processing chatbot for customer service automation using transformer models.',
      technologies: ['Python', 'FastAPI', 'Hugging Face', 'PostgreSQL'],
      category: 'AI/ML',
      featured: false,
    },
  ]

  for (const project of projects) {
    await prisma.project.create({
      data: project,
    })
  }

  console.log('✅ Created sample projects')

  // Create sample achievements
  const achievements = [
    {
      title: 'National Robotics Competition',
      description: 'Won first place in the autonomous navigation challenge at the National Robotics Competition.',
      date: new Date('2025-09-15'),
      position: '1st Place',
      competition: 'National Robotics Competition 2025',
    },
    {
      title: 'IEEE Innovation Challenge',
      description: 'Secured second place in the IEEE Innovation Challenge with our IoT-based solution.',
      date: new Date('2025-06-20'),
      position: '2nd Place',
      competition: 'IEEE Innovation Challenge 2025',
    },
  ]

  for (const achievement of achievements) {
    await prisma.achievement.create({
      data: achievement,
    })
  }

  console.log('✅ Created sample achievements')

  // Create sample team members
  const teamMembers = [
    {
      name: 'John Doe',
      role: 'Team Lead',
      bio: 'Passionate about robotics and AI. Leading the VESCO team since 2024.',
      email: 'john.doe@vesco.com',
    },
    {
      name: 'Jane Smith',
      role: 'Software Engineer',
      bio: 'Full-stack developer specializing in IoT and web applications.',
      email: 'jane.smith@vesco.com',
    },
    {
      name: 'Mike Johnson',
      role: 'Hardware Engineer',
      bio: 'Expert in embedded systems and circuit design.',
      email: 'mike.johnson@vesco.com',
    },
  ]

  for (const member of teamMembers) {
    await prisma.teamMember.create({
      data: member,
    })
  }

  console.log('✅ Created sample team members')
  console.log('🎉 Database seed completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
