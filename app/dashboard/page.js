'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Grid, Paper, List, ListItem, Divider } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [members, setMembers] = useState([]);
  const [topTen, setTopTen] = useState([]);

  useEffect(() => {
    async function fetchMembers() {
      try {
        const response = await fetch('/api/getMontamin'); // استدعاء البيانات من API
        const data = await response.json();

        // حساب total_count الفعلي (عدد الأبناء والأحفاد)
        const updatedMembers = data.map((member) => ({
          ...member,
          totalDescendants: calculateDescendants(member), // حساب عدد الأبناء والأحفاد
        }));

        // ترتيب الأعضاء بناءً على عدد الأبناء والأحفاد
        const sortedMembers = [...updatedMembers].sort((a, b) => b.totalDescendants - a.totalDescendants);

        // استخراج العشرة الأوائل
        const topTenMembers = sortedMembers.slice(0, 10);

        setMembers(updatedMembers); // حفظ الأعضاء مع التصنيف
        setTopTen(topTenMembers); // حفظ العشرة الأوائل
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    }

    fetchMembers();
  }, []);

  // دالة لحساب مجموع الأبناء والأحفاد بشكل متكرر (Recursive)
  const calculateDescendants = (node) => {
    let total = 0;
    if (node.children && node.children.length > 0) {
      total += node.children.length; // إضافة عدد الأبناء
      node.children.forEach((child) => {
        total += calculateDescendants(child); // إضافة عدد الأحفاد لكل ابن
      });
    }
    return total;
  };

  // تجميع الأعضاء حسب `role`
  const classificationData = {
    'عضو': [],
    'مشرف': [],
    'قائد': [],
    'منتمي': [],
  };

  members.forEach((member) => {
    const classification = member.role || 'منتمي';
    classificationData[classification].push(member.name);
  });

  // توزيع الألوان لكل صنف
  const roleColors = {
    'عضو': '#FF6347', // لون الأحمر
    'مشرف': '#3CB371', // لون الأخضر
    'قائد': '#1E90FF', // لون الأزرق
    'منتمي': '#FFD700', // لون الذهبي
  };

  // البيانات للرسم البياني مع الألوان
  const chartData = [
    { name: 'الأصناف', 'عضو': classificationData['عضو'].length, 'مشرف': classificationData['مشرف'].length, 'قائد': classificationData['قائد'].length, 'منتمي': classificationData['منتمي'].length }
  ];

  // Tooltip مخصص
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const dataKey = payload[0].dataKey;
      const membersList = classificationData[dataKey].slice(0, 10).join(', '); // عرض آخر 10 أسماء فقط
      return (
        <Box sx={{ backgroundColor: 'white', border: '1px solid #ccc', padding: 2 }}>
          <Typography variant="body2" color="textPrimary">
            <strong>{label}</strong>
          </Typography>
          <Typography variant="body2" color="textSecondary">
            عدد الأعضاء: {payload[0].value}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            الأعضاء: {membersList}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Box
      sx={{
        direction: 'rtl',
        padding: 6,
        backgroundColor: '#f0f4f8',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography variant="h4" color="primary" sx={{ marginBottom: 4, fontWeight: 'bold' }}>
        لوحة العرض - Dashboard
      </Typography>

      <Grid container spacing={2} sx={{ width: '100%', maxWidth: '1200px' }}>
        {/* Cards for each classification */}
        <Grid item xs={8} sm={3}>
          <Card sx={{ backgroundColor: '#c8e6c9' }}>
            <CardContent>
              <Typography variant="h6" color="primary" align="center">
                عدد المنتمين
              </Typography>
              <Typography variant="h4" color="textPrimary" align="center">
                {classificationData['منتمي'].length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={8} sm={2}>
        
          <Card sx={{ backgroundColor: '#e0f7fa' }}>
            <CardContent>
              <Typography variant="h6" color="primary" align="center">
                عدد الأعضاء 
              </Typography>
              <Typography variant="h4" color="textPrimary" align="center">
                {classificationData['عضو'].length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={8} sm={2}>
          <Card sx={{ backgroundColor: '#ffe0b2' }}>
            <CardContent>
              <Typography variant="h6" color="primary" align="center">
                عدد المشرفين
              </Typography>
              <Typography variant="h4" color="textPrimary" align="center">
                {classificationData['مشرف'].length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={8} sm={4}>
          <Card sx={{ backgroundColor: '#f1f8e9' }}>
            <CardContent>
              <Typography variant="h6" color="primary" align="center">
                عدد القادة
              </Typography>
              <Typography variant="h4" color="textPrimary" align="center">
                {classificationData['قائد'].length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Bar chart showing the classification distribution */}
      <Box sx={{ width: '100%', maxWidth: '800px', marginTop: 4 }}>
        <Paper elevation={3} sx={{ padding: 3 }}>
          <Typography variant="h6" color="primary" align="center" sx={{ marginBottom: 2 }}>
            توزيع الأعضاء حسب التصنيف
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="عضو" fill={roleColors['عضو']} />
              <Bar dataKey="مشرف" fill={roleColors['مشرف']} />
              <Bar dataKey="قائد" fill={roleColors['قائد']} />
              <Bar dataKey="منتمي" fill={roleColors['منتمي']} />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Box>

      {/* Top 10 Members */}
      <Box sx={{ width: '100%', maxWidth: '800px', marginTop: 4 }}>
        <Paper elevation={3} sx={{ padding: 3 }}>
          <Typography variant="h6" color="primary" align="center" sx={{ marginBottom: 2 }}>
            العشرة الأوائل الذين لديهم أكبر عدد من الأبناء والأحفاد
          </Typography>
          <List>
            {topTen.map((member, index) => (
              <React.Fragment key={member.id}>
                <ListItem>
                  <Typography variant="body1">
                    {index + 1}. {member.name} - مجموع المباشرين والغير مباشرين : {member.total_count}
                  </Typography>
                </ListItem>
                {index < topTen.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </Box>
    </Box>
  );
}