import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { BrowserRouter, NavLink } from "react-router-dom";
import "./App.scss";
function NavScrollExample() {
  return (
    <Navbar expand="lg" className="text-white">
      <Container fluid>
        <Navbar.Brand href="/" className="text-white">
          <img
            src="/imgs/logo.webp"
            alt="..."
            className="w-10 h-10 rounded-full"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="flex gap-2 me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            <Nav.Link href="/" className="text-white bg-white/10 rounded-xl">
              Home
            </Nav.Link>

            <NavDropdown
              title={<span className="text-white">DropDown</span>}
              id="navbarScrollingDropdown"
              className="bg-white/10 rounded-xl"
            >
              <NavDropdown.Item href="/weather">Weather</NavDropdown.Item>
              <NavDropdown.Item href="/historicaldata">
                Irradiance Data
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/daily-irradiance">
                Daily visualization
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link
              href="#"
              disabled
              className="text-white bg-white/10 rounded-xl"
            >
              Link
            </Nav.Link>
          </Nav>
          <div>
            <Form className="d-flex">
              {/* <Form.Control
                type="search"
                placeholder="Search"
                className="rounded-l-full border-2 border-green-600 bg-transparent placeholder-green-600 focus:outline-none focus:text-green-600"
                aria-label="Search"
              /> */}
              <Button variant="outline-success text-white text-center bg-green-600 border-2 border-green-600 rounded-full font-bold">
                Login
              </Button>
            </Form>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavScrollExample;
