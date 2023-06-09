import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useContext,
} from "react";
import { Form, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquarePlus,
  faTrashCan,
  faFloppyDisk,
  faFolderClosed,
} from "@fortawesome/free-regular-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import ThemeContext from "../../contexts/ThemeContext";
import { Tooltip } from "@nextui-org/react";
import SaveformName from "../index/SaveformName";

function AddForm() {
  const { theme } = useContext(ThemeContext);
  const [exercises, setExercises] = useState([]);
  const [forms, setForms] = useState({
    0: { campos: { 0: { Nome: "", Series: "", Repeticoes: "" } } },
  });
  const [selectedOption, setSelectedOption] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const cachedExercises = sessionStorage.getItem("exercises");
      if (cachedExercises) {
        setExercises(JSON.parse(cachedExercises));
        return;
      }

      const response = await fetch("http://localhost:4000/exercicios");
      const data = await response.json();
      setExercises(data);
      sessionStorage.setItem("exercises", JSON.stringify(data));
    };

    fetchData();
  }, []);

  const handlesubmit = async()=>{
    try {
      //pesquisar no banco
      const res = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formstate),
      });
      //trasformar em json a response
      const json = await res.json();

      //verificação da response
      if (json.status == 401) {
        setstatuserrormsg(true);
        seterrormsg({ msg: json.message, status: json.message });
      }
      if (json.status == 200) {
        setCookie(null, "Token", json.token, {
          sameSite: "none",
          secure: true,
        });
        router.push("/");
      }
    } catch (err) {
      setstatuserrormsg(true);
      seterrormsg("erro no servidor");
    }
  }

  const adicionarForm = useCallback(() => {
    const newKey = Object.keys(forms).length;
    setForms({
      ...forms,
      [newKey]: { campos: {} },
    });
  }, [forms]);

  const removerForm = useCallback(
    (indice) => {
      const novosForms = { ...forms };
      delete novosForms[indice];
      setForms(novosForms);
    },
    [forms]
  );

  const adicionarCampo = useCallback(
    (indiceForm) => {
      const form = { ...forms[indiceForm] };
      const newKey = Object.keys(form.campos).length;
      form.campos[newKey] = { nome: "", valor: "" };
      setForms({ ...forms, [indiceForm]: form });
    },
    [forms]
  );

  const removerCampo = useCallback(
    (indiceForm, indiceCampo) => {
      const form = { ...forms[indiceForm] };
      delete form.campos[indiceCampo];
      setForms({ ...forms, [indiceForm]: form });
    },
    [forms]
  );

  const handleChange = useCallback(
    (indiceForm, indiceCampo, event) => {
      const form = { ...forms[indiceForm] };
      form.campos[indiceCampo].valor = event.target.value;

      setForms({ ...forms, [indiceForm]: form });
      console.log(forms);
    },
    [forms]
  );



  const handleChangeSeries = (indiceForm, indiceCampo, event) => {
    const form = { ...forms[indiceForm] };
    form.campos[indiceCampo].series = event.target.value;
    setForms({ ...forms, [indiceForm]: form });
  };

  const handleChangeRepeticoes = (indiceForm, indiceCampo, event) => {
    const form = { ...forms[indiceForm] };
    form.campos[indiceCampo].repeticoes = event.target.value;
    setForms({ ...forms, [indiceForm]: form });
  };

  // Cria um array com valores de 1 a 20 - SELEÇÃO DE REPETIÇÃO, SÉRIE
  const repetir = useMemo(
    () => Array.from({ length: 20 }, (_, index) => index + 1),
    []
  );

  const series = useMemo(
    () => Array.from({ length: 10 }, (_, index) => index + 1),
    []
  );

  return (
    <div id="myForm">
      {Object.keys(forms).map((formKey, indiceForm) => (
        <Form key={formKey} className={`formulario ${theme}`}>
          <Row>
            <Col>
              {/*-------------- TEXTO: DESCRIÇÃO DA PAG ---------------*/}
              <h4
                htmlFor={`form${indiceForm}-group`}
                style={{ textAlign: "start", marginBottom: "20px" }}
              >
                Ficha {indiceForm + 1}
              </h4>
            </Col>

            <Col style={{ display: "flex", justifyContent: "end" }}>
              <div>
                {/*-------------- BOTÃO: SALVAR FORM COMO MODELO ---------------*/}
                <SaveformName />
              </div>

              {/*--------------  BOTÃO: USAR UM MODELO DE FORM ---------------*/}
              <div>
                <Tooltip
                  contentColor="primary"
                  color="default"
                  content={"Usar modelo"}
                  placement="bottom"
                >
                  <button
                    type="button"
                    variant="outline-secondary"
                    className={`botao ${theme}`}
                  >
                    <FontAwesomeIcon icon={faFolderClosed} size="lg" />
                  </button>
                </Tooltip>
              </div>
            </Col>
          </Row>

          {/*--------------  FORM: SELECIONAR O EXERCICIO ---------------*/}
          {Object.keys(forms[formKey].campos).map((keyCampo, indiceCampo) => {
            const campo = forms[formKey].campos[keyCampo];
            return (
              <Row className="mb-3" key={`${formKey}-${keyCampo}`}>
                <Col style={{ textAlign: "start" }} lg={6}>
                  <label> Exercicio </label>
                  <Form.Select
                    className={`selecionar ${theme}`}
                    aria-label={`form${indiceForm}-campo${indiceCampo}`}
                    onChange={(event) =>
                      handleChange(indiceForm, keyCampo, event)
                    }
                    value={campo.valor}
                  >
                    <option value="" disabled hidden>
                      ...
                    </option>
                    {exercises.map((exercicio) => (
                      <optgroup
                        className={`selecionar ${theme}`}
                        label={exercicio.nome}
                        key={exercicio.nome}
                      >
                        {exercicio.exercicios.map((ex) => (
                          <option value={ex.nome} key={ex.nome}>
                            {ex.nome}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </Form.Select>
                </Col>

                {/*--------------  FORM: SELECIONAR REPETIÇÃO ---------------*/}
                <Col style={{ textAlign: "start" }} xs={3}>
                  <label> Repetições </label>
                  <Form.Select
                    className={`selecionar ${theme}`}
                    defaultValue=""
                    onChange={(event) => {
                      handleChangeRepeticoes(indiceForm, keyCampo, event);
                    }}
                  >
                    <option value="" disabled hidden>
                      ...
                    </option>
                    {repetir.map((option) => (
                      <option
                        className={`selecionar ${theme}`}
                        key={`${option}repetir`}
                        value={option}
                      >
                        {option}
                      </option>
                    ))}
                  </Form.Select>
                </Col>

                {/*--------------  FORM: SELECIONAR SÉRIE ---------------*/}
                <Col style={{ textAlign: "start" }}>
                  <label> Series </label>
                  <Form.Select
                    defaultValue=""
                    onChange={(event) => {
                      handleChangeSeries(indiceForm, keyCampo, event);
                    }}
                    className={`selecionar ${theme}`}
                  >
                    <option value="" disabled hidden>
                      ...
                    </option>
                    {series.map((option) => (
                      <option
                        className={`selecionar ${theme}`}
                        key={`${option}movimento`}
                        value={option}
                      >
                        {option}
                      </option>
                    ))}
                  </Form.Select>
                </Col>

                <Col
                  style={{
                    display: "flex",
                    justifyContent: "end",
                    marginTop: "23px",
                  }}
                >
                  <div>
                    {/*--------------  BOTÃO: EXCLUIR EXERCICIO ---------------*/}
                    <Tooltip
                      contentColor="error"
                      color="default"
                      content={"Excluir exercicio"}
                      placement="left"
                    >
                      <button
                        type="button"
                        className={`botao danger ${theme}`}
                        onClick={() => removerCampo(formKey, keyCampo)}
                      >
                        <FontAwesomeIcon icon={faTrashCan} size="xl" />
                      </button>
                    </Tooltip>
                  </div>
                </Col>
              </Row>
            );
          })}

          <hr style={{ opacity: "20%" }} />

          {/*--------------  BOTÃO: ADICIONAR NOVO EXERCICIO ---------------*/}
          <button
            type="button"
            className={`botao ${theme}`}
            onClick={() => adicionarCampo(formKey)}
          >
            <FontAwesomeIcon icon={faSquarePlus} size="lg" /> Exercicio
          </button>
        </Form>
      ))}

      <Row
        className={`formulario ${theme}`}
        style={{
          padding: "0px 0px",
          backgroundColor: "#00000000",
          boxShadow: "#00000000 0px 5px 0px 0px",
        }}
      >
        <Col style={{ margin: "0px -3px" }}>
          {/*--------------  BOTÃO: ADICIONAR NOVO FORMULARIO ---------------*/}
          <button
            type="button"
            className={`botao caixa ${theme}`}
            onClick={adicionarForm}
            style={{ width: "22vw" }}
          >
            <FontAwesomeIcon icon={faSquarePlus} size="lg" /> Nova Ficha
          </button>
        </Col>

        <Col style={{ margin: "0px -3px" }}>
          {/*--------------  BOTÃO: EXCLUIR O NOVO FORMULARIO ---------------*/}
          <button
            type="button"
            className={`botao caixa danger ${theme}`}
            onClick={() => removerForm(Object.keys(forms).pop())}
            style={{ width: "22vw" }}
          >
            <FontAwesomeIcon icon={faTrashCan} size="lg" /> excluir Ficha
          </button>
        </Col>

        <Col style={{ margin: "0px -3px" }}>
          {/*--------------  BOTÃO: SALVAR O FORMULARIO COMPLETO ---------------*/}
          <button
            type="button"
            className={`botao caixa success ${theme}`}
            style={{ width: "22vw" }}
          >
            <FontAwesomeIcon icon={faFloppyDisk} size="lg" /> Salvar tudo
          </button>
        </Col>
      </Row>
    </div>
  );
}

export default AddForm;
