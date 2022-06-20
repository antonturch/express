module.exports = {
  users: [
    {
      firstName: "John",
      lastName: "Doe",
      email: "example@example.com",
      password: "123pass",
    },
    {
      firstName: "Jane",
      lastName: "Doe",
      email: "example1@example.com",
      password: "1234pass",
    },
  ],
  orders: [
    { UserId: 1, ProductId: 1 },
    { UserId: 1, ProductId: 1 },
    { UserId: 2, ProductId: 2 },
    { UserId: 2, ProductId: 3 },
  ],
  products: [
    {
      name: "Iphone 2G",
      description: "Apple reinvents the phone, this is only the beginning.",
      price: 350,
      currency: "USD",
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/IPhone_1st_Gen.svg/200px-IPhone_1st_Gen.svg.png",
    },
    {
      name: "Iphone 3G",
      description:
        "The first phone to beat the iPhone. The fastest, most powerful iPhone yet.",
      price: 370,
      currency: "USD",
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/IPhone_1st_Gen.svg/209px-IPhone_1st_Gen.svg.png",
    },
    {
      name: "Iphone 4",
      description: "This changes everything… again.",
      price: 410,
      currency: "USD",
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/IPhone_4_Mock_No_Shadow_PSD.png/200px-IPhone_4_Mock_No_Shadow_PSD.png",
    },
    {
      name: "Iphone 5",
      description: "The biggest thing to happen to iPhone since iPhone.",
      price: 450,
      currency: "USD",
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/IPhone_5.png/212px-IPhone_5.png",
    },
    {
      name: "Iphone 6",
      description: "Bigger than bigger.",
      price: 470,
      currency: "USD",
      img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/IPhone6_silver_frontface.png/200px-IPhone6_silver_frontface.png",
    },
  ],
};
