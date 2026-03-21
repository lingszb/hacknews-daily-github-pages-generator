## ADDED Requirements

### Requirement: Homepage SHALL represent the latest published daily digest
The site homepage SHALL resolve to the most recently published digest.

#### Scenario: homepage matches newest published digest
- **WHEN** at least one daily digest has been published
- **THEN** the homepage SHALL display the latest published digest
- **AND** the homepage content SHALL correspond to that latest digest edition

#### Scenario: homepage updates after a newer digest is published
- **WHEN** a newer daily digest is published after an older one
- **THEN** the homepage SHALL reflect the newer digest as the current homepage content

### Requirement: Homepage MUST NOT diverge from the canonical latest digest view
The homepage MUST remain semantically aligned with the latest digest rather than acting as a separate editorial surface.

#### Scenario: keep homepage and latest digest consistent
- **WHEN** a user views the homepage and the canonical latest digest page
- **THEN** both SHALL represent the same digest edition

### Requirement: Existing published history SHALL remain intact when homepage advances
Promoting a new digest to the homepage SHALL NOT invalidate previously published digest artifacts.

#### Scenario: preserve older published digest after homepage rollover
- **WHEN** a newer digest becomes the homepage
- **THEN** previously published older digests SHALL remain accessible as historical editions
