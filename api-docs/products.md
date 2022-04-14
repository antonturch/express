# Products

Products page

### ***/products/***

- Description: returns all products
- Method: ***GET***

#### Response

- Headers:
    - Content-type: `application/json`

```
{ products: Product[] }
```

#### Example

```
{
  products: [
    {
      id: 1,
      name: "Apple Iphone 3G",
      description: "The iPhone you have been waiting for.",
      price: 350;
      currency: "USD";
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/IPhone_1st_Gen.svg/200px-IPhone_1st_Gen.svg.png";
    },
    {
      id: 2,
      name: "Apple Iphone 4",
      description: "This changes everything. Again.”,
      price: 370;
      currency: "USD";
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/IPhone_4_Mock_No_Shadow_PSD.png/200px-IPhone_4_Mock_No_Shadow_PSD.png";
    },
  ]
}
```

---

### ***/products/{productId}***

- Description: returns the product with the specified product id
- Method: ***GET***
- URI Parameters:
    - `productId`: required(integer)

#### Response

- Headers:
    - Content-type: `application/json`

```
{ product: Product }
```

#### Example

```
    {
      id: 1,
      name: "Apple Iphone 3G",
      description: "The iPhone you have been waiting for.",
      price: 350;
      currency: "USD";
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/IPhone_1st_Gen.svg/200px-IPhone_1st_Gen.svg.png";
    },
```

***

#### [_Back to README_](./README.md)