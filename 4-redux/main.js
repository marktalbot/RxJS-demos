import Rx from 'rxjs/Rx';

const inputField  = document.querySelector('#input');
const activeItems = document.querySelector('#active');
const doneItems   = document.querySelector('#done');
const listItem    = todo => `<li>${todo.text}</li>`;

// Application state
// =================
// Subject type of Observable allows us to get data out (via subscribe)...
// and put data in via next method. eg: appState.next('data').
// Behaviour Subject expects you to start with an inital value
const appState = new Rx.BehaviorSubject({ todos: [] }); 

// Actions and dispatcher functions
// ==================================
const dispatcher = actionFn => (...args) => appState.next(actionFn(...args));
const action     = dispatcher(obj => ({ type: obj.type, data: obj.payload }));

// Reducer function
// ==================================
function reducer(state, action) {
    console.log('action->', action);
    switch(action.type) {
        case 'CREATE_TODO':
            return Object.assign(
                {}, 
                state,
                { todos: state.todos.concat([ { text: action.data, done: false } ]) }
            );
        default:
            return state || {};    
    }
}

// Update view function
// ==================================
function updateView(state) {
    activeItems.innerHTML = state.todos
        .filter(todo => !todo.done)
        .map(listItem) // Shorthand for .map(todo => listItem(todo))
        .join('');
}

// Subscribe and watch the state
// ==================================
// Scan method emits a new state every time new data comes in
// We then subscribe to the Observable that comes out of the scan() method
appState.scan(reducer).subscribe(updateView);

// Add tasks by dispatching actions
// ==================================
action({ type: 'CREATE_TODO', payload: 'my new task #1' });
action({ type: 'CREATE_TODO', payload: 'my new task #2' });
action({ type: 'CREATE_TODO', payload: 'my new task #3' });


// Handle DOM events
// Dispatch actions
// Reducer
// Update view