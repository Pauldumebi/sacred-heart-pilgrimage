/**
 * Google Apps Script for Pilgrimage to Our Lady of Mount Grace, Osmotherley
 * 
 * INSTRUCTIONS:
 * 1. Open Google Sheets (https://sheets.new)
 * 2. Rename the sheet to: "Osmotherley Pilgrimage Registrations"
 * 3. In Row 1, add these column headers:
 *    A1: Timestamp
 *    B1: Full Name
 *    C1: Phone Number
 *    D1: Email Address
 *    E1: Party Size
 *    F1: Transport / Carpool
 *    G1: Prayer Intention
 * 
 * 4. In the top menu, go to: Extensions > Apps Script
 * 5. Delete any code in the editor, and paste the code below.
 * 6. Click "Deploy" (top right) > "New deployment"
 * 7. Click the gear icon next to "Select type" > choose "Web app"
 * 8. Fill in:
 *    - Description: "Pilgrimage Registration"
 *    - Execute as: "Me (<your email>)"
 *    - Who has access: "Anyone" (IMPORTANT!)
 * 9. Click "Deploy", authorize permissions when prompted.
 * 10. Copy the Web App URL (starts with https://script.google.com/macros/s/...)
 * 11. Paste that URL into GOOGLE_SHEET_WEB_APP_URL in app.js
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parse incoming data (handles both JSON and URL-encoded form data)
    var data = {};
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter;
      }
    } else if (e.parameter) {
      data = e.parameter;
    }

    var row = [
      new Date(),
      data.fullName || '',
      data.phoneNumber || '',
      data.emailAddress || '',
      data.partySize || '',
      data.transport || '',
      data.intentions || ''
    ];

    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success', message: 'Registration recorded' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'active', message: 'Pilgrimage Registration Webhook is running.' }))
    .setMimeType(ContentService.MimeType.JSON);
}
