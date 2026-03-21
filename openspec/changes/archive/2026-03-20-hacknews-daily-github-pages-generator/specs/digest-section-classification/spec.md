## ADDED Requirements

### Requirement: System SHALL classify curated stories into the fixed digest sections
The system SHALL assign curated stories into the digest’s fixed editorial sections according to classification rules.

#### Scenario: classify stories into required sections
- **WHEN** the system classifies curated stories for a digest
- **THEN** it SHALL classify stories only into the following sections:
  - 今日头条
  - 热门讨论
  - 值得深读
  - Ask HN
  - Show HN

#### Scenario: prevent publication outside fixed section set
- **WHEN** a story is selected for publication in a digest
- **THEN** it MUST belong to one of the fixed digest sections
- **AND** it MUST NOT be published in an undefined section

### Requirement: Ask HN and Show HN entries SHALL be classified according to their source type
The system SHALL preserve the semantic distinction of Ask HN and Show HN content.

#### Scenario: classify Ask HN content into Ask HN
- **WHEN** a curated story is identified as Ask HN content
- **THEN** the system SHALL classify it into the Ask HN section

#### Scenario: classify Show HN content into Show HN
- **WHEN** a curated story is identified as Show HN content
- **THEN** the system SHALL classify it into the Show HN section

### Requirement: Section classification SHALL produce deterministic publication structure from the same curated input
Given the same curated input set and classification rules, the system SHALL produce the same section assignments.

#### Scenario: keep repeated classification stable
- **WHEN** the same curated story set is classified more than once under the same rule set
- **THEN** the resulting section assignments SHALL be consistent across runs

### Requirement: Section classification SHALL support reduced section population without invalidating the digest
The system SHALL allow some sections to contain fewer entries when the curated pool does not provide enough suitable stories.

#### Scenario: allow sparse section output
- **WHEN** the curated story pool contains insufficient suitable stories for a fixed section
- **THEN** the system SHALL still produce the section in the digest structure
- **AND** the digest MUST remain publishable
