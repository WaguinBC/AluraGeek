import { servicesProducts } from "../services/product-services.js";

const productContainer = document.querySelector("[data-product]");
const form = document.querySelector("[data-form]");

function createCard({nome, preco, imagem, id}){
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
        <div class="img-container">
            <img src="${imagem}" alt="Caneca Stormtrooper">
        </div>
        <div class="card-container--info">
            <p>${nome}</p>
            <div class="card-container--value">
                <p>R$ ${preco}</p>
                <button class="delete-button" data-id="${id}">
                    <img src="./src/lixeira.png" alt="Excluir produto">
                </button>
            </div>
        </div>
    `;
    return card;
}

const renderProducts = async () => {
    try {
        const listProducts = await servicesProducts.productList();
        listProducts.forEach((product) => {
            const productCard = createCard(product);
            productContainer.appendChild(productCard);
        });
    } catch (error) {
        console.log(error);
    }
};

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nome = document.querySelector("[data-nome]").value;
    const preco = document.querySelector("[data-preco]").value;
    const imagem = document.querySelector("[data-imagem]").value;

    try {
        const newProduct = await servicesProducts.createProduct(nome, preco, imagem);
        const newCard = createCard(newProduct);
        productContainer.appendChild(newCard);
    } catch (error) {
        console.log(erro)
    }
    form.reset();
});

// // Função para deletar produtos (não é necessária, pois a exclusão é feita no evento de clique)
// const deleteProducts = async (id) => {
//     try {
//         await servicesProducts.deleteProduct(id); // Chama a função para deletar o produto
//     } catch (error) {
//         console.error("Erro ao excluir o produto:", error);
//     }
// };

productContainer.addEventListener("click", async (event) => {
    const button = event.target.closest(".delete-button"); // Captura o botão de exclusão clicado
    if (button) {
        const id = button.dataset.id; // Obtém o ID do produto a partir do atributo data-id
        try {
            await servicesProducts.deleteProduct(id); // Chama a função para deletar o produto da API
            button.closest(".card").remove(); // Remove o cartão correspondente do DOM
        } catch (error) {
            console.error("Erro ao excluir o produto:", error);
        }
    }
});

renderProducts();