const prompt = require("prompt-sync")({ sigint: true });
const axios = require("axios").default;
const fs = require("fs");
const API_KEY_APP = "ax6542sdru3217t4eesd9";
const API_VERSION = "2.1.0";
const API_APP_CODE = "APF";

const API_PRODUTTORE = "ARGO Software s.r.l. - Ragusa";

const API_URL = "https://www.portaleargo.it/famiglia/api/rest";

const DEFAULT_HEADERS = {
  "x-key-app": API_KEY_APP,
  "x-version": API_VERSION,
  "x-produttore-software": API_PRODUTTORE,
  "x-app-code": API_APP_CODE,
};

const start = async () => {
  if (!fs.existsSync("./circolari")) fs.mkdirSync("./circolari");

  let username, password, SCHOOL_CODE;

  do username = prompt("Username: ");
  while (!username);

  do password = prompt.hide("Password (input is hidden): ");
  while (!password);

  do SCHOOL_CODE = prompt("School code: ");
  while (!SCHOOL_CODE);

  const LOGIN_HEADERS = {
    ...DEFAULT_HEADERS,
    "x-cod-min": SCHOOL_CODE,
    "x-user-id": username,
    "x-pwd": password,
  };

  const AUTH_TOKEN = await axios
    .get(API_URL + "/login", {
      headers: LOGIN_HEADERS,
    })
    .then((res) => res.data.token);

  const MIN_HEADERS = {
    ...DEFAULT_HEADERS,
    "x-cod-min": SCHOOL_CODE,
    "x-auth-token": AUTH_TOKEN,
  };

  const { prgScheda, prgAlunno, prgScuola } = await axios
    .get(API_URL + "/schede", { headers: MIN_HEADERS })
    .then((res) => res.data[0]);

  const HEADERS = {
    ...MIN_HEADERS,
    "x-prg-scheda": prgScheda,
    "x-prg-alunno": prgAlunno,
    "x-prg-scuola": prgScuola,
  };

  const bacheca = await axios
    .get(
      API_URL + "/bachecanuova?_dc=1635104933535&page=1&start=0&limit=1000",
      {
        headers: { ...HEADERS, "x-max-return-record": 1000 },
      }
    )
    .then((res) => res.data.dati)
    .then((dati) => dati.filter((obj) => obj.allegati.length > 0));

  const pad = (input, len, char) => {
    let str = String(input);
    while (str.length < len) str = (String(char) || " ") + str;
    return str;
  };

  const BASE_URL = API_URL + "/messaggiobachecanuova?id=";

  const getUrl = (PRG_ALLEGATO, PRG_MESSAGGIO) => {
    return (
      BASE_URL +
      pad(SCHOOL_CODE.toUpperCase(), 10, "F") +
      "EEEII" +
      pad(PRG_MESSAGGIO, 5, "0") +
      pad(PRG_ALLEGATO, 10, "0") +
      AUTH_TOKEN.replace(/-/g, "") +
      API_KEY_APP
    );
  };

  const getPdf = async (url) => {
    return await axios.get(url).then((res) => res.data);
  };

  const circolari = [];
  const createCircolare = async (item) => {
    const PRG_MESSAGGIO = item.prgMessaggio;
    const allegati = item.allegati;
    const pdfs = [];
    for (let i = 0; i < allegati.length; i++) {
      const { prgAllegato, desFile } = allegati[i];
      const url = getUrl(PRG_MESSAGGIO, prgAllegato);
      const pdf = await getPdf(url);
      const filename = desFile;
      pdfs.push({ pdf, filename });
    }
    pdfs.forEach(({ pdf, filename }) =>
      fs.writeFileSync("./circolari/" + filename, pdf)
    );
    return pdfs;
  };

  for (let i = 0; i < bacheca.length; i++) {
    console.log(`Downloading circolare ${i + 1}/${bacheca.length}`);
    const circolare = await createCircolare(bacheca[i]);
    circolari.push(circolare);
  }

  console.log(`Finished... files available in "circolari" folder`);
};

start();
