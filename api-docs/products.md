# Products

Products page

### ***/products/***

## REQUEST

type: ***get***

## RESPONSE

#### Body

Media type: application/json

Type: array of objects

Items: product

    {
      name: string,
      description: string,
      price: number,
      currency: string,
      img: string,
    }

#### Example

    {
      name: "Iphone 1",
      description: "The first",
      price: 350,
      currency: "USD",
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/IPhone_1st_Gen.svg/200px-IPhone_1st_Gen.svg.png",
    }

***

### ***/products/{productId}***

## REQUEST

type: ***get***

##### URI Parameters

+ productId: required(integer)

## RESPONSE

#### Body

Media type: application/json

Type: object

Item: product

    {
      name: string,
      description: string,
      price: number,
      currency: string,
      img: string,
    }

***

#### [_Back to README_](./README.md)