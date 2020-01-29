import {
  takeLatest,
  fork,
  select,
  all,
  put,
  call,
  take
} from "redux-saga/effects";
import { getPathname } from "../router/selectors";
import { toggleModal } from "containers/ModalPortal/actions";
import { CONFIRM_USER_FORM_CHANGES } from "constants/modalKeys";
import {
  confirmChangesSaga as sagaAction,
  saveConfirmChangesSaga as sagaActionSave
} from "../commonEntities/actions";
import { getAdditionalParams } from "containers/ModalPortal/selectors";
import { saveGroup } from "pages/Groups/actions";
import { getGroupsUsersLength } from "pages/Groups/selectors";
import {
  CONFIGURE_GROUP,
  WORKFLOW,
  WORKFLOW_DETAILS,
  WORKFLOW_TASK,
  USER_PROFILE,
  USER_CONNECTOR_REPORT
} from "./locationConstants";
import { submit } from "redux-form/immutable";
import {
  workflowForm,
  taskForm,
  userProfileForm,
  connectorForm
} from "../../constants/formsNames";
import { isDirty as isDirtySelector } from "redux-form/immutable";
import {
  getWorkflowTaskId,
  getWorkflowId,
  getWorkflowVersionId
} from "../../pages/Workflow2/selectors";
import { submitUserProfile } from "../../pages/UserProfile/actions";
import {
  submitWorkflowDetailsAsync,
  submitWorkflowTaskAsync
} from "../../pages/Workflow2/actions";
import { submitConnectorsForm } from "../../pages/ConnectorCreateUpdate/actions";

const config = {
  [CONFIGURE_GROUP]: {
    actionStart: saveGroup.request,
    actionEnd: null
  },

  [WORKFLOW_TASK]: {
    actionStart: submitWorkflowDetailsAsync.request,
    actionEnd: {
      success: submitWorkflowTaskAsync.success.toString(),
      fail: submitWorkflowTaskAsync.fail.toString()
    }
  },

  [WORKFLOW_DETAILS]: {
    actionStart: submit,
    actionEnd: {
      success: submitWorkflowDetailsAsync.success.toString(),
      fail: submitWorkflowDetailsAsync.fail.toString()
    }
  },

  [USER_PROFILE]: {
    actionStart: submit,
    actionEnd: {
      success: submitUserProfile.success.toString(),
      fail: submitUserProfile.fail.toString()
    }
  },
  [USER_CONNECTOR_REPORT]: {
    actionStart: submitConnectorsForm.request,
    actionEnd: {
      success: submitConnectorsForm.success.toString(),
      fail: submitConnectorsForm.fail.toString()
    }
  }
};

function* confirmChangesSaga({ payload }) {
  const { action, data } = payload;
  const currentLocation = yield select(getPathname);
  const param = currentLocation.split("/");
  let params = {};
  params["id"] = param[2];
  params["reportDefinitionItemId"] = param[3];
  params["reportUniqNumberName"] = param[4];
  if (currentLocation.includes(CONFIGURE_GROUP)) {
    const {
      originUsersLength,
      filteredUsersLength,
      deletedUsersLength
    } = yield select(getGroupsUsersLength);

    if (deletedUsersLength || originUsersLength !== filteredUsersLength) {
      yield put(
        toggleModal.show({
          currentModalKey: CONFIRM_USER_FORM_CHANGES,
          additionalParams: {
            ...payload,
            location: CONFIGURE_GROUP
          }
        })
      );
    } else {
      yield call(action, data);
    }
  } else if (currentLocation.includes(WORKFLOW)) {
    const taskId = yield select(getWorkflowTaskId);
    const workflowId = yield select(getWorkflowId);
    const workflowVersionId = yield select(getWorkflowVersionId);
    const isDirty = taskId
      ? yield select(isDirtySelector(taskForm))
      : yield select(isDirtySelector(workflowForm));

    const location = taskId ? WORKFLOW_TASK : WORKFLOW_DETAILS;

    if (isDirty) {
      yield put(
        toggleModal.show({
          currentModalKey: CONFIRM_USER_FORM_CHANGES,
          additionalParams: {
            ...payload,
            taskId,
            workflowId,
            workflowVersionId,
            location
          }
        })
      );
    } else {
      yield call(action, data);
    }
  } else if (currentLocation.includes(USER_PROFILE)) {
    const isDirty = yield select(isDirtySelector(userProfileForm));
    if (isDirty) {
      yield put(
        toggleModal.show({
          currentModalKey: CONFIRM_USER_FORM_CHANGES,
          additionalParams: {
            ...payload,
            location: USER_PROFILE
          }
        })
      );
    } else {
      yield call(action, data);
    }
  } else if (currentLocation.includes(USER_CONNECTOR_REPORT)) {
    const taskId = yield select(getWorkflowTaskId);

    const isDirty = taskId
      ? yield select(isDirtySelector(workflowForm))
      : yield select(isDirtySelector(connectorForm));

    const location = taskId ? WORKFLOW_TASK : USER_CONNECTOR_REPORT;

    if (isDirty) {
      yield put(
        toggleModal.show({
          currentModalKey: CONFIRM_USER_FORM_CHANGES,
          additionalParams: {
            params,
            location,
            action
          }
        })
      );
    } else {
      yield call(action, data);
    }
  } else {
    yield call(action, data);
  }
}

function* saveConfirmChangesSaga({ payload: isSave }) {
  const { action, data, location, params } = yield select(getAdditionalParams);

  if (isSave) {
    let actionPayload;
    switch (location) {
      case WORKFLOW_DETAILS:
        actionPayload = workflowForm;
        break;
      case WORKFLOW_TASK:
        actionPayload = taskForm;
        break;
      case CONFIGURE_GROUP:
        actionPayload = {};
        break;
      case USER_PROFILE:
        actionPayload = userProfileForm;
        break;
      case USER_CONNECTOR_REPORT:
        actionPayload = params;
        break;
      default:
        actionPayload = {};
    }

    const saveAction = config[location];

    if (saveAction && saveAction.actionStart) {
      yield put(saveAction.actionStart(actionPayload));

      if (saveAction.actionEnd) {
        let shouldWaitActionEnded = true;

        while (shouldWaitActionEnded) {
          const action = yield take();
          if (
            action.type === saveAction.actionEnd.success ||
            action.type === saveAction.actionEnd.fail
          ) {
            shouldWaitActionEnded = false;
          }
        }
      }
    }

    if (action) {
      yield call(action, data);
    }
  } else {
    if (action) {
      yield call(action, data);
    }
  }
}

function* handleConfirmChangesSaga() {
  yield takeLatest(sagaAction.toString(), confirmChangesSaga);
}

function* handleSaveConfirmChangesSaga(params) {
  yield takeLatest(sagaActionSave.toString(), saveConfirmChangesSaga);
}

export default function* forkHandleSagas() {
  yield all([
    fork(handleConfirmChangesSaga),
    fork(handleSaveConfirmChangesSaga)
  ]);
}
