//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import {
  Container,
  Title,
  Text,
  Image,
  Grid,
  Button,
  Group,
} from '@mantine/core';
import React from 'react';

function AboutPage() {
  return (
    <Container size="md" style={{ padding: '40px 0' }}>
      <Title order={1} mb="xl">
        About Us
      </Title>

      <Grid>
        <Grid.Col span={12}>
          <Image
            src="https://via.placeholder.com/200"
            alt="About Us"
            radius="md"
            style={{ maxHeight: '100px', objectFit: 'cover' }}
          />
        </Grid.Col>

        <Grid.Col span={12}>
          <Text size="lg" lineClamp={6} mb="md">
            We are a passionate team committed to building the best experience
            for our users. Our mission is to deliver high-quality products and
            services that meet the needs of our customers. We believe in
            continuous improvement, innovation, and fostering a culture of
            collaboration.
          </Text>

          <Group>
            <Button variant="outline" color="blue" size="lg">
              Learn More
            </Button>
          </Group>
        </Grid.Col>
      </Grid>

      <Title order={2} mt="xl">
        Our Vision
      </Title>
      <Text size="lg" mt="sm">
        Our vision is to become the leading provider in our industry,
        continuously innovating and adapting to the needs of our customers.
      </Text>
    </Container>
  );
}

export default AboutPage;
