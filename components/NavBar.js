// Navbar.js أو الملف الذي يحتوي على Navbar
import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import Link from 'next/link';

export default function Navbar() {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          لوحة التحكم
        </Typography>

        <Button color="inherit" component={Link} href="/add-member">إضافة منتمي</Button>
        <Button color="inherit" component={Link} href="/dashboard">لوحة العرض</Button>
        <Button color="inherit" component={Link} href="/tree">شجرة الأعضاء</Button>
        <Button color="inherit" component={Link} href="/logout">تسجيل خروج</Button>
      </Toolbar>
    </AppBar>
  );
}