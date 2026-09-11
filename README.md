NEUROPLAY

NEUROPLAY is an interactive cognitive training platform containing three memory and perception-based challenges: NEUROREAD, NEUROFLASH, and NEURORECALL. Each challenge uses a different gameplay mechanic and difficulty progression to test a specific type of cognitive processing.

Overview

The application begins with a central dashboard where users can select any of the three training disciplines. Each discipline consists of multiple rounds. After completing a round, the user's accuracy is calculated and displayed before they proceed to the next round.

NEUROPLAY combines timed challenges, visual recall, reading comprehension, and ordered memory into a single interactive application while maintaining a consistent round-based experience across all three disciplines.

Training Disciplines

NEUROREAD

NEUROREAD is a timed reading and comprehension challenge based on typoglycemia. Words are displayed with their first and last letters preserved while the letters between them are rearranged.

The user must read and understand the distorted passage within the available time and answer questions based on its content. Difficulty increases by requiring the user to process longer passages and retain more information.

NEUROFLASH

NEUROFLASH is a rapid visual memory challenge based on numerical recall. A sequence of digits is displayed for a limited amount of time before the user must recall it.

The number of digits increases from 4 to 8 across the rounds, while exposure time decreases from 2.0 seconds to 0.4 seconds. Each digit is displayed using contrasting colours, introducing visual interference while the user attempts to retain the numerical sequence.

NEURORECALL

NEURORECALL is an ordered visual memory challenge. Each round presents a set of visual items that the user has 45 seconds to memorize.

The number of items increases from 5 to 17 across the rounds. After the memorization period, the user must reconstruct the items in their original order. The challenge focuses on retaining both the items and their positions within the sequence.

Cognitive Foundations

The three disciplines are based on different cognitive mechanisms.

NEUROREAD uses typoglycemia as the basis for its distorted-text mechanic, relying on the ability to recognize familiar words even when their internal letters are rearranged.

NEUROFLASH focuses on rapid visual storage and numerical recall under chromatic interference. The changing exposure time and sequence length progressively increase the difficulty of the task.

NEURORECALL focuses on serial-position memory and ordered recall by requiring users to remember a growing set of visual items and reconstruct their original sequence.

The scores and accuracy values in NEUROPLAY are intended for gameplay and focus-training purposes. They are not clinical measurements or diagnostic assessments.

Implementation

NEUROPLAY is implemented as a React-based frontend application. The interface is divided into reusable components, while the three games have separate components and data files for their individual gameplay requirements.

The application uses React to render the interface and handle changes between different stages of the application. JavaScript/TypeScript logic handles user interactions, timers, round progression, difficulty progression, and accuracy calculation.

Each discipline has its own gameplay rules and progression while following the common round-based structure of the application. The interface updates according to the user's progress, allowing the application to move between different stages of each challenge.

CSS is used for the layout, visual design, animations, and presentation of the application.

Project Structure

text
src/
├── components/
│   ├── ConfirmModal.tsx
│   ├── GameCard.tsx
│   ├── Home.tsx
│   ├── HowItWorksModal.tsx
│   ├── Navbar.tsx
│   ├── NeuralNetworkVisual.tsx
│   ├── ProgressBar.tsx
│   ├── ScoreCounter.tsx
│   └── Timer.tsx
│
├── data/
│   ├── neuroflashData.ts
│   ├── neuroreadData.ts
│   └── neurorecallData.ts
│
├── games/
│   ├── NeuroFlash.tsx
│   ├── NeuroRead.tsx
│   └── NeuroRecall.tsx
│
├── utils/
│   └── textScrambler.ts
│
├── App.tsx
├── index.css
├── main.tsx
└── types.ts

.env.example
.gitignore
index.html
metadata.json
package.json
tsconfig.json
vite.config.ts


The components directory contains reusable interface elements such as the navigation bar, timer, progress bar, score counter, game cards, and modals.

The data directory contains the content used by the three training disciplines. The games directory contains the main gameplay components for NEUROREAD, NEUROFLASH, and NEURORECALL.

The utils directory contains supporting logic such as the text-scrambling functionality used by NEUROREAD. The main application files handle the overall application structure, styling, entry point, and shared types.

Tech Stack

React is used for building the interactive user interface and reusable components.

TypeScript is used for the application's component and logic files.

HTML provides the structure of the application.

CSS is used for styling, layouts, animations, and visual presentation.

The project uses a standard package-based frontend setup for development and dependency management.

How to Run

Install the project dependencies using the package configuration included in the repository.

bash
npm install


Start the development environment using the configured project command:

bash
npm run dev


Open the local address provided by the development environment in a web browser.

Author

Neha

NEUROPLAY is a frontend project combining interactive interface design, React development, timed challenges, and cognitive memory-based gameplay.
