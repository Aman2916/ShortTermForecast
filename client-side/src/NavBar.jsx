import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import "./App.scss";
function NavScrollExample() {
  return (
    <Navbar expand="lg" style={{ backgroundColor: " #17193b" }}>
      <Container fluid>
        <Navbar.Brand href="/" className="text-white">
          Solar Irradiance
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            <Nav.Link href="/" className="text-white">
              Home
            </Nav.Link>

            <NavDropdown
              title={<span className="text-white">DropDown</span>}
              id="navbarScrollingDropdown"
            >
              <NavDropdown.Item href="/historicaldata">
                Irradiance Data
              </NavDropdown.Item>
              <NavDropdown.Item href="/weather">Weather</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/daily-irradiance">
                Daily visualization
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="#" disabled>
              Link
            </Nav.Link>
          </Nav>
          <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-success">Login</Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavScrollExample;
