// let URL_USERS = "https://api.slingacademy.com/v1/sample-data/users",
//   URL_POSTS = "https://api.slingacademy.com/v1/sample-data/blog-posts";

// let store = {};

// // let fetchdata = () => {
// //     Promise.all([])// этот метод Promise.all() позволяет получить сразу несколько данных со всех API.
// // }

// let usersPromise = fetch(URL_USERS).then((response) => response.json()); // Создаем fetch запрос, если получаем ответ от промиса (Promise), вызываем метод response.json() и полученные данные храним в переменной usersPromise
// let postsPromise = fetch(URL_POSTS).then((response) => response.json()); // Создаем fetch запрос, если получаем ответ от промиса (Promise), вызываем метод response.json() и полученные данные храним в переменной postsPromise.

//Promise.all(promises) – ожидает выполнения всех промисов и возвращает массив с результатами. Если любой из указанных промисов вернёт ошибку, то результатом работы Promise.all будет эта ошибка, результаты остальных промисов будут игнорироваться.

// Promise.all([usersPromise, postsPromise]).then(([usersData, postsData]) => {
//   //
//   console.log("Данные пользователей", usersData);
//   console.log("Данные постов", postsData);
// });

//=================================================
// Как делать фетч запрос удобнее:

let URLS = [
  "https://api.slingacademy.com/v1/sample-data/users",
  "https://api.slingacademy.com/v1/sample-data/blog-posts",
]; //сохраняем оба API в массиве URLS

const promises = URLS.map((url) =>
  fetch(url).then((response) => response.json())
); //перебираем массив с помощью метода массива map. С помощью стрелочной функции для каждого элемента массива делаем фетч-запрос, если получаем ответ от промиса (Promise), вызываем метод response.json(). Полученные данные сохраняем в переменной promises.

const store = {
  isLoading: true, //пока данные в промис-запросе Promise.all(promises) еще не получены, у нас "будет идти загрузка"
}; //Нахрена нам вообще объект store? Мы хитрым образом загружаем все данные с API в него. И потом из него вытаскиваем, куда и когда нам нужно. Он служит хранилищем.

let loadingText = document.querySelector(".loader"); //выбираем наш html элемент <span class="loader">Loading...</span> для работы с ним в JS

Promise.all(promises) //выгружаем данные в объект store (ранее мы сохранили данные из API в переменной promises).
  .then(([usersData, postsData]) => {
    if (usersData.success) {
      store.users = usersData.users; //если данные из API юзеров были загружены успешно, мы сохраняем их в объекте store
    }
    if (postsData.success) {
      store.blogs = postsData.blogs; //если данные из API постов были загружены успешно, мы тоже сохраняем их в объекте store
    }
  })
  .then(() => {
    render();
    store.isLoading = false; //если данные подгружаются, то "загрузка" в объекте store пропадает
    loadingText.innerHTML = " "; //убираем текст "Loading..." из <span class="loader">Loading...</span>
  })

  .catch((error) => {
    console.log("Данные не получены или их нет!"); //.catch((error) будет ловить ошибки при загрузке. Если они будут, то мы в консоли получим такой текст из кавычек
    loadingText.innerHTML = "Sorry, links are broken or an error occured..."; //при ошибке загрузки получим такой текст на экране
  });

const createUserElement = (data) => {
  //этой функцией создаем карточки для юзеров
  let itemElement = document.createElement("div");
  itemElement.classList.add("item");

  let ulElement = document.createElement("ul");

  //Name
  let liNameElement = document.createElement("li");
  let spanNameFirstElement = document.createElement("span");
  spanNameFirstElement.classList.add("label");

  let spanNameSecondElement = document.createElement("span");
  spanNameSecondElement.innerText = `Name: ${data.first_name}`;

  liNameElement.append(spanNameFirstElement, spanNameSecondElement);

  //Last name
  let liLastNameElement = document.createElement("li");
  let spanLastNameFirstElement = document.createElement("span");
  spanLastNameFirstElement.classList.add("label");
  let spanLastNameSecondElement = document.createElement("span");
  spanLastNameSecondElement.innerText = `Last name: ${data.last_name}`;

  liLastNameElement.append(spanLastNameFirstElement, spanLastNameSecondElement);

  //Email
  let liEmailElement = document.createElement("li");
  let spanEmailFirstElement = document.createElement("span");
  spanEmailFirstElement.classList.add("label");
  let spanEmailSecondElement = document.createElement("span");
  spanEmailSecondElement.innerText = `Email: ${data.email}`;

  liEmailElement.append(spanEmailFirstElement, spanEmailSecondElement);

  //Job
  let liJobElement = document.createElement("li");
  let spanJobFirstElement = document.createElement("span");
  spanJobFirstElement.classList.add("label");
  let spanJobSecondElement = document.createElement("span");
  spanJobSecondElement.innerText = `Job: ${data.job}`;

  liJobElement.append(spanJobFirstElement, spanJobSecondElement);

  ulElement.append(
    liNameElement,
    liLastNameElement,
    liEmailElement,
    liJobElement
  );

  itemElement.append(ulElement);

  itemElement.addEventListener("click", function () {
    openModalBlog(data.id);
  }); //прослушка. При клике на карточку юзера будет запускаться функция по открытию модального окна

  return itemElement;
};

function openModalBlog(id) {
  //функция модального окна

  let modalContent = document.querySelector(".modal_content > ul");
  let filteredBlogs = store.blogs.filter((blog) => blog.user_id === id);

  modalContent.innerHTML = " ";

  let modal = document.querySelector(".modal");
  modal.classList.add("modal_active");

  if (filteredBlogs.length > 0) {
    //Если длина filteredBlogs больше 0 (то есть, хоть какие-то посты у пользователя есть), то отображаем заголовки постов с нумерацией.
    let liTitle = document.createElement("li");
    liTitle.innerText = "Список постов пользователя:";
    modalContent.append(liTitle);

    let postNumber = 1;

    filteredBlogs.forEach((blog) => {
      let liPosts = document.createElement("li");
      liPosts.innerText = postNumber + ") " + blog.title;
      modalContent.append(liPosts);

      postNumber++;
    });
  } else {
    //Если у пользователя постов нет, то мы об этом сообщаем
    modalContent.innerText = "У пользователя пока нет постов.";
  }
}

document.querySelector(".modal_close").addEventListener("click", () => {
  //При нажатии на кнопку в модальном окне закрываем само окно (убираем у него класс modal_active).
  let modal = document.querySelector(".modal");
  modal.classList.remove("modal_active");
});

const createUsersElement = () => {
  //заполняем карточками юзеров <section class="users"></section>
  let usersElement = document.querySelector(".users");

  store.users.forEach((user) => {
    let item = createUserElement(user);

    usersElement.append(item);
  });
};

function render() {
  createUsersElement();
}
