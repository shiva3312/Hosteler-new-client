//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { Container, Grid, Card, Text, Title, Paper } from '@mantine/core';
import {
  IconUsers,
  IconFolder,
  IconShoppingCart,
  IconFileText,
} from '@tabler/icons-react';

function Dashboard() {
  return (
    <Container>
      <Title order={1}>Dashboard</Title>

      {/* Stats Section */}
      <Grid gutter="md" my="lg">
        <Grid.Col span={6}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section>
              <IconUsers size={48} color="blue" />
            </Card.Section>
            <Text size="lg" fw={500}>
              1500 Users
            </Text>
          </Card>
        </Grid.Col>

        <Grid.Col span={6}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section>
              <IconFolder size={48} color="green" />
            </Card.Section>
            <Text size="lg" fw={500}>
              120 Projects
            </Text>
          </Card>
        </Grid.Col>

        <Grid.Col span={6}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section>
              <IconShoppingCart size={48} color="orange" />
            </Card.Section>
            <Text size="lg" fw={500}>
              $12,500 Sales
            </Text>
          </Card>
        </Grid.Col>

        <Grid.Col span={6}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section>
              <IconFileText size={48} color="red" />
            </Card.Section>
            <Text size="lg" fw={500}>
              75 Reports
            </Text>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Recent Activity Section */}
      <Paper shadow="sm" p="lg" radius="md" my="lg">
        <Title order={3}>Recent Activity</Title>
        <Text size="sm">No recent activities to display</Text>
      </Paper>

      {/* Your additional sections can go here */}
    </Container>
  );
}

export default Dashboard;
