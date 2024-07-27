import axios from "axios";

const host = process.env.REACT_APP_CODE_HOST;
const hostJavascript = process.env.REACT_APP_CODE_HOST_JAVASCRIPT;
const apiKey = process.env.REACT_APP_CODE_API_KEY;
const headers = {
  "x-rapidapi-key": apiKey,
  "x-rapidapi-host": host,
  "Content-Type": "application/json",
};

export const createSubmission = async (codeDetails) => {
  const options = {
    method: "POST",
    url: `https://${host}/submissions`,
    params: {
      wait: "false",
      fields: "*",
    },
    headers,
    data: {
      language_id: codeDetails.language_id,
      source_code: codeDetails.code,
    },
  };
    if (codeDetails.language_id === 93) {
      options.url = `https://${hostJavascript}/submissions`;
      options.headers["x-rapidapi-host"] = hostJavascript;
    }
  try {
    const response = await axios.request(options);
    return response.data.token;
  } catch (error) {
    console.error(error);
  }
};
export const getSubmission = async (token, language_id) => {
  const options = {
    method: "GET",
    url: `https://${host}/submissions/${token}`,
    params: {
      base64_encoded: "true",
      fields: "*",
    },
    headers,
  };
  if (language_id === 93) {
    options.url = `https://${hostJavascript}/submissions/${token}`;
    options.headers["x-rapidapi-host"] = hostJavascript;
  }
  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
export const runCode = async (codeDetails) => {
  const token = await createSubmission(codeDetails);
  let statusCode = 1;
  let response;
  while (statusCode === 1 || statusCode === 2) {
    response = await getSubmission(token, codeDetails.language_id);
    statusCode = response?.status_id;
  }
  return response;
};

