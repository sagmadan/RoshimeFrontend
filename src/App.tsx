import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import MemoriesPage from './components/MemoriesPage';
import { ChakraProvider } from '@chakra-ui/react';

const App: React.FC = () => {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/memories" element={<MemoriesPage />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
};

export default App;
