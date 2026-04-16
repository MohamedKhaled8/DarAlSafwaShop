export const uploadToCloudinary = async (file: File): Promise<string> => {
  const CLOUD_NAME = "dz3rnmgj1";
  const API_KEY = "979336691238183";
  const API_SECRET = "jcgR50YTGrLMoe_FpM6EOEr2tdQ";

  const timestamp = Math.round(new Date().getTime() / 1000);
  
  // Create signature string
  const signatureString = `timestamp=${timestamp}${API_SECRET}`;
  
  // Hash the signature using Web Crypto API
  const encoder = new TextEncoder();
  const data = encoder.encode(signatureString);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", API_KEY);
  formData.append("timestamp", timestamp.toString());
  formData.append("signature", signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const dataRes = await response.json();
  if (dataRes.secure_url) {
    return dataRes.secure_url;
  } else {
    throw new Error(dataRes.error?.message || "Upload failed");
  }
};
