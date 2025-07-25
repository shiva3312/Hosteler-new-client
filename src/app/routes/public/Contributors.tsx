import { Container, Title, Image, Grid, Tooltip } from '@mantine/core';
import { z } from 'zod';

export const ContributorSchema = z.object({
  name: z.string(),
  profilePic: z.string().url(), // assuming it's a URL
});

export type Contributor = z.infer<typeof ContributorSchema>;

const contributors: Contributor[] = [
  {
    name: 'Contributor 1',
    profilePic: 'https://img.icons8.com/?size=100&id=Wfmeg9dVsvca&format=png&color=000000', // Replace with actual image URL
  },
  {
    name: 'Contributor 2',
    profilePic: 'https://img.icons8.com/?size=100&id=Wfmeg9dVsvca&format=png&color=000000', // Replace with actual image URL
  },
  {
    name: 'Contributor 3',
    profilePic: 'https://img.icons8.com/?size=100&id=Wfmeg9dVsvca&format=png&color=000000', // Replace with actual image URL
  },
  {
    name: 'Contributor 4',
    profilePic: 'https://img.icons8.com/?size=100&id=Wfmeg9dVsvca&format=png&color=000000', // Replace with actual image URL
  },
  {
    name: 'Contributor 5',
    profilePic: 'https://img.icons8.com/?size=100&id=Wfmeg9dVsvca&format=png&color=000000', // Replace with actual image URL
  },
  {
    name: 'Contributor 6',
    profilePic: 'https://img.icons8.com/?size=100&id=Wfmeg9dVsvca&format=png&color=000000', // Replace with actual image URL
  },
  {
    name: 'Contributor 7',
    profilePic: 'https://img.icons8.com/?size=100&id=Wfmeg9dVsvca&format=png&color=000000', // Replace with actual image URL
  },
  {
    name: 'Contributor 8',
    profilePic: 'https://img.icons8.com/?size=100&id=Wfmeg9dVsvca&format=png&color=000000', // Replace with actual image URL
  }
];

const Contributors = () => {
  return (
    <Container size="lg" className="py-12">
      <Title order={1} className="text-center py-5">
        Our Contributors
      </Title>
      <Grid>
        {contributors.map((contributor, index) => (
          <Grid.Col key={index} span={{ base: 12, sm: 6, md: 4, lg: 3, xl: 2 }} className="flex justify-center">
            <Tooltip label={contributor.name} position="top" withArrow>
              <Image
                src={contributor.profilePic}
                alt={contributor.name}
                radius="full"
                className="w-16 h-16 object-cover cursor-pointer"
              />
            </Tooltip>
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
};

export default Contributors