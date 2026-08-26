import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Nagla Padam Vikas Samiti database...');

  // 1. Create Admin User
  const adminUser = await prisma.user.upsert({
    where: { phone: '9999999999' },
    update: {},
    create: {
      phone: '9999999999',
      email: 'admin@npvs.org.in',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
    },
  });

  // 2. Create Sample Approved Members
  const member1User = await prisma.user.upsert({
    where: { phone: '9876543210' },
    update: {},
    create: {
      phone: '9876543210',
      email: 'ramesh.kumar@example.com',
      role: 'MEMBER',
      status: 'ACTIVE',
    },
  });

  await prisma.member.upsert({
    where: { userId: member1User.id },
    update: {},
    create: {
      userId: member1User.id,
      memberId: 'NPVS-2024-0001',
      fullName: 'Ramesh Kumar',
      guardianName: 'Shri Ram Prasad',
      dateOfBirth: new Date('1980-05-15'),
      gender: 'male',
      village: 'Nagla Padam',
      address: 'Main Basti, Nagla Padam, Aligarh - 202001',
      education: 'Graduate (B.A.)',
      skills: 'Agriculture, Community Organizing, Event Management',
      occupation: 'Farmer & Social Worker',
      designation: 'Senior Committee Member',
      membershipType: 'Member',
      status: 'APPROVED',
      qrToken: 'NPVS-2024-0001-TOKENXYZ1',
      joiningDate: new Date('2022-01-15'),
    },
  });

  const member2User = await prisma.user.upsert({
    where: { phone: '9876500002' },
    update: {},
    create: {
      phone: '9876500002',
      email: 'meena.bai@example.com',
      role: 'MEMBER',
      status: 'ACTIVE',
    },
  });

  await prisma.member.upsert({
    where: { userId: member2User.id },
    update: {},
    create: {
      userId: member2User.id,
      memberId: 'NPVS-2024-0002',
      fullName: 'Meena Bai',
      guardianName: 'Late Shri Mohan Lal',
      dateOfBirth: new Date('1985-08-20'),
      gender: 'female',
      village: 'Nagla Padam',
      address: 'Near Primary School, Nagla Padam',
      education: '12th Pass',
      skills: 'Women Empowerment, Handicrafts, Education',
      occupation: 'Self-Employed',
      designation: 'Women Cell Coordinator',
      membershipType: 'Volunteer',
      status: 'APPROVED',
      qrToken: 'NPVS-2024-0002-TOKENXYZ2',
      joiningDate: new Date('2023-03-10'),
    },
  });

  const member3User = await prisma.user.upsert({
    where: { phone: '9876500003' },
    update: {},
    create: {
      phone: '9876500003',
      email: 'suresh.sharma@example.com',
      role: 'MEMBER',
      status: 'ACTIVE',
    },
  });

  await prisma.member.upsert({
    where: { userId: member3User.id },
    update: {},
    create: {
      userId: member3User.id,
      memberId: 'NPVS-2024-0003',
      fullName: 'Suresh Sharma',
      guardianName: 'Shri Om Prakash',
      dateOfBirth: new Date('1992-11-05'),
      gender: 'male',
      village: 'Nagla Padam',
      address: 'Sector 2, Nagla Padam',
      education: 'Diploma in Electrical',
      skills: 'Sports Organizing, Youth Mobilization, Electrical Work',
      occupation: 'Electrician',
      designation: 'Youth Sports Incharge',
      membershipType: 'Volunteer',
      status: 'APPROVED',
      qrToken: 'NPVS-2024-0003-TOKENXYZ3',
      joiningDate: new Date('2023-08-22'),
    },
  });

  // 3. Create Sample Pending Applications
  const pendingApps = [
    {
      fullName: 'Sunita Devi',
      guardianName: 'Dinesh Chandra',
      dateOfBirth: new Date('1990-04-12'),
      gender: 'female',
      mobile: '9811122233',
      email: 'sunita.devi@example.com',
      village: 'Nagla Padam',
      address: 'North Street, Nagla Padam',
      education: 'B.Ed, M.A. Hindi',
      skills: 'Teaching, Social Work',
      requestedRole: 'Volunteer',
      reason: 'I want to volunteer teaching basic Hindi and English to primary school students in our village.',
      status: 'PENDING',
    },
    {
      fullName: 'Vikas Singh',
      guardianName: 'Maheshwar Singh',
      dateOfBirth: new Date('1998-09-25'),
      gender: 'male',
      mobile: '9822233344',
      email: 'vikas.singh@example.com',
      village: 'Nagla Padam',
      address: 'West Quarter, Nagla Padam',
      education: 'B.Sc Agriculture',
      skills: 'Modern Farming Techniques, Organic Compost',
      requestedRole: 'Member',
      reason: 'I wish to organize free farmer guidance workshops for better crop yield and solar pump adoption.',
      status: 'PENDING',
    },
  ];

  for (const app of pendingApps) {
    const existing = await prisma.membershipApplication.findFirst({
      where: { mobile: app.mobile },
    });
    if (!existing) {
      await prisma.membershipApplication.create({ data: app });
    }
  }

  // 4. Create Sample Community Events
  const sampleEvents = [
    {
      title: 'Annual Village Vikas Mela & Cultural Evening',
      description: 'Grand annual gathering featuring cultural folk dances, felicitations of meritorious students, and village development planning session with all residents.',
      category: 'Cultural & Community',
      venue: 'Gram Panchayat Ground, Nagla Padam',
      date: new Date('2026-10-15T10:00:00.000Z'),
      startTime: '10:00 AM',
      endTime: '6:00 PM',
      capacity: 300,
      status: 'PUBLISHED',
    },
    {
      title: 'Free Health & Eye Checkup Camp',
      description: 'Collaborative medical camp with district doctors providing free general medicine checkups, eye screenings, and distribution of free spectacles and basic medicines.',
      category: 'Healthcare',
      venue: 'Primary School Campus, Nagla Padam',
      date: new Date('2026-09-20T09:00:00.000Z'),
      startTime: '09:00 AM',
      endTime: '2:00 PM',
      capacity: 200,
      status: 'PUBLISHED',
    },
    {
      title: 'Inter-Village Kabaddi & Cricket Tournament',
      description: 'Annual youth sports tournament bringing together teams from Nagla Padam and adjacent villages to foster teamwork and fitness.',
      category: 'Sports',
      venue: 'Sports Ground, Nagla Padam',
      date: new Date('2026-11-05T08:00:00.000Z'),
      startTime: '08:00 AM',
      endTime: '5:00 PM',
      capacity: 500,
      status: 'PUBLISHED',
    },
    {
      title: 'Clean Village Green Village Tree Plantation Drive',
      description: 'Community volunteer drive to plant 500+ fruit and shade saplings along village roads and canal banks.',
      category: 'Environment',
      venue: 'Canal Road & Basti Periphery',
      date: new Date('2026-08-30T07:30:00.000Z'),
      startTime: '07:30 AM',
      endTime: '12:00 PM',
      capacity: 150,
      status: 'PUBLISHED',
    },
  ];

  for (const ev of sampleEvents) {
    const existing = await prisma.event.findFirst({
      where: { title: ev.title },
    });
    if (!existing) {
      await prisma.event.create({ data: ev });
    }
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
