interface GithubUserResponse {
    id: number,
    login: string,
    name: string,
    bio: string,
    public_repos: number,
    repos_url: string,
    message?: 'Not Found'
};

interface GithubRepoResponse {
    name: string,
    description: string,
    fork: boolean,
    stargazers_count: number
};

const users: GithubUserResponse[] = [];

async function fetchUser(username: string) {
    const response = await fetch(`https://api.github.com/users/${username}`);
    const user: GithubUserResponse = await response.json();

    if(user.message){
        console.log('User not found');
    } else {
        users.push(user)
    }

    console.log(
        `O usuário ${user.login} foi salvo.\n` +
        `\nid: ${user.id}` +
        `\nlogin: ${user.login}` +
        `\nNome: ${user.name}` +
        `\nBio: ${user.bio}` +
        `\nRepositórios públicos: ${user.public_repos}`
      );
};

async function showUser(username: string) {
    const user: GithubUserResponse | undefined = users.find(user => user.login === username);

    if (typeof user === 'undefined') {
        console.log('User not found')
    } else {
        const response = await fetch(user.repos_url);
        const repos: GithubRepoResponse[] = await response.json()

        let message = `id: ${user.id}\n` +
      `\nlogin: ${user.login}` +
      `\nNome: ${user.name}` +
      `\nBio: ${user.bio}` +
      `\nRepositórios públicos: ${user.public_repos}`

    repos.forEach(repo => {
      message += `\nNome: ${repo.name}` +
        `\nDescrição: ${repo.description}` +
        `\nEstrelas: ${repo.stargazers_count}` +
        `\nÉ um fork: ${repo.fork ? 'Si;m' : 'Não'}\n`
    });

    console.log(message);
    
    }
};

function showAllUsers() {
    let message = 'Usuários:\n'
    users.forEach(user => {
        message += `\n${user.login}`
    });

    console.table(message);
};

function showReposTotal() {
    const reposTotal = users.reduce((accumulator, user) => (accumulator + user.public_repos), 0);

    console.table(reposTotal);
};

function showTopFive() {
    const topFive = users.slice().sort((currentUser, followingUser) => followingUser.public_repos - currentUser.public_repos).slice(0, 5)

    let message = 'Top 5 usuários com mais repositórios públicos:\n'

    topFive.forEach((user, index) => {
      message += `\n${index + 1} - ${user.login}: ${user.public_repos} repositórios`
    })
  
    alert(message)
};

async function main() {
    await fetchUser('AkiraShirou');

    showAllUsers();
    showReposTotal();
    showTopFive();
};