export interface MentorFormData {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  designation: string;
  company: string;
  location: string;
  experience: string;
  industry: string;
  expertise: string; // Comma separated string from checkboxes
  pastExperience: string;
  achievements: string;
  mode: string;
  availability: string;
  timeCommitment: string;
  startupCount: string;
  startupStage: string;
  whyMentor: string;
  pastMentorship: string;
  photoUrl?: string;
}

export async function submitMentor(
  formData: MentorFormData,
  croppedImageBase64: string | null
): Promise<void> {
  
  // 1. Upload Image to ImgBB if provided
  let photoUrl = '';
  
  if (croppedImageBase64) {
    const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
    if (!apiKey || apiKey === 'YOUR_IMGBB_API_KEY_HERE') {
      throw new Error("Missing ImgBB API Key. Please add it to your .env file.");
    }

    const base64Data = croppedImageBase64.split(',')[1];
    const imageFormData = new globalThis.FormData();
    imageFormData.append('key', apiKey);
    imageFormData.append('image', base64Data);

    const imgResponse = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: imageFormData,
    });

    if (!imgResponse.ok) {
      throw new Error(`Image upload failed: HTTP ${imgResponse.status}`);
    }

    const imgResult = await imgResponse.json();
    if (!imgResult.success) {
      throw new Error('Image upload failed');
    }

    photoUrl = imgResult.data.url;
  }

  // 2. Submit Data to Google Apps Script
  const submitData = new globalThis.FormData();
  
  // Append all text fields
  Object.keys(formData).forEach(key => {
    submitData.append(key, formData[key as keyof MentorFormData] || '');
  });
  
  // Append the ImgBB photo URL
  submitData.append('photoUrl', photoUrl);

  const endpoint = import.meta.env.VITE_MENTOR_SUBMIT_ENDPOINT;
  if (!endpoint || endpoint === 'YOUR_NEW_MENTOR_SCRIPT_URL_HERE') {
    throw new Error("Missing Apps Script Endpoint. Please deploy the script and add URL to .env.");
  }

  const response = await fetch(endpoint, { 
    method: 'POST', 
    body: submitData 
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const result = await response.json();

  if (result.status !== 'success') {
    throw new Error(result.message || 'Submission failed');
  }
}
