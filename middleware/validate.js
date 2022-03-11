module.exports = (validator) => {
  return (req, res, next) => {
    const { error } = validator(req);
    if (error) {
      console.log(error);
      return res.status(400).send(error.details[0].message);
    }
    console.log("Validated")
    next();
  };
};
