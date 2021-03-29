window.onload = () => {
  // Fonction qui fait apparaitre les elements du panier sur la page a partir du local storage
  // let products = [];
  let productList = JSON.parse(localStorage.getItem("teddy"));

  //Calcul du prix total
  const totalPriceCalculation = (productList) => {
    console.log(productList);
    let totalPrice = 0;
    for (let item of productList) {
      totalPrice = totalPrice + item.price;
      console.log("Chaque produit present dans le panier : ", item);
    }
    console.log("Prix total calcule par la fonction", totalPrice);
    return totalPrice;
  };

  //Affichage du prix total dans le panier
  const showTotalPrice = () => {
    const totalPriceContainer = document.getElementById("total-price");
    totalPriceContainer.innerHTML = totalPriceCalculation(productList);
  };

  const showCartItems = () => {
    if (productList === null) {
      let errormessage = document.getElementById("error-message-panier");
      errormessage.classList.add("alert");
      errormessage.innerHTML = "Votre panier est vide";
    } else {
      for (let item of productList) {
        let productLine = document.createElement("div");

        let productLineContainer = document.getElementById(
          "products-container"
        );
        productLineContainer.appendChild(productLine);
        productLine.classList.add("row", "bg-white", "my-3");

        let productCol1 = document.createElement("div");
        productCol1.classList.add("col-4");
        productLine.appendChild(productCol1);

        let productCard = document.createElement("div");
        productCard.classList.add("card");
        productCol1.appendChild(productCard);

        let teddyImage = document.createElement("img");
        teddyImage.classList.add("card-image-top");
        productCard.appendChild(teddyImage);
        teddyImage.setAttribute("src", item.imageUrl);

        let productCol2 = document.createElement("div");
        productCol2.classList.add("col-4", "my-auto");
        productLine.appendChild(productCol2);

        let productName = document.createElement("h2");
        productName.classList.add("card-title");
        productCol2.appendChild(productName);
        productName.innerHTML = item.name;

        let productColor = document.createElement("p");
        productColor.classList.add("card-text");
        productCol2.appendChild(productColor);
        productColor.innerHTML = item.chosenColor;

        let productCol3 = document.createElement("div");
        productCol3.classList.add("col-4", "my-auto");
        productLine.appendChild(productCol3);

        let productPrice = document.createElement("p");
        productPrice.classList.add(
          "align-middle",
          "my-auto",
          "text-right",
          "mr-2",
          "price"
        );
        productCol3.appendChild(productPrice);
        productPrice.innerHTML = item.price;

        // Construction de la liste des ID a envoyer au serveur
        // products.push(item._id);
      }
      showTotalPrice();
    }
  };

  showCartItems();

  // Construction de l'objet contact a envoyer au serveur
  let nom;
  let prenom;
  let addresse;
  let ville;
  let mail;

  let nameContainer = document.getElementById("lastName");
  nameContainer.addEventListener("change", function (event) {
    nom = event.target.value;
    console.log(nom);
  });

  let firstNameContainer = document.getElementById("firstName");
  firstNameContainer.addEventListener("change", function (event) {
    prenom = event.target.value;
    console.log(prenom);
  });

  let addressContainer = document.getElementById("address");
  addressContainer.addEventListener("change", function (event) {
    addresse = event.target.value;
    console.log(addresse);
  });

  let cityContainer = document.getElementById("city");
  cityContainer.addEventListener("change", function (event) {
    ville = event.target.value;
    console.log(ville);
  });

  let mailContainer = document.getElementById("mail");
  mailContainer.addEventListener("input", function (event) {
    mail = event.target.value;
    console.log(mail);
  });

  const getContactInfo = () => {
    const mailFormat = /[A-Za-z0-9._%+-]+@[a-z0-9.-]/;
    if (
      prenom !== undefined &&
      nom !== undefined &&
      addresse !== undefined &&
      ville !== undefined &&
      mail !== undefined &&
      mail.match(mailFormat)
    ) {
      let contactInfo = {
        firstName: prenom,
        lastName: nom,
        address: addresse,
        city: ville,
        email: mail,
      };
      console.log("Objet Contact dans la fonction getContactInfo", contactInfo);
      return contactInfo;
    } else {
      console.log("Formulaire non complet");
      // let errormessage = document.getElementById("error-message");
      // errormessage.classList.add("alert");
      // errormessage.innerHTML = "Formulaire incomplet";
      return false;
    }
  };

  // Construit la liste produit à envoyer au serveur et vérifie que le panier n'est pas vide

  const getProductList = (productList) => {
    let products = [];
    if (productList === null) {
      let formContainer = document.getElementById("form-container");
      formContainer.classList.add("invisible");
      return false;
    } else {
      for (let item of productList) {
        products.push(item._id);
      }
      return products;
    }
  };

  getProductList(productList);

  // Fonction de validation

  const form = document.getElementById("form-container");

  // form.onsubmit = function(){
  //   let contact = getContactInfo();
  //   let products = getProductList(productList);
  //     if (!contact || !products) {
  //       return false
  //     } else {
  //       return true
  //     }
  //   }

  // Envoyer les donnees au serveur avec Promise
  // let apiResponse;
  let confirmationButton = document.getElementById("confirmation-button");

  let sendOrderToServer = (e) => {
    let formContainer = document.getElementById("form-container");
    formContainer.reportValidity()
    console.log(e)
    e.preventDefault();
    let contact = getContactInfo();
    let products = getProductList(productList);
    let jsonBody = {
      contact,
      products,
    };
    console.log(jsonBody);
    if (!contact || !products) {
      console.error("error");
      return false;
    } else {
      console.log("final jsonbody", jsonBody);
      return fetch("http://localhost:3000/api/teddies/order", {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify(jsonBody),
      })
        .then((response) => {
          return response.json();
        })
        .then((jsonResponse) => {
          let orderId = jsonResponse.orderId;
          localStorage.setItem("orderId", JSON.stringify(orderId));
          let totalAmount = totalPriceCalculation(productList);
          localStorage.setItem("totalAmount", JSON.stringify(totalAmount));
          window.location.href= "../confirmation/confirmation.html"
        })
        .catch((error) => console.error(error));
    }
  };

  // Lancer la fonction sendOrderToServer quand on clique sur le bouton commander
  confirmationButton.addEventListener("click", (e) => sendOrderToServer(e));
};
