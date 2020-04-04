##### TIPHIVE API v2.0

API endpoint: https://api2.tiphive.com/v2
Updated: October 10, 2017 [New Items](#new)

### Table Of Contents

- [Sign-up/Registration](#sign-upregistration)
- [Sign-In/Login](#sign-inlogin)
- [Domains](#domains)
  - [Removing Users](#removing-users)
  - [Adding Users](#adding-users)
- [Joining Domains](#joining-domains)
- [Users](#userspeople)
  - [Using is_active to scope](#users-is-active)
- [User Profiles](#user-profile)
  - [UI Settings](#ui-settings)
- [Roles](#roles)
- [Topics](#topics)
  - [CRUD](#topics-crud-operations)
  - [Filters](#topics-filters)
- [Tips](#tips)
  - [Tip Filters](#tip-filters)
  - [Tips Archiving](#tips-archiving)
  - [Flag/Like/Star/Vote](#tips-flag-like-vote-star)
  - [Tip Reorder](#tip-reorder)
  - [Nesting Tips](#nesting-tips)
- [Tips Assigned to](#assigned-to)
- [Tip Assignments](#tip-assignments)
- [TipLinks](#tip-links)
- [Comments](#commentsanswers)
- [Groups](#groups)
  - [Group Membership](#group-membership)
- [Views](#views)
- [Search](#search)
- [Sharing](#sharing)
- [Follow/Unfollow](#followunfollow)
- [Flags](#flags)
- [Likes](#likes)
- [Stars](#stars)
- [Votes](#votes)
- [Invitations](#invitations)
- [Activity Permissions](#activity-permissions)
  - [Full Permissions Document](permissions.md)
- [Bulk Actions on selected tips](#bulk-actions)
  - [Archive](#archive)
  - [Organize](#organize)
  - [Share](#share)

### NEW

- [Views](#views)
- [Removing Users](#removing-users)
- [Adding Users](#adding-users)
- [Nesting Tips](#nesting-tips)

* [UI Settings](#ui-settings)
* [Tip Reorder](#tip-reorder)

Notes:

- Some listing functions are always paginated with a default of 25 records per page
- you can customize using parameter `page[number]`, for example: `/tips?page[number]=1`
- You could set parameter `page[size]` to set number of items returned per page, for example `/tips?page[number]=1&page[size]=10`

Common Headers for Every Request:

- `Content-Type: application/vnd.api+json`
- `X-Tenant-Name:` value of `public` or ``n Name`
- The following are only required after signing in
  - `Authorization: Bearer [user_auth_token from signin]`

##### TO CHANGE DOMAINS

- You must set the header X-Tenant-Name to an existing domain name

### SIGN-UP/REGISTRATION

---

#### POST `/registrations`

_Create a new user_

- If on a private domain, we check for invitation_required
  - If an invitation is required and the form submits a token, we check if token is valid
    - If the token is valid, we join allow the user to join, regardless of restrictions
  - If an invitation is required and no invitation token is given
    - We give an error 'This domain requires an invitation'
  - If the private domain allows certain email domains to register without an invitation
    - We check if the user's email address submitted to join matches one of the allowed domains
    - If it matches, we allow the registration
    - If it does not match, we give error 'You must have a company email address.'

| param                        | value | req? | notes                                        |
| ---------------------------- | ----- | ---- | -------------------------------------------- |
| user[:email]                 |       | yes  |                                              |
| user[:password]              |       | yes  |                                              |
| user[:password_confirmation] |       | yes  |                                              |
| user[:first_name]            |       | yes  |                                              |
| user[:last_name]             |       | yes  |                                              |
| invitation_token             |       | no   | token generated when someone invites someone |

#### GET `/registrations/confirm?confirmation_token=:confirmation_token`

_Confirm user account using confirm token_

### SIGN-IN/LOGIN

---

- `POST /sessions` - Log user in
- param: user[email]
- param: user[password]
- return: user data and authentication_token to use in other requests

### DOMAINS

---

#### Notes

- Domains is a global table
- DomainMemberships is a global table that records user connections to domains
- 'public' is the default Tenant. It has no domain
- current_domain is either the domain of the current_tenant, or if 'public' is a temporary Domain.new
  - There is a method domain.users which scopes users by domains, or grabs all if Tenant is 'public'
- Most resources, if not all, will be scoped by domain
- There is no way currently for resources from one domain to be connected or returned to another domain

#### GET `/domains`

_List of domains the current_user is a member of_

#### GET `/domains/:tenant_name/show`

_Show a specific domain by tenant_name_

#### POST `/domains/search`

_Search for domains with a certain name or tenant name_

| param        | values                  | req? | notes                                |
| ------------ | ----------------------- | ---- | ------------------------------------ |
| filter[name] | any string              | yes  |                                      |
| EXAMPLE      | `?filter[name]=tiphive` |      | returns all domains matching tiphive |

#### POST `/domains`

_Create a new domain_

| param                    | value                                 | req? | notes                                              |
| ------------------------ | ------------------------------------- | ---- | -------------------------------------------------- |
| name                     | any string                            | yes  |                                                    |
| EXAMPLE                  | `?name=Carolina%20Panthers`           | ===  | ===                                                |
| tenant_name              | alpha numeric string                  | yes  | "-" allows, no spaces                              |
|                          | `?tenant_name=carolina-panthers`      |      |                                                    |
| logo                     | TBD                                   | no   |                                                    |
| background_image         | TBD                                   | no   |                                                    |
| remote_logo_url          | URL                                   | no   |                                                    |
| remote_background_image  | URL                                   | no   |                                                    |
| join_type                | ['invitation_required','open']        | no   | defaults to invitation_required                    |
|                          | `?join_type=invitation_required`      |      |                                                    |
| email_domains            | array of domains like                 | no   | acceptable email will override invitation_required |
|                          | `?email_domains=test.com,tiphive.com` |      |                                                    |
| allow_invitation_request | true or false                         | no   |                                                    |

#### PATCH `/domains/:id`

_Updates domain with given :id_

| param             | value | req? | notes |
| ----------------- | ----- | ---- | ----- |
| SEE CREATE PARAMS |       |      |       |

#### REMOVING USERS

---

#### Intro:

- Currently, to remove a user, you call `/domains/remove_user` with a data payload of
- this will always use the current domain

```json
{
  "user_id": "ID of user to remove",
  "reassign_user_id": "Optional id of user to reassign content to"
}
```

#### ADDING USERS

---

#### Intro:

- Currently, to add a user, you call `/domains/remove_user` with a data payload of
- this will always use the current domain

```json
{
  "user_id": "ID of user to add"
}
```

#### JOINING DOMAINS

---

#### Two methods:

- When registering a new user
  - See [Sign-up/Registration](#sign-upregistration)
- When logging in -- THIS HAS YET TO BE DETERMINED

#### POST `/domains/:tenant_name/join`

_Allows currently logged in user to join a domain if allowed_

| param       | value              | req? | notes |
| ----------- | ------------------ | ---- | ----- |
| tenant_name | domain tenant_name | yes  |       |

#### POST `/domains/add_user`

_Add a user to domain_
_Will use current_domain_

- Example Payload

```json
{
  "user_id": "ID of user to add"
}
```

| param   | value   | req? | example | notes |
| ------- | ------- | ---- | ------- | ----- |
| user_id | user id | yes  |         |       |

### USERS/PEOPLE

---

#### Notes

- Users is a global table
- DomainMemberships is a global table that records user connections to domains

#### GET `/users/explore`

_List of users following the same hives and not being followed by default_

| param         | value                                    | req? | notes                                                        |
| ------------- | ---------------------------------------- | ---- | ------------------------------------------------------------ |
| filter[users] | following, followers, all                | no   | changes which users are returned. removes 'same hives' scope |
| EXAMPLE       | `/users/explore?filter[users]=following` | ---  |                                                              |

#### GET `/users`

_List of users. Defaults to current_user.following_

| param               | value                                    | req? | notes                                                                   |
| ------------------- | ---------------------------------------- | ---- | ----------------------------------------------------------------------- |
| filter[users]       | following, followers, all, not_following | no   | if not_following, will find users following same hives                  |
| EXAMPLE             | `/users?filter[users]=following`         | ---  |                                                                         |
| filter[users][name] | first, last, or email to find            | no   |                                                                         |
|                     | `/users?filter[users][name]=bob`         |      | will find users with first_name, last_name or email having 'bob' inside |
|                     | `/users?include=user_profile`            | no   | will include user profile                                               |

#### Users is active

_to filter users by active or not active_

- Use `/users?filter[is_active]=false` to list inactive users
- Use `/users?filter[is_active]=true` to list active users
- Use `/users?filter[is_active]='all'` to list all users

#### POST `/users/:id/follow`

_Current user will follow the user with the given :id_

#### POST `/users/:id/unfollow`

_Current user will stop following the user with the given :id_

#### POST `/users/:id/follow_all_topics`

_Current user will follow the topics the given user is following_

- If User A is following Topics 3,4,5 and User B follows User A then User B will be now follow Topics 3,4,5

#### PATCH `users/:id/domain_roles`

_Updates user role for domain_
| param | value | req? | example | notes |
|---------------------------------------------------|---------------|------|-------------|----------------------------------|
| role | string | yes | |

### USER PROFILE

---

#### POST `/users/:user_id/user_profile`

_Update user and profile_

- For updating email notifications send array of hash email_notifcations: { someone_likes_question: 'weekly', someone_add_tip_to_topic: 'daily' }

- Available options for notification keys [
  :someone_likes_tip,
  :someone_likes_question,
  :someone_add_tip_to_topic,
  :someone_shared_topic_with_me,
  :someone_shared_tip_with_me,
  :someone_shared_question_with_me,
  :someone_comments_on_tip,
  :someone_added_to_group,
  :someone_added_to_domain
  ]

- Available options for notification frequency value is %w(always daily weekly never)

| param                                              | value   | req? | example | notes                                    |
| -------------------------------------------------- | ------- | ---- | ------- | ---------------------------------------- |
| email_notifcations                                 | hash    | no   |         | someone_likes_question: 'weekly'         |
| attributes[avatar]                                 | file    | no   |         |                                          |
| attributes[background_image]                       | file    | no   |         |                                          |
| attributes[remote_avatar_url]                      | link    | no   |         |                                          |
| attributes[remote_background_image_url]            | link    | no   |         |                                          |
| attributes[follow_all_members]                     | boolean | no   |         |                                          |
| attributes[follow_all_hives]                       | boolean | no   |         |                                          |
| attributes[user_attributes][id]                    | integer | yes  |         |                                          |
| attributes[user_attributes][first_name]            | string  | no   |         |                                          |
| attributes[user_attributes][last_name]             | string  | no   |         |                                          |
| attributes[user_attributes][email]                 | string  | no   |         |                                          |
| attributes[user_attributes][password]              | string  | no   |         |                                          |
| attributes[user_attributes][password_confirmation] | string  | no   |         | required when changing password          |
| attributes[user_attributes][current_password]      | string  | no\* |         | required when changing email or password |

#### UI Settings

_Update UI Preferences_

Example Payload to change hex_panel to false

```json
{
  "id": user.user_profile.id,
  "user_id": user.id,
  "data": {
    "attributes": {
      "user_attributes": {
        "id": user.id
      }
    },
    "ui_settings": {
      "topic_view_filter": {},
      "hex_panel": false
    }
  }
}
```

### ROLES

---

#### POST `/topics/:topic_id/roles`

_Create a role for a hive_

| param   | value  | req? | example | notes |
| ------- | ------ | ---- | ------- | ----- |
| user_id | id     | yes  |         |       |
| role    | string | yes  |         |       |

#### POST `/topics/:topic_id/roles/remove`

_Remove a role on hive_

| param   | value  | req? | example | notes |
| ------- | ------ | ---- | ------- | ----- |
| user_id | id     | yes  |         |       |
| role    | string | yes  |         |       |

#### GET `/domain_roles`

_Get all roles for domain_

### TOPICS

---

#### TOPICS: CRUD Operations

---

#### TOPICS CREATE: POST `/topics`

_Create a topic_
_Params listed below are typically sent via JSON payload_

#### Request Format:

_Minimum to create_

```json
{
  "data": {
    "type": "topics",
    "attributes": {
      "title": "Test Topic Title"
    }
  }
}
```

_An extended create, with user_followers_

```json
{
  "data": {
    "type": "topics",
    "attributes": {
      "title": "Test Topic from Postman 3"
    },
    "relationships": {
      "user_followers": {
        "data": [{ "id": "7992", "type": "users" }]
      }
    }
  }
}
```

| param                                                             | value           | req?  | notes                     |     |
| ----------------------------------------------------------------- | --------------- | ----- | ------------------------- | --- |
| id                                                                | topic id        | yes   |                           |     |
|                                                                   | `/topics/1`     |       |                           |     |
| title                                                             | string          | yes   |                           |     |
| description                                                       | text            | no    |                           |     |
| parent_id                                                         | a topic id      | no    | creates a subtopic        |     |
| relationships[topic_preferences]                                  | array of hash   | yes\* | not required, recommended |     |
| relationships[topic_preferences][0][data][background_image]       | image           | no    |                           |     |
| relationships[topic_preferences][0][data][background_color_index] | image           | no    |                           |     |
| relationships[topic_preferences][0][data][share_following]        | image           | no    |                           |     |
| relationships[topic_preferences][0][data][share_public]           | image           | no    |                           |     |
| relationships[group_followers][data]                              | array of hashes | no    |                           |     |
| relationships[user_followers][data]                               | array of hashes | no    | can be users or emails    |     |
| relationships[list_followers][data]                               | array of hashes | no    |                           |     |

---

#### TOPICS READ ALL FOLLOWING: GET `/topics`

_List of current user connected hives (my_hives)_

- Defaults to **current_user.following_topics.roots** (The hives a the user is following)

| param           | value        | req? | example                                | notes                                                                                               |
| --------------- | ------------ | ---- | -------------------------------------- | --------------------------------------------------------------------------------------------------- |
| parent_id       | a topic id   | no   | `/topics?parent_id=1`                  | Use this when viewing a Hive to get `subtopics. Only subtopics of topic with parent_id will show |` |
| sort[fieldname] | asc or desc  | no   | `/topics?sort[created_at]=desc`        | topics sorted by field                                                                              |
| page[number]    | page number  | no   | `/topics?page[number]=1`               |                                                                                                     |
| page[size]      | # of records | no   | `/topics?page[number]=1&page[size]=10` |                                                                                                     |

---

#### TOPICS READ ALL IN DOMAIN: GET `/topics/?search_all_hives=true`

_List all Topics in the domain regardless of following or not_

---

#### TOPICS FILTERS

- The following assume a request like `/topics?filter[FILTER_NAME]=FILTER_VALUE`
- You can chain them as well `/topics?filter[within_group]=:group_id&filter[created_by]=:user_id`
- When more than one filter is applied, their intersection is taken i.e. topics which satisfy all the filters will be return. If you want to instead get topics which satisfy atleast one filter use `filter[combine_with]="OR"`

| FILTER_NAME          | FILTER_VALUE OPTIONS | RESPONSE                               |
| -------------------- | -------------------- | -------------------------------------- |
| within_group         | group_id             | topics within group_id                 |
| created_by           | user_id              | topics created_by user with user_id    |
| followed_by_user     | user_id              | topics that are followed by user_id    |
| not_followed_by_user | user_id              | topics not followed by user_id         |
| shared_with          | user_id              | topics shared with user_id             |
| type                 | liked                | topics like by current_user            |
| type                 | starred              | topics starred by current_user         |
| combine_with         | "OR"                 | topics that satisfy atleast one filter |

---

#### TOPICS READ ONE: GET `/topics/:id`

###### Example Response

- _NOTE_:attributes.default_view_id May be null

```
{
  "data": {
    "id": 10,
    "type": "topics",
    "attributes": {
      "title": "Recruitment",
      "description": "",
      "slug": "10-recruitment",
      "user_id": 2,
      "created_at": "2012-01-01T12:00:00.000Z",
      "path": [
        {
          "id": 10,
          "type": "topics",
          "title": "Recruitment",
          "slug": "10-recruitment"
        }
      ],
      "kind": "Hive",
      "starred_by_current_user": "true",
      "tip_count": 10,
      "default_view_id": 34
    },
    "relationships": {
      "parent": {
        "data": null
      },
      "children": {
        "data": [
          {
            "id": "3292",
            "type": "topics"
          },
          {
            ...
          }
        ]
      },
      "topic_preferences": {
        "data": [
          {
            "id": 11456,
            "type": "topic_preferences",
            "background_color_index": 1,
            "background_image_url": null,
            "share_following": false,
            "share_public": true
          }
        ]
      },
      "share_settings": {
        "data": [
          null, // Returss null if object can't be found
          {
            "id": 20,
            "sharing_object_id": 6629,
            "sharing_object_type": "User",
            "sharing_object_name": "Perry Keys",
            "shareable_object_avatar": null
          },
          {
            //... Repeated for each sharing object
          }
        ]
      },
      "question_followers": {
        "data": []
      },
      "user_followers": {
        "data": [
          {
            "id": "6873",
            "type": "users"
          },
          {
            //...
          }
        ]
      },
      "group_followers": {
        "data": []
      },
      "list_followers": {
        "data": []
      },
      "contexts": {
        "data": [
          {
            "context_uniq_id": "user:6873:domain:131:group:1:topic:1",
            "created_at": "2017-07-26T21:01:28.212Z",
            "updated_at": "2017-11-13T15:57:52.639Z",
            "name": null,
            "default": false,
            "topic_id": 1
          },
        ]
      }
    }
  }
}
```

---

#### TOPICS UPDATE: `PATCH /topics/[:id]`

_Update an existing topic_
_Params listed below are typically sent via JSON payload_

###### Minimum Request Example

```json
{
  "data": {
    "id": 15,
    "type": "topics",
    "attributes": {
      "title": "An updated topic title"
    }
  }
}
```

| param                                                             | value           | req?  | notes                     |     |
| ----------------------------------------------------------------- | --------------- | ----- | ------------------------- | --- |
| id                                                                | topic id        | yes   |                           |     |
|                                                                   | `/topics/1`     |       |                           |     |
| title                                                             | string          | yes   |                           |     |
| description                                                       | text            | no    |                           |     |
| parent_id                                                         | a topic id      | no    | creates a subtopic        |     |
| relationships[topic_preferences]                                  | array of hash   | yes\* | not required, recommended |     |
| relationships[topic_preferences][0][data][background_image]       | image           | no    |                           |     |
| relationships[topic_preferences][0][data][background_color_index] | image           | no    |                           |     |
| relationships[topic_preferences][0][data][share_following]        | image           | no    |                           |     |
| relationships[topic_preferences][0][data][share_public]           | image           | no    |                           |     |
| relationships[group_followers][data]                              | array of hashes | no    |                           |     |
| relationships[user_followers][data]                               | array of hashes | no    | can be users or emails    |     |
| relationships[list_followers][data]                               | array of hashes | no    |                           |     |

Example of user_followers hash -

```json
{
  "data": {
    "id": 15,
    "type": "topics",
    "attributes": {
      "title": "An updated topic title"
    },
    "relationships": {
      "user_followers": {
        "data": [
          { "id": "everyone", "type": "users" },
          { "id": "1", "type": "users" },
          { "id": "testhiveinvite@share.com", "type": "emails" }
        ]
      }
    }
  }
}
```

#### TOPICS: Sharing

---

_See the create/update options for topics_
_You must include relationships data in request_

- Send a list of ids to follow, API will remove/add appropriate connections

###### Topic Sharing Specs:

- Remember: This is ONLY to provide a way to affect the current_users Tips
  - You "share" all tips in hive by changing settings
  - The settings then become the default for new tips
  - This is an additive process only. You cannot remove settings for a tip
- Share Setting Behavior
  - You must create a new share setting when a user is selected
  - You must remove the share setting when a user is de-selected
- Follow Behavior
  - You may create a new follow when a user is selected
  - You may not remove a follow when a user is de-selected

#### TOPICS: Other

---

#### GET `/topics/explore`

_List of Hives to be explored_

- The topic list is currently topics followed by EDITOR_EMAIL
- The default filter is topics not being followed

| param          | value         | req? | example                                        | notes      |
| -------------- | ------------- | ---- | ---------------------------------------------- | ---------- |
| filter[topics] | not_following | no   | `/topics/explore?filter[topics]=not_following` | Future Use |
| page[number]   | page number   | no   | `/topics/explore?page[number]=1`               |            |
| page[size]     | # of records  | no   | `/topics/explore?page[number]=1&page[size]=10` |            |

#### GET `/topics/suggested_topics`

_A list of suggested titles of topics_

#### Response Format:

```json
{
  "data": [
    {
      "id": global_template.id,
      "type": 'global_templates',
      "attributes": {
        "title": global_template.title
      }
    },
    {...}, {...}
  ]
}
```

#### GET `/topics/:topic_id/tips`

_Get `a list of tips that belong to a topic with :id_`

#### POST `/topics/[:id]/join`

_Join (follow) a topic_

#### DELETE `/topics/[:id]`

_Remove a topic with all sub topics_

| param              | value      | req? | example     | notes                     |
| ------------------ | ---------- | ---- | ----------- | ------------------------- |
| id                 | topic id   | yes  | `/topics/1` |                           |
| notify             | boolean    | no   |             | notify followers          |
| alternate_topic_id | integer    | no   |             | move tips to this topic   |
| move_tip_ids       | :all/Array | no   |             | all/Array tip ids to move |

#### POST `/topics/[:id]/move`

_Move subtopic_

| param              | value    | req? | example     | notes                       |
| ------------------ | -------- | ---- | ----------- | --------------------------- |
| id                 | topic id | yes  | `/topics/1` |                             |
| alternate_topic_id | integer  | yes  |             | move subtopic to this topic |

#### POST `/topics/[:id]/share_with_relationships`

_Share a topic with provided relationships_

- Relationships should be provided in the json data payload

<a name="tip_flag"></a>

<!-- An anchor for some docs later -->

### TIPS

---

#### TIPS: CRUD operations

---

#### GET `/tips`

_Retrieve a list of tips_

#### GET `/topics/:topic_id/tips`

_Listed here as an alternative way to retrieve tips for a specific topic_

#### GET `/cards/:id`

_Retrieve a single tip(card)_

#### POST `/tips`

_Create a new tip_

**NOTE:** user_followers can accept an option 'Everyone' and/or 'Following'

```json
{
  "data": {
    "type": "tips",
    "attributes": {
      "title": "Tip Title",
      "body": "Tip Body copy",
      "start_date": date,
      "due_date": date,
      "completion_date": date,
      "completed_percentage": 20,
      "work_estimation": 20,
      "share_following": false,
      "share_public": true
    },
    "relationships": {
      "subtopics": {
        "data": [
          { "id": topic_id, "type": "topics" },
          { "id": another_topic_id, "type": "topics" }
        ]
      },
      "user_followers || list_followers || group_followers": {
        "data": [
          { "id": user_id, "type": "users || lists || groups" },
          { "id": another_user_id, "type": "users || lists || groups" }
        ]
      },
      "attachments": {
        "data": [
          { "id": attachment_id, "type": "attachments" },
          { "id": another_attachment_id, "type": "attachments" }
        ]
      },
      "parent_tip": {
        "data": { "id": parent_tip_id, "type": "tips" }
      }
    }
  }
}
```

| param                                | value                         | req? | notes                            |
| ------------------------------------ | ----------------------------- | ---- | -------------------------------- |
| title                                |                               | yes  |                                  |
| body                                 |                               | yes  |                                  |
| start_date                           | date                          | no   |                                  |
| due_date                             | date                          | no   |                                  |
| completion_date                      | date                          | no   |                                  |
| completed_percentage                 | integer                       | no   |                                  |
| work_estimation                      | integer                       | no   |                                  |
| relationships[subtopics][data]       | array of topic_ids            | no   |                                  |
|                                      | {id: id, type: "topics"}      |      |                                  |
| relationships[user_followers][data]  | array of user_ids             | no   | users will follow tip            |
|                                      | {id: id, type: "users"}       |      |                                  |
|                                      | OPTIONAL id: 'Everyone'       |      | will set the tip to share_public |
|                                      | OPTIONAL id: 'Following'      |      | will set tip to share_following  |
| relationships[list_followers][data]  | array of list_ids             | no   | lists of users will follow tip   |
|                                      | {id: id, type: "lists"}       |      |                                  |
| relationships[group_followers][data] | array of group_ids            | no   | groups will follow tip           |
|                                      | {id: id, type: "groups"}      |      |                                  |
| relationships[attachments][data]     | array of attachment_ids       | no   | will connect attachments to tip  |
|                                      | {id: id, type: "attachments"} |      |                                  |

#### PATCH `/cards/:id`

_Update a certain tip_
_See Create for a list of attributes_

#### DELETE `/cards/:id`

_Delete a certain tip_

#### TIPS: Share Settings

---

_See the create/update options for tips_
_You must include relationships data in request_

- Send a list of ids to follow, API will remove/add appropriate connections

#### TIP Filters

---

##### GET `/tips?filter[assigned_to]=`

_Filter tips assigned to a user id_

| param       | value   | req? | notes |
| ----------- | ------- | ---- | ----- |
| assigned_to | user id | yes  |       |

Example: `/tips?filter[assigned_to]=55` should find tips assigned to user with id 55

#### TIPS Archiving

---

#### POST `/cards/:id/archive`

_Archive a tip_
_Should not allow someone to archive if they are not allowed to edit/update the Tip(Card)_

#### POST `/cards/:id/unarchive`

_Unarchive a tip_

#### TIPS: Flag, like, vote, star

---

#### POST `/cards/:id/flag`

_Flag a tip with reason_

```
{
  data: {
    id: tip.id,
    type: 'tips',
    reason: 'Flagger Reason'
  }
}
```

| param  | value  | req? | notes               |
| ------ | ------ | ---- | ------------------- |
| id     | tip id | yes  |                     |
| reason | string | no   | reason for flagging |

#### POST `/cards/:id/like`

_Like a tip_

| param | value  | req? | notes |
| ----- | ------ | ---- | ----- |
| id    | tip id | yes  |       |

#### POST `/cards/:id/unlike`

_Unike a tip_

| param | value  | req? | notes |
| ----- | ------ | ---- | ----- |
| id    | tip id | yes  |       |

#### POST `/cards/:id/star`

_Star a tip_

| param | value  | req? | notes |
| ----- | ------ | ---- | ----- |
| id    | tip id | yes  |       |

#### POST `/cards/:id/unstar`

_Unstar a tip_

| param | value  | req? | notes |
| ----- | ------ | ---- | ----- |
| id    | tip id | yes  |       |

#### POST `/cards/:id/upvote`

_Upvote a tip_

| param | value  | req? | notes |
| ----- | ------ | ---- | ----- |
| id    | tip id | yes  |       |

#### POST `/cards/:id/downvote`

_Downvote a tip_

| param | value  | req? | notes |
| ----- | ------ | ---- | ----- |
| id    | tip id | yes  |       |

### TIP REORDER

---

#### POST `/cards/:id/reorder?position=&topic_id=&context_id=`

_Move a tip to a new position within a context_

_When using this endpoint, the API will automatically pickup user and domain(Hive)_

_If you are within a Topic, the url should include a topic_id_

| param      | value       | req? | notes                                                                      |
| ---------- | ----------- | ---- | -------------------------------------------------------------------------- |
| :id        | tip_id      | yes  | the id of the tip                                                          |
| position   | any integer | yes  | where you would like the Tip                                               |
| topic_id   | topic id    | yes  | optional topic id if withing a topic                                       |
| context_id | context_id  | no   | `user:1:domain:1:topic:1` use only if changing order NOT from current user |
| EXAMPLE    |             |      | `/cards/555/reorder?position=1&topic_id=8`                                 |
|            |             |      | This would move a tip with id 555 to the first position within the topic 8 |

### NESTING TIPS

---

#### POST `/tips`

_Creating a new tip that is a child of another tip_
_Same syntax as creating a new tip, but add a relationship of parent_tip_

```json
{
  "data": {
    "type": "tips",
    "attributes": {
      "title": "Tip Title",
      "body": "Tip Body copy"
    },
    "relationships": {
      "parent_tip": {
        "data": { "id": parent_tip_id, "type": "tips" }
      }
    }
  }
}
```

#### POST `/connections`

_Creates connections between two resources_
_In this case, a tip can follow another tip, creating a nested tip_

Requires a follower and a followable (parent tip)
Example Payload, this will make Tip 45 a nested tip of Tip 20

```json
// CREATE CONNECTION
{
  "data": {
    "attributes": {
      "next": {
        "follower": { "id": ID, "type": TYPE },
        "followable": { "id": ID, "type": TYPE }
      }
    }
  }
}

// UPDATE EXISTING CONNECTION (MOVING SOMETHING)
{
  "data": {
    "attributes": {
      "previous": {
        "follower": { "id": ID, "type": TYPE },
        "followable": { "id": ID, "type": TYPE }
      },
      "next": {
        "follower": { "id": ID, "type": TYPE },
        "followable": { "id": ID, "type": TYPE }
      }
    }
  }
}

// DELETE A CONNECTION (not the resource)
{
  "data": {
    "attributes": {
      "previous": {
        "follower": { "id": ID, "type": TYPE },
        "followable": { "id": ID, "type": TYPE }
      }
    }
  }
}
```

### ASSIGNED TO

---

#### GET `/assigned_to?user_ids=`

_Find tips assigned to users using user_ids_

| param    | value    | req? | notes              |
| -------- | -------- | ---- | ------------------ |
| user_ids | user ids | yes  | should be an array |

Example: `/assigned_to?user_ids=[1,2,3]` would return tips assigned to users with ids 1, 2, 3

### TIP ASSIGNMENTS

---

#### POST `/tip_assignments?tip_id=&user_id=`

_Create a new tip assignment given tip_id and user_id_

| param   | value             | req? | notes |
| ------- | ----------------- | ---- | ----- |
| tip_id  | tip id            | yes  |       |
| user_id | user id to assign | yes  |       |

Example: `/tip_assignments?tip_id=1&user_id=55` would assign the tip with the id 1 to user with id 55

### TIPLINKS

---

#### POST `/cards/:tip_id/tip_links/fetch`

_Fetch or create tip link for a tip_

| param     | value  | req? | notes |
| --------- | ------ | ---- | ----- |
| tip_id    | tip id | yes  |       |
| data[url] | url    | yes  |       |

#### DELETE `/tip_links/:id`

_Destroy a tip link_

### COMMENTS

---

### SEARCH

---

#### NOTES:

- Search is scoped by domain
- IMPORTANT!!! CURRENLY USERS ARE NOT SCOPED BY DOMAIN

#### GET `/search`

_Allows us to search all or select resources_

| param        | value                                            | req? | notes                                |
| ------------ | ------------------------------------------------ | ---- | ------------------------------------ |
| q            | search string                                    | yes  | used alone will search all resources |
| EXAMPLE      | `/search?q=puppy`                                | ---  | ---                                  |
| resources    | one or more of user, topic, tip, group, question | no   | will only search for given resources |
| EXAMPLE      | `/search?q=puppy&resources=topic,tip`            | ---  | note what is plural vs singular      |
| page[number] | integer                                          | no   | triggers pagination                  |
| EXAMPLE      | `/search?q=puppy&page[number]=1`                 | ---  | ---                                  |
| page[size]   | integer                                          | no   | changes how many results per page    |
| EXAMPLE      | `/search?q=puppy&page[number]=1&page[size]=5`    | ---  | ---                                  |

### COMMENTS/ANSWERS

---

#### GET `/cards/:tip_id/comments`

_List of comments belonging to a tip_

#### POST `/cards/:tip_id/comments`

_Create a comment to a tip_

**NOTE:** location params are not supported at this time. They may never be

| param     | value     | req? | notes         |
| --------- | --------- | ---- | ------------- |
| title     | title     | no   |               |
| body      | body      | yes  |               |
| latitude  | latitude  | no   | NOT SUPPORTED |
| longitude | longitude | no   | NOT SUPPORTED |
| location  | location  | no   | NOT SUPPORTED |

#### PATCH `/comments/:id`

_UPDATE an existing comment_

| param | value | req? | notes |
| ----- | ----- | ---- | ----- |
| title | title | no   |       |
| body  | body  | yes  |       |

#### POST `/comments/:id/reply`

_Create a replay to an existing comment_

| param      | value | req? | notes                                       |
| ---------- | ----- | ---- | ------------------------------------------- |
| comment_id |       | yes  | The comment to which the reply should apply |
| title      | title | no   |                                             |
| body       | body  | yes  |                                             |

#### DELETE /comments/:comment_id

_Removes a comment_

#### POST `/comments/:id/flag`

_Flag a comment with reason_

| param  | value      | req? | notes               |
| ------ | ---------- | ---- | ------------------- |
| id     | comment id | yes  |                     |
| reason | string     | no   | reason for flagging |

### GROUPS

---

#### LIST ALL: `GET /groups`

_Returns both groups that user created and following(member of)_

###### Response Format

```json
{
  "data": [
    {
      "id": "1",
      "type": "groups",
      "attributes": {
        "title": "Group Title",
        "description": "Group Description",
        "color_index": "8",
        "user_followers_count": 1
      },
      "relationships": {
        "user_followers": {
          "data": [
            {
              "id": "321",
              "type": "user"
            }
          ]
        }
      }
    }
  ]
}
```

#### READ ONE: `GET /groups/:id`

_Returns one group given the id_

###### Response Format (Note relationships return array)

```json
{
  "data": {
    "id": "1",
    "type": "groups",
    "attributes": {
      "title": "Group Title",
      "description": "Group Description",
      "color_index": "8",
      "user_followers_count": 1
    },
    "relationships": {
      "user_followers": { "data": [{ "id": "321", "type": "users" }] },
      "topic_followers": { "data": [{ "id": "22", "type": "topics" }] }
    }
  },
  "included": {
    "//": "this is optional and returns larger set of attrs",
    "type": "users",
    "id": "321",
    "attributes": {
      "user_attr_key": "user_attr_value"
    }
  }
}
```

###### Options

| URL params | value                           | req? | notes |
| ---------- | ------------------------------- | ---- | ----- |
| include    | comma separated resources       | no   |       |
|            | `groups/1?include=users,topics` |      |       |

#### CREATE: `POST /groups`

_Create a new group_

- Pass user_followers to add users to the Group
- Pass subtopics to connect Hives to the Group

###### Request Example

```json
{
  "data": {
    "type": "groups",
    "attributes": {
      "title": "Group Title"
    },
    "relationships": {
      "//": "Relationships are optional"
      "user_followers": {
        "data": [
          { "id": "450", "type": "users" },
          { "id": "1332", "type": "users" }
        ]
      },
      "subtopics": {
        "data": [
          { "id": "9811", "type": "topics" }
        ]
      }
    }
  }
}
```

###### Response after creating a group

_Contains any relationships that may exist_

```json
{
  "data": {
    "id": "1",
    "type": "groups",
    "attributes": {
      "title": "Group Title",
      "description": null,
      "color_index": 8,
      "user_followers_count": 2
    },
    "relationships": {
      "user": {
        "data": { "id": "6873", "type": "users" }
      },
      "user_followers": {
        "data": [
          { "id": "450", "type": "users" },
          { "id": "6873", "type": "users" }
        ]
      },
      "topics": {
        "data": [
          {
            "id": "9811",
            "slug": "9811-a-hive-for-mixpanel",
            "type": "topics",
            "hive": "A Hive for MixPanel",
            "hive_slug": "9811-a-hive-for-mixpanel",
            "hive_url": "http://api.tiphive.dev/v2/topics/9811-a-hive-for-mixpanel",
            "title": "A Hive for MixPanel",
            "topic_path_string": null,
            "url": "http://api.tiphive.dev/v2/topics/9811-a-hive-for-mixpanel"
          }
        ]
      },
      "subtopics": {
        "data": []
      }
    }
  }
}
```

#### UPDATE `PATCH /groups/:id`

_Update an existing group identified by :id_
_NOTE: the user_followers is a destructive action, only what is included will be maintained_

###### Request Example - Comments are not included in response

```json
{
  "data": {
    "id": "1",
    "type": "groups",
    "attributes": {
      "title": "Updated Group Title"
    },
    "relationships": {
      "//": "IMPORTANT! Existing relationships will be changed ",
      "//": "depending on what is in here",
      "user_followers": {
        "data": [{ "id": "124", "type": "users" }]
      },
      "subtopics": {
        "data": [{ "id": "9811", "type": "topics" }]
      }
    }
  }
}
```

###### Response after updating a group

```json
{
  "data": {
    "id": "1",
    "type": "groups",
    "attributes": {
      "title": "Updated Group Title",
      "description": null,
      "color_index": 8
      "user_followers_count": 2
    },
    "relationships": {
      "user": {
        "data": { "id": "6873", "type": "users" }
      },
      "user_followers": {
        "data": [
          { "id": "124", "type": "users" },
          { "id": "6873", "type": "users" }
        ]
      }
    }
  }
}
```

#### DELETE `DELETE /groups/:id`

_Deletes a group, use with caution_

- No need to include a json payload
- You will receive the code 204 - no content from the server
- You will not receive any JSON response

---

---

### GROUP MEMBERSHIP

---

#### CREATE `POST /groups/:id/group_memberships`

_Allows a user to join a group with :id_

- Just point to a group with an id and create a new membership
- You may send a single user
- Of you may send an array of users
- Returns a list of current members for that group

###### Example Requests

```json
{
  "data": { "id": "7269", "type": "users" }
}
```

```json
{
  "data": [{ "id": "7269", "type": "users" }, { "id": "7269", "type": "users" }]
}
```

###### Example Response - List of group members

```json
{
  "data": [
    {
      "id": "6873",
      "type": "users",
      "attributes": {
        "first_name": "Anthony",
        "last_name": "Lassiter",
        "name": "Anthony Lassiter",
        "username": "alassiter"
      },
      "relationships": {
        "user_profile": {
          "data": {
            "//": "[LIST OF USER PROFILE ATTRIBUTES]"
          }
        }
      }
    },
    {
      "id": "442",
      "type": "users",
      "attributes": {
        "first_name": "Bob",
        "last_name": "Smith",
        "name": "Bob Smith",
        "username": "bsmith"
      },
      "relationships": {
        "user_profile": {
          "data": {
            "//": "[LIST OF USER PROFILE ATTRIBUTES]"
          }
        }
      }
    }
  ],
  "meta": {
    "current_domain": "public",
    "current_company": null,
    "count": 2
  }
}
```

### BULK ACTIONS

---

#### ARCHIVE

- Returns tips that were archived
- Returns tips that were not archived (not permitted to logged in user)

##### POST `/bulk_actions/archive?tip_ids=`

_Archive selected tips using tip_ids_

| param   | value            | req? | notes              |
| ------- | ---------------- | ---- | ------------------ |
| tip_ids | array of tip ids | yes  | should be an array |

Example: `/bulk_actions/archive?tip_ids=[1,2,3]` would archive tips with ids 1, 2, 3 only if logged in user has authorization to do so

#### ORGANIZE

##### POST `/bulk_actions/organize?tip_ids=&topic_ids=`

_Adds selected tips to selected topics using tip_ids and topic_ids_

| param     | value              | req? | notes              |
| --------- | ------------------ | ---- | ------------------ |
| tip_ids   | array of tip ids   | yes  | should be an array |
| topic_ids | array of topic ids | yes  | should be an array |

Example: `/bulk_actions/organize?tip_ids=[1,2,3]&topic_ids=[1,2,3]` would add tips with ids 1, 2, 3 to topics with ids 1, 2, 3

#### SHARE

##### POST `/bulk_actions/share?tip_ids=&user_ids=`

_Shares selected tips with selected users using tip_ids and user_ids_

| param    | value             | req? | notes              |
| -------- | ----------------- | ---- | ------------------ |
| tip_ids  | array of tip ids  | yes  | should be an array |
| user_ids | array of user ids | yes  | should be an array |

Example: `/bulk_actions/share?tip_ids=[1,2,3]&user_ids=[1,2,3]` would share tips with ids 1, 2, 3 with users having ids 1, 2, 3

### VIEWS

---

#### LIST ALL: `GET /views`

- Returns an array of views with ids
- Returns attributes: kind and name
- Kind can be 'system', 'user', or 'domain'
- Name is the name of the view
  - currently one of ['grid','small grid','list','sheet','task','wiki','kanban']

##### Example Response

```json
{
  "data": [
    {
      "id": "1",
      "type": "views",
      "attributes": {
        "kind": "system",
        "name": "grid"
      }
    }
  ]
}
```

### SEARCH

---

#### NOTES:

- Search is scoped by domain
- IMPORTANT!!! CURRENLY USERS ARE NOT SCOPED BY DOMAIN

#### GET `/search`

_Allows us to search all or select resources_

| param        | value                                            | req? | notes                                |
| ------------ | ------------------------------------------------ | ---- | ------------------------------------ |
| q            | search string                                    | yes  | used alone will search all resources |
| EXAMPLE      | `/search?q=puppy`                                | ---  | ---                                  |
| resources    | one or more of user, topic, tip, group, question | no   | will only search for given resources |
| EXAMPLE      | `/search?q=puppy&resource=topic,tip`             | ---  | ---                                  |
| page[number] | integer                                          | no   | triggers pagination                  |
| EXAMPLE      | `/search?q=puppy&page[number]=1`                 | ---  | ---                                  |
| page[size]   | integer                                          | no   | changes how many results per page    |
| EXAMPLE      | `/search?q=puppy&page[number]=1&page[size]=5`    | ---  | ---                                  |

### SHARING

---

- Each resources has their own share settings section look up Tips, Topics, etc...

### FOLLOW/UNFOLLOW

---

### FLAGS

---

- See [/cards/:id/flag](#user-content-tip_flag)
- Same for Comment and Question flags

### LIKES

---

#### POST `/:resource/:id/like`

- Assigns a vote of type like to resource
- Resource can be one of ['tips', 'topics']

| param    | value              | req? | example         | notes                          |
| -------- | ------------------ | ---- | --------------- | ------------------------------ |
| resource | tips or topics     | yes  | `/cards/1/like` | Creates a like for tip.id == 1 |
| id       | id of tip or topic | yes  |                 |                                |

#### POST `/:resource/:id/unlike`

- Removes a vote of type like from resource
- Resource can be one of ['tips', 'topics']

| param    | value              | req? | example           | notes                          |
| -------- | ------------------ | ---- | ----------------- | ------------------------------ |
| resource | tips or topics     | yes  | `/cards/1/unlike` | Removes a like for tip.id == 1 |
| id       | id of tip or topic | yes  |                   |                                |

#### GET `/:resource/?filter[type]=liked`

- Returns a list of liked resources

| param    | value          | req? | example                      | notes              |
| -------- | -------------- | ---- | ---------------------------- | ------------------ |
| resource | tips or topics | yes  | `/cards/?filter[type]=liked` | Returns liked tips |

### STARS

---

#### POST `/:resource/:id/star`

- Assigns a vote of type star to resource
- Resource can be one of ['tips', 'topics']

| param    | value              | req? | example         | notes                          |
| -------- | ------------------ | ---- | --------------- | ------------------------------ |
| resource | tips or topics     | yes  | `/cards/1/star` | Creates a star for tip.id == 1 |
| id       | id of tip or topic | yes  |                 |                                |

#### POST `/:resource/:id/unstar`

- Removes a vote of type star from resource
- Resource can be one of ['tips', 'topics']

| param    | value              | req? | example           | notes                          |
| -------- | ------------------ | ---- | ----------------- | ------------------------------ |
| resource | tips or topics     | yes  | `/cards/1/unstar` | Removes a star for tip.id == 1 |
| id       | id of tip or topic | yes  |                   |                                |

#### GET `/:resource/?filter[type]=starred`

- Returns a list of starred resources

| param    | value          | req? | example                        | notes                |
| -------- | -------------- | ---- | ------------------------------ | -------------------- |
| resource | tips or topics | yes  | `/cards/?filter[type]=starred` | Returns starred tips |

### VOTES

---

### INVITATIONS

---

#### GET `/invitations`

_Retrieve a list of invitations_

#### POST `/invitations/search`

_Retrieve status of emails_

| param  | value           | req? | example | notes                             |
| ------ | --------------- | ---- | ------- | --------------------------------- |
| emails | Array of emails | yes  |         | returns array of email and status |

#### POST `/invitations/create`

_Create an invitation_

| param           | value  | req? | example | notes                                    |
| --------------- | ------ | ---- | ------- | ---------------------------------------- |
| user_id         | id     | yes  |         |                                          |
| emails          | emails | yes  |         | array                                    |
| invitation_type | string | yes  |         | :account, :domain, :group, :hive, :share |
| invitable_type  | string | yes  |         |                                          |
| invitable_id    | id     | yes  |         |                                          |
| custom_message  | text   | no   |         |                                          |

#### GET `/invitations/:id/reinvite`

_Reinvite_

| param | value         | req? | example | notes |
| ----- | ------------- | ---- | ------- | ----- |
| id    | invitation id | yes  |         |       |

#### POST `/invitations/request_invitation`

_Creates a new invitation where domain owner is inviter and submitted email is invitee_

| param      | value      | req? | example | notes |
| ---------- | ---------- | ---- | ------- | ----- |
| email      | email      | yes  |         |       |
| first_name | first name | no   |         |       |
| last_name  | last name  | no   |         |       |

### Notifications

---

#### GET `/notifications`

_Retrieve a list of notifications_

### Activity Permissions

---

_Permissions are sent with the resource_

- `GET /domains/:tenant_name/show` will return the domain with its permission settings
