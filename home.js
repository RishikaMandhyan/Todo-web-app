//this web application fetches data for todos from an api and also provides an option to add/delete our own todos

//unique id starts from 201 as the data we are fetching from the api already has 200 entries
var unique_id=201;
var todo_list=new Array(0);  
var submit_button= document.getElementById("submit_button");
var list_container= document.getElementById("list_container2");


fetch('https://jsonplaceholder.typicode.com/todos')
  .then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not OK');
    }
    return response.json();
  })
  .then((data) => {
    todo_list=data;
    render_list();
  })
  .catch(error => {
    console.log('Error:', error.message);
  });



function render_list()
{
    
    list_container.innerHTML='';

    todo_list.forEach(function(item)
    {
            var new_para=document.createElement("p");
            var new_button=document.createElement("button");
            var new_div=document.createElement("div");
            new_para.innerText=item.title;
            new_div.setAttribute("class", "each_item");
            new_button.setAttribute("id", item.id);
            new_button.setAttribute("class", "delete_button");
            new_button.innerText= "Delete";
            new_button.setAttribute("onclick", "delete_function("+ item.id+")");
            new_div.appendChild(new_para);
            new_div.appendChild(new_button);
            list_container.appendChild(new_div);
    });

}


function delete_function(button_id)
{

    var index= todo_list.findIndex(function(item)
    {
        return (item.id===button_id);
    })

    todo_list.splice(index,1);
    console.log(todo_list);
    var x= list_container.scrollTop;
    render_list();
    list_container.scrollTop=x;

}


submit_button.addEventListener("click", function(){

    var userinput= document.getElementById("userinput").value;

    if(!userinput.length) alert("Task cannot be empty");
    else 
    {
        var new_entry=
        {
            title: userinput,
            id: unique_id
        }

        
        todo_list.push(new_entry);
        document.getElementById("userinput").value='';
        render_list();
        list_container.scrollTop= -list_container.scrollHeight;
        unique_id++;
        console.log(todo_list);
    }

})


