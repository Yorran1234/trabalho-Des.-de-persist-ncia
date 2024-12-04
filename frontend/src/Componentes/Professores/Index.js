import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { FaSearch, FaPlus, FaTimes, FaEdit } from 'react-icons/fa';

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

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background-color: #6E8EB4;
  border-radius: 20px;
  padding: 10px;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  padding: 15px;
  border-radius: 10px;
  border: none;
  flex-grow: 1;
  margin-right: 10px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  font-size: 1rem;
  color: #333;
`;

const SearchButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: #fff;
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

const ProfessorItem = styled.tr`
  background-color: #ECF7FE;

  &:nth-child(even) {
    background-color: #F4FAFF;
  }
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

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 50px;
  border-radius: 30px;
  max-width: 800px;
  width: 100%;
  position: relative;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const ButtonSave = styled.button`
  padding: 10px 20px;
  background-color: #326589;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: #254a73;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #333;
  font-size: 1.5rem;
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;

  &:hover {
    color: #999;
  }
`;

function Professores() {
  const [professores, setProfessores] = useState([]);
  const [pesquisa, setPesquisa] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [novoProfessor, setNovoProfessor] = useState({ nome: '', email: '', disciplina: '' });
  const [editandoProfessor, setEditandoProfessor] = useState(null);

  useEffect(() => {
    fetchProfessores();
  }, []);

  const fetchProfessores = async () => {
    try {
      const response = await axios.get('http://localhost:5000/professores');
      setProfessores(response.data);
    } catch (error) {
      console.error('Erro ao carregar professores:', error);
    }
  };

  const handleIncluirProfessor = () => {
    setNovoProfessor({ nome: '', email: '', disciplina: '' });
    setIsModalOpen(true);
    setEditandoProfessor(null);
  };

  const handleAlterarProfessor = (professor) => {
    setNovoProfessor({ nome: professor.nome, email: professor.email, disciplina: professor.disciplina });
    setIsModalOpen(true);
    setEditandoProfessor(professor);
  };

  const handleSalvarProfessor = async () => {
    const { nome, email, disciplina } = novoProfessor;
    if (!nome || !email || !disciplina) {
      alert('Preencha todos os campos!');
      return;
    }

    try {
      if (editandoProfessor) {
        await axios.put(`http://localhost:5000/professores/${editandoProfessor.id}`, { nome, email, disciplina });
      } else {
        await axios.post('http://localhost:5000/professores', { nome, email, disciplina });
      }
      fetchProfessores();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erro ao salvar professor:', error);
    }
  };

  const excluirProfessor = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/professores/${id}`);
      fetchProfessores();
    } catch (error) {
      console.error('Erro ao excluir professor:', error);
    }
  };

  return (
    <Container>
      <Titulo>Lista de Professores</Titulo>

      <SearchBar>
        <SearchInput
          type="text"
          placeholder="Pesquise por nome"
          value={pesquisa}
          onChange={(e) => setPesquisa(e.target.value)}
        />
        <SearchButton>
          <FaSearch />
        </SearchButton>
      </SearchBar>

      <Button onClick={handleIncluirProfessor}>
        <FaPlus /> Incluir Professor
      </Button>

      <Table>
        <thead>
          <tr>
            <Th>Nome</Th>
            <Th>Email</Th>
            <Th>Disciplina</Th>
            <Th>Ações</Th>
          </tr>
        </thead>
        <tbody>
          {professores.map((professor) => (
            <ProfessorItem key={professor.id}>
              <Td>{professor.nome}</Td>
              <Td>{professor.email}</Td>
              <Td>{professor.disciplina}</Td>
              <Td>
                <Button onClick={() => handleAlterarProfessor(professor)}>
                  <FaEdit /> Editar
                </Button>
                <Button onClick={() => excluirProfessor(professor.id)}>
                  <FaTimes /> Excluir
                </Button>
              </Td>
            </ProfessorItem>
          ))}
        </tbody>
      </Table>

      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <CloseButton onClick={() => setIsModalOpen(false)}>
              <FaTimes />
            </CloseButton>
            <h2>{editandoProfessor ? 'Alterar Professor' : 'Incluir Professor'}</h2>
            <FormGroup>
              <Label>Nome:</Label>
              <Input
                type="text"
                value={novoProfessor.nome}
                onChange={(e) => setNovoProfessor({ ...novoProfessor, nome: e.target.value })}
              />
            </FormGroup>
            <FormGroup>
              <Label>Email:</Label>
              <Input
                type="email"
                value={novoProfessor.email}
                onChange={(e) => setNovoProfessor({ ...novoProfessor, email: e.target.value })}
              />
            </FormGroup>
            <FormGroup>
              <Label>Disciplina:</Label>
              <Input
                type="text"
                value={novoProfessor.disciplina}
                onChange={(e) => setNovoProfessor({ ...novoProfessor, disciplina: e.target.value })}
              />
            </FormGroup>
            <ButtonSave onClick={handleSalvarProfessor}>Salvar</ButtonSave>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
}

export default Professores;
