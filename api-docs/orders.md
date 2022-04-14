# Orders

User order page

### ***/orders/{userId}***

- Description: returns all user orders
- Method: ***GET***
- URI Parameters:
    - `userId`: required(integer)

#### Response

- Headers:
    - Content-type: `application/json`

```
{ orders: Order[] }
```

#### Example

```
{
  orders: [
    {
      id: 1, 
      userId: 13,
      productId: 26,
    }
  ]
}
```

---

### ***/orders/{userId}***

- Description: creates order for user with specified product
- Method: ***POST***
- URI Parameters:
    - `userId`: required(integer)

#### Request body

```
{
  productId: number,
}
```

#### Response

- Headers:
    - Content-type: `application/json`

```
{ order: Order }
```

#### Example

```
{
  order: {
    id: 1, 
    userId: 13,
    productId: 26,
  }
}
```

---

#### [_Back to README_](./README.md)
