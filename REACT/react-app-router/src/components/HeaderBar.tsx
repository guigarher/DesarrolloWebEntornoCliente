import { Navbar, Container } from "react-bootstrap";

export default function HeaderBar() {
  return (
    <Navbar bg="dark" variant="dark" expand="sm">
      <Container fluid>
        <Navbar.Brand>Smart Economato</Navbar.Brand>
      </Container>
    </Navbar>
  );
}
