const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass

const orderExists = (req, res, next) => {
  const orderID = req.params.id;
  const foundOrder = orders.find((order) => order.id === orderID);
  if (foundOrder) {
    res.locals.foundOrder = foundOrder;
    return next();
  }
  return next({
    status: 404,
    message: `Order id not found: ${req.params.id}`,
  });
};

const ordeExistsDelete = (req, res, next) => {
  const orderID = req.params.id;
  const foundOrder = orders.find((order) => order.id === orderID);
  if (foundOrder) {
    return foundOrder.status !== "pending"
      ? next({
          status: 400,
          message: `	An order cannot be deleted unless it is pending`,
        })
      : next();
  } else {
    return next({
      status: 404,
      message: `Order id not found: ${req.params.id}`,
    });
  }
};

function create(req, res, next) {
  const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;
  const newOrder = {
    id: nextId(), // Assign the next ID
    deliverTo,
    mobileNumber,
    status,
    dishes,
  };
  orders.push(newOrder);
  res.status(201).json({ data: newOrder });
}

function read(req, res, next) {
  const { foundOrder } = res.locals;
  res.json({ data: foundOrder });
}

function validateFieldsForUpdate(req, res, next) {
  const { data: { deliverTo, mobileNumber, dishes, status, id } = {} } =
    req.body;
  if (id !== req.params.id) {
    if (id == undefined || id == null || id == "") {
      if (deliverTo) {
        if (mobileNumber) {
          if (status) {
            if (status !== "invalid") {
              if (dishes) {
                if (dishes !== "") {
                  if (dishes.length !== 0) {
                    if (Array.isArray(dishes)) {
                      dishes.map((v, index) => {
                        if (!v.quantity) {
                          return next({
                            status: 400,
                            message: `Dish ${index} must have a quantity that is an integer greater than 0`,
                          });
                        }
                        if (!Number.isInteger(v.quantity)) {
                          return next({
                            status: 400,
                            message: `Dish ${index} must have a quantity that is an integer greater than 0`,
                          });
                        }
                        if (index == dishes.length - 1) {
                          return next();
                        }
                      });
                    } else {
                      return next({
                        status: 400,
                        message: "Order must include at least one dish",
                      });
                    }
                  } else {
                    return next({
                      status: 400,
                      message: "Order must include at least one dish",
                    });
                  }
                } else {
                  return next({
                    status: 400,
                    message: "Order must include at least one dish",
                  });
                }
              } else {
                return next({
                  status: 400,
                  message: "Order must include at least one dish",
                });
              }
            } else {
              return next({ status: 400, message: "status" });
            }
          } else {
            return next({
              status: 400,
              message:
                "Order must have a status of pending, preparing, out-for-delivery, delivered",
            });
          }
        } else {
          return next({
            status: 400,
            message: "Order must include a mobileNumber",
          });
        }
      } else {
        return next({ status: 400, message: "Order must include a deliverTo" });
      }
    } else {
      return next({
        status: 400,
        message: `Order id does not match route id. Order: ${id}, Route: ${req.params.id}.`,
      });
    }
  } else if (deliverTo) {
    if (!mobileNumber) {
      return next({
        status: 400,
        message: "Order must include a mobileNumber",
      });
    }
    if (status) {
      if (status !== "invalid") {
        if (dishes) {
          if (dishes !== "") {
            if (dishes.length !== 0) {
              if (Array.isArray(dishes)) {
                dishes.map((v, index) => {
                  if (!v.quantity) {
                    return next({
                      status: 400,
                      message: `Dish ${index} must have a quantity that is an integer greater than 0`,
                    });
                  }
                  if (!Number.isInteger(v.quantity)) {
                    return next({
                      status: 400,
                      message: `Dish ${index} must have a quantity that is an integer greater than 0`,
                    });
                  }
                  if (index == dishes.length - 1) {
                    return next();
                  }
                });
              } else {
                return next({
                  status: 400,
                  message: "Order must include at least one dish",
                });
              }
            } else {
              return next({
                status: 400,
                message: "Order must include at least one dish",
              });
            }
          } else {
            return next({
              status: 400,
              message: "Order must include at least one dish",
            });
          }
        } else {
          return next({
            status: 400,
            message: "Order must include at least one dish",
          });
        }
      } else {
        return next({ status: 400, message: "status" });
      }
    } else {
      return next({
        status: 400,
        message:
          "Order must have a status of pending, preparing, out-for-delivery, delivered",
      });
    }
  } else {
    return next({ status: 400, message: "Order must include a deliverTo" });
  }
}

const validateFieldsForCreate = (req, res, next) => {
  const { data: { deliverTo, mobileNumber, dishes, status } = {} } = req.body;
  if (deliverTo) {
    if (mobileNumber) {
      if (dishes) {
        if (dishes !== "") {
          if (dishes.length !== 0) {
            if (Array.isArray(dishes)) {
              dishes.map((v, index) => {
                if (!v.quantity) {
                  return next({
                    status: 400,
                    message: `Dish ${index} must have a quantity that is an integer greater than 0`,
                  });
                }
                if (!Number.isInteger(v.quantity)) {
                  return next({
                    status: 400,
                    message: `Dish ${index} must have a quantity that is an integer greater than 0`,
                  });
                }
                if (index == dishes.length - 1) {
                  return next();
                }
              });
            } else {
              return next({
                status: 400,
                message: "Order must include at least one dish",
              });
            }
          } else {
            return next({
              status: 400,
              message: "Order must include at least one dish",
            });
          }
        } else {
          return next({
            status: 400,
            message: "Order must include at least one dish",
          });
        }
      } else {
        return next({
          status: 400,
          message: "Order must include at least one dish",
        });
      }
    } else {
      return next({
        status: 400,
        message: "Order must include a mobileNumber",
      });
    }
  } else {
    return next({ status: 400, message: "Order must include a deliverTo" });
  }
};

function update(req, res, next) {
  const { foundOrder } = res.locals;

  const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;
  foundOrder.dishes = dishes;
  foundOrder.deliverTo = deliverTo;
  foundOrder.mobileNumber = mobileNumber;
  foundOrder.status = status;
  res.json({ data: foundOrder });
}

function destroy(req, res, next) {
  const orderID = Number(req.params.id);
  const index = orders.findIndex((order) => order.id === orderID);
  const deletedNote = orders.splice(index, 1);
  res.sendStatus(204);
}

function list(req, res, next) {
  res.json({ data: orders });
}

module.exports = {
  create: [validateFieldsForCreate, create],
  update: [orderExists, validateFieldsForUpdate, update],
  read: [orderExists, read],
  delete: [ordeExistsDelete, destroy],
  list,
};
