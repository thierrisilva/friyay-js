This is intended as a quick guide for new devs, to help them understand the current state of our
codebase, where it is headed, and the general philosophies with which to approach new components.


Background:
Friyay is built in React, and currently uses React Router 3.2 and Redux.  Our Redux implementation is recent and incomplete,
and rectifying this is a priority.  Likewise, an upgrade to React Router 4+ will be coming up.  More information on what to find where in
Redux can be found below.


Vocab:
- Some things have changed names over time, yet their server models retain their original name.  Some of them are still used interchangeably:
Domain == Hive
Topic used to be called a Hive.  Now it is just a Topic, as Domain == Hive
SubTopic used to be called SubHive
Tip or TipCard == Card



Notes on new/modified code:
Due to the evolution of the project and the number and variety of developers that have contributed to it, you'll find
the code in some components to be inconsistent, and may wonder what is new and what is old and what you should be following.
Please consider the following when building new features, fixing bugs, or enhancing existing code:

- Leave everything better than you found it.  If you are fixing a bug, and can solve it by fixing a function, but know a more concise or legible
  way to rewrite the function, do it.

- Readability is more important than terseness.  As we have many hands coming in and out of code, it is vital that a developer can read your function
  and easily work out what is going on.  If you have a choice between a 5 line function thats hard to read, and a 10 line function thats really obvious,
  go for the 10 lines.  That said, be smart, and make sure you are using the tools available to you (lodash, utility functions in the library,
  es6 spreads, etc)

- Don't Repeat Yourself (Or Anyone Else)! - If there is a function being performed somewhere in the app, and you also need to perform the same function,
  consider copying the function into the library and importing it.  While you're at it, see what you can do about refactoring the function :)

- If a UI element will be used more than once, make it a component.  Make sure that component is easy to find so others can use it.  If its already
  being used in other places but is not a component, pull that code out, write a component, then alter the other places to use the component.
  e.g the 'Like' button on a card

- If a bunch of elements are often used together, build them as individual components, then make another component that contains them all.
  We call the smaller components 'Elements' and the groupings 'Assemblies'. e.g. the 'Comment', 'Like' and 'Star' buttons on a card

- If an Elements purpose is to perform a function, where practical, make it perform that function.  If it needs to dispatch an action to Redux,
  make it do that.  Avoid passing functions through various intermediate components just to perform a function.  Do not use Context to pass it down.
  The exception to this rule is any async actions that call data down from the server (GET requests).  Consider why your component needs to get data
  from the server and if multiple instances of your component are going to make a bunch of subsequent calls.  If so, we need to hoist the call up
  to a higher component in the tree.

- If an Element is always used with a card only, save it in /components/shared/cards/elements.  Card-related Assemblies go in
  /components/shared/cards/elements/assemblies.  Likewise Elements and Assemblies relating only to topics/subtopics go in /components/shared/topics/..
  and label-related Elements and Assemblies go in /components/shared/labels...

- Don't build multiple components to arbitrarily reduce each page size.  While smaller components are better, first consider how you might
  refactor your code to make it more legible and have less going on.  Reducing the number of props and functions passed through a component
  that aren't directly used by that component will help.  If you must break pieces out into separate components, where possible try to find
  opportunities to break out pieces that might be used again.

- Don't create a component solely for the purpose of styling a single DOM element.  We can use CSS classes for that.




Notes on building Views:
The number and nature of Views available in Friyay has grown over time, and the incremental change has lead to a number of if/else and Switch
statements scattered through a number of components to control the logic of what UI is presented based on the users selected view.
Starting with this branch, we'll be installing some containers to manage view presentation.  In the /src/components/views folder you will find:

- ViewContainer:  This is a container that will ultimately be presented by the Cards, Topic, Topics, and User page.  It will hold the logic
  of when to show a Header (like the Topic Title), a Topic/Subtopic listing (like the hexagons), and a Card View (like the Grid View).

- DynamicHeaderContainer: This is presented by the ViewContainer any time a Header should be shown.  This container technically acts as a switch
  statement, allowing us to build any number of Header views as their own component, and wire them up to this container to have them presented
  when appropriate

- DynamicTopicContainer: This is presented by the ViewContainer any time a Topic/Subtopic listing should be shown.  This also acts as a switch
  statement, allowing us to build any number of Topic views as their own component, and wire them up to this container to have them presented
  when appropriate

- DynamicCardContainer: Like above, but for Card Views.  When building a new View for Cards, you are likely to need to build a new 'Card' component
  if the cards in your view are different to what already exists.  Save this component under components/shared/cards/ with an appropriate name.

- header_views, topic_views, card_views folders: These are the folders where you save the view component you have built.  Where practical, try to
  build an entire view as a single component, except where you are using a Card component you have built, or other reused UI elements/assemblies



Notes on Redux, and writing Actions:
Our current redux implementation acts as a flush-cache, where we call cards from the server, the server supplies them in the appropriate order,
and the array at /cards/collection in the redux tree is REPLACED.  That means your current source of truth for what cards to show, and in what order,
sits there.

We will be changing the redux implementation throughout the next few months to pull down cards and KEEP them in an object, with their IDs for keys.
This will put the onus on the front end to determine what cards to display and in what order.  This won't yet matter to anyone currently working with
card data.

If you need to dispatch an action to the redux store, please look hard to see if one has already been written.  We have a lot of actions already
in there, and it is likely that you will find what you need.  If you must write a new action, please give it a name that makes it really obvious
what it does and remember to put as much logic as possible into the function that calls the action - the reducer is only for updating state.
If you think your action will be used repeatedly, put the logic into a utility function in the library for others to use, rather than in the reducer.
e.g src/lib/card_actions

If you are connecting to the Redux store, do it as close to the Element calling the function as possible.  While not completely orthodox, connecting
an Element directly to the store to dispatch only a single function still makes that Element a lot easier for everyone to use than passing down
a function as a prop through three levels of the component tree.

If you are thinking about writing a new reducer to manage UI state, think harder.  Who else is going to care about what state your UI is in? Most
often this should sit in local state (e.g whether a menu is open or closed).



Notes on 3rd Party Packages/Libraries/Plugins:
Try to avoid adding third party packages for achieving something that won't be that difficult to build yourself.  If a package is essential
to deliver the functionality you need, or will save significant dev time, find a well supported package with high usage and request approval
from whoever has engaged you to complete the work.  Only do this after you've checked our package.json file to see if there is something already there
that you need.
