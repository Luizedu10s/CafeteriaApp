import { Card, Button } from 'react-bootstrap';

const CardCoffe = ({nome, preco}) => {
  return (
    <Card style={{ width: '18rem' }} className="shadow-sm h-100">
      <Card.Img
        variant="top"
        src="https://api.dicebear.com/9.x/shapes/svg?seed=xicara&backgroundColor=6f4e37"
        alt="Café"
        style={{ height: '180px', objectFit: 'cover' }}
      />
      <Card.Body>
        <Card.Title>{nome}</Card.Title>
        <Card.Text>
          Um café saboroso e aromático, perfeito para qualquer momento do dia.
        </Card.Text>
        <div className="d-flex justify-content-between align-items-center">
          <strong>R${preco}</strong>
          <Button variant="success">Visualizar produto</Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CardCoffe;
