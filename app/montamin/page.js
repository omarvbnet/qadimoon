'use client';

import React, { useState, useEffect } from 'react';
import { 
  TextField, 
  Box, 
  Typography, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  List, 
  Tabs, 
  Tab, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper 
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function Members() {
  const [members, setMembers] = useState([]);
  const [montamin, setMontamin] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    // Fetch members and montamin data
    async function fetchData() {
      try {
        const membersResponse = await fetch('/api/get');
        const membersData = await membersResponse.json();
        setMembers(membersData);

        const montaminResponse = await fetch('/api/getMontamin');
        const montaminData = await montaminResponse.json();
        setMontamin(montaminData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  // Recursive function to count descendants
  const countDescendants = (node) => {
    let total = 0;
    if (node.children && node.children.length > 0) {
      total += node.children.length;
      node.children.forEach((child) => {
        total += countDescendants(child);
      });
    }
    return total;
  };

  // Recursive search function for the tree structure
  const searchTree = (node, term) => {
    if (node.name.toLowerCase().includes(term)) return true;
    if (node.children && node.children.length > 0) {
      return node.children.some((child) => searchTree(child, term));
    }
    return false;
  };

  const filteredMembers = members.filter((member) => {
    const term = searchTerm ? searchTerm.toLowerCase() : '';
    return searchTree(member, term);
  });

  const filteredMontamin = montamin.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Render tree structure
  const renderTree = (node) => (
    <Accordion key={node.id} sx={{ marginBottom: 2, width: '100%' }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel-${node.id}-content`} id={`panel-${node.id}-header`}>
        <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
          <Typography variant="h6" color="primary" sx={{ width: '30%', flexShrink: 0 }}>
            {countDescendants(node)}
          </Typography>
          <Typography variant="h6" color="primary" sx={{ width: '60%', flexShrink: 0 }}>
            {node.name} (ID: {node.id}) - عدد المباشرين: {node.children_count} - عدد الغير مباشرين: {node.grandchildren_count}
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        {node.children && node.children.length > 0 && (
          <List sx={{ paddingLeft: 4 }}>
            {node.children.map((child) => renderTree(child))}
          </List>
        )}
      </AccordionDetails>
    </Accordion>
  );

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
        إدارة الأعضاء
      </Typography>
      <Tabs
        value={tabValue}
        onChange={(e, newValue) => setTabValue(newValue)}
        sx={{ marginBottom: 4 }}
        centered
      >
        <Tab label="شبكة الأعضاء" />
        <Tab label="قائمة المنتمين" />
      </Tabs>

      <TextField
        variant="outlined"
        placeholder="ابحث عن اسم..."
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{
          marginBottom: 4,
          backgroundColor: '#ffffff',
          borderRadius: 3,
          maxWidth: '600px',
          '& .MuiOutlinedInput-root': {
            borderRadius: 3,
          },
        }}
      />

      {tabValue === 0 && (
        <Box sx={{ width: '100%', maxWidth: 800 }}>
          {filteredMembers.length > 0 ? (
            <List>{filteredMembers.map((member) => renderTree(member))}</List>
          ) : (
            <Typography variant="h6" color="textSecondary" align="center">
              لا توجد نتائج مطابقة
            </Typography>
          )}
        </Box>
      )}

      {tabValue === 1 && (
        <TableContainer component={Paper} sx={{ maxWidth: 800, marginTop: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>الاسم</TableCell>
                <TableCell>المعرف</TableCell>
                <TableCell>الإجمالي</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMontamin.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.total_count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}