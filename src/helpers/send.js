exports.send = (res, ok, body, err) => {
  if (body !== undefined && body !== null) {
    // Verifica si el cuerpo no es undefined ni null
    return res.send({ ok, body, err });
  } else {
    return res
      .status(500)
      .send({ error: "El cuerpo de la respuesta está vacío." });
  }
};
