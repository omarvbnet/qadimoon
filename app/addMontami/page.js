'use client';
import { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Select, MenuItem, FormControl, InputLabel, Grid, Paper, Snackbar, Alert } from '@mui/material';

export default function AddMontami() {
  const [formData, setFormData] = useState({
    name: '',
    province: '',
    city: '',
    phone_number: '',
    voter_id_number: '',
    registration_center_name: '',
    identifier: '',
  });

  const [identifiers, setIdentifiers] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // جلب قائمة المعرفين
  useEffect(() => {
    const fetchIdentifiers = async () => {
      const response = await fetch('/api/getIdentifiers');
      const data = await response.json();
      setIdentifiers(data);
    };

    fetchIdentifiers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('/api/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      setSnackbar({ open: true, message: 'تم إضافة المنتمي بنجاح!', severity: 'success' });
    } else {
      setSnackbar({ open: true, message: 'حدث خطأ أثناء إضافة المنتمي.', severity: 'error' });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box 
      sx={{
        backgroundColor: '#f9f9f9',
        minHeight: '60vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 4,
        direction:'rtl'
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          borderRadius: 4,
          maxWidth: 500,
          width: '100%',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography variant="h5" sx={{    direction:'rtl' , marginBottom: 4, textAlign: 'center', fontWeight: 'bold' }}>
          إضافة منتمي جديد
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item sx={{   direction:'rtl'}} xs={12}>
              <TextField
               sx={{ textAlign:'right'}}
                fullWidth
                label="اسم المنتمي"
                name="name"
                variant="outlined"
                
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="المحافظة"
                name="province"
                variant="outlined"
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="المدينة"
                name="city"
                variant="outlined"
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="رقم الهاتف"
                name="phone_number"
                variant="outlined"
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="رقم بطاقة الناخب"
                name="voter_id_number"
                variant="outlined"
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="اسم مركز التسجيل"
                name="registration_center_name"
                variant="outlined"
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>المعرف</InputLabel>
                <Select
                  name="identifier"
                  value={formData.identifier}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="">
                    <em>اختر المعرف</em>
                  </MenuItem>
                  {identifiers.map((identifier) => (
                    <MenuItem key={identifier.id} value={identifier.id}>
                      {identifier.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: '#1976d2',
                  color: '#fff',
                  padding: '10px 20px',
                  borderRadius: 2,
                  '&:hover': { backgroundColor: '#1565c0' },
                }}
              >
                إضافة منتمي
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
      {/* Snackbar Component */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}