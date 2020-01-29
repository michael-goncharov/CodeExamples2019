import { connect } from "react-redux";
import { compose } from "redux";
import { createStructuredSelector } from "reselect";
import { withHandlers, pure, withProps } from "recompose";
import EditableControlPanel from "./EditableControlPanel";
import { toggleModal } from "containers/ModalPortal/actions";
import { getSettingTypeInitialValues } from "pages/Accelerator/selectors";
import { settingsChangeInterval } from "entities/commonEntities/actions";
import { goBack } from "react-router-redux";
import { confirmChangesSaga } from "../../entities/commonEntities/actions";
import startNewService, { isWithPlus } from "containers/AddNewMenuItem/service";
import {
  setPartScreenPreloader,
  switchOffLoaders
} from "../../entities/ui/actions";
import {
  getEndPointWorkflows,
  isAllowSaveActions
} from "pages/EndpointReport/selectors";
import {
  getInitiationWorkflows,
  getInitiationWorkflowId
} from "../../pages/Workflow2/selectors";
import { getisPartScreenPreloader } from "entities/ui/selectors";

const mapDispatchToProps = {
  openModal: toggleModal.show,
  settingsSubmit: settingsChangeInterval,
  goBack,
  confirmChangesSaga,
  startNewService,
  switchOffLoaders,
  setPartScreenPreloader
};

const mapStateToProps = createStructuredSelector({
  initialValues: getSettingTypeInitialValues,
  workflows: getEndPointWorkflows,
  initiationWorkflows: getInitiationWorkflows,
  initiationWorkflowId: getInitiationWorkflowId,
  isAllowSaveActions,
  isLoading: getisPartScreenPreloader
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose(
  withConnect,
  withProps(
    ({
      workflows,
      isAllowSaveActions,
      withPlus,
      initiationWorkflows,
      initWorkflows
    }) => {
      return {
        withPlus: withPlus || isWithPlus(workflows),
        isAllowSaveActions,
        workflows,
        initiationWorkflows,
        initWorkflows: initWorkflows
      };
    }
  )
)(EditableControlPanel);
