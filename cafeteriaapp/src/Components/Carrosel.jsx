import { Carousel } from 'react-bootstrap';

const Carrosel = () => {
  const imagens = [
    {
      id: 1,
      src: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80',
      alt: 'Café fresco servido em uma xícara',
    },
    {
      id: 2,
      src: 'https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=1200&q=80',
      alt: 'Mesa com café e pão',
    },
    {
      id: 3,
      src: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80',
      alt: 'Café e sobremesas em uma cafeteria',
    },
  ];

  return (
    <Carousel className="shadow rounded">
      {imagens.map((imagem) => (
        <Carousel.Item key={imagem.id}>
          <img
            className="d-block w-100"
            src={imagem.src}
            alt={imagem.alt}
            style={{ height: '400px', objectFit: 'cover', borderRadius: '12px' }}
          />
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default Carrosel;