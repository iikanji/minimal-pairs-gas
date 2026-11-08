# Tony Starking a Word Pair Web App: A Seven-Stage Teacher–AI Dialogue

> **Editorial note:** This is an illustrative, edited reconstruction of the Word Pair Google Apps Script conversation, organized around the seven-stage voice-assisted workflow. It is **not a verbatim transcript**. Dialogue is drawn from and closely adapted to the original exchange where possible. Questions, replies, and ordering needed to demonstrate the seven stages have been reconstructed. Code is deliberately omitted.

## Stage 1. State the seed

**Teacher:** Okay, I'm looking to Tony Stark a very simple web app made in Google Apps Script here. I'm gonna describe it to you, and then I'd like you to produce that code for me. Sound good?

**AI:** Go ahead and describe what you're envisioning for the web app.

**Teacher:** I want to help students distinguish between teacher-emitted minimal pairs—two words that differ by just one phoneme, such as *ship / sheep* or *light / right*. The teacher says one word aloud; students listen and tap the word they think they heard. The app doesn't play the audio: the teacher supplies the spoken word. I want a simple text input field that takes a four-digit student ID, a dropdown menu labeled Word Pair, and two larger rounded rectangle buttons that populate with the words chosen in the dropdown. There's a total of 10 turns. I want the previous selection stored in memory and, when students finish, the 10 stored words sent to a Google Sheet. Finally, I'd like to show a message with the student's name.

## Stage 2. Keep the AI in inquiry mode

**Teacher:** This is a brand new web app created from scratch. Before you produce the code, ask me one question at a time until we understand the actions and data.

**AI:** So the teacher says one of the two words aloud, and the student selects the word they heard. The app records their selections, rather than producing the spoken stimulus. What should the student do first when the web app opens?

**Teacher:** In the top left-hand corner, a simple text input field labeled ID. It's going to take a four-digit student ID. In the upper right-hand corner, a dropdown menu labeled Word Pair. There are approximately 15 word pairs.

**AI:** What happens when the student chooses a word pair?

**Teacher:** The two larger rounded rectangle buttons in the center of the page will populate with the words that are chosen in the dropdown, one word per button, of course.

**AI:** What should happen when a student selects one of those buttons?

**Teacher:** Next will store the current button selection in memory, reset the button state, and advance it to the next turn. There's a total of 10 turns.

**AI:** When can the student finish, and what should be recorded?

**Teacher:** Done will become active once all 10 turns have taken place. When Done is pushed, a timestamp, the Student ID, the word pair, and the 10 stored words will be sent to an attached Google Sheet and entered into Column A, Column B, Column C, and Columns D–M respectively.

**AI:** Where will the student's name come from?

**Teacher:** The student name will be matched from the ID and pulled from the roster. The message should read, “Great effort, STUDENT NAME! Don't give up!”

## Stage 3. Produce a mission brief

**AI:** Here's the picture of what we're going for. The purpose is listening discrimination of minimal pairs: the teacher says one word aloud, and the student identifies it by selecting one of two on-screen words. The app records selections, but the current design does not establish an answer key or automatically calculate correctness. A student enters a four-digit ID, chooses one of approximately 15 word pairs, and selects one word per turn. Next records each selection and advances the game. After 10 turns, Done sends the timestamp, ID, word pair, and 10 choices to Google Sheets. A roster maps the ID to the student's first name for a personalized message. Reset returns the app to its initial loading state. The student-facing page should be simple and mobile-friendly. Is that correct?

**Teacher:** Yes. Also, the spreadsheet should be accessed by its ID, regardless of where the script lives.

**AI:** We can use `SpreadsheetApp.openById()` so the web app always uses that specific Google Sheet. We should also confirm that the script has permission to access the sheet and that student IDs and names are handled only for the intended classroom purpose.

**Teacher:** Okay. And I want a short survey question after the students finish.

**AI:** We can reveal a survey section underneath the main app, rather than an overlay. The rating can be recorded in Column N for that session.

## Stage 4. Map the logic

**AI:** Let's map the sequence before writing the code: load the word pairs; enter the student ID; choose a pair; select one of the two words; click Next to store that choice and reset the buttons; repeat for 10 turns; enable Done; save the session; look up the student's name; then show the message and survey.

**Teacher:** Right. Done should only become active after the 10th turn is finished. No dialogue box. And after 10 times, the word pair buttons should no longer be selectable.

**AI:** Then after turn 10, Done becomes active and both word buttons remain disabled. The backend should also require exactly 10 choices.

**Teacher:** It should only send each data set once. I clicked Done four times and it entered the same data four times.

**AI:** We need to prevent multiple clicks. After the first valid submission, disable Done immediately and block further submissions for that session. For stronger protection against retries or reloads, the server should also recognize a unique session submission rather than relying only on the disabled button.

**Teacher:** Reset should return the state of this web app to its initial loading state.

**AI:** Then Reset clears the choices, turn count, selected pair, student ID, and survey state. A completed session must not be silently resubmitted.

## Stage 5. Define the interface

**Teacher:** The layout and arrangement of the elements must be the same. ID top-left, dropdown top-right, two larger rounded rectangle buttons symmetrically centered, Reset bottom-left, Next in the center, Done bottom-right.

**AI:** We can put all the controls inside a centered frame, with a white background, rounded corners, and tighter spacing. The two word buttons will be side by side, with Reset, Next, and Done on a single bottom row.

**Teacher:** It's too spread out. The UI needs to be a little tighter.

**AI:** A centered container with a maximum width of about 500 pixels will make the layout more compact while preserving the original arrangement.

**Teacher:** The Word Pair selection dropdown should read “Choose a pair.” at its default state.

**AI:** We'll add a disabled placeholder option, selected by default, so the student must actively choose a pair.

**Teacher:** Let's get rid of the overlay and load a partial underneath. It should contain the same text, but also a survey-style question with five stars. The stars are greyed-out at first, but turn yellow, increase in size by 7%, and dance back and forth when clicked or tapped. The survey question is 「今日のどれぐらい自信が付きましたか？」

**AI:** The survey will appear under the main frame after Done. Selecting a star rating from 1 to 5 will highlight that many stars, animate them, and save the rating in Column N of the same session record.

## Stage 6. Generate the blueprint

**AI:** Here's the blueprint for the two Google Apps Script files.

**AI:** `Code.gs` serves the HTML page, returns the 15 word pairs, looks up a student name from the Roster sheet, stores one completed session in Sheet1, and saves the confidence rating in Column N. `Index.html` displays the centered frame, ID field, dropdown, two word buttons, Reset/Next/Done controls, and the survey beneath the frame.

**Teacher:** The word pairs should use a slash with spaces, like “Sun / Moon” and “Cat / Dog.”

**AI:** Then `updateButtons()` will split the selected value on `' / '`, placing one word on each button. The default dropdown text remains “Choose a pair.”

**AI:** The data fields are: Column A timestamp; B four-digit student ID; C word pair; D–M ten chosen words; N confidence rating. The roster maps student ID to first name. Done stays inactive until 10 completed turns. Word selection stops after turn 10. The app prevents duplicate submissions and shows an error if the ID is not four digits or the server cannot save. The student name is shown only after the save succeeds.

**Teacher:** Good. The code needs to be ready to copy and paste into a brand new web app created from scratch.

**AI:** The acceptance checks are: the placeholder appears on load; both buttons show the selected pair; Next stores exactly one choice per turn; Done is disabled before turn 10; the word buttons are disabled after turn 10; the sheet receives exactly one row per completed session; the roster name appears; and the star rating is saved to Column N.

## Stage 7. Transfer to code, test, and repair

**Teacher:** Generate all of `Index.html` and `Code.gs` for copy paste please.

**AI:** I'll generate the complete backend and frontend. `Code.gs` uses the specified spreadsheet ID; `Index.html` handles the interface, ten-turn state, and survey. [Code.gs — .js code omitted] [Index.html — .html code omitted]

**Teacher:** It loads, but it is super dark. Almost as if the overlay is covering the whole thing.

**AI:** The overlay CSS is displaying a full-screen dark layer. We should hide it by default and only show it when requested. [HTML/CSS code snippet omitted]

**Teacher:** The overlay doesn't load after 10 turns.

**AI:** We need to check the Done validation, the successful server response, and the overlay display state. We should show an error if saving fails, rather than assuming the display code is the cause. [JavaScript code snippet omitted]

**Teacher:** Let's get rid of the overlay and load a partial underneath. It should contain the same text, but also a survey-style question with five stars.

**AI:** We'll replace the overlay with a hidden survey section revealed only after Done successfully stores the results. The rating will be saved in Column N. [HTML and JavaScript code omitted]

**Teacher:** Rad. That works. However, it should only send each data set once. I clicked Done four times and it entered the same data four times. Only allow Done to be clicked once.

**AI:** The Done button needs to be disabled immediately, with a submission flag to block repeated clicks. A server-side session identifier can also protect against accidental duplicate writes after retries. [JavaScript code snippet omitted]

**Teacher:** Let's go back. Done button is inactive until 10th turn is finished. Change the backend logic if necessary. Also, `updateButtons()` should split the selected pair on `' / '`.

**AI:** Done will become active only after the tenth completed turn. The backend will require exactly 10 choices, and the word pair buttons will use the slash-separated format. [JavaScript code snippet omitted]

**Teacher:** The Word Pair selection dropdown should read “Choose a pair.” at its default state.

**AI:** We'll add that placeholder and require a valid selection before a turn can begin. [JavaScript code snippet omitted]

**Teacher:** After 10 times, the word pair buttons should no longer be selectable.

**AI:** After turn 10, both word buttons will be disabled and further selections blocked. Done will remain available for one valid submission. [JavaScript code snippet omitted]

**Teacher:** Okay. That's the behavior I want.

**AI:** The remaining step is to test the deployed version with a valid student ID, a missing ID, an unselected pair, ten completed turns, repeated Done clicks, Reset, and a one-to-five-star rating. Confirm that the sheet receives one session row and that the rating updates the same row. Any errors or classroom observations can then guide the next revision.

---

## Editorial provenance

The pedagogical explanation that the teacher pronounces minimal pairs and students identify the word heard is a newly supplied clarification, not an explicit statement in the original transcript. The original transcript directly supports the app concept, four-digit ID, word-pair dropdown, ten-turn sequence, spreadsheet columns, roster lookup, personalized message, centered layout, survey, star animation, duplicate-submission problem, dropdown placeholder, slash-separated pairs, and final button lockout. The explicit one-question-at-a-time inquiry, mission brief, permissions discussion, server-side idempotency recommendation, formal acceptance checks, and final testing checklist are **editorial additions** needed to illustrate the proposed seven-stage workflow. The final teacher confirmation is also reconstructed. This example must not be presented as an unedited record of actual teacher–AI dialogue.
