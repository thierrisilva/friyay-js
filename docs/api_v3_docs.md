NOTE: This is not a live API, we are only collecting ideas here

#### TOPICS FILTERS
- Change filters to narrow down type of filter
- The following assume a request like `/topics?FILTER_PREFIX[FILTER_NAME]=FILTER_VALUE`

|  FILTER_PREFIX   |      FILTER_NAME      | FILTER_VALUE OPTIONS |                    RESPONSE                   |
|------------------|-----------------------|----------------------|-----------------------------------------------|
| filter_scope     | groups                | group_ids            | topics within group by group_id               |
| filter_scope     | created_by            | user_id              | topics created_by user with user_id           |
| filter_scope     | followed_by_users     | user_ids             | topics that are followed by users in user_ids |
| filter_scope     | not_followed_by_users | user_ids             | topics not followed by users in user_ids      |
| filter_attribute | ANY ATTR OF TOPIC     | string               | topics where attribute equals value           |
|                  | EXAMPLE               |                      | `?filter_attribute[title]=red%20dawn`         |
|                  |                       |                      |                                               |