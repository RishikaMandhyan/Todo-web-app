//this web application fetches data for todos from an api and also provides an option to add/delete our own todos

//unique id starts from 201 as the data we are fetching from the api already has 200 entries
var unique_id=201;
var todo_list=new Array(0);  
var submit_button= document.getElementById("submit_button");
var list_container= document.getElementById("list_container2");


fetch('https://jsonplaceholder.typicode.com/todos')
  .then((response) => 
  {
    if (!response.ok) 
    {
      throw new Error('Network response was not OK');
    }
    return response.json();
  })
  .then((data) => 
  {
    todo_list=data;
    render_list();
  })
  .catch(error => 
  {
    console.log('Error:', error.message);
  });


function render_list()
{
    
    list_container.innerHTML='';
    todo_list.forEach(function(item)
    {
            var para=document.createElement("p");
            var delete_button=document.createElement("button");
            var edit_button=document.createElement("button");
            var save_button=document.createElement("button");
            var complete_button=document.createElement("button");
            var new_div=document.createElement("div");

            para.innerText=item.title;
            para.setAttribute("id", "p"+item.id);

            edit_button.setAttribute("onclick", "edit_function("+ item.id+")");
            edit_button.setAttribute("class", "edit_button");
            edit_button.innerText= "Edit";

            save_button.setAttribute("onclick", "save_function("+ item.id+")");
            save_button.setAttribute("class", "save_button");
            save_button.style.display="none";
            save_button.innerText= "Save";

            complete_button.setAttribute("onclick", "complete_function("+ item.id+")");
            complete_button.setAttribute("class", "complete_button");
            complete_button.innerText= "Done";

            if(item.saved)
            {
              para.style.border="0";
              item.saved=false;
            }

            //makes sure that edit button disappears when we start editing and save button appears instead
            if(item.editable)
            {
              para.setAttribute("contenteditable","true");
              para.style.border="1px solid black";
              edit_button.style.display="none";
              save_button.style.display="inline-block";
            }

            if(item.completed) 
            { 
              para.style.textDecoration="line-through";
              complete_button.innerText= "Undone";
              new_div.setAttribute("class", "each_item_completed");
            }
            else new_div.setAttribute("class", "each_item_uncompleted");

            delete_button.setAttribute("class", "delete_button");
            delete_button.innerText= "Delete";
            delete_button.setAttribute("onclick", "delete_function("+ item.id+")");

            new_div.appendChild(para);
            new_div.appendChild(delete_button);
            new_div.appendChild(edit_button);
            new_div.appendChild(save_button);
            new_div.appendChild(complete_button);
            list_container.appendChild(new_div);

    });

}

function complete_function(id)
{ 

  var index= todo_list.findIndex(function(item)
    {
        return (item.id===id);
    })

    todo_list[index].completed=!(todo_list[index].completed);
    var x= list_container.scrollTop;
    render_list();
    list_container.scrollTop=x;

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


function edit_function(id)
{
    var index= todo_list.findIndex(function(item)
    {
        return (item.id===id);
    })

    todo_list[index].editable= true;
    var x= list_container.scrollTop;
    render_list();
    list_container.scrollTop=x;
}


function save_function(id)
{
      var index= todo_list.findIndex(function(item)
      {
          return (item.id===id);
      })

      todo_list[index].saved= true;
     

      var p_element=document.getElementById("p"+id);
      todo_list[index].title= p_element.innerText;
      todo_list[index].editable=false; 
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
            id: unique_id,
            completed: false,
            editable:false,
            saved: false
        }

        todo_list.push(new_entry);
        document.getElementById("userinput").value='';
        render_list();
        list_container.scrollTop= -list_container.scrollHeight;
        unique_id++;
        console.log(todo_list);
    }
})



