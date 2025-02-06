'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  TextField, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Button,
  Collapse,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from '@mui/material';
import { Home, ExpandMore, ChevronRight } from '@mui/icons-material';

const rankColors = {
  عضو: '#4CAF50',
  مشرف: '#2196F3',
  قائد: '#FFC107',
  'منتمي': '#757575'
};

const calculateCounts = (node) => {
  if (!node) return { direct: 0, indirect: 0 };
  
  let direct = node.children?.length || 0;
  let indirect = 0;
  const stack = [...(node.children || [])];
  
  while (stack.length > 0) {
    const current = stack.pop();
    indirect += current.children?.length || 0;
    if (current.children) {
      stack.push(...current.children);
    }
  }
  
  return { direct, indirect };
};

const getRank = (direct, indirect) => {
  const total = direct + indirect;
  if (total >= 100 && direct >= 10) return 'قائد';
  if (total >= 50 && direct >= 5) return 'مشرف';
  if (direct >= 10) return 'عضو';
  return 'منتمي';
};

const TreeNode = ({ node, searchTerm, selectedRank }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { direct, indirect } = calculateCounts(node);
  const rank = getRank(direct, indirect);
  const hasChildren = node.children?.length > 0;

  const matchesSearch = (
    node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    node.id.toString().includes(searchTerm)
  ) && (selectedRank === 'الكل' || rank === selectedRank);

  if (!matchesSearch && !hasMatchingChildren(node, searchTerm, selectedRank)) {
    return null;
  }

  return (
    <div dir="rtl">
      <ListItem 
        button
        onClick={() => setIsOpen(!isOpen)}
        sx={{ 
          pl: node.level * 2,
          backgroundColor: isOpen ? '#f0f4f8' : 'transparent',
          borderRadius: 1,
          display: matchesSearch ? 'flex' : 'none',
          flexDirection: 'row-reverse'
        }}
      >
        <ListItemIcon sx={{ minWidth: 'auto', marginLeft: 1 }}>
          {hasChildren ? (isOpen ? <ExpandMore /> : <ChevronRight />) : null}
        </ListItemIcon>
        <ListItemText
          primary={`${node.name} (ID: ${node.id})`}
          secondary={`الرتبة: ${rank} | المباشرين: ${direct} | غير مباشرين: ${indirect}`}
          sx={{ 
            color: rankColors[rank],
            textAlign: 'right',
            marginRight: 2
          }}
          primaryTypographyProps={{ style: { direction: 'rtl', textAlign: 'right' } }}
          secondaryTypographyProps={{ style: { direction: 'rtl', textAlign: 'right' } }}
        />
      </ListItem>
      {hasChildren && (
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {node.children.map(child => (
              <TreeNode 
                key={child.id} 
                node={{ ...child, level: node.level + 1 }}
                searchTerm={searchTerm}
                selectedRank={selectedRank}
              />
            ))}
          </List>
        </Collapse>
      )}
    </div>
  );
};

const hasMatchingChildren = (node, searchTerm, selectedRank) => {
  if (!node.children) return false;
  return node.children.some(child => {
    const { direct, indirect } = calculateCounts(child);
    const rank = getRank(direct, indirect);
    const matches = (
      child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      child.id.toString().includes(searchTerm)
    ) && (selectedRank === 'الكل' || rank === selectedRank);
    return matches || hasMatchingChildren(child, searchTerm, selectedRank);
  });
};

export default function Members() {
  const [data, setData] = useState(null);
  const [mergedMembers, setMergedMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRank, setSelectedRank] = useState('الكل');
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/get');
        const apiData = await response.json();
        if (apiData.length > 0) {
          const transformedData = addLevels(apiData[0]);
          setData(transformedData);
          setMergedMembers(flattenHierarchy(apiData[0]));
        }
      } catch (error) {
        console.error('❌ خطأ في جلب البيانات:', error);
      }
    };
    fetchData();
  }, []);

  const addLevels = (node, level = 0) => ({
    ...node,
    level,
    children: node.children?.map(child => addLevels(child, level + 1)) || []
  });

  const flattenHierarchy = (node, list = []) => {
    const { direct, indirect } = calculateCounts(node);
    const rank = getRank(direct, indirect);
    list.push({
      id: node.id,
      name: node.name,
      governorate: node.governorate,
      city: node.city,
      phone_number: node.phone_number,
      children_count: direct,
      grandchildren_count: indirect,
      total_combined: direct + indirect,
      rank: rank
    });
    node.children?.forEach(child => flattenHierarchy(child, list));
    return list;
  };

  const filteredMembers = mergedMembers.filter(member =>
    (member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.id.toString().includes(searchTerm)) &&
    (selectedRank === 'الكل' || member.rank === selectedRank)
  );

  return (
    <Box sx={{ 
      direction: 'rtl',
      padding: 4,
      backgroundColor: '#f0f4f8',
      minHeight: '100vh'
    }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: 'primary.main' }}>
        نظام إدارة الأعضاء التفاعلي
      </Typography>

      <Tabs value={tabValue} onChange={(e, newVal) => setTabValue(newVal)} centered sx={{ mb: 4 }}>
        <Tab label="الهيكل التفاعلي" />
        <Tab label="القائمة الكاملة" />
      </Tabs>

      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <TextField
          fullWidth
          placeholder="ابحث بالأسم أو الرقم التعريفي..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ maxWidth: 600, bgcolor: 'white' }}
        />
        
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>الرتبة</InputLabel>
          <Select
            value={selectedRank}
            onChange={(e) => setSelectedRank(e.target.value)}
            label="الرتبة"
          >
            <MenuItem value="الكل">الكل</MenuItem>
            <MenuItem value="قائد">قائد</MenuItem>
            <MenuItem value="مشرف">مشرف</MenuItem>
            <MenuItem value="عضو">عضو</MenuItem>
            <MenuItem value="منتمي">منتمي</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {tabValue === 0 && (
        <Box sx={{ 
          height: '70vh',
          bgcolor: 'white',
          borderRadius: 2,
          p: 2,
          overflow: 'auto',
          direction: 'rtl'
        }}>
          {data ? (
            <List sx={{ direction: 'rtl' }}>
              <TreeNode 
                node={data} 
                searchTerm={searchTerm}
                selectedRank={selectedRank}
              />
            </List>
          ) : (
            <Typography variant="h6" color="textSecondary" align="right">
              جاري تحميل البيانات...
            </Typography>
          )}
        </Box>
      )}

      {tabValue === 1 && (
        <TableContainer component={Paper} sx={{ maxWidth: '95%', mx: 'auto' }}>
          <Table>
            <TableHead sx={{ bgcolor: 'primary.light' }}>
              <TableRow>
                {['الاسم', 'المعرف', 'المحافظة', 'المدينة', 'الهاتف', 'المباشرين', 'غير مباشرين', 'الإجمالي', 'الرتبة'].map(
                  (header) => (
                    <TableCell key={header} sx={{ fontWeight: 'bold' }}>{header}</TableCell>
                  )
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMembers.map((member) => (
                <TableRow key={member.id} hover>
                  <TableCell>{member.name}</TableCell>
                  <TableCell>{member.id}</TableCell>
                  <TableCell>{member.governorate}</TableCell>
                  <TableCell>{member.city}</TableCell>
                  <TableCell>{member.phone_number}</TableCell>
                  <TableCell>{member.children_count}</TableCell>
                  <TableCell>{member.grandchildren_count}</TableCell>
                  <TableCell>{member.total_combined}</TableCell>
                  <TableCell sx={{ 
                    color: rankColors[member.rank],
                    fontWeight: 'bold'
                  }}>
                    {member.rank}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
