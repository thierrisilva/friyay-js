The purpose of the DataManager (DM) is to ensure the redux store has the data our components need,
while trying to prevent redundant or duplicate API calls. You don't HAVE to use the DM
to ensure your data is in the store, but doing so will ensure that other consumers of the same
data don't try to call it at the same time.  It works like this:

We configure certain data 'requirements' ( for an example, see newRedux/database/topics/dmRequirements ).

A requirement consists of:
1. An action that gets dispatched for this requirement ( e.g getTopics )
2. A 'key': a string ( or function that returns a string ) used to identify this specific requirement.
3. A 'test': a function that uses the key above and the history of calls made so far to determine if the action needs to be dispatched

Requirements are passed to the DM using its 'iRequire' function, it tests the requirements, and if a
requirement fails the test, the action is dispatched.  As an example:

DataManager.iRequire({
  subtopicsForTopics: {
    topicId: '12'
  },
  topic: {
    topicId: '12'
  }
})

Each of the above requirements will be tested against the relevant test, and their action dispatched if they fail.

NOTE:  The DM does NOT return your data - you will still get that from the redux store as per normal.
What it WILL return to you is an object with certain meta data from the API call, such as the current page,
the total number of pages (for index calls such as 'topics'), and a 'loadMore' function that can be called
at any time to call the next page of records if you require them.


The DM can be utilised directly by importing it into your component and calling its iRequire function when you establish
your data needs (such as componentDidMount or certain state changes), but you wil probably find it easier to use
one of the two components that take card of the logic for you:



The 'withDataManager' Higher Order Component:
This component allows you to preconfigure your data requirements based on props, and incorporates the redux 'connect' function
as well - giving you mapState and mapDispatch automatically.  You can preconfigure your requirements like this:

const dataRequirements = ( props ) => ({
  cardsForTopic: { topicId: props.topicId },
  subtopicsForTopic: { topicId: props.topicId },
  topic: { topicSlug: props.topicSlug },
});

export default withDataManager( dataRequirements, mapState, mapDispatch )([YourComponentName]);

- the withDataManager HOC will display a loading indicator when it first mounts and calls your data, only mounting
your component when the data is fetched and available in the redux store.  It will then send new requirements
to the DataManager if any relevant props change.
- the withDataManager HOC passes in a couple of props to your component that you can use if required:
dmLoading:  this is true if your dataRequirements are currently inflight
dmData: an object with keys to match your preconfigured data requirements, including the meta data and loadMore functions




the DMLoader component:
This is a simple loading indicator that you can place somewhere that you need a list of data, but for one reason or
other you do not want the data to get called on componentDidMount or to change on componentWillReceiveProps ( such as
lists that only display based on a state change -> see TaskViewTopicSection for an example )
The DMLoader is provided with your data requirements up front as props.  When it finds itself in the ViewPort, it will
pass your data requirements to the DataManager to get them.  Ensure the DMLoader is placed below where the data will be
rendered, as if there are more pages, it will call subsequent pages each time it enters the viewport, for automagic
infinite scrolling.  You can thank me later ;)
