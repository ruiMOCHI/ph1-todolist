"use strict";

const inputElement = document.querySelector("#new-todo");  //inputタグ
const addButtonElement = document.querySelector("#add-button");  //buttonタグ
const todoListElement = document.querySelector("#todo-list");  //ulタグ

let todoList = [];  //To-Do アイテムのリストを保持するための変数 を配列として定義しましょう。todoList
//配列を使えば、To-Do を 1つの場所にまとめて保存できます。配列の各要素はインデックスで簡単にアクセスできるので、特定の To-Do を探し、追加・編集・削除が容易にできます。
//最初は何も入っていないので、空配列として設定しましょう。
let updateIndex = null;

const renderTodoList = () => {
    todoListElement.innerHTML = "";  //todoListElement=todoList=ul要素を一旦空にする
    todoList.forEach((todo, index) => {
        const todoElement = createTodoElement(todo, index);
        todoListElement.appendChild(todoElement);//子要素の末尾に追加
    });
};  //これらの変更をユーザーにリアルタイムで表示するためには、都度 HTML を更新する必要があります。
    //この更新を実施し、各 To-Do の HTML を生成する処理を renderTodoList 関数としてまとめていきましょう！

const addOrUpdateTodo = () => {
  const value = inputElement.value.trim(); //また、.trim() を使うことで文字列の先頭や末尾の空白を削除することができす。例えば、ユーザーが間違って入力の前後に空白を入れても、それが影響しないようにできます。
  if (value) {
    if (updateIndex !== null) {
        todoList[updateIndex].text = value;
        updateIndex = null;
        addButtonElement.textContent = '追加';
    } else {
    todoList.push({ text: value, completed: false });/*ToDoアイテムをtodoList配列に追加します。新しいToDoアイテムは、オブジェクトとして表現され、そのテキストはvalueから取得され、completedプロパティは初期値としてfalseに設定されます*/
    // console.log(todoList);
    }
    renderTodoList();//ここでも renderTodoList 関数が役立ちます。この関数は、To-Do List 配列の内容を基に、ブラウザ上にTodoリストを再描画します。
     //そのため、addTodo の中で新しい To-Do を追加した後、renderTodoList を呼び出すことで、ブラウザ上に変更を即座に反映させることができます。
    inputElement.value = "";/*前回の内容が残らないようするために*/
  }
};

const toggleTodo = (index) => {  //引数として受け取る index は、操作したい To-Do の位置を示します。例えば、最初の To-Do アイテムを操作したい場合は、index は0になります。
    todoList[index].completed = !todoList[index].completed;  //左辺は指定されたインデックスのTodo項目の completed プロパティ（完了状態を示すブール値）を参照します。右辺はプロパティの現在の値を反転させます。つまり、完了していた場合は未完了に、未完了だった場合は完了に切り替える（L60~64に渡す。ボタンを押す前に完了だったら、未完了に。ボタンを押す前に未完了だったら、完了に。）
    if (todoList[index].completed){
        Swal.fire({
            icon: 'success' ,
            title: '完了！' ,
            text: 'ToDoが完了しました。' ,
            timer: 1500 ,
        });  //アラート表示
    }
    renderTodoList();
}; //要するに、toggleTodo 関数は、Todoリスト内の特定のTodo項目の完了状態をトグル（切り替え）するための関数です。
   //例えば、ユーザーがTodoリストの項目をクリックしたときに、その項目の完了状態を切り替えるのに使えます。

const deleteTodo = (index) => {
    todoList.splice(index, 1);  //指定したindexの要素を削除（普通の削除）。Ex{constで宣言された,(arrは配列)}arr.splice("配列の位置"、"取り除く要素の数"、"追加する要素")
    renderTodoList();    //これが無いとボタンをクリックしても反応しない
};

const updateTodo = (index) => {
    inputElement.value = todoList[index].text;
    addButtonElement.textContent = '更新';
    updateIndex = index
};

const createTodoElement = (todo, index) => {  //コンソールに結果を表示しているだけだと意味がないので、HTML の要素を生成する 関数も定義しましょう！todo: 各 To-Do を指します。先ほどのオブジェクトで定義した text と completed のプロパティを持ちます。index: To-Do のインデックスを指します。完了や削除の操作を特定の To-Do に適用するために使用します。
    const li = document.createElement("li");
    li.innerHTML = todo.text;

    const completeButton = document.createElement("button");
    completeButton.textContent = todo.completed ? "Undo" : "Complete";
    completeButton.classList = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mx-2 my-4";
    completeButton.addEventListener("click", () => toggleTodo(index))   //L36~42を受け取る。
    li.appendChild(completeButton);

    const updateButton = document.createElement("button");
    updateButton.textContent = "Update";
    updateButton.classList = "bg-yellow-500 hover:bg-yellow-700 text-white py-1 px-2 font-bold rounded mx-2 my-4";
    updateButton.addEventListener("click", () => updateTodo(index))
    li.appendChild(updateButton);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList = "bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded mx-2 my-4";
    deleteButton.addEventListener("click", () => deleteTodo(index));
    li.appendChild(deleteButton);

    return li;
};


addButtonElement.addEventListener("click", addOrUpdateTodo);