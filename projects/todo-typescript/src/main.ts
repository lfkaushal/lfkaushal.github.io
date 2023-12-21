import './sass/main.scss';
import Task, { ITask } from './Task';
import TaskList from './TaskList';
import circleOutline from './assets/icons/circle-outline.svg';
import circleComplete from './assets/icons/complete.svg';
import listSvg from './assets/icons/list.svg';
import { createImage } from './utils';

enum Filters {
  ALL,
  COMPLETE,
  INCOMPLETE,
}

// Get DOM Elements
const taskListElement = document.querySelector('.tasks') as HTMLDivElement;
// Modals
const modal = document.querySelector('#modal') as HTMLDivElement;
const modalOpener = document.querySelectorAll('.modal-opener');
const modalCloser = document.querySelectorAll('.modal-closer');
const taskForm = document.querySelector('#add-task') as HTMLFormElement;
const modalTaskForm = document.querySelector(
  '#modal-add-form',
) as HTMLFormElement;
// Filter btns
const allFilterBtns = document.querySelectorAll('.filter-all');
const completeFilterBtns = document.querySelectorAll('.filter-complete');
const incompleteFilterBtns = document.querySelectorAll('.filter-incomplete');

// Intitialize variables
const taskList = new TaskList([]);
let currentFilter = Filters.ALL;

/**
 * create a new task instance and
 * add it to the taskList
 *
 * @param title title of the task
 * @param description description of the task
 * @param completed status of the task
 * @returns task object
 */
function createTask(title: string, description: string, completed: boolean) {
  const task = new Task(title, description, completed);
  taskList.addTask(task);
  return task;
}

/**
 * render the task into the DOM
 *
 * @param tasks Task object list
 */
function renderTasks(tasks: ITask[]) {
  if (!taskListElement) throw new Error('Container not found!');

  taskListElement.innerHTML = '';

  if (tasks.length === 0) {
    // Render empty list

    // <div class="tasks-empty">
    const tasksEmpty = document.createElement('div');
    tasksEmpty.classList.add('tasks-empty');

    // <div class="tasks-empty__icon">
    const emptyIcon = document.createElement('div');
    emptyIcon.classList.add('tasks-empty__icon');

    // svg icon of empty list
    const svgIcon = createImage(listSvg);

    emptyIcon.appendChild(svgIcon);

    // Append empty icon to tasksEmpty
    tasksEmpty.appendChild(emptyIcon);

    const emptyText = document.createElement('p');
    emptyText.classList.add('tasks-empty__text');
    emptyText.textContent = "You don't have any tasks yet. Create a new one.";

    tasksEmpty.appendChild(emptyText);

    taskListElement.appendChild(tasksEmpty);
    return;
  }

  tasks.forEach((task) => {
    // <div class="task">
    const wrapper = document.createElement('div');
    wrapper.classList.add('task');
    // <div class="task__content">
    const content = document.createElement('div');
    content.classList.add('task__content');

    // <h3 class="task__title">${todo?.title}</h3>
    const title = document.createElement('h3');
    title.classList.add('task__title');
    title.textContent = task.title;

    // <p class="task__text">${todo?.description || ''}</p>
    const description = document.createElement('p');
    description.classList.add('task__text');

    description.textContent = task.description || '';

    // append to content
    content.appendChild(title);
    content.appendChild(description);

    const actions = document.createElement('div');
    // <button type="button" class="btn btn-icon btn-icon--secondary complete-btn" >
    const toggleBtn = document.createElement('button');
    toggleBtn.setAttribute('type', 'button');
    toggleBtn.classList.add(
      'btn',
      'btn-icon',
      'btn-icon--secondary',
      'complete-btn',
    );

    // Button Icon
    let btnIcon;
    if (task.getCompleted()) {
      btnIcon = createImage(circleComplete);
    } else {
      btnIcon = createImage(circleOutline);
    }

    // Append the SVG to the compelte button
    toggleBtn.appendChild(btnIcon);

    // Add event listener to the toggle btn
    toggleBtn.addEventListener('click', () => {
      task.toggleCompleted();
      renderFilteredTasks();
    });

    actions.appendChild(toggleBtn);
    wrapper.appendChild(content);
    wrapper.appendChild(actions);

    taskListElement.appendChild(wrapper);

    return;
  });
}

/**
 * handle when task is submitted through form
 *
 * @param event form submit event
 */
function handleTaskSubmit(event: SubmitEvent) {
  event.preventDefault();

  const taskForm = event.target as HTMLFormElement;
  const formData = new FormData(taskForm);

  // Grab form value
  const title = formData.get('title') as string;
  const description = (formData.get('description') as string) || '';
  const completed = false;

  // create task and render it on the page
  createTask(title, description, completed);
  renderTasks(taskList.list);
  // reset the form
  taskForm.reset();
  handleModalClose();
}

/**
 * Render tasks based on the current filter
 */
function renderFilteredTasks() {
  let filteredTasks: ITask[];

  switch (currentFilter) {
    case Filters.COMPLETE:
      filteredTasks = taskList.list.filter((task) => task.completed);

      break;
    case Filters.INCOMPLETE:
      filteredTasks = taskList.list.filter((task) => !task.completed);

      break;
    default:
      filteredTasks = taskList.list;
      break;
  }

  renderTasks(filteredTasks);
}

/**
 * Handle filter button click
 *
 * @param filter The selected filter
 */
function handleFilterClick(filter: Filters) {
  // Remove active class from the buttons
  allFilterBtns.forEach((btn) => {
    btn.classList.remove('header__menu-link--active');
  });

  completeFilterBtns.forEach((btn) => {
    btn.classList.remove('header__menu-link--active');
  });

  incompleteFilterBtns.forEach((btn) => {
    btn.classList.remove('header__menu-link--active');
  });

  currentFilter = filter;

  // Add active class to the selected button
  switch (currentFilter) {
    case Filters.COMPLETE:
      completeFilterBtns.forEach((btn) =>
        btn.classList.add('header__menu-link--active'),
      );
      break;
    case Filters.INCOMPLETE:
      incompleteFilterBtns.forEach((btn) =>
        btn.classList.add('header__menu-link--active'),
      );
      break;
    default:
      allFilterBtns.forEach((btn) =>
        btn.classList.add('header__menu-link--active'),
      );
      break;
  }

  renderFilteredTasks();
}

/**
 * open the modal
 *
 */
function handleModalOpen() {
  if (!modal) throw new Error('No modal found');
  modal.classList.remove('modal-hidden');
}

/**
 * close the modal
 *
 */
function handleModalClose() {
  if (!modal) throw new Error('No modal found');
  modal.classList.add('modal-hidden');
  modalTaskForm.reset();
}

/**
 * setup the event listeners in our app
 *
 */
function setupEventListeners() {
  // Handle task event listeners

  [taskForm, modalTaskForm].forEach((tasks) => {
    tasks?.addEventListener('submit', handleTaskSubmit);
  });

  // Handle when modal opens
  modalOpener.forEach((opener) => {
    opener.addEventListener('click', handleModalOpen);
  });

  // Handle when modal closes
  modalCloser.forEach((closer) => {
    closer.addEventListener('click', handleModalClose);
  });

  // handle when filter button is clicked
  allFilterBtns.forEach((allFilterBtn) => {
    allFilterBtn.addEventListener('click', () => {
      handleFilterClick(Filters.ALL);
    });
  });

  completeFilterBtns.forEach((completeFilterBtn) => {
    completeFilterBtn.addEventListener('click', () =>
      handleFilterClick(Filters.COMPLETE),
    );
  });

  incompleteFilterBtns.forEach((incompleteFilterBtn) => {
    incompleteFilterBtn.addEventListener('click', () =>
      handleFilterClick(Filters.INCOMPLETE),
    );
  });
}

// Call functions
createTask('Task title', 'Task description', false);

renderTasks(taskList.list);

setupEventListeners();
