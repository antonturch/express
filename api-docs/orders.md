# Orders

User order page

### ***/orders/{userId}***

## REQUEST

type: ***get***

##### URI Parameters

+ userId: required(integer)

## RESPONSE

#### Body

Media type: application/json

Type: array of objects

Items: order

    {
      id: number,
      userId: number,
      productId: number,
    }

#### Example

    {
      id: 1, 
      userId: 13,
      productId: 26,
    }

## REQUEST

type: ***post***

##### URI Parameters

+ userId: required(integer)

Media type: application/json

Type: object

    {
      productId: number,
    }

## RESPONSE

#### Body

Media type: application/json

Type: object

Item: order

    {
      id: number, 
      userId: number,
      productId: number,
    }

#### Example

    {
      id: 1, 
      userId: 13,
      productId: 26,
    }

***

#### [_Back to README_](./README.md)