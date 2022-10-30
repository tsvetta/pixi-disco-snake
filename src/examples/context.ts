export const contextFn = () => {
  class A {
    private actualName: string = 'A';

    // @ts-ignore
    private myName: string = `${this.actualName}: I am A`;
    public method: Function = () => {};
  }

  class B {
    private actualName: string = 'A';
    private myName: string = `${this.actualName}: I am B`;

    public printName() {
      // Here... what does "this" means?!
      console.log(this.myName);
    }
  }

  const a = new A();
  const b = new B();

  // I assign a.method
  a.method = b.printName;
  a.method(); // This will print "I am A"
  b.printName(); // This will print "I am B"

  // This will create a new function where `b` is the `this` for that function
  a.method = b.printName.bind(b);
  a.method(); // This now prints "I am B"
};
