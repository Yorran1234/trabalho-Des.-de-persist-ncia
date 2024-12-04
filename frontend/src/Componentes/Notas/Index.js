import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

// Estilização com styled-components
const Container = styled.div`
  padding: 20px;
  background-color: #A0B3D5;
  border-radius: 10px;
  max-width: 1300px;
  margin: 80px auto;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
`;

const Titulo = styled.h2`
  text-align: center;
  color: #2F509D;
  margin-bottom: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-spacing: 0;
  border-collapse: collapse;
  background-color: #dff1fb;
  border-radius: 10px;
  overflow: hidden;
`;

const Th = styled.th`
  background-color: #9ED1F5;
  padding: 15px;
  text-align: left;
  border: 1px solid #ddd;
  color: #fff;
  font-size: 1rem;
  text-transform: uppercase;
`;

const Td = styled.td`
  padding: 15px;
  border: 1px solid #ddd;
  text-align: center;
  font-size: 1rem;
  color: #555;
`;

const Button = styled.button`
  padding: 5px 10px;
  background-color: #F7F9FB;
  border: 2px solid #326589;
  color: #326589;
  font-size: 16px;
  font-weight: bold;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.3s;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #326589;
    color: white;
  }
`;

const InputNota = styled.input`
  padding: 5px;
  width: 60px;
  border: 1px solid #ccc;
  border-radius: 5px;
  text-align: center;
`;

const Notas = () => {
  const [alunos, setAlunos] = useState([]);
  const [isEditing, setIsEditing] = useState(null);
  const [notaTemp, setNotaTemp] = useState('');

  // Carregar os alunos com as notas ao montar o componente
  useEffect(() => {
    carregarAlunos();
  }, []);

  const carregarAlunos = () => {
    axios
      .get('http://localhost:5000/alunos')
      .then((response) => {
        console.log('Dados recebidos do backend:', response.data); // Verificar o formato retornado
        setAlunos(response.data);
      })
      .catch((error) => {
        console.error('Erro ao carregar alunos:', error);
      });
  };

  const handleAddNota = (alunoId) => {
    if (!notaTemp) {
      alert('Por favor, insira uma nota válida.');
      return;
    }

    const data = { alunoId, nota: parseFloat(notaTemp) };

    axios
      .post('http://localhost:5000/notas', data)
      .then(() => {
        alert('Nota adicionada com sucesso');
        setNotaTemp('');
        setIsEditing(null); // Desativa o modo de edição
        carregarAlunos(); // Recarrega os dados atualizados
      })
      .catch((error) => {
        console.error('Erro ao adicionar nota:', error);
      });
  };

  const handleDeleteNota = (alunoId) => {
    if (!window.confirm('Tem certeza que deseja excluir todas as notas deste aluno?')) {
      return;
    }

    axios
      .delete(`http://localhost:5000/notas/${alunoId}`)
      .then(() => {
        alert('Notas excluídas com sucesso');
        carregarAlunos();
      })
      .catch((error) => {
        console.error('Erro ao excluir notas:', error);
      });
  };

  return (
    <Container>
      <Titulo>Notas dos Alunos</Titulo>
      <Table>
        <thead>
          <tr>
            <Th>Nome</Th>
            <Th>Notas</Th>
            <Th>Ações</Th>
          </tr>
        </thead>
        <tbody>
          {alunos.map((aluno) => (
            <tr key={aluno.id}>
              <Td>{aluno.nome}</Td>
              <Td>
                {Array.isArray(aluno.notas) && aluno.notas.length > 0
                  ? aluno.notas.join(', ')
                  : 'Sem notas cadastradas'}
              </Td>
              <Td>
                {isEditing === aluno.id ? (
                  <>
                    <InputNota
                      type="number"
                      value={notaTemp}
                      onChange={(e) => setNotaTemp(e.target.value)}
                    />
                    <Button onClick={() => handleAddNota(aluno.id)}>Salvar</Button>
                  </>
                ) : (
                  <>
                    <Button onClick={() => setIsEditing(aluno.id)}>Adicionar</Button>
                    <Button onClick={() => handleDeleteNota(aluno.id)}>Excluir</Button>
                  </>
                )}
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Notas;
