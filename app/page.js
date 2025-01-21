
"use client"
import { Container } from '@mui/material';
import Members from './montamin/page';


export default function Home() {
  
  return (
    <div>
      {/* شريط التنقل */}
    

      {/* محتوى الصفحة */}
      <Container sx={{ marginTop: 0 }}>
       
        <Members/>
      </Container>
    </div>
  );
}