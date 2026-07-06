function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  
  try {
    Logger.log('Received POST request');
    Logger.log('Request data: ' + JSON.stringify(e));
    
    // Check if we have any data
    if (!e || (!e.parameter && !e.postData)) {
      throw new Error('No data received');
    }

    // Get the form data from the request
    var formData;
    if (e.postData) {
      // If data is sent as JSON
      formData = JSON.parse(e.postData.contents);
    } else {
      // If data is sent as form-data
      formData = e.parameter;
    }
    
    Logger.log('Form data received: ' + JSON.stringify(formData));
    
    const spreadsheetId = ''; // Your spreadsheet ID
    const ss = SpreadsheetApp.openById(spreadsheetId);

    // Detect recruitment form based on presence of fields
    const isRecruitment = formData.contactNo || formData.branch || formData.year || formData.positions || formData.whyJoin;

    var sheet = ss.getSheetByName(isRecruitment ? 'Recruitment_2025' : 'Registrations');
    if (!sheet) {
      // Auto-create sheet with headers
      sheet = ss.insertSheet(isRecruitment ? 'Recruitment_2025' : 'Registrations');
      if (isRecruitment) {
        sheet.appendRow(['Timestamp','Name','Email','Contact No','Branch','Year','Positions','Why Join','Past Experience','Resume URL']);
      } else {
        sheet.appendRow(['Timestamp','Name','Email','Phone','Graduation Year','Business Idea','Funding','Progress','CollegeID URL']);
      }
    }

    // Handle uploads
    var fileUrl = '';

    if (isRecruitment && formData.resume) {
      var recFolderName = 'Recruitment Resumes 2025';
      var recFolder = DriveApp.getFoldersByName(recFolderName).hasNext() ?
        DriveApp.getFoldersByName(recFolderName).next() :
        DriveApp.createFolder(recFolderName);
      var resumeBase64 = String(formData.resume).split(',')[1] || '';
      if (resumeBase64) {
        var resumeBlob = Utilities.newBlob(Utilities.base64Decode(resumeBase64), 'application/octet-stream', 'resume');
        var resumeFile = recFolder.createFile(resumeBlob);
        resumeFile.setName((formData.name || 'candidate') + '_Resume_' + new Date().toISOString());
        fileUrl = resumeFile.getUrl();
      }
    } else if (!isRecruitment && formData.collegeId) {
      var folderName = 'College ID Uploads';
      var folder = DriveApp.getFoldersByName(folderName).hasNext() ?
        DriveApp.getFoldersByName(folderName).next() :
        DriveApp.createFolder(folderName);
      var base64Data = String(formData.collegeId).split(',')[1] || '';
      if (base64Data) {
        var fileBlob = Utilities.newBlob(Utilities.base64Decode(base64Data), 'application/octet-stream', 'college_id');
        var file = folder.createFile(fileBlob);
        file.setName((formData.name || 'student') + '_CollegeID_' + new Date().toISOString());
        fileUrl = file.getUrl();
      }
    }

    var timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "MM/dd/yyyy HH:mm:ss");

    if (isRecruitment) {
      sheet.appendRow([
        timestamp,
        formData.name || '',
        formData.email || '',
        formData.contactNo || '',
        formData.branch || '',
        formData.year || '',
        formData.positions || '',
        formData.whyJoin || '',
        formData.pastExperience || '',
        fileUrl
      ]);
    } else {
      sheet.appendRow([
        timestamp,
        formData.name || '',
        formData.email || '',
        formData.phone || '',
        formData.graduationYear || '',
        formData.businessIdea || '',
        formData.funding || '',
        formData.progress || '',
        fileUrl
      ]);
    }

    Logger.log('Data successfully appended to sheet');
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Data successfully recorded'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: 'Failed to record data: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: 'GET request received'
  })).setMimeType(ContentService.MimeType.JSON);
}