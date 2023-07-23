//this web application fetches data for todos from an api and also provides an option to add/delete our own todos
//import moment from './node_modules/moment/src/moment';

var unique_id, subtask_uid=1, category_uid=1;
var priority="none";
var duedate="none";
var subtask_arr=new Array(0);
var category_arr=new Array(0);
var todo_string= localStorage.getItem('todos');
var todo_list=JSON.parse(todo_string);
if(todo_list==null || todo_list.length==0) 
{ 
  //console.log("hi");
  unique_id=1;
  subtask_uid=1;
  category_uid=1;
  todo_list=new Array(0);
}
else unique_id=todo_list[todo_list.length-1].id +1;


var submit_button= document.getElementById("submit_button");
var search_button_1= document.getElementById("search_button_1");
var cancel_search_button_1= document.getElementById("cancel_search_button_1");
var search_button_2= document.getElementById("search_button_2");
var cancel_search_button_2= document.getElementById("cancel_search_button_2");
var search_button_3= document.getElementById("search_button_3");
var cancel_search_button_3= document.getElementById("cancel_search_button_3");
var list_container= document.getElementById("list_container2");
render_list();


//unique id starts from 201 as the data we are fetching from the api already has 200 entries
// fetch('https://jsonplaceholder.typicode.com/todos')
//   .then((response) => 
//   {
//     if (!response.ok) 
//     {
//       throw new Error('Network response was not OK');
//     }
//     return response.json();
//   })
//   .then((data) => 
//   {
//     todo_list=data;
//     render_list();
//   })
//   .catch(error => 
//   {
//     console.log('Error:', error.message);
//   });


function render_list()
{
    
    list_container.innerHTML='';
    todo_list.forEach(function(item)
    {
      if(item.display)
      {
        var para=document.createElement("p");
        var date_para=document.createElement("p");
        var subtask_div=document.createElement("div");
        var category_div=document.createElement("div");
        var button_container=document.createElement("div");
        var delete_button=document.createElement("button");
        var edit_button=document.createElement("button");
        var save_button=document.createElement("button");
        var complete_button=document.createElement("button");
        var new_div=document.createElement("div");

        para.innerText=item.title;
        para.setAttribute("id", "p"+item.id);

        button_container.setAttribute("class", "button_container");

        edit_button.setAttribute("onclick", "edit_function("+ item.id+")");
        edit_button.setAttribute("class", "edit_button");
        edit_button.innerHTML=`<span class="material-symbols-outlined" id="ed_button">
        edit
        </span>`;

        save_button.setAttribute("onclick", "save_function("+ item.id+")");
        save_button.setAttribute("class", "save_button");
        save_button.style.display="none";
        
        save_button.innerHTML=`<span class="material-symbols-outlined" id="save_button">
        save_as
        </span>`;

        complete_button.setAttribute("onclick", "complete_function("+ item.id+")");
        complete_button.setAttribute("class", "complete_button");
        
        complete_button.innerHTML=`<span class="material-symbols-outlined" id="done_button">
        done
        </span>`;
        

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

        switch(item.priority)
        {
          case "none":
          new_div.setAttribute("id", 'gray');
          break;

          case "high":
            new_div.setAttribute("id", "red");
          break;

          case "medium":
            new_div.setAttribute("id", "orange");
          break;

          case "low":
            new_div.setAttribute("id", "green");
          break;

        }

        let today_date= new Date();
        let tmrw= new Date(today_date);
        tmrw.setDate(today_date.getDate() + 1);

        if(item.duedate!="none")
        {
          if(item.duedate== today_date.toUTCString().slice(5, 16))
          {
            date_para.innerText="Due Today";
          }
  
          else if(item.duedate== tmrw.toUTCString().slice(5, 16))
          {
            date_para.innerText="Due Tomorrow";
          }

          else
          {
            date_para.innerText="Due on "+ item.duedate;
          }
        }

       
        item.subtask_arr.map(function(s_item)
        {
            var s_para=document.createElement("li");
            s_para.innerText=s_item.title;
            s_para.setAttribute("id", s_item.s_id);
            //console.log(item.subtask_arr);
            subtask_div.appendChild(s_para);

        })

        item.category_arr.map(function(c_item)
        {
            var c_para=document.createElement("p");
            c_para.innerText="Category: "+c_item.title;
            c_para.setAttribute("id", c_item.c_id);
            //console.log(item.subtask_arr);
            category_div.appendChild(c_para);

        })
        

      //console.log("hi");
        delete_button.setAttribute("class", "delete_button");
        delete_button.innerHTML=`<span class="material-symbols-outlined" id="del_button">
        delete
        </span>`;
        delete_button.setAttribute("onclick", "delete_function("+ item.id+")");

        new_div.appendChild(para);
        new_div.appendChild(category_div);
        new_div.appendChild(date_para);
        new_div.appendChild(subtask_div);

        button_container.appendChild(delete_button);
        button_container.appendChild(edit_button);
        button_container.appendChild(save_button);
        button_container.appendChild(complete_button);

        new_div.appendChild(button_container);
        list_container.appendChild(new_div);

      }
    });

}

function complete_function(id)
{ 

  var index= todo_list.findIndex(function(item)
    {
        return (item.id===id);
    })

    todo_list[index].completed=!(todo_list[index].completed);
    localStorage.setItem('todos', JSON.stringify(todo_list));
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
    localStorage.setItem('todos', JSON.stringify(todo_list));
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
    localStorage.setItem('todos', JSON.stringify(todo_list));
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
      localStorage.setItem('todos', JSON.stringify(todo_list));
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
            saved: false,
            display: true,
            priority: priority,
            duedate: duedate,
            subtask_arr: [...subtask_arr],
            category_arr: [...category_arr]
        }

        todo_list.push(new_entry);
        localStorage.setItem('todos', JSON.stringify(todo_list));  
        document.getElementById("userinput").value='';
        render_list();
        list_container.scrollTop= -list_container.scrollHeight;
        unique_id++;
        priority= "none";
        duedate="none";
        while(subtask_arr.length) {subtask_arr.pop();}
        while(category_arr.length) {category_arr.pop();}

        document.getElementById("subtask_list_container").textContent='';
        document.getElementById("category_list_container").textContent='';
        console.log(subtask_arr);
        console.log(category_arr);
        document.getElementById("date").style.display="none";
        document.getElementById("high").style.backgroundColor="blueviolet";
        document.getElementById("medium").style.backgroundColor="blueviolet";
        document.getElementById("low").style.backgroundColor="blueviolet";
        document.getElementById("today").style.backgroundColor="blueviolet";
        document.getElementById("tmrw").style.backgroundColor="blueviolet";
        document.getElementById("custom").style.backgroundColor="blueviolet";
        console.log(todo_list);
    }
})


//partial keyword search
//it returns the todo if the todo title contains any of the keywords mentioned by the user
search_button_1.addEventListener('click', function()
{
  var search_input= document.getElementById("search_input").value;
  var search_keywords=search_input.toLowerCase().split(' ');
  console.log(search_keywords);

  todo_list.map(function(item){
  var counter=0;
    search_keywords.map(function(item2){
      if(item.title.toLowerCase().includes(item2))
      {
           counter++;
      }
    })
    if(counter==0) item.display=false;
  })

  render_list();

  todo_list.map(function(item)
  {
    item.display=true;
  })

})

cancel_search_button_1.addEventListener('click', function()
{
  document.getElementById("search_input").value='';
  render_list();
})


//priority tags
//adding event listeners to each of the list items
var list_items= document.getElementsByClassName("priority_item");
var arr=Array.from(list_items);
arr.map(function(item){

  item.addEventListener("click", function(event)
  {

    for(var i=0;i<arr.length;i++){

      if(event.target==arr[i])
      {
        priority=event.target.id;
        event.target.style.backgroundColor="#4F0766";
        console.log(priority);
      }

      else arr[i].style.backgroundColor="blueviolet";
    }
    
  })

})


//duedate selection
var list_items2= document.getElementsByClassName("duedate_item");
var arr2=Array.from(list_items2);
arr2.map(function(item){

  item.addEventListener("click", function(event)
  {

    for(var i=0;i<arr2.length;i++)
    {
      if(event.target==arr2[i])
      {
        //console.log(event.target.style.backgroundColor);
        if(event.target.style.backgroundColor=="rgb(79, 7, 102)") 
        {
          //console.log("hi");
          event.target.style.backgroundColor="blueviolet";
          document.getElementById("date").style.display="none";
          duedate="none";
        }
        else
        {
          if(event.target.id=="today")
          {
            let today_date= new Date().toUTCString().slice(5, 16);
            duedate=today_date;
            console.log(duedate);
          }
          else if(event.target.id=="tmrw")
          {
            let today_date= new Date();
            let tmrw= new Date(today_date);
            tmrw.setDate(today_date.getDate() + 1);
            duedate=tmrw.toUTCString().slice(5, 16);
            console.log(duedate);
          }
          else if(event.target.id=="custom")
          {
            document.getElementById("date").style.display="block";
            //console.log("hi");
          }
          event.target.style.backgroundColor="#4F0766";
        }
      }
      else arr2[i].style.backgroundColor="blueviolet";
    }
  })
})


document.getElementById("date").addEventListener('change', function(event){
  var str=event.target.value;
  duedate= new Date(str).toUTCString().slice(5, 16);
  //console.log(duedate);
})



//functionality of entering subtasks when plus button is clicked
document.getElementById("plus_button_subtask").addEventListener("click", function()
{
  
    var parent_div= document.getElementById("subtask_list_container");
    var subtask= document.getElementById("subtask_input").value;


    if(subtask.length>0)
    {
      console.log(subtask);
      var new_p= document.createElement("p");
      new_p.innerText=subtask;
      new_p.setAttribute("class","subtask_para");
      parent_div.appendChild(new_p);
  
      var new_entry=
      {
          title: subtask,
          s_id: subtask_uid,
      }
  
      subtask_arr.push(new_entry);
      document.getElementById("subtask_input").value='';
     // console.log(subtask_arr);
      subtask_uid++;
    }

    else alert("Subtask cannot be empty");
    

})


//adding category
document.getElementById("plus_button_category").addEventListener("click", function()
{
  
    var parent_div= document.getElementById("category_list_container");
    var category= document.getElementById("category_input").value;

    if(category.length>0 && category_arr.length<1)
    {
      console.log(category);
      var new_p= document.createElement("p");
      new_p.innerText=category;
      new_p.setAttribute("class","category_para");
      parent_div.appendChild(new_p);
  
      var new_entry=
      {
          title: category,
          c_id: category_uid,
      }
  
      category_arr.push(new_entry);
     // console.log(subtask_arr);
      category_uid++;
  
    }

    else 
    {
      if(category.length<1)  alert("Category cannot be empty");
      else if(category_arr.length>=1)  alert("Task can have only one category");
    }

    
    document.getElementById("category_input").value='';
   
})




//category filter
//it returns the todo if the todo category contains any of the categories mentioned by the user
search_button_2.addEventListener('click', function()
{

  var search_input= document.getElementById("search_input_2").value;

  if(search_input.length>0)
  {
    var search_keywords=search_input.toLowerCase().split(' ');
    console.log(search_keywords);
  
    todo_list.map(function(item)
    {

      var counter=0;
      if(item.category_arr.length>0)
      {    

        
        search_keywords.map(function(item2)
        {
    
          var x_arr= item.category_arr;
          console.log(x_arr);
          if(x_arr[0].title.toLowerCase().includes(item2))
          {
              counter++;
          }
        })
        

      }

      if(counter==0 ) item.display=false;
    
    })
  
    render_list();
  
    todo_list.map(function(item)
    {
      item.display=true;
    })
  }
  

})

cancel_search_button_2.addEventListener('click', function()
{
  document.getElementById("search_input_2").value='';
  render_list();
})



//priority filter
//it returns the todo if the todo filter contains any of the priorities mentioned by the user
search_button_3.addEventListener('click', function()
{

  var search_input= document.getElementById("search_input_3").value;

  if(search_input.length>0)
  {
    var search_keywords=search_input.toLowerCase().split(' ');
    console.log(search_keywords);
  
    todo_list.map(function(item){
    var counter=0;
      search_keywords.map(function(item2)
      {
        if(item.priority.toLowerCase()==item2)
        {
             counter++;
        }
      })

      if(counter==0) item.display=false;
    })
  
    render_list();
  
    todo_list.map(function(item)
    {
      item.display=true;
    })
  }
  

})

cancel_search_button_3.addEventListener('click', function()
{
  document.getElementById("search_input_3").value='';
  render_list();
})