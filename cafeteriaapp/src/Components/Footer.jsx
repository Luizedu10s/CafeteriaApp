import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <Container>
        <Row className="align-items-center">
          <Col md={6} className="mb-2 mb-md-0">
            <h5 className="mb-1">Cafeteria App</h5>
            <p className="mb-0">Seu lugar favorito para café, sobremesas e momentos especiais.</p>
          </Col>
          <Col md={6} className="text-md-end">
            <p className="mb-1">📍 Rua das Flores, 123</p>
            <p className="mb-0">📞 (11) 99999-9999</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
