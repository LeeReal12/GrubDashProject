const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass
function dishExists(req, res, next) {
  const dishID = req.params.id;
  const foundDish = dishes.find((dish) => dish.id === dishID);

  if (foundDish) {
    res.locals.foundDish = foundDish;
    return next();
  }
  return next({
    status: 404,
    message: `Dish id not found: ${req.params.id}`,
  });
}

function dishExistsDelete(req, res, next) {
  const dishID = req.params.id;
  const foundDish = dishes.find((dish) => dish.id === dishID);
  return foundDish
    ? next({
        status: 405,
        message: `Dish id found: ${req.params.id}`,
      })
    : next({
        status: 405,
        message: `Dish id not found: ${req.params.id}`,
      });
}

function read(req, res, next) {
  const { foundDish } = res.locals;
  res.json({ data: foundDish });
}

function validator(req, res, next) {
  const { data: { name, description, image_url, price, id } = {} } = req.body;
  if (id !== req.params.id) {
    if (id == undefined || id == null || id == "") {
      if (name) {
        if (description) {
          if (image_url) {
            if (price) {
              return Number.isInteger(price)
                ? price >= 0
                  ? next()
                  : next({
                      status: 400,
                      message:
                        "Dish must have a price that is an integer greater than 0",
                    })
                : next({
                    status: 400,
                    message:
                      "Dish must have a price that is an integer greater than 0",
                  });
            } else {
              return next({
                status: 400,
                message: "Dish must include a price",
              });
            }
          } else {
            return next({
              status: 400,
              message: "Dish must include a image_url",
            });
          }
        } else {
          return next({
            status: 400,
            message: "Dish must include a description",
          });
        }
      } else {
        return next({ status: 400, message: "Dish must include a name" });
      }
    } else {
      return next({
        status: 400,
        message: `Dish id does not match route id. Dish: ${id}, Route: ${req.params.id}`,
      });
    }
  } else if (!name) {
    return next({ status: 400, message: "Dish must include a name" });
  } else
    return description
      ? image_url
        ? price
          ? Number.isInteger(price)
            ? price >= 0
              ? next()
              : next({
                  status: 400,
                  message:
                    "Dish must have a price that is an integer greater than 0",
                })
            : next({
                status: 400,
                message:
                  "Dish must have a price that is an integer greater than 0",
              })
          : next({ status: 400, message: "Dish must include a price" })
        : next({
            status: 400,
            message: "Dish must include a image_url",
          })
      : next({
          status: 400,
          message: "Dish must include a description",
        });
}

function create(req, res, next) {
  const { data: { name, description, image_url, price } = {} } = req.body;
  const newDish = {
    id: nextId(),
    name,
    description,
    image_url,
    price,
  };
  dishes.push(newDish);
  res.status(201).json({ data: newDish });
}

function update(req, res, next) {
  const { foundDish } = res.locals;
  const { data: { name, description, image_url, price } = {} } = req.body;
  foundDish.name = name;
  foundDish.description = description;
  foundDish.image_url = image_url;
  foundDish.price = price;

  res.json({ data: foundDish });
}

function list(req, res) {
  res.json({ data: dishes });
}

function destroy(req, res, next) {
  res.sendStatus(204);
}

module.exports = {
  create: [validator, create],
  read: [dishExists, read],
  update: [dishExists, validator, update],
  delete: [dishExistsDelete, destroy],
  list,
};
