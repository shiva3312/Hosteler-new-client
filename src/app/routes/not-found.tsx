//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { Button, Container, Group, Text, Title } from '@mantine/core';

import { paths } from '@/config/paths';

import classes from './not-found.module.css';

function NotFoundTitle() {
  return (
    <Container className={classes.root}>
      <Text className={classes.label}>404</Text>
      <Title className={classes.title}>You have found a secret place.</Title>
      <Text c="dimmed" size="lg" ta="center" className={classes.description}>
        Unfortunately, this is only a 404 page. You may have mistyped the
        address, or the page has been moved to another URL.
      </Text>
      <Group justify="center">
        <Button
          variant="subtle"
          size="md"
          onClick={() => (window.location.href = paths.app.dashboard.getHref())}
        >
          Take me back to home page
        </Button>
      </Group>
    </Container>
  );
}

export default NotFoundTitle;
