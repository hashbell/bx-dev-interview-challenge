import React, { useEffect } from 'react';
import { Box, Typography, Paper, Alert, Button } from '@mui/material';
import { ThemeMode } from '../../types';
import { UploadArea } from '../../components/file-management/UploadArea';
import { FileCard } from '../../components/file-management/FileCard';
import { useFiles } from '../../hooks/useFiles';

interface DashboardPageProps {
  mode: ThemeMode;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ mode }) => {
  const {
    files,
    loading,
    uploading,
    selectedFile,
    uploadFile,
    downloadFile,
    selectFile,
    loadFiles,
  } = useFiles();

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  const handleUpload = async () => {
    if (!selectedFile) return;
    try {
      await uploadFile(selectedFile);
      alert(`File "${selectedFile.name}" uploaded successfully!`);
    } catch (err) {
      alert(`Upload failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Paper className={mode === 'light' ? "glass-effect" : "glass-effect-dark"} sx={{ p: 6, mb: 4, borderRadius: 3, width: '100%' }}>
          <Typography variant="h4" className="gradient-text" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
            📁 Upload Files
          </Typography>
          <UploadArea
            onFileSelect={selectFile}
            selectedFile={selectedFile}
            uploading={uploading}
            mode={mode}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              size="large"
              sx={{ 
                px: 6, 
                py: 2,
                fontSize: '1.2rem',
                fontWeight: 'bold',
                color: 'white',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  boxShadow: '0 6px 20px rgba(16, 185, 129, 0.6)',
                  transform: 'translateY(-1px)',
                },
                '&:disabled': {
                  background: '#9ca3af',
                  color: 'white',
                  boxShadow: 'none',
                }
              }}
            >
              {uploading ? "⏳ Uploading..." : "🚀 Upload File"}
            </Button>
          </Box>
        </Paper>
      </Box>
      
      <Box sx={{ width: '100%' }}>
        <Paper className={mode === 'light' ? "glass-effect" : "glass-effect-dark"} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
          <Typography variant="h4" className="gradient-text" gutterBottom sx={{ mb: 3 }}>
            📂 Your Files
          </Typography>
          <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
            <Typography variant="body2">
              <strong>💡 Download Options:</strong> Choose between direct download (secure backend transfer) or presigned URL (fast direct access, opens in new tab).
              Presigned URLs expire in 60 seconds for enhanced security.
            </Typography>
          </Alert>
          {loading ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                ⏳ Loading your files...
              </Typography>
            </Box>
          ) : files.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                📭 No files uploaded yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Upload your first file to get started!
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'grid', gap: 3 }}>
              {files.map((file) => (
                <FileCard
                  key={file.id}
                  file={file}
                  onDownload={downloadFile}
                  loading={loading}
                  mode={mode}
                />
              ))}
            </Box>
          )}
        </Paper>
      </Box>
      
      <Box sx={{ width: '100%' }}>
        <Paper className={mode === 'light' ? "glass-effect" : "glass-effect-dark"} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" className="gradient-text" gutterBottom sx={{ mb: 3 }}>
            🚀 System Status
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ mb: 2, color: mode === 'light' ? '#1f2937' : '#f3f4f6', fontWeight: 'bold' }}>
                ✨ Features Active
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, color: mode === 'light' ? '#374151' : '#d1d5db' }}>
                ✅ Modern UI with Glass Morphism
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, color: mode === 'light' ? '#374151' : '#d1d5db' }}>
                ✅ Secure Authentication System
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, color: mode === 'light' ? '#374151' : '#d1d5db' }}>
                ✅ Advanced File Management
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, color: mode === 'light' ? '#374151' : '#d1d5db' }}>
                ✅ Dual Download Methods
              </Typography>
            </Box>
            <Box>
              <Typography variant="h6" sx={{ mb: 2, color: mode === 'light' ? '#1f2937' : '#f3f4f6', fontWeight: 'bold' }}>
                🛡️ Security Features
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, color: mode === 'light' ? '#374151' : '#d1d5db' }}>
                ✅ End-to-End Encryption
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, color: mode === 'light' ? '#374151' : '#d1d5db' }}>
                ✅ Secure File Transfer
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, color: mode === 'light' ? '#374151' : '#d1d5db' }}>
                ✅ Presigned URL Security
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, color: mode === 'light' ? '#374151' : '#d1d5db' }}>
                ✅ User Authentication
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </>
  );
}; 
