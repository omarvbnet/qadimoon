'use client';
import { useState } from 'react';
import { TextField, Autocomplete, Container, Typography, Grid, Button, Box, CircularProgress } from '@mui/material';

export default function AddMontameen() {
    const [formData, setFormData] = useState({
        name: '',
        governorate: '',
        city: '',
        phone: '',
        voterCard: '',
        registrationCenter: '',
        identifier: null, // معرف المستخدم المختار
    });

    const [identifiers, setIdentifiers] = useState([]); // قائمة المعرفين المتاحة
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSearch = async (event, value) => {
        const query = value.trim();
        if (query.length === 0) {
            setIdentifiers([]);
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`/api/searchIdentifiers?query=${encodeURIComponent(query)}`);

            if (!response.ok) {
                const errorData = await response.json(); // استخراج تفاصيل الخطأ
                throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message}, Details: ${errorData.error}`);
            }

            const data = await response.json();
            console.log('✅ Response data:', data);
            setIdentifiers(data);
        } catch (error) {
            console.error('❌ Error fetching identifiers:', error.message);
        }
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch('/api/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            alert('تم إضافة المنتمي بنجاح!');
        } else {
            alert('حدث خطأ أثناء إضافة المنتمي.');
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom align="center">
                تسجيل المنتمين
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="اسم المنتمي"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="المحافظة"
                            name="governorate"
                            value={formData.governorate}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="المدينة"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="رقم الهاتف"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="رقم بطاقة الناخب"
                            name="voterCard"
                            value={formData.voterCard}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="اسم مركز التسجيل"
                            name="registrationCenter"
                            value={formData.registrationCenter}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Autocomplete
                            freeSolo
                            options={identifiers}
                            getOptionLabel={(option) => option.name || ''}
                            onInputChange={handleSearch}
                            onChange={(event, newValue) => {
                                setFormData({ ...formData, identifier: newValue ? newValue.id : null });
                            }}
                            loading={loading}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="المعرف"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <>
                                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                                {params.InputProps.endAdornment}
                                            </>
                                        ),
                                    }}
                                />
                            )}
                        />
                    </Grid>
                </Grid>
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Button type="submit" variant="contained" color="primary">
                        تسجيل
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}
