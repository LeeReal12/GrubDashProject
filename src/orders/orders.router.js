const router = require("express").Router();

const methodNotAllowed = require("../errors/methodNotAllowed");
const orderController = require("./orders.controller");
// TODO: Implement the /orders routes needed to make the tests pass

router
  .route("/")
  .get(orderController.list)
  .post(orderController.create)
  .all(methodNotAllowed);

router
  .route("/:id")
  .put(orderController.update)
  .get(orderController.read)
  .delete(orderController.delete)
  .all(methodNotAllowed);

module.exports = router;
