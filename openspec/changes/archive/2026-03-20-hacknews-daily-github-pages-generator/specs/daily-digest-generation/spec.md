## ADDED Requirements

### Requirement: System SHALL generate one daily digest artifact per publication date
The system SHALL produce a uniquely identifiable daily digest for each publication date it processes.

#### Scenario: generate a dated digest from eligible stories
- **WHEN** the system processes a publication date with at least one eligible story
- **THEN** it SHALL create exactly one digest for that date
- **AND** the digest SHALL include the publication date as part of its identity
- **AND** the digest SHALL contain one or more digest sections

#### Scenario: prevent duplicate digests for the same date in a single published state
- **WHEN** the system publishes output for a given publication date
- **THEN** it MUST NOT expose more than one published daily digest as the canonical digest for that same date

### Requirement: Daily digest SHALL include the fixed section structure
Each generated daily digest SHALL use the fixed section set defined by the product scope.

#### Scenario: include all required section names
- **WHEN** a daily digest is generated
- **THEN** it SHALL represent the following sections in the digest structure:
  - 今日头条
  - 热门讨论
  - 值得深读
  - Ask HN
  - Show HN

#### Scenario: preserve fixed section naming across days
- **WHEN** daily digests are generated across multiple publication dates
- **THEN** the section names SHALL remain consistent across those digests

### Requirement: Daily digest output MUST remain publishable under partial content conditions
The system MUST prefer a minimally publishable digest over a total generation failure when optional or non-critical content is unavailable.

#### Scenario: publish digest without optional enhancements
- **WHEN** the daily digest can be formed but optional enhancements are unavailable
- **THEN** the system SHALL still generate the digest
- **AND** the digest SHALL remain valid without those optional enhancements

#### Scenario: publish digest with sparse sections
- **WHEN** some fixed sections have fewer eligible stories than usual
- **THEN** the system SHALL still generate the digest
- **AND** it MUST preserve the section structure even if section item counts are reduced

### Requirement: Daily digest SHALL expose entries as outbound references to source stories
Each digest entry SHALL preserve a navigable relationship to the source story.

#### Scenario: include a source reference for each published entry
- **WHEN** a story appears in a generated digest
- **THEN** that digest entry SHALL include a reference to the source story destination
