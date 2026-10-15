async function getUser(id) {
  const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
  return res.json();
}

const user = getUser(1);
console.log(user); // Promise { <pending> }
