import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";

const Cardapio = () => {
    const [cardapio, setCardapio] = useState([])

    useEffect(() => {
        async function buscarProdutos(){
            try{
                const res = await fetch("http://localhost:3000/produtos");
                if(!res.ok) throw new Error(`falha na requisição: ${res.status}`);
                const data = await res.json();
                setCardapio(data);
            } catch (err){
                console.log(`Erro ao realizar requisição: ${err}`)
            }
        }

        buscarProdutos();
    }, []);

    return (
        <div className="container py-4">
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Nome</th>
                        <th>Preço</th>
                    </tr>
                </thead>
                <tbody>
                    {cardapio.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.nome}</td>
                            <td>{item.preco}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    )
}

export default Cardapio