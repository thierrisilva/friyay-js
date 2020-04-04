Our folder structure and approach to redux:

Abstractions:
- Helper functions to make implementing thunks simpler or more convenient

Actions:
- Are only interested in triggering a potential change in the store
- Are objects, or functions that return objects
- Have no async code
- Can be batched, as they are all asynchronous
- Use verbs that describe their impact on the store: add, change, delete, replace, setOpen, set[Attribute]
- Contain no logic
- Each dispatch of an action triggers a potential subscriber update
- NOTE: If you think you need to dispatch an Action, check first that there is not a corresponding Thunk - as some Actions will have a Thunk predecessor to make an API Call.


APICalls:
- All API Calls relating to the domain (mostly in the database subfolder)
- Thunks import the calls they need and call them appropriately


DMRequirements:
- Configuration of data requirements for use with the DataManager (see readme in src/dataManager)


Reducer:
- The reducer, duh!


Schema:
- The Schema and Normalizr functions for pushing database records into the redux store


Selectors:
- Are functions or Reselect Selectors for accessing state elements.
- Use Reselect extensively to memoize results for reduced computation
- Where likely to be used by multiple simultaneous components should provide a function to return an instance fo the selector


Thunks:
- Are middle-man functions between components and the store
- Take care of all async code
- Contain logic for determining which actions to dispatch, and preparing data for server calls or dispatching actions
- Dispatch one or more actions, or other Thunks if necessary
- When dispatching multiple actions, they batch them to reduce mapState updates
- Use verbs to describe what the user is doing: create, update, remove, move, toggle, open, close, do[Thing]
- Dispatching thunks does not trigger subscriber updates


Utilities:
- Any utility functions likely to be required by more than one thunk or component relating to this specific domain
