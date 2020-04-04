# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]
### Added
- 

### Changed
- 

### Fixed
- 

## [0.6.4]
### Added
- New Left-hand SubHive navigation
- Hive filters
- People filters

### Changed
- Improved Breadcrumbs
- Share settings are in alphabetcal order
- Tip Performance increased

### Fixed
- Share settings remain intact when you close a Tip and re-open it
- Share settings reindexed to remove people that were not supposed to be there
- Corrected Google Drive root folder with integration
- Print Tip was only printing 1 page
- On TipFeed and User Profile page, if in list view and you scrolled it would flip back to Grid View

## [0.6.0]
### Added
- Drop Box integration
- Google Drive integration
- Google Chrome Extension

### Changed
- Tip editor updated to keep action buttons at the bottom
- Tip editor updated look to handle many attachments better
- The Tip Quick Menu (the 3 dots on tips in the feed view) now closes after opening the edit form

### Fixed
- Print Tip was repeating pages
- Check if valid email during signup before allowing submission
  + Fixes users putting commas in emails

## [0.5.6] - 2017-03-22
### Fixed
- People page wasn't loading more people as you scrolled
- Links in comments were causing an error
- Long comments disabled the save button
- Creating a comment after a comment wasn't working
- You could not invite someone, then open the invitation form again and invite someone else
- Import CSV for invitations didn't work if the fields were wrapped with " marks

## [0.5.5] - 2017-03-10
### Added
- New Hives Page (click Hives in left menu)
- New People Page (click People in left menu)
- New Import CSV of emails to invite
- New Profile Stats on Profile Page
- New Labels on Full Tip View

### Changed
- Inviting multple people is easier
- Improved LIKE speed
- Hive Page now has filters for following and not following
- People Page now has filters for following and being followed

### Fixed
- fixed: Label Tab on create Tip from Main Form
- fixed: Create SubHive doesn't take you outside the group
- fixed: Comment Edit is no longer blank

## [0.5.2] - 2017-02-24
### Added
- Right bar Introduced with Tip View Buttons
- Tip Form now has a Label Tab
- @Mentions !!

### Changed
- Share selector now looks and behaves like the topic selector

### Fixed
- Login and Join form submit buttons now reset after failed try

### Known Issues
- Creating a TipCard using the button inside a topic doesn't present the Label Tab, it will if you click the Main + button

## [0.5.1.1] - 2017-02-21
### Added
- Tip Options to large Grid tip

### Changed
- Increase initial number of tips to 25

### Fixed
- Selected Label filter now remains the filter when changing views (Grid, SmGrid, List)

## [0.5.1] - 2017-02-17
### Added
- List Tip View
- Small Grid Tip View

## [0.5.0] - 2017-02-17
### Added
- New CHANGELOG file
- Support for Groups
- Scrolling on Search results

### Removed
- Questions from Search results

### Changed
- Tip redesign
- version in package.json to 0.5.0

### Fixed
- Hive Grid during Onboarding
