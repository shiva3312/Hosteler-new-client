//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { Button, Group, Menu } from '@mantine/core';
import {
  IconCheck,
  IconUser,
  IconBan,
  IconCircle,
  IconCircleOff,
  IconCircleCheck,
} from '@tabler/icons-react';
import React from 'react';

import { GeneralAction } from '@/data/feature';
import { MealStatus, UserStatus } from '@/interfaces/enums';
import { UserResponse } from '@/interfaces/user.interface';
import { useUserBulkAction } from '@/lib/api/user/bulk-action';

import { DeleteUser } from './delete-user';
import { useNotifications } from '../core/notifications';

type BulkActionsProps = {
  selectedRows: UserResponse[];
  onSuccess?: () => void;
};

const bulkActions = [
  {
    label: 'Set Meal Active',
    action: MealStatus.Active,
    group: 'Meal Status',
    color: 'green',
    icon: <IconCircleCheck size={16} />,
  },
  {
    label: 'Set Meal Inactive',
    action: MealStatus.Inactive,
    group: 'Meal Status',
    color: 'orange',
    icon: <IconCircleOff size={16} />,
  },
  {
    label: 'Set Meal Disabled',
    action: MealStatus.Disabled,
    group: 'Meal Status',
    color: 'red',
    icon: <IconCircle size={16} />,
  },
  {
    label: 'Set User Active',
    action: UserStatus.Active,
    group: 'User Status',
    color: 'green',
    icon: <IconUser size={16} />,
  },
  {
    label: 'Set User Inactive',
    action: UserStatus.Inactive,
    group: 'User Status',
    color: 'orange',
    icon: <IconCircleOff size={16} />,
  },
  {
    label: 'Set User Disabled',
    action: UserStatus.Disabled,
    group: 'User Status',
    color: 'red',
    icon: <IconCircle size={16} />,
  },
  {
    label: 'Set User Banned',
    action: UserStatus.Banned,
    group: 'User Status',
    color: 'black',
    icon: <IconBan size={16} />,
  },
];

export const BulkActions = ({ selectedRows, ...props }: BulkActionsProps) => {
  const { addNotification } = useNotifications();

  const userBulkAction = useUserBulkAction({
    mutationConfig: {
      onSuccess: () => {
        if (props?.onSuccess) {
          props.onSuccess();
        }
        addNotification({
          type: 'success',
          title: 'Updated successfully',
        });
      },
    },
  });

  const handleBulkAction = (action: string, type: string = '') => {
    let key = '';
    if (type === 'Meal Status') key = 'meal';
    else if (type === 'User Status') key = 'status';

    switch (`${action}${key}`) {
      case `${UserStatus.Active}status`:
      case `${UserStatus.Inactive}status`:
      case `${UserStatus.Disabled}status`:
      case `${UserStatus.Banned}status`:
        userBulkAction.mutate({
          action: GeneralAction.UPDATE,
          data: selectedRows.map((s) => ({
            _id: s._id,
            status: action as UserStatus,
          })),
        });
        break;

      case `${MealStatus.Active}meal`:
      case `${MealStatus.Inactive}meal`:
      case `${MealStatus.Disabled}meal`:
        userBulkAction.mutate({
          action: GeneralAction.UPDATE,
          data: selectedRows.map((s) => ({
            _id: s._id,
            mealStatus: action as MealStatus,
          })),
        });
        break;

      // case 'delete':
      //   userBulkAction.mutate({
      //     action: GeneralAction.DELETE,
      //     data: selectedRows.map((s) => ({
      //       _id: s._id,
      //     })),
      //   });
      //   break;
      case 'approve':
        userBulkAction.mutate({
          action: GeneralAction.UPDATE,
          data: selectedRows.map((s) => ({
            _id: s._id,
            isVerified: true,
          })),
        });
        break;
    }
  };

  return (
    <Group>
      <Button
        color="green"
        variant="light"
        disabled={selectedRows.length === 0}
        leftSection={<IconCheck size={16} />}
        onClick={() => handleBulkAction('approve')}
      >
        Approve {selectedRows.length > 0 ? `(${selectedRows.length})` : ''}
      </Button>
      <DeleteUser users={selectedRows} variant="default" />
      <Menu
        shadow="md"
        withArrow
        position="right-start"
        disabled={selectedRows.length === 0}
      >
        <Menu.Target>
          <Button variant="outline">More actions</Button>
        </Menu.Target>
        <Menu.Dropdown>
          {['Meal Status', 'User Status'].map((group, idx) => (
            <React.Fragment key={group}>
              <Menu.Label>{group}</Menu.Label>
              {bulkActions
                .filter((a) => a.group === group)
                .map((a) => (
                  <Menu.Item
                    leftSection={a.icon}
                    color={a.color}
                    key={a.action}
                    onClick={() => handleBulkAction(a.action, a.group)}
                  >
                    {a.label}
                  </Menu.Item>
                ))}
              {idx === 0 && <Menu.Divider />}
            </React.Fragment>
          ))}
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
};
