import './App.css';
import {ColorModeContext, useMode} from './theme';
import {CssBaseline, ThemeProvider} from '@mui/material'
import Topbar from './global/Topbar';
import AppSidebar from './global/Sidebar';
import { ProSidebarProvider } from 'react-pro-sidebar';
import Dashboard from './scenes/Dashboard';
import Instructors from './scenes/Instructors'
import Students from './scenes/Students'
// import Bar from './scenes/bar'
// import Form from './scenes/form'
// import Pie from './scenes/pie'
// import Line from './scenes/line'
// import Geography from './scenes/geography'
import { Route, Routes } from 'react-router-dom';
import Stations from './scenes/Stations';

function App() {
  const[theme, colorMode] = useMode();
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
    <CssBaseline />
    <ProSidebarProvider>
    <div className="app">
      <AppSidebar />
      <main className='content'>
        <Topbar />
        <Routes>
          <Route path='/' element={<Dashboard/>} />
          <Route path='/instructors' element={<Instructors />} />
          <Route path='/students' element={<Students />} />
          <Route path='/stations' element={<Stations />} />
          {/* <Route path='/results' element={<Results />} /> */}
          {/* <Route path='/form' element={<Form />} /> */}
          {/* <Route path='/bar' element={<Bar />} /> */}
          {/* <Route path='/pie' element={<Pie />} /> */}
          {/* <Route path='/line' element={<Line />} /> */}
          {/* <Route path='/calender' element={<Calender />} /> */}
          {/* <Route path='/geography' element={<Geography />} /> */}
        </Routes>
      </main>
    </div>
    </ProSidebarProvider>
    </ThemeProvider>
    </ColorModeContext.Provider>
   
  );
}

export default App;
