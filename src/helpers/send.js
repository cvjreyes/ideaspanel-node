exports.send = (res, ok, body, err) => {
  if (body) {
    return res.send({ ok, body, err });
  } else {
    return res.end();
  }
};

