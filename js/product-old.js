window.onload = () => {
  // Recuperer l'ID du teddy dans l'URL
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product_id = urlParams.get("_id");

  // Promise qui récupère les données API et lance la fonction buildTeddies si tout se passe bien
  let teddy = "";
  let getTeddies = fetch("http://localhost:3000/api/teddies/" + product_id, {
    method: "GET",
  })
    .then((response) => {
      return response.json();
    })
    .then((element) => {
      showTeddyDetail(element);
      teddy = element;
    })
    .catch((error) => alert("Erreur: " + error));

  // Afficher le détail du produit sur la page product.html
  let teddyColor;
  let showTeddyDetail = (element) => {
    let teddyName2 = document.getElementById("teddy-name2");
    teddyName2.innerHTML = element.name;

    let teddyPicContainer = document.getElementById("teddypic-container");
    teddyPicContainer.setAttribute("src", element.imageUrl);

    let teddyDetails = document.getElementById("teddyDetails");
    teddyDetails.innerHTML = element.description;

    let teddyPrice2 = document.getElementById("teddy-price");
    teddyPrice2.innerHTML = element.price;
    teddyPrice2.classList.add("price");

    teddyColor = document.getElementById("teddy-color");
    let colors = element.colors;
    colors.forEach((color) => {
      let option = document.createElement("option");
      teddyColor.appendChild(option);
      option.innerHTML = color;
    });
    teddyColor.addEventListener("change", (event) => {
      let chosenColor = event.target.value;
      console.log(chosenColor)

   });
    
  };

  var addTeddyToCart = () => {
    var existing = localStorage.getItem("teddy");
    let teddies;
    if (existing) {
      teddies = JSON.parse(existing);
    } else {
      teddies = [];
    }
    console.log(teddy);
    teddies.push(teddy);
    localStorage.setItem("teddy", JSON.stringify(teddies));
    console.log(localStorage.getItem("teddy"));
    let successAlert = document.getElementById("alert-success");
    successAlert.innerHTML =
      "Félicitations ! Vous avez ajouté cet article à votre panier !";
    successAlert.classList.add("alert", "alert-success", "mt-3");
    addToCartButton.remove();
  };

  let addToCartButton = document.getElementById("add-cart");
  addToCartButton.onclick = addTeddyToCart;

  function getColor() {
    var color = document.getElementById("teddy-color").value;
    console.log(color);
  }

  // localStorage.clear();
};
