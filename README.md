# Minimal Pairs: A Teacher-Built Google Apps Script Micro-App

**An illustrative artifact of a seven-stage, voice-assisted, teacher-led development workflow**

> **Repository status:** Educational prototype and archival example, **not** a production-hardened student-data system. The code demonstrates a working classroom interaction and Google Sheets integration; it is not a validated assessment instrument or an automatically scored listening test.

## Why this app exists

The starting point was a language-teaching problem, not a software requirement: students need repeated opportunities to distinguish **English minimal pairs**—words differing by one phoneme, such as *light/right* or *play/pray*. A teacher says one of the two words aloud. Students listen, decide which word they heard, and tap the matching on-screen button.

The app is deliberately small. It provides a two-choice interface, records ten responses, and sends them to a Google Sheet. After submission, students see a personalized encouragement message and a five-star confidence question. The teacher supplies the speech: **the app does not generate or play audio.**

This is an example of *teacher citizen development*: pedagogical knowledge drives a modest classroom-scale tool, while conversational AI assists with planning, coding, testing, and revision. The intended product is the micro-app, not the AI conversation itself.

## At a glance

| Item | Implementation in the supplied version |
| --- | --- |
| Platform | Google Apps Script (GAS), HTML Service, Google Sheets |
| Classroom task | Identify the word the teacher pronounces from a displayed minimal pair |
| Item bank | 16 selectable pairs, maintained in `getWordPairs()` |
| Student identifier | Four-digit ID entered by the student |
| Session | Exactly ten recorded choices; `Done` becomes available after the tenth `Next` |
| Response storage | Timestamp, student ID, selected pair, and ten chosen words |
| Personalization | Student's given name looked up from a separate `Roster` worksheet |
| Post-task question | 「今日のどれぐらい自信が付きましたか？」 (self-reported confidence; five stars) |
| Confidence storage | Selected rating (1–5) written to column N |
| Automatic correctness scoring | **Not implemented** |
| Speech generation / recognition | **Not implemented** |

## Seven-stage voice-assisted workflow

This project is documented as a **retrospective, edited illustration** of the seven-stage workflow. The development conversation originally moved quickly into code; the organized seven-stage narrative should **not** be represented as a verbatim record of an uninterrupted, code-free discovery phase. The distinction matters for research transparency.

1. **State the seed.** Define the teaching need: discriminate teacher-spoken minimal pairs; students select what they hear; store responses for later review.
2. **Keep the AI in inquiry mode.** Clarify who says the words, what students tap, the expected number of turns, and where data should go, *before* generating code. In this project, some such clarifications were made retrospectively when the dialogue was edited to illustrate the method.
3. **Produce a mission brief.** Summarize the interaction, Google Sheet and roster dependencies, stored data, and success conditions for teacher review.
4. **Map the logic.** Choose a pair → select one word → press `Next` → repeat ten times → press `Done` → save the session → answer the confidence question.
5. **Define the interface.** Put a four-digit ID field and pair selector above two large word buttons; position `Reset`, `Next`, and `Done` below; keep the interface compact and centered.
6. **Generate the blueprint.** Specify `Code.gs`, `Index.html`, sheet columns, roster lookup, GAS functions, deployment permissions, and failure cases.
7. **Transfer to code, test, and repair.** Develop the files, deploy the web app, and revise it in response to classroom-oriented observations: overlay obscuring the page, layout too spread out, repeated submission, pair-delimiter changes, placeholder text, and locking the word buttons after ten turns.

**Research use:** Treat the revised seven-stage dialogue as an *edited reconstruction* of an authentic design process. If depositing the dialogue as supplementary material, clearly label it, distinguish authentic exchanges from editorial additions, and provide a version/date. Do not call reconstructed turns verbatim.

## Repository structure

```text
minimal-pairs-gas/
├── README.md                 # Project documentation
├── Code.gs                   # Google Apps Script backend
├── Index.html                # HTML/CSS/JavaScript frontend
├── LICENSE                   # Placeholder: license not yet selected
└── docs/
    └── seven-stage-dialogue.md  # Edited illustrative dialogue
```

The Apps Script editor expects a server-side file named **`Code.gs`**, not `Code.js`. The HTML file is named **`Index.html`** in the editor (you enter `Index` when creating the file).

## Google Sheet setup

Create a spreadsheet that you control and add these two worksheets, using these **exact tab names** (or adjust the corresponding constants in `Code.gs`):

### `Sheet1`: session responses

| Column | Meaning |
| --- | --- |
| A | Server-generated timestamp |
| B | Four-digit student ID |
| C | Selected minimal pair (e.g., `light / write`) |
| D–M | Recorded response 1 through response 10 |
| N | Post-task confidence rating (integer 1–5) |

Suggested header row:

```text
Timestamp	Student ID	Word Pair	Choice 1	Choice 2	Choice 3	Choice 4	Choice 5	Choice 6	Choice 7	Choice 8	Choice 9	Choice 10	Confidence
```

### `Roster`: student-name lookup

| A | B |
| --- | --- |
| Student ID | Given name |
| `0001` | `Student A` |
| `0002` | `Student B` |

Use **fictional entries only** in public examples. If IDs may start with zero, format column A as **Plain text** before entering them so leading zeros are retained. The sample ID/name values are placeholders, not actual student records.

**Do not upload** the real spreadsheet, roster, responses, student names, IDs, classroom data, or a functional sheet-sharing link to a public repository. The project requires a separate, private spreadsheet for each deployment.

## Configuration and deployment

1. Create a Google Sheet with the `Sheet1` and `Roster` tabs shown above.
2. Copy the spreadsheet's ID from its URL. **Keep the actual ID out of the public repository.** In your private Apps Script deployment, configure:

   ```javascript
   const SPREADSHEET_ID = '[YOUR_SPREADSHEET_ID_HERE]';
   const DATA_SHEET = 'Sheet1';
   const ROSTER_SHEET = 'Roster';
   ```

3. Create a Google Apps Script project and add `Code.gs` and `Index.html`.
4. Authorize the script to access the intended spreadsheet when Google prompts you.
5. In **Deploy → New deployment → Web app**, choose **Execute as: Me** (the developer) if you intend students to use the interface without accessing the spreadsheet directly. **Who has access: Anyone** can be used for an intentionally public entry point *only after* school approval and a review of the server-side functions and identity controls. Restrict access to your school domain or authorized users where possible; see **Web app permissions vs. spreadsheet permissions** below.
6. Test with **synthetic** IDs, names, and choices before using it with students; verify that session data and confidence ratings reach the intended row and columns.
7. If you update the deployed version, publish a new deployment version or update the existing deployment as appropriate. An editor preview does not necessarily represent the live deployment.

The source invokes `SpreadsheetApp.openById(...)`, so the script account must have permission to open the configured spreadsheet. A public copy of these files alone cannot write to any sheet until an authorized deployer supplies a valid spreadsheet ID.

## Web app permissions vs. spreadsheet permissions

**The web app and the spreadsheet have different sharing settings. Do not confuse the two.** Google Apps Script permits a web app to run **as the developer** while allowing **Anyone** to open the web-app URL. With **Execute as: Me**, the backend reads and writes the Sheet using the deployer's authorization; students generally do **not** need direct access to the spreadsheet. This can be convenient for a classroom micro-app, but **“Anyone” is not automatically a safe deployment setting**: anyone permitted to open the app can invoke its exposed server functions under the developer's authority.

| Resource | Practical setting | Reason |
| --- | --- | --- |
| Web app — **Execute as** | **Me** (developer), when institutionally approved | The script can write responses to the private spreadsheet without sharing that spreadsheet with students. |
| Web app — **Who has access** | Prefer the **school domain or authenticated intended users** where practical. **Anyone** is a possible classroom configuration, not a blanket security recommendation. | This determines who can reach the app and invoke its backend, **not** who can open the Sheet in Google Drive. |
| Response spreadsheet (`Sheet1`) | **General access: Restricted**; share with authorized teaching/research staff only | Contains student identifiers, response histories, and confidence ratings. |
| Name roster (`Roster`) | **Restricted**, with the smallest feasible group of authorized staff | Maps four-digit IDs to names; the combination can identify learners. |
| Apps Script source project | Keep editing access restricted to maintainers | Editors can alter the code and potentially change how private data is processed. |
| Public GitHub repository | Publish **placeholder configuration and fictional examples only** | The repository must not disclose the real roster, spreadsheet ID, response exports, or other identifying information. |

**For the supplied prototype specifically:** a four-digit ID is **not authentication**. The server's `getStudentName()`, `storeResult()`, and `saveConfidence()` operations have no independent caller-identity or record-ownership verification. Someone who can invoke the web app's server functions may submit data under another ID or attempt to modify a rating for a row. Also, `appendRow()` followed by `getLastRow()` risks associating a confidence rating with the wrong student's row under concurrent use. **Keep deployment restricted or use only synthetic data until these issues are addressed; do not describe the current prototype as safe for unrestricted public use with live student data.**

**Before use with actual students:** confirm school/institutional permission and any required student/parent consent; minimize collected personal data; set a retention/deletion policy; inspect the Sheet's **Share → General access** setting and any inherited/shared-folder access; confirm only the intended staff can open the Sheet; test access using a student account; and verify the web app reveals no roster or responses to unauthorized users. Do **not** enable **Anyone with the link** on the spreadsheet just to make the app work. The deployer's access is sufficient when the web app runs as that developer.

References: [Google Apps Script: Web Apps](https://developers.google.com/apps-script/guides/web) · [Google Drive: Share files](https://support.google.com/drive/answer/2494822)

## Classroom interaction

1. The student enters a four-digit ID and selects a pair (the menu initially reads **“Choose a pair.”**).
2. The teacher pronounces one word from the pair; the student taps one of the two large buttons.
3. Tapping a word disables both choice buttons for that turn. `Next` records advancement and re-enables the choices for the next turn.
4. After ten selections and ten presses of `Next`, both word buttons remain disabled and `Done` becomes active.
5. `Done` submits the ten selections to `Sheet1` and displays **“Great effort, [STUDENT NAME]! Don't give up!”**, using the roster lookup.
6. Below the message, the student selects one to five stars in response to 「今日のどれぐらい自信が付きましたか？」. The stars turn yellow, enlarge slightly, and animate; the selected rating is written to column N.

The app records **what was selected**, not whether it matched what the teacher said. It does not know which word the teacher actually pronounced on any turn. Any correctness analysis requires an independently specified answer key or teacher observation data linked to those turns.

## What changed through iteration

The documented conversation includes several useful examples of teacher-directed refinement:

| Observation / request | Design response |
| --- | --- |
| Opening page appeared too dark | Hide the congratulatory overlay by default |
| Interface felt too spread out | Move controls into a narrower, centered frame |
| Overlay interrupted the experience | Replace it with a survey section below the app |
| Students need feedback | Add a personalized message and five-star confidence question |
| `Done` created repeated rows | Disable the submission button after use in the current page session |
| Some versions allowed variable-length play | Return to a fixed ten-turn activity |
| The word-pair delimiter changed | Parse `Word 1 / Word 2` rather than `Word 1|Word 2` |
| An accidental default pair was possible | Start the dropdown at “Choose a pair.” |
| Buttons remained clickable after ten turns | Disable both word buttons at completion |

These examples document **iterative prototyping**, not a formal evaluation of learning gains, usability, security, or reliability.

## Known limitations and cautions

The supplied version is a valuable prototype but should not be described as robust or fully production-ready. In particular:

- **Privacy and access:** A four-digit ID is an identifier, **not authentication**. The current design exposes a roster-derived given name in the browser and does not establish that an entered ID belongs to the person using it. **Execute as: Me** does not confer Google Drive access to students, but it means public callers can invoke backend functions with the deployer's authority. Keep the spreadsheet **Restricted** and follow the web-app permissions guidance above.
- **Repeated submissions:** The browser-side `submitted` flag prevents ordinary double-clicks **within one loaded page**; it is not server-side deduplication. Refreshing, resetting, opening a second tab, or repeating a request may create another record.
- **Concurrent sessions:** The backend calls `appendRow()` and then separately calls `getLastRow()`. If two students submit almost simultaneously, the row number returned can refer to the *other* submission. The later confidence rating may then be written to the wrong record. This is a **material data-integrity issue** that should be fixed before classroom-wide use. A stable per-session identifier and server-side locking/lookup are preferable to trusting a row number from the browser.
- **Server validation:** `storeResult()` checks the number of choices but does not independently validate the ID format, allowed pair, or each selected word. `saveConfidence()` does not validate the rating or row ownership. The browser cannot serve as the security boundary.
- **Changing pairs mid-session:** The supplied interface allows a student to change the selected pair during an ongoing ten-turn session. Because the saved row includes one final pair label, that row can misrepresent earlier responses unless the selection is locked after the first choice or each turn's pair is recorded.
- **No explicit error handling:** The supplied frontend lacks `google.script.run.withFailureHandler(...)` callbacks and a submission-recovery experience. A failed write can leave the UI disabled with no clear explanation.
- **Roster matching:** The implementation relies on string comparisons of sheet values. Leading-zero IDs require deliberate text formatting; missing or mistyped roster entries yield the fallback name `Student`.
- **Reset behavior:** `Reset` starts a new local turn sequence, but the submitted session is already stored and cannot be removed from the Sheet by pressing `Reset`.
- **Accessibility and layout:** Star ratings are clickable `span` elements rather than labeled keyboard-operable controls; small-screen alignment and keyboard accessibility require further work.
- **Survey interpretation:** The five-star answer is **self-reported confidence**, not a measure of phonemic discrimination accuracy or learning effectiveness.

### Recommended next hardening steps

Before deployment with real students, prioritize **(1)** a stable, server-generated session key and an atomic/locked submission process; **(2)** validated, idempotent rating updates associated with that session key; **(3)** server-side input and identity/access controls; **(4)** robust error feedback and a clear retry policy; and **(5)** decisions about locking the pair and how the teacher's spoken answer key would be recorded if correctness scoring is needed.

## Research and archival notes

This repository is suitable as a **software artifact** supporting discussion of voice-assisted teacher development of classroom micro-apps. Distinguish three layers in research reporting:

- **Code artifact:** What the supplied source actually implements at the archived revision.
- **Design-process evidence:** What the authentic conversation shows about requests, revisions, debugging, and teacher oversight.
- **Edited teaching illustration:** Any seven-stage transcript that reorganizes, adds bridging questions, or reconstructs exchanges to demonstrate a workflow. Such a document must be labeled as reconstructed, not presented as raw empirical data.

A repository release tag or commit hash, date, and (if desired) an archived release with a DOI can help readers cite the exact version. If sharing a transcript, review it independently for student names, identifiers, spreadsheet IDs and URLs, school-specific details, and other sensitive material. Replacing the spreadsheet ID in source code does **not** anonymize other linked datasets.

**Suggested citation metadata** (replace placeholders with your own verified publication details):

```text
Title: Minimal Pairs: A Teacher-Built Google Apps Script Micro-App
Creators: [AUTHOR NAME(S)]
Version: [RELEASE VERSION]
Year: [YEAR]
Repository URL: [GITHUB REPOSITORY URL]
Archive DOI: [DOI, IF MINTED]
Related publication: [FULL REFERENCE, IF APPLICABLE]
```

The included `LICENSE` file is a **placeholder and not a license grant**. Before publishing the repository, the rights holders should choose a license, replace that file with its actual terms, and update this notice. Until then, do not assume others have permission to reuse or redistribute the code.

## Acknowledgment

The prototype was developed through teacher-directed conversation with generative AI. The teacher supplied the pedagogical task and evaluated whether proposed interface and workflow changes met classroom requirements. Generative AI assisted in producing and revising the Google Apps Script and HTML source. The educator remains responsible for verification, classroom suitability, student-data governance, and any claims made about the artifact.
