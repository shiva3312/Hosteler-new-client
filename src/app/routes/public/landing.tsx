//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import {
  Container,
  Text,
  Card,
  SimpleGrid,
  ThemeIcon,
  Center,
  Image,
} from '@mantine/core';
import {
  IconBed,
  IconUsers,
  IconClipboardList,
  IconSoup,
} from '@tabler/icons-react';

import { SinglePageLayout } from '@/components/ui/core/layout/single-page-layout';

const features = [
  {
    icon: <IconClipboardList size={32} />,
    title: 'Attendance & Reports',
    description:
      'Track attendance and generate insightful reports for hostel operations.',
  },
  {
    icon: <IconSoup size={32} />,
    title: 'Mess Management',
    description:
      'Automate meal planning, attendance, and billing for hostel mess with ease.',
  },
  {
    icon: <IconBed size={32} />,
    title: 'Room Allocation',
    upcomming: true,
    description:
      'Efficiently assign and manage hostel rooms for all residents.',
  },
  {
    icon: <IconUsers size={32} />,
    title: 'Resident Profiles',
    upcomming: true,
    description:
      'Maintain detailed records and status of all hostel residents.',
  },
];

function LandingPage() {
  return (
    <SinglePageLayout>
      <Center>
        <Image
          src="/logo_no-background.png"
          alt="Hostelease Logo"
          radius="md"
          style={{ width: '120px', height: '120px', objectFit: 'cover' }}
        />
      </Center>

      <Container size="lg" py={'lg'} style={{ textAlign: 'center' }}>
        <Text size="lg" mb="xs" fw={600} c="blue">
          Manage your hostel like no one else!
        </Text>
        <Text size="xl" mb="xl" c="dimmed">
          The all-in-one platform for hostel administration, with a special
          focus on <b>mess management</b>. Streamline your daily operations,
          save time, and keep residents happy!
        </Text>

        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="lg" my="xl">
          {features.map((feature) => (
            <Card
              key={feature.title}
              shadow="md"
              padding="xl"
              radius="lg"
              withBorder
              style={{
                transition: 'transform 0.2s',
                cursor: feature.upcomming ? 'not-allowed' : 'pointer',
                background: feature.upcomming
                  ? 'linear-gradient(135deg, #f1f3f5 60%, #e9ecef 100%)'
                  : 'linear-gradient(135deg, #f8fafc 60%, #e3f6fd 100%)',
                opacity: feature.upcomming ? 0.7 : 1,
                position: 'relative',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = 'scale(1.05)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = 'scale(1)')
              }
            >
              {feature.upcomming && (
                <div
                  style={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    zIndex: 2,
                  }}
                >
                  <Text
                    size="xs"
                    fw={700}
                    c="dimmed"
                    style={{
                      background: '#e9ecef',
                      borderRadius: 8,
                      padding: '2px 10px',
                    }}
                  >
                    Upcoming Soon
                  </Text>
                </div>
              )}
              <ThemeIcon size={48} radius="md" color="blue" mb="md">
                {feature.icon}
              </ThemeIcon>
              <Text fw={700} mb={4}>
                {feature.title}
              </Text>
              <Text size="sm" c="dimmed">
                {feature.description}
              </Text>
            </Card>
          ))}
        </SimpleGrid>
      </Container>
    </SinglePageLayout>
  );
}

export default LandingPage;
