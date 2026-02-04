import { Container } from "react-bootstrap";

export default function FooterBar() {
  return (
    <footer className="border-top py-3 bg-white">
      <Container fluid className="text-muted small">
        {new Date().getFullYear()} - Smart Economato
      </Container>
    </footer>
  );
}
