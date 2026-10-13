# Connecting Registration to Google Sheets (2-Minute Setup)

Follow these quick steps to send every pilgrimage registration directly into a private Google Sheet in real time.

---

### Step 1: Create Your Google Sheet
1. Open Google Sheets: **[sheets.new](https://sheets.new)**
2. Name the spreadsheet: **`Osmotherley Pilgrimage Registrations`**
3. In **Row 1**, label columns **A** to **G** as follows:

| A | B | C | D | E | F | G |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Timestamp** | **Full Name** | **Phone Number** | **Email Address** | **Party Size** | **Transport / Carpool** | **Prayer Intention** |

---

### Step 2: Open Apps Script
1. In the Google Sheet top menu, click **Extensions** → **Apps Script**.
2. Delete whatever sample code is currently in the script editor.
3. Open [`google_apps_script.js`](google_apps_script.js) in this project, copy all its code, and paste it into the editor.

*(Or copy this snippet directly)*:
```javascript
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
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
    ];

    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}
```

4. Click **Save** (💾 or `Ctrl+S` / `Cmd+S`).

---

### Step 3: Deploy as a Web App
1. In the top right corner, click **Deploy** → **New deployment**.
2. Click the gear icon ⚙️ next to *Select type* and choose **Web app**.
3. Configure the fields:
   - **Description:** `Pilgrimage Form Handler`
   - **Execute as:** `Me (<your google email>)`
   - **Who has access:** **`Anyone`** *(This is important so the site form can submit to it)*
4. Click **Deploy**.
5. Google will ask you to **Authorize access**:
   - Click *Authorize access* → select your account → click *Advanced* (small text at bottom) → click *Go to Untitled project (unsafe)* → click *Allow*.
6. Copy the **Web App URL** provided (it looks like `https://script.google.com/macros/s/.../exec`).

---

### Step 4: Paste URL into `app.js`
Open [`app.js`](app.js) and paste your URL into line 10:

```javascript
const GOOGLE_SHEET_WEB_APP_URL = "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec";
```

That's it! Every time someone clicks **Confirm Pilgrimage Registration**, a new row will instantly appear in your Google Sheet.
