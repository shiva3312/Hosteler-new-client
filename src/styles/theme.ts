//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.

import {
  createTheme,
  Button,
  Title,
  Checkbox,
  NumberFormatter,
  Select,
  Tooltip,
  ActionIcon,
  TextInput,
  MultiSelect,
  PasswordInput,
} from '@mantine/core';
import { DateInput, TimeInput } from '@mantine/dates';

export const theme = createTheme({
  cursorType: 'pointer',
  components: {
    // Define your extended components with default props here
    TimeInput: TimeInput.extend({
      defaultProps: {
        formTarget: 'time',
        placeholder: 'Select a time',
      },
    }),
    Button: Button.extend({
      defaultProps: {
        // color: '#00ad73',
        variant: 'filled',

        radius: 'sm',
      },
    }),
    DateInput: DateInput.extend({
      defaultProps: {
        clearable: true,
        valueFormat: 'DD/MM/YYYY',
        placeholder: 'Select a date',
      },
    }),
    ActionIcon: ActionIcon.extend({
      defaultProps: {
        variant: 'light',
      },
    }),
    TextInput: TextInput.extend({
      defaultProps: {
        autoComplete: 'off',
      },
    }),
    PasswordInput: PasswordInput.extend({
      defaultProps: {
        autoComplete: 'off',
      },
    }),
    Title: Title.extend({
      defaultProps: {
        fz: '20',
      },
    }),
    Checkbox: Checkbox.extend({
      defaultProps: {
        labelPosition: 'right',
      },
    }),
    NumberFormatter: NumberFormatter.extend({
      defaultProps: {
        suffix: ' Rs.',
        decimalScale: 2,
        thousandSeparator: true,
      },
    }),
    MultiSelect: MultiSelect.extend({
      defaultProps: {
        searchable: true,
      },
    }),
    Select: Select.extend({
      defaultProps: {
        comboboxProps: {
          transitionProps: {
            transition: 'pop',
            duration: 200,
          },
        },
        allowDeselect: false,
        required: true,
        searchable: true,
        nothingFoundMessage: 'Nothing found...',
      },
    }),
    ToolTip: Tooltip.extend({
      defaultProps: {
        color: 'transparent',
        arrowSize: 4,
        withArrow: true,
        transitionProps: { transition: 'fade', duration: 200 },
      },
    }),
  },

  colors: {
    mainColor: [
      '#ebfff8',
      '#d6fdf0',
      '#a7fde0',
      '#76fdcd',
      '#55fdbe',
      '#46fdb6',
      '#3dfdb1',
      '#31e29a',
      '#23c888',
      '#00ad73',
    ],
    warning: [
      '#fff1e1',
      '#ffe1cb',
      '#ffc29a',
      '#ffa263',
      '#ff8636',
      '#ff7418',
      '#ff6a06',
      '#e45900',
      '#cb4e00',
      '#b14100',
    ],
    success: [
      '#e5feee',
      '#d2f9e0',
      '#a8f1c0',
      '#7aea9f',
      '#53e383',
      '#3bdf70',
      '#2bdd66',
      '#1ac455',
      '#0caf49',
      '#00963c',
    ],
    info: [
      '#fff0e4',
      '#ffe0cf',
      '#fac0a1',
      '#f69e6e',
      '#f28043',
      '#f06d27',
      '#f06418',
      '#d6530c',
      '#bf4906',
      '#a73c00',
    ],
    error: [
      '#ffe9e9',
      '#ffd1d1',
      '#fba0a1',
      '#f76d6d',
      '#f34141',
      '#f22625',
      '#f21616',
      '#d8070b',
      '#c10008',
      '#a90003',
    ],
  },
  fontFamily: 'Montserrat, sans-serif',
  defaultRadius: 'sm',
});
