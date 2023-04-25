exports.send = (res, ok, body, err) => {
  if (body || ok) {
    return res.send({ ok, body, err });
  } else {
    return res.end();
  }
};

