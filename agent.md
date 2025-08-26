Cursor Agent Development & Refactoring Instructions
This document provides a set of core instructions for the automated agent to follow when developing new code or refactoring existing code. Adherence to these guidelines ensures a consistent, maintainable, and scalable codebase.

1. File & Component Structure
   One Component, One File: Every time a new component is created, it must reside in its own dedicated file. This promotes reusability, modularity, and easier debugging.

No Shared Component Files: Do not group multiple components within a single file, even if they are closely related.

2. Module Imports
   Absolute Paths Only: All import statements must use absolute paths from the project's source root (e.g., src/).

Incorrect: import { Button } from '../../components/Button';

Correct: import { Button } from '@components/Button'; (assuming @ is an alias for src/)

Automatic Conversion: The agent is instructed to automatically convert any existing relative path imports to their absolute path equivalents.

3. Type & Interface Declarations
   Prefer export type: When defining data structures, favor the export type declaration over export interface. This ensures consistency and leverages the full capabilities of modern TypeScript.

Example: export type UserProfile = { ... }

Avoid export interface: Do not use export interface for any new or refactored type definitions.

4. Type Organization
   Dedicated /types Folder: All type definitions must be placed in a dedicated types folder located at the source root of the project.

Page-Based Grouping: Organize types within the /types folder based on the pages or sections they are used in.

Example Structure:

src/
└── types/
├── home-page.ts
├── account-settings.ts
└── common-props.ts

5. Animations
   Approved Animation Libraries: Animations can be created using CSS, or one of the following libraries:

Framer Motion: Recommended for component-level animations, gestures, and state-based transitions.

GSAP (GreenSock Animation Platform): Recommended for complex, timeline-based animations and high-performance visual effects.

6. Placeholder Content
   Dedicated /content Folder: All placeholder content (e.g., strings for lists, mock data, etc.) must be placed in a dedicated content folder located at the project's source root (src/).

Capitalized File Names: The name of each placeholder content file should be in all capital letters, using an underscore (\_) to separate words.

Example: /src/content/COLLECTION_NAME.ts

7. Styling
   Priority on Tailwind: The agent should use Tailwind CSS as the primary styling method.

Conditional Use: The agent should not force the use of Tailwind if it does not make sense for the specific styling requirement.
