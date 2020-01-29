import React, { useMemo } from "react";
import Select from "react-select";
import get from "lodash/get";
import { ThemedBorder, LabelText } from "components";

const MultipleSelect = ({
  input,
  options: initialOptions = null,
  ...props
}) => {
  const inputOptions = get(input, "value._tail.array") || [];
  const initialValues = inputOptions.map(item => {
    const currentItem = item.toJS();
    return currentItem.value.Key;
  });
  const currentValues = Array.isArray(input.value)
    ? input.value.map(option => option.value.Key)
    : [];

  const options = useMemo(() => {
    if (Array.isArray(initialOptions) && initialOptions.length) {
      return initialOptions.map(option => ({
        ...option,
        label: option.text
      }));
    }

    return [];
  }, [initialOptions]);

  const selectedValues = useMemo(
    () =>
      options.filter(
        ({ value: { Key } }) =>
          initialValues.includes(Key) || currentValues.includes(Key)
      ),
    [options, initialValues.length, currentValues.length]
  );

  return (
    <ThemedBorder customClass="themed-dropdown">
      <Select
        {...input}
        onBlur={() => null}
        options={options}
        isSearchable
        menuPosition="absolute"
        menuPlacement="auto"
        placeholder={false}
        isClearable
        isMulti
        value={selectedValues}
        closeMenuOnSelect={false}
        isDisabled={props.isEditable ? !props.isEditable : false}
        classNamePrefix="react-select"
      />
    </ThemedBorder>
  );
};

const WithThemedBorderAndLabel = ({ labelText, ...props }) => (
  <LabelText labelText={labelText}>
    <MultipleSelect {...props} />
  </LabelText>
);

export default WithThemedBorderAndLabel;
