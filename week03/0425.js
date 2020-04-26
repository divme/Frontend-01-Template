// Completion Record
// [[type]]: normal, break, continue, return, throw
// [[value]]: Types
// [[target]]: label

// 简单语句
// ExpressionStatement
// EmptyStatement
// DebuggerStatement
// a = 1 + 2;
// ;
// debugger;
// continue label;
// breack label;


// block
// {} 会形成块级作用域吗？

for (let i = 0; i < 10; i++) {
  let i = 0;
  console.log(i);
}

{
  let i = 0;
  {
    let i = 1;
    console.log(i);
  }
  console.log(i)
}


function run() {
  for (i = 0; i <10; i++) {
    // var i
    console.log(i)
    var i
  }
  // var i
}

// label
function  classXXX() {
   // public:
    this.a = 1;
    this.b = 2;
   // private:
    this.c= 3;
    this.d= 4;
}


function *foo(){
  yield 1;
  yield 2;
  var i = 3;
  while(true)
    yield i++;
}
var ff = foo();

function await(func) {
  if (func.then) {

  }
}
