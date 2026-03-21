# digest-archive-publishing Specification

## Purpose
TBD - created by archiving change hacknews-daily-github-pages-generator. Update Purpose after archive.
## Requirements
### Requirement: System SHALL preserve published daily digests as historical archive entries
Each published daily digest SHALL remain available as a historical record after newer digests are generated.

#### Scenario: retain historical digest after later publication
- **WHEN** a daily digest has been published for an earlier date
- **AND** a later date digest is subsequently published
- **THEN** the earlier digest SHALL remain preserved as an archive entry

### Requirement: Archive SHALL provide date-addressable access to historical digests
The archive SHALL expose historical digests in a way that lets users identify and access them by publication date.

#### Scenario: access archive entry by publication date
- **WHEN** a digest has been published for a given date
- **THEN** the archive SHALL expose that digest with its publication date
- **AND** the historical entry SHALL be distinguishable from other dates

#### Scenario: list multiple historical digests
- **WHEN** multiple daily digests have been published
- **THEN** the archive SHALL present more than one historical digest entry
- **AND** each entry SHALL identify its corresponding publication date

### Requirement: Archive publishing MUST be additive across successful digest generations
Successful publication of a new digest MUST add to archive history rather than replace all prior history.

#### Scenario: add new history entry without removing older ones
- **WHEN** a new daily digest is successfully published
- **THEN** the archive SHALL include the new digest as an additional historical entry
- **AND** previously published historical entries MUST remain present

### Requirement: Archive SHALL remain valid even if a new digest generation fails
A failed attempt to generate a new digest SHALL NOT destroy previously published archive content.

#### Scenario: preserve archive on new-generation failure
- **WHEN** a new digest generation attempt fails before publication
- **THEN** previously published archive entries SHALL remain unchanged and accessible

