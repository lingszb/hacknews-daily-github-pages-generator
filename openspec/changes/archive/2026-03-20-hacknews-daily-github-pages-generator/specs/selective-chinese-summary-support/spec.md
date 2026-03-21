## ADDED Requirements

### Requirement: System SHALL support optional one-line Chinese summary text for selected sections only
The system SHALL allow, but not require, a single line of Chinese summary or recommendation text on eligible digest entries.

#### Scenario: allow optional Chinese summary in 今日头条
- **WHEN** a digest entry is published in 今日头条
- **THEN** the system MAY include one line of Chinese summary or recommendation text for that entry

#### Scenario: allow optional Chinese summary in 值得深读
- **WHEN** a digest entry is published in 值得深读
- **THEN** the system MAY include one line of Chinese summary or recommendation text for that entry

#### Scenario: do not require Chinese summary for eligible sections
- **WHEN** a digest entry is published in 今日头条 or 值得深读
- **THEN** the digest SHALL remain valid even if no Chinese summary is present for that entry

### Requirement: Chinese summary support MUST NOT extend to non-eligible sections
The system MUST restrict Chinese summary display to the approved sections only.

#### Scenario: reject Chinese summary in 热门讨论
- **WHEN** a digest entry is published in 热门讨论
- **THEN** that entry MUST NOT display a Chinese summary or recommendation line

#### Scenario: reject Chinese summary in Ask HN
- **WHEN** a digest entry is published in Ask HN
- **THEN** that entry MUST NOT display a Chinese summary or recommendation line

#### Scenario: reject Chinese summary in Show HN
- **WHEN** a digest entry is published in Show HN
- **THEN** that entry MUST NOT display a Chinese summary or recommendation line

### Requirement: Chinese summary MUST be additive and MUST NOT replace the original title
Any Chinese summary text SHALL act as supplemental guidance only.

#### Scenario: retain original title when Chinese summary exists
- **WHEN** a digest entry includes a Chinese summary
- **THEN** the entry SHALL still display the original source title
- **AND** the Chinese summary MUST NOT replace the original source title

### Requirement: Chinese summary SHALL be limited in cardinality per entry
Each eligible digest entry SHALL support at most one Chinese summary line.

#### Scenario: prevent multiple Chinese summary lines for one entry
- **WHEN** a digest entry includes Chinese summary content
- **THEN** the system SHALL associate no more than one Chinese summary line with that entry
