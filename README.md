# Odoo Node SDK

# Documentation

### Odoo Authentication

```javascript
const Odoo = require("odoo-node-sdk");

const odoo = new Odoo({
  username,
  password,
  database,
  host,
  port,
  uri,
});

(async () => {
  await odoo.authenticate();
})();
```

### Search

```javascript
const products = await odoo.search({
  model: "product.product",
  domain: [],
  fields: ["name"],
});

console.log(products);
// [{id: 1, name: "Product 1"}, {id: 2, name: "Product 2"}]
```

### Create

```javascript
const product = await odoo.create({
  model: "product.product",
  { name: "My new product" }
});

console.log(product);
// [3]
```

### Write

```javascript
const product = await odoo.write({
  model: "product.product",
  3, { name: "My new product updated!" }
});

console.log(product);
// true
```

### Unlink

```javascript
 await odoo.unlink({ model: "product.product", 3 });
```

## Author

[Marluan Espiritusanto](https://twitter.com/marluanguerrero)
