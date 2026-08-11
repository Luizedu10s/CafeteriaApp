import { Carousel } from 'react-bootstrap';
import { useEffect, useState } from 'react';

// Components
import Header from './Components/Header';
import Footer from './Components/Footer';
import Sobre from './Components/Sobre';
import Carrosel from './Components/Carrosel';
import Clientes from './Components/Clientes';
import Cardapio from './Components/Cardapio';

// router 
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Css
import './App.css';
import CardCoffe from './Components/CardCoffe';

function App() {
  const [produtos, setProdutos] = useState([])

  useEffect(() => {
      async function buscarProdutos(){
          try{
              const res = await fetch("http://localhost:3000/produtos");
              if(!res.ok) throw new Error(`falha na requisição: ${res.status}`);
              const data = await res.json();
              setProdutos(data);
          } catch (err){
              console.log(`Erro ao realizar requisição: ${err}`)
          }
      }
      buscarProdutos();
  }, []);

  return (
    <>
      <BrowserRouter>
        <Header />

        <main>
          <Routes>
            <Route path="/" element={
              <div className="container py-4">
                <Carrosel />
                <div>
                  <h1>Produtos disponiveis</h1>
                </div>
                <div className="mt-4 d-flex flex-wrap justify-content-center gap-4">
                  {
                    produtos.map((item) => (
                      <CardCoffe nome={item.nome} preco={item.preco} key={item.id} />
                    ))
                  }
                </div>
              </div>
            } />
            <Route path="/Clientes" element={<Clientes />} />
            <Route path="/Cardapio" element={<Cardapio />} />
            <Route path="/Sobre" element={<Sobre />} />
          </Routes>
        </main>

        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App