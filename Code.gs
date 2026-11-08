/**
 * CONFIGURATION CONSTANTS
 */
const SPREADSHEET_ID = '[YOUR_SPREADSHEET_ID_HERE]';
const DATA_SHEET = 'Sheet1';
const ROSTER_SHEET = 'Roster';

/**
 * Returns a static list of word pairs.
 */
function getWordPairs() {
  return [
    'lice / rice',
    'climb / crime',
    'light / write',
    'fly / fry',
    'long / wrong',
    'grass / glass',
    'collect / correct',
    'lock / rock',
    'law / raw',
    'leader / reader',
    'clown / crown',
    'play / pray',
    'glow / grow',
    'flee / free',
    'locket / rocket',
    'pilot / pirate'
  ];
}
/**
 * Looks up the student name given their ID.
 * Searches the ROSTER_SHEET for a match.
 */
function getStudentName(studentId) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const roster = ss.getSheetByName(ROSTER_SHEET);
  const data = roster.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(studentId)) {
      return data[i][1];
    }
  }
  return 'Student';
}

/**
 * Stores the student's session result in the data sheet.
 * Returns the student name and the row number for later rating updates.
 */
function storeResult(studentId, wordPair, choices) {
  if (choices.length !== 10) {
    throw new Error('Exactly 10 choices are required.');
  }

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(DATA_SHEET);
  const timestamp = new Date();

  const row = [timestamp, studentId, wordPair].concat(choices);
  sheet.appendRow(row);

  const lastRow = sheet.getLastRow();
  const studentName = getStudentName(studentId);

  return {
    studentName: studentName,
    row: lastRow
  };
}

/**
 * Saves the confidence rating (1-5 stars) in Column N of the data sheet.
 * Expects the row number returned by storeResult.
 */
function saveConfidence(rowNumber, rating) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(DATA_SHEET);
  sheet.getRange(rowNumber, 14).setValue(rating); // Column N is 14
}

/**
 * Serves the web app's HTML page.
 */
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Word Pair Selection App')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
