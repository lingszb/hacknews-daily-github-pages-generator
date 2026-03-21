## ADDED Requirements

### Requirement: System SHALL normalize candidate stories into a consistent story record
The system SHALL convert accepted input candidates into a uniform story representation suitable for downstream curation and publishing.

#### Scenario: normalize a candidate with core story data
- **WHEN** the system ingests a candidate story that includes the minimum required source fields
- **THEN** it SHALL produce a normalized story record
- **AND** that record SHALL preserve the original title
- **AND** that record SHALL preserve a stable source reference
- **AND** that record SHALL preserve the story type when such type is available

#### Scenario: preserve original title text
- **WHEN** a candidate story is normalized
- **THEN** the normalized record SHALL use the original source title as the display title
- **AND** it MUST NOT replace that title with a translated Chinese title

### Requirement: System SHALL curate stories by eligibility before digest inclusion
The system SHALL determine whether normalized stories are eligible for publication in the digest.

#### Scenario: include eligible normalized stories in the candidate pool
- **WHEN** a normalized story satisfies the digest eligibility rules
- **THEN** the story SHALL remain available for downstream section classification

#### Scenario: exclude ineligible normalized stories from the candidate pool
- **WHEN** a normalized story does not satisfy the digest eligibility rules
- **THEN** the story SHALL be excluded from downstream digest publication
- **AND** it MUST NOT appear in any published digest section

### Requirement: Story normalization and curation SHALL tolerate incomplete individual items
The system SHALL prefer item-level exclusion over batch-level failure when individual candidates are malformed or incomplete.

#### Scenario: skip malformed candidate without aborting the full batch
- **WHEN** one candidate story cannot be normalized into a valid story record
- **THEN** the system SHALL exclude that candidate from curated output
- **AND** it SHALL continue processing other candidates in the same batch

#### Scenario: publish curated output from remaining valid stories
- **WHEN** at least one candidate in a batch is successfully normalized and deemed eligible
- **THEN** the system SHALL make the remaining valid stories available for digest generation
