import { Container, Title, Text, Image, Grid, Card } from '@mantine/core';
import { z } from 'zod';

export const ContributorSchema = z.object({
  name: z.string(),
  designation: z.string(),
  contributions: z.string(),
  profilePic: z.string().url(), // assuming it's a URL
});

export type Contributor = z.infer<typeof ContributorSchema>;

const contributors: Contributor[] = [
  {
    name: 'Shivam Chaurasia',
    designation: 'Lead Developer',
    contributions: 'Designed core architecture, implemented authentication system, and led UI/UX development.',
    profilePic: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCAvE4NQuOnrjboZSCZCOfDv7ry3l4yysuLg&s',
  },
  {
    name: 'Nabi Mondal',
    designation: 'Frontend Developer',
    contributions: 'Developed responsive UI components and integrated Tailwind CSS for styling.',
    profilePic: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCAvE4NQuOnrjboZSCZCOfDv7ry3l4yysuLg&s',
  },
  {
    name: 'Mr ABC',
    designation: 'Backend Developer',
    contributions: 'Built RESTful APIs, optimized database queries, and ensured server-side security.',
    profilePic: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCAvE4NQuOnrjboZSCZCOfDv7ry3l4yysuLg&s',
  },
];

const Contributors = () => {
  return (
    <Container size="lg" className="py-12">
      <Title order={1} className="text-center py-5">
        Our Contributors
      </Title>
      <Grid>
        {contributors.map((contributor, index) => (
          <Grid.Col key={index} span={{ base: 12, md: 6, lg: 4 }}>
            <Card
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              className="flex flex-col items-center"
            >
              <div className="flex items-center mb-4 w-full">
                <Image
                  src={contributor.profilePic}
                  alt={contributor.name}
                  radius="full"
                  className="w-16 h-16 mr-4 object-cover"
                />
                <div className="text-left">
                  <Title order={3} className="text-gray-800">
                    {contributor.name}
                  </Title>
                  <Text size="sm" c="dimmed">
                    {contributor.designation}
                  </Text>
                </div>
              </div>
              <Text size="sm" c="gray" className="text-left">
                {contributor.contributions}
              </Text>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
};

export default Contributors
