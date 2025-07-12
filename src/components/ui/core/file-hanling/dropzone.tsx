//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { Box, Button, Group, Text, useMantineTheme } from '@mantine/core';
import { Dropzone, MIME_TYPES } from '@mantine/dropzone';
import { IconCloudUpload, IconDownload, IconX } from '@tabler/icons-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { ImageSize } from '@/interfaces/enums';
import { ImageUploadRequestZodSchema } from '@/interfaces/user.interface';
import { useUploadImage } from '@/lib/api/user/upload-image';

import classes from './dropzone.module.css';
import { UserProfileImage } from './user-image';
import { useNotifications } from '../notifications';

interface DropzoneButtonProps {
  onDropAutoUpload?: boolean;
  triggerUpload?: boolean;
  userId?: string;
  size?: ImageSize;
  imageUrl?: string;
}

export function DropzoneButton(props: DropzoneButtonProps) {
  const theme = useMantineTheme();
  const openRef = useRef<() => void>(null);
  const fileReference = useRef<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  // const { data: me } = useMe(); // Assuming you have a hook to get the current user
  const { addNotification } = useNotifications();

  const { mutate: uploadImage } = useUploadImage({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Image uploaded successfully!',
          message: 'Your profile image has been updated.',
        });
      },
      onError: (error) => {
        addNotification({
          type: 'error',
          title: 'Upload Failed',
          message: error.message || 'An error occurred during upload.',
        });
      },
    },
  });

  const handleUpload = useCallback(() => {
    if (fileReference.current && props.userId)
      uploadImage({ userId: props.userId ?? '', file: fileReference.current });
  }, [props.userId, uploadImage]);

  useEffect(() => {
    // If triggerUpload is true, automatically open the dropzone
    if (props.triggerUpload && fileReference.current) {
      handleUpload();
    }
  }, [handleUpload, preview, props.triggerUpload]);

  const handleDrop = (files: File[]) => {
    const file = files[0];
    if (!file) {
      alert('No file selected.');
      return;
    }

    // Validate file metadata using Zod
    const fileMetadata = {
      mimetype: file.type,
      size: file.size,
      originalname: file.name,
    };

    try {
      ImageUploadRequestZodSchema.parse(fileMetadata);

      // Reset preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Store the file reference
      fileReference.current = file;
    } catch (error: any) {
      console.error('Validation Error:', error.errors);
      alert(error.errors?.[0]?.message || 'Invalid file');
      return;
    }

    if (props.onDropAutoUpload) {
      // Automatically upload the file if onDropAutoUpload is true
      handleUpload();
    }
  };

  return (
    <Box style={{ width: '150px', height: '150px' }}>
      <div className={classes.wrapper}>
        <Dropzone
          openRef={openRef}
          onDrop={handleDrop}
          className={classes.dropzone}
          radius="xl"
          accept={[MIME_TYPES.pdf, MIME_TYPES.png, MIME_TYPES.jpeg]}
          maxSize={3 * 1024 ** 2} // Updated to 3MB
        >
          <Box style={{ pointerEvents: 'none' }}>
            {props.imageUrl || preview ? (
              <UserProfileImage
                url={preview ?? props.imageUrl ?? undefined}
                type={props.size ?? ImageSize.Medium}
                modifyUrl={!preview}
              />
            ) : (
              <>
                <Group justify="center">
                  <Dropzone.Accept>
                    <IconDownload
                      size={40}
                      color={theme.colors.blue[6]}
                      stroke={1.5}
                    />
                  </Dropzone.Accept>
                  <Dropzone.Reject>
                    <IconX size={40} color={theme.colors.red[6]} stroke={1.5} />
                  </Dropzone.Reject>
                  <Dropzone.Idle>
                    <IconCloudUpload
                      size={40}
                      stroke={1.5}
                      className={classes.icon}
                    />
                  </Dropzone.Idle>
                </Group>

                <Text ta="center" fw={700} fz="sm" mt="sm">
                  <Dropzone.Accept>Drop files here</Dropzone.Accept>
                  <Dropzone.Reject>
                    PDF or Image file less than 3MB
                  </Dropzone.Reject>
                </Text>

                <Text className={classes.description}>
                  Drag&apos;n&apos;drop file.
                </Text>
              </>
            )}
          </Box>
          <Button
            className={classes.control}
            size="compact-xs"
            radius="xl"
            onClick={() => openRef.current?.()}
          >
            Select file
          </Button>
        </Dropzone>
      </div>
    </Box>
  );
}
