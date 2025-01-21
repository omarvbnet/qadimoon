'use client'

import React, { useState } from 'react';
import { AppBar, Toolbar, Button, Box, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, useMediaQuery, useTheme, Typography } from '@mui/material';
import { Home, PersonAdd, ViewList, AccountTree, ExitToApp, Menu } from '@mui/icons-material';
import Link from 'next/link';

const Navbar = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // إذا كانت الشاشة صغيرة (مثلاً الموبايل)

  const toggleDrawer = (open) => {
    setOpenDrawer(open);
  };

  return (
    <AppBar position="sticky" sx={{ background: 'linear-gradient(to right, #FF7E5F, #FEB47B)', boxShadow: 5 }}>
      <Toolbar>
        {/* Logo */}
        <Typography
          variant="h4"
          sx={{
            flexGrow:2,
            fontFamily: 'Tajawal, sans-serif',
            fontWeight: 'bold',
            color: '#fff',
            textShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            alignItems: 'center',
            textAlign:'left',

          }}
        >
         
          قادمون
        </Typography>

        {/* Show Menu Icon on mobile */}
        {isMobile ? (
          <IconButton
            color="inherit"
            edge="end"
            onClick={() => toggleDrawer(true)}
          >
            <Menu />
          </IconButton>
        ) : (
          <Box sx={{ display: 'flex', gap: 2 }}>
            {/* Desktop Navbar Buttons */}
            <Button
              color="inherit"
              startIcon={<AccountTree />}
              component={Link}
              href="/"
              sx={{
                '&:hover': { backgroundColor: '#FEB47B', color: '#fff' },
                transition: 'all 0.3s ease-in-out', padding:0,
              }}
            >
              <div key={7} style={{paddingRight:10}}>شبكة الاعضاء</div>
            </Button>

            <Button
              color="inherit"
              startIcon={<PersonAdd />}
              component={Link}
              href="/addMontami"
              sx={{
                '&:hover': { backgroundColor: '#FEB47B', color: '#fff' },
                transition: 'all 0.3s ease-in-out',
              }}
            >
                <div key={9} style={{paddingRight:10}} >  إضافة منتمي</div>
             
            </Button>

            <Button
              color="inherit"
              startIcon={<ViewList />}
              component={Link}
              href="/dashboard"
              sx={{
                '&:hover': { backgroundColor: '#FEB47B', color: '#fff' },
                transition: 'all 0.3s ease-in-out',
              }}
            >
                <div key={8} style={{paddingRight:10}}>   لوحة العرض   </div>
            
            </Button>

            <Button
              color="inherit"
              startIcon={<ExitToApp />}
              component={Link}
              href="/logout"
              sx={{
                '&:hover': { backgroundColor: '#FEB47B', color: '#fff' },
                transition: 'all 0.3s ease-in-out',
              }}
            >
                <div key={0} style={{paddingRight:10}}>  تسجيل خروج  </div>
              
            </Button>
          </Box>
        )}
      </Toolbar>

      {/* Drawer for mobile */}
      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={() => toggleDrawer(false)}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={() => toggleDrawer(false)}
          onKeyDown={() => toggleDrawer(false)}
        >
          <List>
            <ListItem button component={Link} href="/">
              <ListItemIcon><Home /></ListItemIcon>
              <ListItemText primary="الصفحة الرئيسية" />
            </ListItem>
            <ListItem button component={Link} href="/addMontami">
              <ListItemIcon><PersonAdd /></ListItemIcon>
              <ListItemText primary="إضافة منتمي" />
            </ListItem>
            <ListItem button component={Link} href="/dashboard">
              <ListItemIcon><ViewList /></ListItemIcon>
              <ListItemText primary="لوحة العرض" />
            </ListItem>
            <ListItem button component={Link} href="/">
              <ListItemIcon><AccountTree /></ListItemIcon>
              <ListItemText primary="شجرة الأعضاء" />
            </ListItem>
            <ListItem button component={Link} href="/logout">
              <ListItemIcon><ExitToApp /></ListItemIcon>
              <ListItemText primary="تسجيل خروج" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;