

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileTypeColor = (mimetype: string): string => {
  if (mimetype.startsWith('image/')) return '#4caf50';
  if (mimetype.startsWith('application/pdf')) return '#f44336';
  if (mimetype.includes('word')) return '#2196f3';
  if (mimetype.includes('excel')) return '#4caf50';
  return '#757575';
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString();
};

export const handleApiError = async (response: Response): Promise<string> => {
  let errorMessage = 'Request failed';
  try {
    const errorData = await response.json();
    errorMessage = errorData.message || errorData.error || 'Request failed';
  } catch {
    const errorText = await response.text();
    errorMessage = errorText || 'Request failed';
  }
  return errorMessage;
};

export const downloadBlob = (blob: Blob, filename: string): void => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

export const openInNewTab = (url: string): void => {
  window.open(url, '_blank');
}; 
