/* @flow  */
import * as React from "react";
import { Checkbox, Icon } from "semantic-ui-react";
import uniqId from "helpers/uniqId";
import { ThemedBorder, LabelText } from "components";
import isEqual from "lodash/isEqual";
import getSelectedOptions from "./utils/getSelectedItems";
import cn from "classnames";
import stubObject from "lodash/stubObject";
import { NO_SELECTION } from "../../constants";
import CustomTooltip from "components/CustomTooltip";
import "./styles.scss";

export const bc = "custom-multiple";

type Props = {
  config: Array<Object>
};

type State = {
  isOpen: boolean,
  selectedOptions: Array<Object>
};

export class CustomMultipleItem extends React.PureComponent {
  static displayName = "CustomMultipleItem";

  static defaultProps = {
    withLabelHover: false,
    option: {}
  };

  handleChange = () => {
    const { option, handleOptionsChange, disabled, isChecked } = this.props;
    if (disabled) {
      return false;
    }

    handleOptionsChange({
      isChecked: !isChecked,
      ...option
    });
  };

  render() {
    const { option, disabled, isChecked, withLabelHover } = this.props;
    const withToolTip = (
      <CustomTooltip toolTipText={option.value.TaskName}>
        <div
          className={cn(
            `${bc}__item`,
            withLabelHover && `${bc}__item--hover`,
            disabled && `${bc}--disabled`
          )}
          onClick={this.handleChange}
        >
          <div className={`${bc}__pointer-events`}>
            <Checkbox
              checked={isChecked}
              className={`${bc}__checkbox`}
              disabled={disabled}
            />
          </div>
          <span>{option.text}</span>
        </div>
      </CustomTooltip>
    );
    const withoutTooltip = (
      <div
        className={cn(
          `${bc}__item`,
          withLabelHover && `${bc}__item--hover`,
          disabled && `${bc}--disabled`
        )}
        onClick={this.handleChange}
      >
        <div className={`${bc}__pointer-events`}>
          <Checkbox
            checked={isChecked}
            className={`${bc}__checkbox`}
            disabled={disabled}
          />
        </div>
        <span>{option.text}</span>
      </div>
    );
    const renderEl = option.value.TaskName ? withToolTip : withoutTooltip;
    return renderEl;
  }
}

class CustomMultiple extends React.PureComponent<Props, State> {
  static displayName = "CustomMultiple";
  state = {
    isOpen: false,
    selectedOptions: [],
    inputValue: "",
    newOptions: []
  };

  lastValue = "";

  // drop-down-id
  id = uniqId();
  // drop-down-input
  inputId = uniqId("input-id");

  handleOpenClick = ({ target }) => {
    if (target.closest(`#${this.id}`)) {
      return;
    }

    this.setState(({ isOpen }) => ({
      isOpen: !isOpen
    }));
  };

  handleOutSideClick = ({ target }) => {
    if (target.closest(`#${this.inputId}`)) {
      return;
    }
    if (!target.closest(`#${this.id}`)) {
      this.setState({
        isOpen: false
      });
    }
  };

  componentDidMount() {
    window.addEventListener("click", this.handleOutSideClick);
    this.props.initValues &&
      this.setState((state, props) => props.initValues(state, props));
    if (this.props.editingData && this.props.editingData["Story Type"]) {
      this.setState({ selectedOptions: this.props.editingData["Story Type"] });
    }
    const noneVal = {
      key: "None",
      text: "None",
      value: {
        $type:
          "WhitingHouse.WorkflowFramework.Domain.OutputKeyNameDomain, WhitingHouse.WorkflowFramework.Domain",
        Children: null,
        Id: 0,
        Key: "00000000-0000-0000-0000-000000000000",
        TaskName: false
      }
    };
    /* TODO WHERE ISNONE SHOULD BE */
    if (this.props.options) {
      const isNone = this.props.options.some(item => {
        if (item.text === "None") return true;
      });
      const isNS = this.props.options.some(item => {
        if (item.text === "No Selection") return true;
      });
      if (!isNone && !isNS) {
        /* const newVal = this.props.options.unshift(noneVal); */
        const newVal = this.props.options;
        this.setState({ newOptions: newVal });
      }
    }
  }

  componentDidUpdate({ input, initValues }) {
    // check if new field will be invoked cleaned previous state
    if (
      input.name !== this.props.input.name ||
      (!this.props.input.value &&
        this.state.selectedOptions.length &&
        this.state.selectedOptions[0].text !== NO_SELECTION &&
        !this.state.isOpen)
    ) {
      this.setState({
        isOpen: false,
        selectedOptions: [],
        inputValue: ""
      });
      typeof initValues === "function" &&
        this.setState((state, props) => initValues(state, props));
    }
  }

  componentWillUnmount() {
    window.removeEventListener("click", this.handleOutSideClick);
  }

  handleOptionsChange = ({ isChecked, ...option }) => {
    this.setState(
      ({ selectedOptions }) => {
        const newSelectedOptions = isChecked
          ? selectedOptions.concat(option)
          : selectedOptions.filter(({ key, text }) => {
              if (key) {
                return key !== option.key;
              }

              return text !== option.text;
            });
        const inputValue = newSelectedOptions
          .map(e => (typeof e === "object" ? e.text : e))
          .join(",");
        return {
          selectedOptions: newSelectedOptions,
          inputValue
        };
      },
      () => this.props.input.onChange(this.state.selectedOptions)
    );
  };

  stopPropagation = ev => ev.stopPropagation();

  renderConfig() {
    const { selectedOptions, newOptions } = this.state;
    const { options } = this.props;
    return (
      <div
        className={`${bc}__config`}
        id={this.id}
        onMouseOver={this.stopPropagation}
      >
        {options &&
          options.map(option => (
            <CustomMultipleItem
              key={option.key}
              option={option}
              handleOptionsChange={this.handleOptionsChange}
              isChecked={selectedOptions.some(({ key, text }) => {
                const { key: optionKey, text: optionText } = option;

                if (key) {
                  return key === optionKey;
                }

                return text === optionText;
              })}
              withLabelHover
            />
          ))}
      </div>
    );
  }

  setSelectedOptions = options => {
    this.setState({
      selectedOptions: options
    });
    this.props.input.onChange(options);
  };

  handleInputChange = ({ target }) => {
    const { selectedOptions } = this.state;
    const { options } = this.props;
    const value = target.value;
    const { matchedOptions = [], charsFromEnd = 0 } = getSelectedOptions(
      options,
      value
    );
    const isDeleting = value.length < this.lastValue.length;

    this.setState({
      inputValue: value
    });

    if (!isEqual(selectedOptions, matchedOptions)) {
      if (!isDeleting) {
        const newInputValue = matchedOptions.map(e => e.text).join(",");
        this.setState(
          {
            inputValue: newInputValue
          },
          () => (target.selectionStart = newInputValue.length - charsFromEnd)
        );
      }
      this.setSelectedOptions(matchedOptions);
    }
    this.lastValue = value;
  };

  render() {
    const { isOpen, inputValue } = this.state;
    const { input, onMouseEnter, onMouseLeave, disabled } = this.props;

    return (
      <div
        className={cn(bc, disabled && "disabled")}
        onClick={disabled ? stubObject : this.handleOpenClick}
        id={this.inputId}
        onMouseOver={disabled ? stubObject : onMouseEnter}
        onMouseLeave={disabled ? stubObject : onMouseLeave}
      >
        <input
          className={`${bc}__input`}
          onChange={this.handleInputChange}
          value={inputValue}
          disabled={disabled}
        />
        <div
          className={cn(
            `${bc}__icon-wrapper`,
            isOpen && `${bc}__icon-wrapper--with-border`,
            disabled && "disabled"
          )}
        >
          <Icon name="dropdown" size="small" className={`${bc}__icon`} />
        </div>
        <input type="hidden" {...input} disabled={disabled} />
        {isOpen ? this.renderConfig() : null}
      </div>
    );
  }
}

const WithThemedBorderAndLabel = ({ labelText, ...props }) => (
  <LabelText labelText={labelText}>
    <ThemedBorder>
      <CustomMultiple {...props} />
    </ThemedBorder>
  </LabelText>
);

export default WithThemedBorderAndLabel;
