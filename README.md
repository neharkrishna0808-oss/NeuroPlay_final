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


SCREENSHOTS OF THE WEBSITE:
<img width="2880" height="1258" alt="image" src="https://github.com/user-attachments/assets/ca7fb65d-39ec-4a23-9d49-7b4afdefb7f9" />

This is the homepage of NeuroPlay. 
There are three types of games to test your different cognitive aspects:
<img width="2874" height="1324" alt="image" src="https://github.com/user-attachments/assets/d740765c-0100-46cd-8ed9-4fdd8b432fc1" />

The First Game is called NeuroRead:
<img width="2880" height="1326" alt="image" src="https://github.com/user-attachments/assets/0f84630d-6b27-4ceb-85a8-24792959ed4f" />
it is a game that tests your comprehensive skills by having you read through a passage with words that are jumbled, with the first and last letter of each words being the same as the original word. eg: reading -- rdeiang. The user will be expected to read and comprehend the jumbled paragraph and comprehend and answer the 2 questions after each level. There are 5 levels. each level will have more content and a time constraint. 
<img width="2880" height="1328" alt="image" src="https://github.com/user-attachments/assets/5c0d38dd-b622-441c-93a7-efead860e5c0" />
After the time limit passes:
<img width="2878" height="1330" alt="image" src="https://github.com/user-attachments/assets/c623824f-3fbb-472c-b2b5-f7fa5efc7062" />
<img width="2874" height="1330" alt="image" src="https://github.com/user-attachments/assets/71e6aa52-9ad7-42e1-b333-83dafc0ac6bb" />
Then the game gives you a final grade for your comprehension skills.

The next game is called NeuroFlash:
It tests how you fast your brain visualises and retains information in a short time-frame
<img width="2880" height="1326" alt="image" src="https://github.com/user-attachments/assets/0c32e9a9-76c9-4855-8f66-ae52c3ed8d20" />
<img width="2122" height="972" alt="image" src="https://github.com/user-attachments/assets/581d87aa-3629-46b0-945e-8f4aefc41ccd" />
<img width="2880" height="1320" alt="image" src="https://github.com/user-attachments/assets/a0ab6137-ea1a-443a-9cb9-3e173d969ea5" />
<img width="2878" height="1318" alt="image" src="https://github.com/user-attachments/assets/b3de7165-95c9-4f01-b894-4ba64744c0f2" />

The last game is called NeuroRecall:
It is a memory game where you will be given 45 seconds to memorise and list down each of the given elements and there are 5 levels. with each level the number of elements to be memorised increases.
<img width="2880" height="1324" alt="image" src="https://github.com/user-attachments/assets/07fc5f96-b7d9-4dd1-a789-e88fdfb9bd17" />
<img width="2880" height="1320" alt="image" src="https://github.com/user-attachments/assets/f22cb3ee-0bd1-4081-b4d1-4cdf4443db51" />
<img width="2880" height="1326" alt="image" src="https://github.com/user-attachments/assets/596e3dc3-a87e-4256-b293-af8bd9cd0d9a" />
<img width="2878" height="1324" alt="image" src="https://github.com/user-attachments/assets/b062bf4c-8a09-4382-aae2-9d3f3b8c772d" />
<img width="2880" height="1322" alt="image" src="https://github.com/user-attachments/assets/e7461adb-c5ed-4fa2-b93f-ed45f8615bc9" />

VIDEO DEMO OF THE WEBSITE:
https://drive.google.com/file/d/1rYZPE1RBCQQOFfVKSs_YaWE-Lw90jp0L/view?usp=sharing
















