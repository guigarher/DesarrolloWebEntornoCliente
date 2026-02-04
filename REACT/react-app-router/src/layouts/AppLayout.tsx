import { Container, Row, Col } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import HeaderBar from "../components/HeaderBar";
import LeftNav from "../components/LeftNav";
import FooterBar from "../components/FooterBar";

export default function AppLayout() {
  return (
    <div className="min-vh-100 d-flex flex-column">
      <HeaderBar />

      <Container fluid className="flex-grow-1">
        <Row className="h-100">
          <Col
            xs={12}
            md={3}
            lg={2}
            className="border-end bg-light p-0"
            style={{ minHeight: "calc(100vh - 112px)" }}
          >
            <LeftNav />
          </Col>

          <Col xs={12} md={9} lg={10} className="p-4">
            {/* AQUÍ SE RENDERIZAN LAS PÁGINAS DE FORMA DINÁMICA */}

            <Outlet />
          </Col>
        </Row>
      </Container>

      <FooterBar />
    </div>
  );
}
