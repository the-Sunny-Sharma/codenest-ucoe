export const levels = [
  {
    title: "Class Declaration",
    description:
      "In Java, a class is a blueprint for creating objects. Arrange the code blocks to create a proper class declaration.",
    code: [
      "public class Car {",
      "    private String model;",
      "    private int year;",
      "    // Constructor",
      "    public Car(String model, int year) {",
      "        this.model = model;",
      "        this.year = year;",
      "    }",
      "}",
    ],
    solution: [
      "public class Car {",
      "    private String model;",
      "    private int year;",
      "    // Constructor",
      "    public Car(String model, int year) {",
      "        this.model = model;",
      "        this.year = year;",
      "    }",
      "}",
    ],
  },
  {
    title: "Method Declaration",
    description:
      "Methods are functions that belong to a class. Create a method that returns the car's information.",
    code: [
      '        return model + " (" + year + ")";',
      "    private int year;",
      "}",
      "public class Car {",
      "    public String getInfo() {",
      "    }",
      "    private String model;",
    ],
    solution: [
      "public class Car {",
      "    private String model;",
      "    private int year;",
      "    public String getInfo() {",
      '        return model + " (" + year + ")";',
      "    }",
      "}",
    ],
  },
  {
    title: "Inheritance",
    description:
      "Inheritance allows a class to inherit properties and methods from another class. Create a SportsCar class that inherits from Car.",
    code: [
      "public class SportsCar extends Car {",
      "    private int topSpeed;",
      "    public SportsCar(String model, int year, int topSpeed) {",
      "        super(model, year);",
      "        this.topSpeed = topSpeed;",
      "    }",
      "}",
    ],
    solution: [
      "public class SportsCar extends Car {",
      "    private int topSpeed;",
      "    public SportsCar(String model, int year, int topSpeed) {",
      "        super(model, year);",
      "        this.topSpeed = topSpeed;",
      "    }",
      "}",
    ],
  },
];
