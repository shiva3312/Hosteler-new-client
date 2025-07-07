//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import {
  CloseButton,
  Combobox,
  Highlight,
  Loader,
  TextInput,
  useCombobox,
} from '@mantine/core';
import { useEffect, useState } from 'react';

interface ComboboxOption {
  value: string;
  label: string;
}
interface AsyncAutocompleteProps {
  label?: string;
  placeholder?: string;
  selected?: string | null;
  onChange: (value: string) => void;
  onSearch?: (query: string) => void; // Made onSearch optional
  data: ComboboxOption[];
  loading: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export function AsyncAutocompleteCombobox(props: AsyncAutocompleteProps) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const { data, loading, onSearch } = props;
  const [value, setValue] = useState(props.selected || ''); // Initialize with selected value
  const [filteredData, setFilteredData] = useState<ComboboxOption[]>([]); // State to hold filtered data

  useEffect(() => {
    // Initialize filteredData with the provided data prop
    if (data.length !== 0) setFilteredData(data);
  }, [data]);

  useEffect(() => {
    // Update value when props.selected changes
    setValue(props.selected || '');
  }, [props.selected]);

  const options = (filteredData || []).map((item) => (
    <Combobox.Option value={item.value} key={item.label}>
      <Highlight highlight={value} size="sm">
        {item.label}
      </Highlight>
    </Combobox.Option>
  ));

  const handleSearch = (query: string) => {
    if (onSearch) {
      onSearch(query); // Call the provided onSearch function
    } else {
      // Filter data locally if onSearch is not provided
      const filtered = data.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase()),
      );
      setFilteredData(filtered);
    }
  };

  return (
    <Combobox
      onOptionSubmit={(optionValue) => {
        setValue(optionValue);
        props.onChange(optionValue);
        combobox.closeDropdown();
      }}
      size="xs"
      withinPortal={false}
      store={combobox}
    >
      <Combobox.Target>
        <TextInput
          size={props.size || 'xs'}
          placeholder={props.placeholder || 'Search...'}
          value={
            data.find((item) => item.value === value)?.label || value // Show label if value matches, fallback to value
          }
          label={props.label}
          onChange={(event) => {
            const query = event.currentTarget.value;
            setValue(query); // Update the local `value` state
            handleSearch(query); // Use the handleSearch function
            combobox.resetSelectedOption();
            combobox.openDropdown();
          }}
          onClick={() => combobox.openDropdown()}
          onFocus={() => {
            combobox.openDropdown();
            if (data.length === 0) {
              handleSearch(value);
            }
          }}
          onBlur={() => {
            // Reset value to previously selected value if no new selection is made
            setValue(props.selected || '');
            combobox.closeDropdown();
          }}
          rightSection={
            loading ? (
              <Loader size={18} />
            ) : (
              value !== '' && (
                <CloseButton
                  size="sm"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    setValue('');
                    props.onChange(''); // Clear the selected value
                    combobox.resetSelectedOption();
                    setFilteredData(data);
                  }}
                  aria-label="Clear value"
                />
              )
            )
          }
        />
      </Combobox.Target>

      <Combobox.Dropdown hidden={filteredData === null}>
        <Combobox.Options>
          {options}
          {filteredData.length === 0 && (
            <Combobox.Empty>No results found</Combobox.Empty>
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
