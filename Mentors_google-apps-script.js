function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  
  try {
    // Check if we have any data
    if (!e || (!e.parameter && !e.postData)) {
      throw new Error('No data received');
    }

    var formData;
    if (e.postData) {
      formData = JSON.parse(e.postData.contents);
    } else {
      formData = e.parameter;
    }
    
    // Replace with your Mentor Spreadsheet ID
    const spreadsheetId = ''; 
    const ss = SpreadsheetApp.openById(spreadsheetId);

    var sheet = ss.getSheetByName('Mentors');
    if (!sheet) {
      sheet = ss.insertSheet('Mentors');
      sheet.appendRow([
        'Timestamp',
        'Full Name',
        'Email Address',
        'Phone Number',
        'LinkedIn',
        'Designation',
        'Organization',
        'Location',
        'Years of Experience',
        'Industry',
        'Areas of Expertise',
        'Past Startup Experience',
        'Notable Achievements',
        'Preferred Mode',
        'Availability',
        'Time Commitment',
        'Max Startups to Mentor',
        'Preferred Startup Stage',
        'Why Mentor with us?',
        'Past Mentorship Exp.',
        'Profile Photo URL'
      ]);
      
      var headerRange = sheet.getRange(1, 1, 1, 21);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#f3f3f3");
      sheet.setFrozenRows(1);
    }

    var timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "MM/dd/yyyy HH:mm:ss");

    sheet.appendRow([
      timestamp,
      formData.name || '',
      formData.email || '',
      formData.phone || '',
      formData.linkedin || '',
      formData.designation || '',
      formData.company || '',
      formData.location || '',
      formData.experience || '',
      formData.industry || '',
      formData.expertise || '',
      formData.pastExperience || '',
      formData.achievements || '',
      formData.mode || '',
      formData.availability || '',
      formData.timeCommitment || '',
      formData.startupCount || '',
      formData.startupStage || '',
      formData.whyMentor || '',
      formData.pastMentorship || '',
      formData.photoUrl || ''
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Mentor data successfully recorded'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: 'Failed to record mentor data: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: 'Mentor Apps Script is running'
  })).setMimeType(ContentService.MimeType.JSON);
}
