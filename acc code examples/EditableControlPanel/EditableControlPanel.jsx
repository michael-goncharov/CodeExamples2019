// @flow
import * as React from "react";
import { Grid, Dropdown } from "semantic-ui-react";
import CustomButton from "components/Button";
import CustomTooltip from "components/CustomTooltip";
import { Field } from "redux-form/immutable";
import ModalFormTemplate from "containers/ModalFormTemplate";
import DropDown from "components/Dropdown";
import { REPORT_SETTINGS_MODAL_KEY } from "constants/modalKeys";
import { refreshIntervals } from "helpers/userSettings";
import { ADD_NEW_MODAL_KEY } from "../../constants/modalKeys";

import "./styles.scss";

type Props = {
  title?: string,
  rightSideMenus?: [],
  withPlus?: boolean,
  withRemove?: boolean,
  withCancel?: boolean,
  withHistory?: boolean,
  dropDownValue?: number,
  onlyPlus?: boolean,
  withCancel?: boolean,
  dropDownOnChange?: (str: string) => Action,
  goBack?: () => Action
};

const separatedButtonConfig = {
  History: ["Submit"],
  "Start New": [],
  Terminate: [],
  Restart: [],
  Calculate: [],
  "Add New": [],
  "Add Users": []
};

const ButtonWithTooltip = ({ text, ...props }) => (
  <CustomTooltip toolTipText={text}>
    <CustomButton circular {...props} />
  </CustomTooltip>
);

const bc = "header-control-panel";

const intervals = refreshIntervals();

const addFunctionAsEvent = (fn, arg) => () => fn(arg);

class HeaderControlPanel extends React.PureComponent<Props> {
  static displayName = "HeaderControlPanel";
  state = { isUrlForVideo: false };
  getUrlForVideo = url => this.setState({ isUrlForVideo: url });
  ownActions = {
    plus: {
      icon: "play circle",
      text: "Start New",
      disabled: false,
      event: () => console.log("work")
    },
    cancel: {
      icon: "times",
      text: "Cancel",
      disabled: false,
      event: e => {
        e.preventDefault();
        // this.props.switchOffLoaders();
        // this.props.setPartScreenPreloader(true);
        this.props.confirmChangesSaga({
          action: this.props.goBack
        });
      }
    },
    remove: {
      icon: "trash alternate outline",
      text: "Terminate",
      disabled: false,
      event: () => console.log("work")
    },
    history: {
      icon: "history",
      text: "History",
      disabled: false,
      event: () => console.log("work")
    }
  };

  static defaultProps = {
    rightSideMenus: [
      {
        icon: "refresh",
        text: "Refresh",
        disabled: false,
        event: () => console.log("work")
      }
    ]
  };

  handleDropDown = (ev, { value }: { value: string }): void => {
    this.props.dropDownOnChange(value);
  };
  componentDidMount() {}

  leftSideRender() {
    const { title, leftSideMenus, dropdown, dropDownValue } = this.props;
    let leftSideMenusSize = false;
    if (leftSideMenus) {
      leftSideMenusSize = !!leftSideMenus;
    }
    return (
      <Grid.Column className={bc}>
        <div className={`${bc}__title-box`}>
          <div className="display-table">
            {dropdown && dropdown.length > 1 ? (
              <Dropdown
                selectOnBlur={false}
                inline
                options={dropdown}
                onChange={this.handleDropDown}
                className={`${bc}__drop-down`}
                defaultValue={dropdown[dropDownValue].value}
              />
            ) : (
              <div className={`${bc}__title display-table-cell`}>
                {title || (dropdown && dropdown[0].text)}
              </div>
            )}
            <div className={`${bc}__left-side display-table-cell`}>
              {leftSideMenus
                ? leftSideMenus.map((item, i) => (
                    <ButtonWithTooltip
                      text={item.tooltipText}
                      key={item.content + i}
                      circular
                      withShortDesc
                      leftSideMenusSize={leftSideMenusSize}
                      content={item.content}
                      onClick={item.action}
                      active={item.active}
                    />
                  ))
                : null}
            </div>
          </div>
        </div>
      </Grid.Column>
    );
  }

  rightSideRender() {
    const {
      rightSideMenus,
      rightSideMenusActions,
      withPlus,
      onlyPlus,
      withCancel,
      withRemove,
      withHistory,
      openModal,
      initialValues,
      initiationWorkflows,
      initiationWorkflowId,
      initWorkflows,
      withAdd,
      ...rest
    } = this.props;
    const { cancel, history, plus, remove } = this.ownActions;
    let rightSideMenuSize = false;
    if (rightSideMenus) {
      rightSideMenuSize = !!rightSideMenus;
    }
    if (!rightSideMenus) {
      return null;
    }
    let rightSide = (() => {
      if (onlyPlus) {
        return [plus];
      }

      let result = rightSideMenus;

      if (initialValues) {
        result = [
          ...result,
          {
            icon: "setting",
            text: "Settings",
            disabled: false,
            event: addFunctionAsEvent(openModal, {
              currentModalKey: REPORT_SETTINGS_MODAL_KEY
            })
          }
        ];
      }
      if (withRemove) {
        result = [remove, ...result];
      }
      if (withHistory) {
        result = [history, ...result];
      }
      //   Unneeded "Start New" icon on dev tasks page
      // if (
      //   (rightSideMenus.length &&
      //     withPlus &&
      //     rightSideMenus[0].text !== "Start New") ||
      //   (rightSideMenusActions &&
      //     rightSideMenusActions.hasOwnProperty("Start New"))
      // ) {
      //   result = [plus, ...result];
      // }

      // if (withPlus) {
      //   result = [plus, ...result];
      // }
      if (withPlus && initWorkflows) {
        if (initWorkflows.length > 1) {
          result = [
            {
              icon: "play circle",
              text: "Start New ",
              disabled: false,
              event: () =>
                openModal({
                  currentModalKey: ADD_NEW_MODAL_KEY,
                  additionalParams: {
                    initiationWorkflow: true,
                    onStart: workflowVersionId => {
                      return `workflow/new/${workflowVersionId}`;
                    },
                    workflows: initWorkflows
                  }
                })
            },
            ...result
          ];
        } else if (initWorkflows.length === 1) {
          result = [
            {
              icon: "play circle",
              text: "Start New",
              disabled: false,
              event: () =>
                this.props.history2.push(`/workflow/new/${initWorkflows[0].Id}`)
            },
            ...result
          ];
        }
      }

      if (initiationWorkflows) {
        if (initiationWorkflows.length > 1) {
          result = [
            {
              icon: "play circle",
              text: "Start New",
              disabled: false,
              event: () =>
                openModal({
                  currentModalKey: ADD_NEW_MODAL_KEY,
                  additionalParams: {
                    initiationWorkflow: true,
                    onStart: workflowVersionId => {
                      return `workflow/initialization/${initiationWorkflowId}/${workflowVersionId}`;
                    },
                    workflows: initiationWorkflows
                  }
                })
            },
            ...result
          ];
        } else if (initiationWorkflows.length === 1) {
          result = [
            {
              icon: "play circle",
              text: "Start New",
              disabled: false,
              event: () =>
                this.props.history2.push(
                  `/workflow/initialization/${initiationWorkflowId}/${initiationWorkflows[0].Id}`
                )
            },
            ...result
          ];
        }
      }

      if (withAdd) {
        result = [
          {
            icon: "plus",
            text: "Add New",
            event: () => {
              console.log("Event Add New was called");
            }
          },
          ...result
        ];
      }
      if (withCancel) {
        result = result.concat(cancel);
      }
      return result;
    })();

    if (rightSideMenusActions) {
      rightSide = rightSide.map(menu => ({
        ...menu,
        event: rightSideMenusActions[menu.text] || menu.event,
        rightSideMenuSize
      }));
    }
    let rightSideMenusFilter;
    rightSideMenusFilter = rightSide.map((item, i) => {
      if (!rightSideMenuSize) item["rightSideMenuSize"] = true;
      if (i === rightSide.length - 1) item["lastElement"] = true;
      return item;
    });
    if (!this.props.isAllowSaveActions && this.props.workflows.length !== 0)
      rightSideMenusFilter = rightSide.filter(item => {
        if (item.text === "Save") return false;
        if (item.text === "Save and Go Back") return false;
        return true;
      });
    return (
      <Grid.Column>
        <div className={`${bc}__right-side-menu-container`}>
          {this.renderRightButtonList(rightSideMenusFilter)}
        </div>
      </Grid.Column>
    );
  }

  renderRightButtonList(rightSide) {
    let arrWithSeparators = [];
    return rightSide.map(
      (
        { text, icon, modifyButton, event, asSimpleButton, ...props },
        i,
        arr
      ) => {
        const restArray = arr.slice(++i);
        let hasSeparator = false;
        if (
          separatedButtonConfig[text] &&
          !separatedButtonConfig[text].length
        ) {
          hasSeparator = true;
        } else {
          hasSeparator =
            separatedButtonConfig[text] &&
            separatedButtonConfig[text].every(
              (name, i) => name === restArray[i].text
            );
        }

        let button = this.createButton(
          text,
          icon,
          event,
          asSimpleButton,
          props
        );

        if (modifyButton) {
          button = modifyButton(button, this.getUrlForVideo);
        }
        arrWithSeparators.push(hasSeparator);
        const isSeparators = arrWithSeparators.some(item => {
          if (item) return true;
        });
        let isFirst = false;
        if (rightSide[0].text === "Save") {
          isFirst = true;
        }
        // let cancelAfterSave = false;
        // if (
        //   rightSide &&
        //   rightSide[i] &&
        //   i > 0 &&
        //   rightSide[i].text === "Cancel" &&
        //   rightSide[i - 1].text === "Start New"
        // ) {
        //   cancelAfterSave = true;
        // }
        return (
          <React.Fragment key={text}>
            {/* {text === "Cancel" && !cancelAfterSave ? (
              <div className="vertical-separator" />
            ) : null} */}
            {text === "Submit" ||
            (!isSeparators && text === "Save" && !isFirst) ||
            (this.state.isUrlForVideo && text === "video") ? (
              <div className="vertical-separator" />
            ) : null}
            {button}
            {hasSeparator ? <div className="vertical-separator" /> : null}
          </React.Fragment>
        );
      }
    );
  }

  createButton(text, icon, event, asSimpleButton, props) {
    return asSimpleButton ? (
      <CustomButton
        customClass={`${bc}__simple-button-rounded`}
        type="button"
        content={text}
        onClick={event}
        key={text + icon}
        {...props}
      />
    ) : (
      <ButtonWithTooltip
        key={text + icon}
        text={text}
        {...props}
        icon={icon}
        onClick={event}
      />
    );
  }

  render() {
    const { initialValues, settingsSubmit } = this.props;
    return (
      <Grid className={bc}>
        <ModalFormTemplate
          title="Settings"
          submitContent="Save"
          bodyTitle="Refresh Interval"
          initialValues={initialValues}
          onSubmit={settingsSubmit}
          modalKey={REPORT_SETTINGS_MODAL_KEY}
        >
          <Field
            name="refreshInt"
            component={DropDown}
            options={intervals}
            customClass={`${bc}__field-drop-down`}
          />
        </ModalFormTemplate>
        <Grid.Row columns="2">
          {this.leftSideRender()}
          {this.rightSideRender()}
        </Grid.Row>
      </Grid>
    );
  }
}

export default HeaderControlPanel;
