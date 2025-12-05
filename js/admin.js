
const formAdmin = document.getElementById('formAdmin');
const inputNome = document.getElementById('nomeUser');
const inputEmail = document.getElementById('emailUser');
const inputSearch = document.getElementById('searchData');
const listaUsuarios = document.getElementById('listaUsuarios');
const btnLimpar = document.getElementById('btnLimpar');
const btnExcluirTodos = document.getElementById('btnExcluirTodos');

// 
const STORAGE_KEY = 'pythonAcademy_users';

//  FUNÇÕES

//
function getUsuarios() {
    const usuarios = localStorage.getItem(STORAGE_KEY);
    return usuarios ? JSON.parse(usuarios) : [];
}

// 
function saveUsuarios(lista) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
}

// 
function renderizarLista(filtro = '') {
    listaUsuarios.innerHTML = ''; // Limpa a lista visual atual
    const usuarios = getUsuarios();

    //
    const usuariosFiltrados = usuarios.filter(user => {
        const termo = filtro.toLowerCase();
        return user.nome.toLowerCase().includes(termo) || 
               user.email.toLowerCase().includes(termo);
    });

    if (usuariosFiltrados.length === 0) {
        listaUsuarios.innerHTML = '<li style="justify-content:center; color:#666;">Nenhum registro encontrado.</li>';
        return;
    }

    // Cria os elementos 
    usuariosFiltrados.forEach((user, index) => {
        // 
        const realIndex = usuarios.indexOf(user);

        const li = document.createElement('li');
        
        li.innerHTML = `
            <div class="user-info">
                <span class="user-date"><i class="far fa-clock"></i> ${user.dataCadastro}</span>
                <strong>${user.nome}</strong> <br>
                <span>${user.email}</span>
            </div>
            <button onclick="excluirUsuario(${realIndex})" class="btn-delete" title="Excluir item">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        listaUsuarios.appendChild(li);
    });
}

// Ad
function cadastrarUsuario(event) {
    event.preventDefault(); 

    const nome = inputNome.value.trim();
    const email = inputEmail.value.trim();

    if (!nome || !email) {
        alert("Preencha todos os campos!");
        return;
    }

    const novoUsuario = {
        nome: nome,
        email: email,
        dataCadastro: new Date().toLocaleString('pt-BR') // Data formatada
    };

    const usuarios = getUsuarios();
    usuarios.push(novoUsuario);
    
    saveUsuarios(usuarios); 
    
    formAdmin.reset(); // Limpa 
    renderizarLista(); // Atualiza 
    alert("Usuário cadastrado com sucesso!");
}

// Excluir 

window.excluirUsuario = function(index) {
    if(confirm("Tem certeza que deseja excluir este usuário?")) {
        const usuarios = getUsuarios();
        usuarios.splice(index, 1); // Remove 1 item na posição index
        saveUsuarios(usuarios);
        renderizarLista(inputSearch.value); // Mantém o filtro atual se houver
    }
}

// Excluir todos
function excluirTodos() {
    if(confirm("ATENÇÃO: Isso apagará TODOS os registros. Confirmar?")) {
        localStorage.removeItem(STORAGE_KEY);
        renderizarLista();
    }
}

// Limpar campos
function limparCampos() {
    formAdmin.reset();
    inputNome.focus();
}

// Pesquisar 
function pesquisarUsuarios() {
    const termo = inputSearch.value;
    renderizarLista(termo);
}



// envio do formulário
formAdmin.addEventListener('submit', cadastrarUsuario);

// clique no botão limpar
btnLimpar.addEventListener('click', limparCampos);

//  clique no botão excluir todos
btnExcluirTodos.addEventListener('click', excluirTodos);

// digitação no campo de pesquisa (pesquisa em tempo real)
inputSearch.addEventListener('input', pesquisarUsuarios);

// Inicializa a lista ao carregar a página
document.addEventListener('DOMContentLoaded', () => renderizarLista());