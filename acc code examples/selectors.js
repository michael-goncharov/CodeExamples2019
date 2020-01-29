import { createSelector } from "reselect";
import {
  getFormValues,
  getFormSubmitErrors,
  getFormSyncErrors
} from "redux-form/immutable";
import get from "lodash/get";
import { workflowForm, taskForm } from "../../constants/formsNames";
import { getAvailableFields } from "../../normalizers";
import maybe from "../../helpers/maybe";
import { StatusType } from "../../enums";
import { createFilteredListData } from "../../containers/FilterBar/selectors";
import { userLightProfile } from "../Accelerator/selectors";
import { getNormalizedForm } from "../../components/FormLayout/selectors";
import {
  getCalculatedFields,
  getCalculatedInitialValues
} from "../../components/FormLayout/components/fields/Calculated/selectors";
import Immutable from "immutable";
import {
  parsedFieldsPlacedOnTheForm,
  createInitialValues
} from "../../components/FormLayout/utils";
import { getAvailableLayouts } from "../../normalizers";

const getWorkflow = state => state.get("workflow2");

// =========================================
//             COMMON STORE
// =========================================

export const rightSideMenuActions = createSelector(
  getWorkflow,
  w => w.RightSideMenuActions
);

export const getAllFields = createSelector(
  getWorkflow,
  ({ Details }) => Details.Fields
);

export const hasCalculatedFieldsOnTheForm = formName =>
  createSelector(
    getCalculatedFields,
    fields => fields.some(field => field.formName === formName)
  );

export const getHeaderTitle = createSelector(
  getWorkflow,
  w => w.HeaderTitle
);

export const getFullWorkflowTaskOrDetailsHistory = createSelector(
  getWorkflow,
  w => {
    const {
      isTaskHistory,
      isWorkflowHistory,
      histories
    } = w.FullWorkflowTaskOrDetailsHistory;
    const task = maybe(w.Task, s => s.Task);
    const workflow = maybe(w.Details, d => d.Workflow);
    let createdHistory = {
      isInitHistory: true,
      key: "__some_key__"
    };

    if (isTaskHistory) {
      createdHistory["CreatedDate"] = task.CreatedDate;
      createdHistory["description"] = "Task was created";
    }

    if (isWorkflowHistory) {
      createdHistory["CreatedDate"] = workflow.CreatedDate;
      createdHistory["description"] = "Workflow was created";
    }

    if (!histories) {
      return [createdHistory];
    }

    return histories.concat([createdHistory]);
  }
);

export const getWorkflowDefinitionId = createSelector(
  getWorkflow,
  w =>
    maybe(w.Task, s => s.Task, t => t.WorkflowDefinitionId) ||
    maybe(w.Details, d => d.Workflow, wo => wo.WorkflowDefinitionId)
);

export const getRootWorkflowDefinitionFolderId = createSelector(
  getWorkflow,
  w =>
    maybe(w.Task, s => s.Task, t => t.RootWorkflowDefinitionFolderId) ||
    maybe(w.Details, d => d.WorkflowDefinition, wd => wd.FolderId)
);

export const getWorkflowFolderId = createSelector(
  getWorkflow,
  w =>
    maybe(w.Task, s => s.Task, t => t.FolderId) ||
    maybe(w.Details, d => d.Workflow, wo => wo.FolderId) ||
    maybe(w.Details, d => d.generatedWorkflowFolderId)
);

export const getWorkflowName = createSelector(
  getWorkflow,
  w => maybe(w.Details, s => s.WorkflowDefinition, d => d.Name)
);

export const getCreatedWorkflowName = createSelector(
  getWorkflow,
  w => {
    const name = maybe(w.Details, s => s.Workflow, d => d.Name) || "";
    const id = maybe(w.Details, s => s.Workflow, d => d.Id) || 0;
    return `${name} ${id}`;
  }
);

export const getWorkflowId = createSelector(
  getWorkflow,
  w =>
    maybe(w.Task, s => s.Task, t => t.WorkflowId) ||
    maybe(w.Details, s => s.Workflow, wo => wo.Id)
);

export const getWorkflowTaskName = createSelector(
  getWorkflow,
  w => maybe(w.Task, s => s.Task, t => t.Name)
);

export const getWorkflowVersionId = createSelector(
  getWorkflow,
  w =>
    maybe(w.Task, s => s.WorkflowVersion, v => v.Id) ||
    maybe(w.Details, s => s.WorkflowVersion, v => v.Id)
);
export const getInitiationWorkflows = createSelector(
  getWorkflow,
  workflow =>
    get(workflow, "Details.WorkflowDefinition.Initiations.$values", false)
);
export const getInitiationWorkflowId = createSelector(
  getWorkflow,
  workflow => get(workflow, "Details.Workflow.Id", false)
);

// =========================================
//             TASK STORE
// =========================================

const getWorkflowTaskStore = createSelector(
  getWorkflow,
  w => w.Task
);

export const isContinuousTask = createSelector(
  getWorkflowTaskStore,
  ts => ts.IsContinuous
);

export const isWorkflowTaskLoaded = createSelector(
  getWorkflowTaskStore,
  t => t.isLoaded
);

export const getWorkflowTaskLayouts = createSelector(
  getWorkflowTaskStore,
  isWorkflowTaskLoaded,
  (t, isLoaded) => isLoaded && t.Layouts
);

export const getWorkflowTaskLayoutsFields = createSelector(
  getWorkflowTaskStore,
  isWorkflowTaskLoaded,
  (t, isLoaded) => isLoaded && t.Fields
);

export const getTaskFieldsArePlacedOnTheForm = createSelector(
  getWorkflowTaskLayoutsFields,
  getWorkflowTaskLayouts,
  isWorkflowTaskLoaded,
  (allFields, layouts, isLoaded) =>
    parsedFieldsPlacedOnTheForm(allFields, layouts, isLoaded)
);

export const getWorkflowTask = createSelector(
  getWorkflowTaskStore,
  isWorkflowTaskLoaded,
  (t, isLoaded) => isLoaded && t.Task
);

export const getWorkflowTaskId = createSelector(
  getWorkflowTask,
  t => t.Id
);

export const isTaskAssignedToCurrentUser = createSelector(
  getWorkflowTask,
  userLightProfile,
  (task, user) => task.AssignedTo === +user.UserId
);

export const isWorkflowTaskComplete = createSelector(
  getWorkflowTask,
  task => task.StatusType === StatusType.Complete
);

export const isWorkflowTaskTerminated = createSelector(
  getWorkflowTask,
  task => task.StatusType === StatusType.Cancelled
);

export const getTaskPriorities = createSelector(
  getWorkflowTaskStore,
  isWorkflowTaskLoaded,
  (t, isLoaded) => isLoaded && t.Priorities
);

export const getWorkflowTaskFormValues = createSelector(
  getFormValues(taskForm),
  f => f
);

export const getTaskAvailableFields = createSelector(
  getTaskFieldsArePlacedOnTheForm,
  getFormValues(taskForm),
  isWorkflowTaskLoaded,
  (allFields, reduxFormValues, isLoaded) =>
    (isLoaded && getAvailableFields(allFields, reduxFormValues)) || []
);

export const initialValuesForTaskSettingsForm = createSelector(
  getWorkflowTask,
  t => ({
    assignedTo: t.AssignedToUser || "Unassigned",
    priority: maybe(t.PriorityListItem, p => p.Rank)
  })
);

const initialValuesWorkflowTaskForm = createSelector(
  getTaskFieldsArePlacedOnTheForm,
  fields => createInitialValues(fields)
);

export const initialValuesForWorkflowTaskLayoutsForm = createSelector(
  initialValuesWorkflowTaskForm,
  getCalculatedInitialValues(taskForm),
  (formInitialValues, calculatedInitialValues = []) => {
    // Include calculate fields
    const calcValues = calculatedInitialValues.reduce((accumulator, value) => {
      accumulator[`${value.name}`] = value.value;
      return accumulator;
    }, {});

    return {
      ...formInitialValues,
      ...calcValues
    };
  }
);

export const getTaskHistory = createSelector(
  getWorkflow,
  t => t.TaskHistory
);

export const getWorkflowTaskForm = createSelector(
  getWorkflowTaskStore,
  store => store.Form
);

export const getWorkflowTaskFormId = createSelector(
  getWorkflowTaskForm,
  f => f.Id
);

export const getWorkflowTaskFormErrors = createSelector(
  getFormSyncErrors(taskForm),
  getFormSubmitErrors(taskForm),
  (syncErrors, submitErrors) => ({
    ...syncErrors,
    ...submitErrors.toJS()
  })
);

export const getWorkflowTaskTabErrorList = createSelector(
  getWorkflowTaskFormErrors,
  getNormalizedForm(taskForm),
  (errors, tabs) =>
    Object.keys(tabs).map(key => {
      const hasError = tabs[key].some(name => !!errors[name]);
      return {
        tabName: key,
        hasError
      };
    })
);

// =========================================
//             DETAILS STORE
// =========================================

export const getWorkflowDetailsStore = createSelector(
  getWorkflow,
  w => w.Details
);

export const isWorkflowDetailsLoaded = createSelector(
  getWorkflowDetailsStore,
  t => t.isLoaded
);

export const getWorkflowDetailsLayouts = createSelector(
  getWorkflowDetailsStore,
  isWorkflowDetailsLoaded,
  (t, isLoaded) => {
    return (isLoaded && t.Layouts) || [];
  }
);

export const getWorkflowDetailsLayoutsFields = createSelector(
  getWorkflowDetailsStore,
  isWorkflowDetailsLoaded,
  (t, isLoaded) => isLoaded && t.Fields
);

export const getWorkflowDetailsFieldsArePlacedOnTheForm = createSelector(
  getWorkflowDetailsLayoutsFields,
  isWorkflowDetailsLoaded,
  getWorkflowDetailsLayouts,
  (allFields, isLoaded, layouts) =>
    /*    
    parsedFieldsPlacedOnTheForm(allFields, layouts, isLoaded)
    */
    isLoaded ? allFields : []
);

export const getWorkflowDetailsFormValues = createSelector(
  getFormValues(workflowForm),
  f => f
);

export const getDetailsAvailableFields = createSelector(
  getWorkflowDetailsFieldsArePlacedOnTheForm,
  getFormValues(workflowForm),
  isWorkflowDetailsLoaded,
  getAllFields,
  (allFields, reduxFormValues, isLoaded, allFieldsForRender) => {
    return (
      (isLoaded &&
        getAvailableFields(allFields, reduxFormValues, allFieldsForRender)) ||
      allFields
    );
  }
);

export const getAvailableWorkflowDetailsLayouts = createSelector(
  getDetailsAvailableFields,
  getWorkflowDetailsLayouts,
  isWorkflowDetailsLoaded,
  (availableFields, layouts, isLoaded) => {
    return (isLoaded && getAvailableLayouts(availableFields, layouts)) || [];
  }
);

const initialValuesWorkflowDetailsForm = createSelector(
  getWorkflowDetailsFieldsArePlacedOnTheForm,
  fields => createInitialValues(fields)
);

export const initialValuesForWorkflowDetailsLayoutsForm = createSelector(
  initialValuesWorkflowDetailsForm,
  getCalculatedInitialValues(workflowForm),
  (formInitialValues, calculatedInitialValues = []) => {
    const calcValues = calculatedInitialValues.reduce((accumulator, value) => {
      accumulator[`${value.name}`] = value.value;
      return accumulator;
    }, {});

    return {
      ...formInitialValues,
      ...calcValues
    };
  }
);

export const getWorkflowDetailsForm = createSelector(
  getWorkflowDetailsStore,
  store => store.Form
);

export const getWorkflowModel = createSelector(
  getWorkflowDetailsStore,
  store => store.Workflow
);

export const getWorkflowdetailsWorkflowDefinition = createSelector(
  getWorkflowDetailsStore,
  store => store.WorkflowDefinition
);

export const getWorkflowDetailsFormId = createSelector(
  getWorkflowDetailsForm,
  f => f.Id
);

export const getWorkflowDetailsFormErrors = createSelector(
  getFormSubmitErrors(workflowForm),
  submitErrors => {
    return Immutable.Iterable.isIterable(submitErrors)
      ? submitErrors.toJS()
      : submitErrors;
  }
);

export const getWorkflowDetailsTabErrorList = createSelector(
  getWorkflowDetailsFormErrors,
  getNormalizedForm(workflowForm),
  (errors, tabs) => {
    return Object.keys(tabs).map(key => {
      const hasError = tabs[key].some(name => !!errors[name]);
      return {
        tabName: key,
        hasError
      };
    });
  }
);

// =========================================
//             HISTORY STORE
// =========================================

const getWorkflowHistoryStore = createSelector(
  getWorkflow,
  w => w.History
);

export const isWorkflowHistoryLoaded = createSelector(
  getWorkflowHistoryStore,
  s => s.isLoaded
);

export const getWorkflowHistoryWorkflowResults = createSelector(
  isWorkflowHistoryLoaded,
  getWorkflowHistoryStore,
  (isLoaded, h) => (isLoaded && h.WorkflowResults) || []
);

export const getHistoryTaskResults = createSelector(
  isWorkflowHistoryLoaded,
  getWorkflowHistoryStore,
  (isLoaded, h) => (isLoaded && h.TaskResults) || []
);

// =========================================
//             DOCUMENTS STORE
// =========================================

export const getWorkflowDocumentsStore = createSelector(
  getWorkflow,
  w => w.Documents
);

export const isWorkflowDocumentsLoaded = createSelector(
  getWorkflowDocumentsStore,
  store => store.isLoaded
);

export const getWorkflowDocuments = createSelector(
  getWorkflowDocumentsStore,
  store => store.documents
);

export const getFilteredWorkflowDocuments = createFilteredListData(
  getWorkflowDocuments,
  docs => [docs.Name]
);

export const getDocumentsMode = createSelector(
  getWorkflowDocumentsStore,
  store => store.mode
);

export const getSelectedDocumentIdToPreview = createSelector(
  getWorkflowDocumentsStore,
  store => store.selectedDocumentId
);

// =========================================
//             NOTES STORE
// =========================================

export const getWorkflowNotesStore = createSelector(
  getWorkflow,
  w => w.Notes
);

export const isWorkflowNotesLoaded = createSelector(
  getWorkflowNotesStore,
  store => store.isLoaded
);

export const getWorkflowNotes = createSelector(
  getWorkflowNotesStore,
  store => store.notes
);

export const getWorkflowNoteIds = createSelector(
  getWorkflowNotes,
  notes => notes.map(note => note.Id)
);

export const getNormalizedWorkflowNotes = createSelector(
  getWorkflowNotes,
  notes => {
    return notes
      .filter(note => !note.ParentId)
      .map(note => {
        note.SubNotes = notes.filter(_note => _note.ParentId === note.Id);
        return note;
      });
  }
);

export const getFilteredWorkflowNotes = createFilteredListData(
  getNormalizedWorkflowNotes,
  note => [note.Header, note.Content]
);

export const getFavoritedWorkflowNotes = createSelector(
  getFilteredWorkflowNotes,
  notes => {
    return notes.filter(note => !!note.Flags.length) || [];
  }
);
