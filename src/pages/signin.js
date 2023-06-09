import ThemeButton from "../components/index/ThemeButton";
import { Container, Row, Form, Col } from "react-bootstrap";
import React, { useContext, useState } from "react";
import ThemeContext from "../contexts/ThemeContext";
import axios from "axios";
import Link from "next/link";

function Login() {
  const { theme } = useContext(ThemeContext);
  const [formstate, setformstate] = useState({});
  const [errormsg, seterrormsg] = useState(false);

  const handleChange = (event) => {
    setformstate({
      ...formstate,
      [event.target.id]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Impede o envio do formulário
    console.log("handle submit");
    try {
      const res = await axios.post("http://localhost:4000/login", formstate);
      console.log(res);
      const resp = await res.data;
      console.log(resp);

      if (resp.message === "Credenciais inválidas") {
        console.log("entrou no if");
      } else {
        console.log("salvando dados de cookie");
      }
    } catch (err) {
      console.log(err.response);
    }
  };

  return (
    <Container
      className={`alinharcentro fundo login ${theme}`}
      style={{ margin: "0px" }}
    >
      <Row style={{ width: "50%", maxWidth: "500px" }}>
        <Form
          onSubmit={handleSubmit}
          noValidate
          style={{ padding: "10%" }}
          className={`formulario ${theme}`}
        >
          <h4 style={{ marginBottom: "20px" }}>Sign In</h4>
          <div style={{ textAlign: "start", marginLeft: "10px" }}> Nome </div>
          <Form.Group controlId="name">
            <Form.Control
              onChange={handleChange}
              className={`selecionar ${theme}`}
              type="name"
              placeholder="Nome completo"
              required
              value={formstate.name || ""}
            />
          </Form.Group>

          <div style={{ textAlign: "start", marginLeft: "10px" }}> Email </div>
          <Form.Group controlId="email">
            <Form.Control
              onChange={handleChange}
              className={`selecionar ${theme}`}
              type="email"
              placeholder="seuemail@email.com"
              required
              value={formstate.email || ""}
            />
          </Form.Group>

          <div style={{ textAlign: "start", marginLeft: "10px" }}>Telefone</div>
          <Form.Group controlId="tel">
            <Form.Control
              onChange={handleChange}
              className={`selecionar ${theme}`}
              type="number"
              placeholder="(00)________"
              required
              value={formstate.tel || ""}
            />
          </Form.Group>

          <Row>
            <Col>
              <div style={{ textAlign: "start", marginLeft: "10px" }}>
                Senha
              </div>
              <Form.Group controlId="password">
                <Form.Control
                  onChange={handleChange}
                  className={`selecionar ${theme}`}
                  type="password"
                  placeholder="*********"
                  required
                  value={formstate.senha}
                />
              </Form.Group>
            </Col>

            <Col>
              <div style={{ textAlign: "start", marginLeft: "10px" }}>
                Confirmar senha
              </div>
              <Form.Group controlId="password">
                <Form.Control
                  onChange={handleChange}
                  className={`selecionar ${theme}`}
                  type="password"
                  placeholder="*********"
                  required
                  value={formstate.senha}
                />
              </Form.Group>
            </Col>
          </Row>

          <button type="submit" className={`botao ${theme}`}>
            Criar
          </button>

          <p className="linkrecuperar">
            <Link href="/login" legacyBehavior passHref>
              <b>Entrar na conta</b>
            </Link>
          </p>
        </Form>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <ThemeButton />
        </div>
      </Row>
    </Container>
  );
}

export default Login;
