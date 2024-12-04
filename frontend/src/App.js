import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Componentes/Header/Index';
import Professores from './Componentes/Professores/Index';
import Alunos from './Componentes/Alunos/Index';
import Notas from './Componentes/Notas/Index';
import styled from 'styled-components';

const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background-image: linear-gradient(90deg, #002F52 35%, #326589 165%);
`;

const WelcomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 100px); // Adjust this value based on your header height
  color: white;
`;

const WelcomeTitle = styled.h1`
  font-size: 2.8rem;
  margin-bottom: 20px;
`;

const WelcomeSubtitle = styled.p`
  font-size: 1.9rem;
`;

const BemVindo = () => (
  <WelcomeContainer>
    <WelcomeTitle>Bem-Vindo ao GITE</WelcomeTitle>
    <WelcomeSubtitle>Gestão Integrada de Turmas Educativas</WelcomeSubtitle>
  </WelcomeContainer>
);

function App() {
  return (
    <Router>
      <AppContainer>
        <Header />
        <Routes>
          <Route path="/" element={<BemVindo />} />
          <Route path="/alunos" element={<Alunos />} />
          <Route path="/Professores" element={<Professores />} />
          <Route path="/Notas" element={<Notas />} />
        </Routes>
      </AppContainer>
    </Router>
  );
}

export default App;