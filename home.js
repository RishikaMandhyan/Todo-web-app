//this web application fetches data for todos from an api and also provides an option to add/delete our own todos
//import moment from './node_modules/moment/src/moment';

var unique_id, last_subtask_uid, category_uid=1,tag_uid=1, session_id, index=0;;
var priority="none";
var duedate= "new Date()";
var subtask_arr=new Array(0);
var category_arr=new Array(0);
var tag_arr=new Array(0);
var todo_string= localStorage.getItem('todos');
var todo_list=JSON.parse(todo_string);
var session_string= localStorage.getItem('sessions');
var session_arr=JSON.parse(session_string);
var subtasks_string= localStorage.getItem('subtasks');
var all_subtasks_arr=JSON.parse(subtasks_string);

if(todo_list==null || todo_list.length==0) 
{ 
  unique_id=1;
  last_subtask_uid=0;
  localStorage.setItem("last_subtask_uid", last_subtask_uid);
  category_uid=1;
  tag_uid=1;
  todo_list=new Array(0);
}
else 
{
  unique_id=todo_list[todo_list.length-1].id +1;
  last_subtask_uid= parseInt(localStorage.getItem("last_subtask_uid"));
  
}

if(session_arr==null)
{
 session_id=0;
 session_arr= new Array(0);
}
else
{
  session_id= session_arr[session_arr.length-1].session_id+1;
}

var activity_arr= new Array(0);
var new_activity={
  session_id: session_id,
  start_time: new Date(),
  activity_arr: [...activity_arr]
 }

session_arr.push(new_activity);
localStorage.setItem("sessions", JSON.stringify(session_arr));

if(all_subtasks_arr==null)
{
  all_subtasks_arr= new Array(0);
}

console.log(all_subtasks_arr);

var submit_button= document.getElementById("submit_button");
var search_button_1= document.getElementById("search_button_1");
var search_button_2= document.getElementById("search_button_2");
var search_button_3= document.getElementById("search_button_3");
var search_button_5= document.getElementById("search_button_5");
var cancel_search_button_4= document.getElementById("cancel_search_button_4");
var list_container= document.getElementById("list_container2");
render_list(todo_list);

function render_list(x)
{
    
    list_container.innerHTML='';
    x.forEach(function(item)
    {
      if(item.display)
      {
        var para=document.createElement("p");
        var date_para=document.createElement("p");
        date_para.style.fontSize="16px";
        var subtask_div=document.createElement("div");
        var tag_div=document.createElement("div");
        tag_div.style.textAlign="right";

        var category_div=document.createElement("div");
        category_div.style.textAlign="right";
        category_div.style.fontSize="16px";
        var button_container=document.createElement("div");
        var delete_button=document.createElement("button");
        var edit_button=document.createElement("button");
        var save_button=document.createElement("button");
        var complete_button=document.createElement("button");
        var new_div=document.createElement("div");
        var left_div=document.createElement("div");
        left_div.setAttribute("id", left_div);
        left_div.style.marginRight="15px";
        left_div.style.maxWidth="65%";
        var right_div=document.createElement("div");
        right_div.setAttribute("id", right_div);



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
          new_div.classList.add('gray');
          break;

          case "high":
            new_div.classList.add("red");
          break;

          case "medium":
            new_div.classList.add("orange");
          break;

          case "low":
            new_div.classList.add("green");
          break;

        }

        let today_date= new Date();
        let tmrw= new Date(today_date);
        let item_date= new Date(item.duedate).toUTCString().slice(5, 16);
        tmrw.setDate(today_date.getDate() + 1);

      if(item.duedate!="none")
        {

          if(item_date== today_date.toUTCString().slice(5, 16))
          {
            date_para.innerText="Due Today";
          }
           else if(item_date== tmrw.toUTCString().slice(5, 16))
          {
            
            date_para.innerText="Due Tomorrow";
          }
          else
          {
            date_para.innerText="Due on "+ item_date;
          }

         
        }

       
        item.subtask_arr.map(function(s_item)
        {
            var s_para=document.createElement("li");
            s_para.innerText=s_item.title;
            s_para.setAttribute("id", s_item.s_id);
            subtask_div.appendChild(s_para);
            //dragSubtask(s_para);
            s_para.classList.add("dragSubtask");

        })

        var t_para=document.createElement("span");
        t_para.innerText="Tags: ";
        item.tag_arr.map(function(t_item)
        {
            t_para.innerText+=t_item.title+", ";
            t_para.setAttribute("id", t_item.t_id);
        })
        if(t_para.innerText!="Tags: ") tag_div.appendChild(t_para);

        
        item.category_arr.map(function(c_item)
        {
            var c_para=document.createElement("p");
            c_para.innerText="Category: "+c_item.title;
            c_para.setAttribute("id", c_item.c_id);
            category_div.appendChild(c_para);

        })
        
        delete_button.setAttribute("class", "delete_button");
        delete_button.innerHTML=`<span class="material-symbols-outlined" id="del_button">
        delete
        </span>`;
        delete_button.setAttribute("onclick", "delete_function("+ item.id+")");
        dragItem(new_div);
        new_div.setAttribute("id", "d"+item.id);
        new_div.classList.add("dragItem");
        left_div.appendChild(para);
        right_div.appendChild(category_div);
        right_div.appendChild(tag_div);
        left_div.appendChild(date_para);
        left_div.appendChild(subtask_div);
        button_container.appendChild(delete_button);
        button_container.appendChild(edit_button);
        button_container.appendChild(save_button);
        button_container.appendChild(complete_button);
        right_div.appendChild(button_container);

        new_div.appendChild(left_div);
        new_div.appendChild(right_div);
       
        list_container.appendChild(new_div);
      }
    });

    session_arr[session_id].activity_arr.push("User rendered list at "+ new Date());
    localStorage.setItem("sessions", JSON.stringify(session_arr));
}

function dragItem(new_div)
{
  new_div.setAttribute("draggable", "true");
  new_div.addEventListener("dragstart", dragStart);
  new_div.addEventListener("dragover", dragOver);
  new_div.addEventListener("drop", dragDrop);
  //new_div.addEventListener("dragenter", dragEnter);
  //new_div.addEventListener("dragleave", dragLeave);
  new_div.addEventListener("dragend", dragEnd); 
}



var fromElement, toElement, fromIndex;

function dragStart(event)
{
   fromElement=event.target;
   fromIndex=todo_list.findIndex(function(item){
    return ("d"+item.id===event.target.getAttribute("id"));
  })
   this.classList.add("dragging");
  //  session_arr[session_id].activity_arr.push("User started dragging task "+todo_list[fromIndex].title+" at "+ new Date());
  //  localStorage.setItem("sessions", JSON.stringify(session_arr));
   
}
function dragEnd(){

  this.classList.remove("dragging");
  // session_arr[session_id].activity_arr.push("User stopped dragging task "+todo_list[fromIndex].title+" at "+ new Date());
  // localStorage.setItem("sessions", JSON.stringify(session_arr));
}

function dragOver(e){
   
  e.preventDefault();
  const containerRect = list_container.getBoundingClientRect();
  const offsetY = e.clientY - containerRect.top;
  const containerHeight = containerRect.height;
  const scrollThreshold = 20; 
  const scrollSpeed = 100; 
  if (offsetY < scrollThreshold) 
  {
    list_container.scrollTop -= scrollSpeed;
  } else if (offsetY > containerHeight - scrollThreshold) 
  {
    list_container.scrollTop += scrollSpeed;
  }
}

function findAncestorWithClass(element, className) 
{
while ((element = element.parentElement) && !element.classList.contains(className));
return element;
}


function dragDrop(e)
{
  
    const containerRect = list_container.getBoundingClientRect();
    const offsetY = e.clientY - containerRect.top;
    const items = list_container.querySelectorAll(".dragItem");
    let dropIndex = 0;
    for (let i = 0; i < items.length; i++) 
    {
      const itemRect = items[i].getBoundingClientRect();
      const itemMiddleY = itemRect.top - containerRect.top + itemRect.height / 2;
     
      if (offsetY > itemMiddleY) 
      {
        //console.log(offsetY, itemMiddleY);
        dropIndex = i + 1;
      }
    }

    var parentDiv;
    if(e.target.classList.contains("dragItem"))
    {
      parentDiv=e.target;
    }
    else parentDiv=findAncestorWithClass(e.target, "dragItem");
    console.log(parentDiv);
    if(parentDiv)
    {
      // session_arr[session_id].activity_arr.push("User dropped task "+todo_list[fromIndex].title+" after task "+todo_list[dropIndex-1].title+" at "+ new Date());
      // localStorage.setItem("sessions", JSON.stringify(session_arr));
      var removed= todo_list.splice(fromIndex,1);
      if(fromIndex < dropIndex) dropIndex--;
      todo_list.splice(dropIndex, 0, removed[0]);
      console.log(todo_list);
      localStorage.setItem('todos', JSON.stringify(todo_list));  
      render_list(todo_list);
   }
    
}



// var fromElement_st, toElement_st, fromIndex_st, fromElement_st_id, from_subtask_arr;

// function dragSubtask(s_para)
// {
//   s_para.setAttribute("draggable", "true");
//   s_para.addEventListener("dragstart", dragStart_st);
//   s_para.addEventListener("dragover", dragOver);
//   s_para.addEventListener("drop", dragDrop_st);
//  // s_para.addEventListener("dragenter", dragEnter_st);
//   //s_para.addEventListener("dragleave", dragLeave_st);
//   s_para.addEventListener("dragend", dragEnd_st); 
// }

// function dragStart_st(event)
// {
//    fromElement_st=event.target;
//    fromElement_st_id= event.target.getAttribute("id");
//    //console.log(fromElement_st_id);
//    fromIndex_st=all_subtasks_arr.findIndex(function(item){

//     //console.log(item.s_id, event.target.getAttribute("id"));
//     return (item.s_id===parseInt(event.target.getAttribute("id")));
//   })

//  //console.log(fromIndex_st);

//   //fromIndex_st= all_subtasks_arr[fromIndex_st].index;
//   var fromParentElementId= all_subtasks_arr[fromIndex_st].parent_id;
//   var fromParentElementIndex=todo_list.findIndex(function(item){
//     return (item.id===fromParentElementId)
//  })



//   var from_subtask_arr= todo_list[fromParentElementIndex].subtask_arr;

//   //console.log(from_subtask_arr);

//   fromIndex_inside_st_arr=from_subtask_arr.findIndex(function(item){
//     //console.log(item.s_id, fromElement_st_id )
//     return ( item.s_id===  parseInt(fromElement_st_id  ))
//   })

//   //console.log(fromIndex_inside_st_arr);

//    this.classList.add("dragging");
   
// }

// function dragEnd_st(){

//   this.classList.remove("dragging");
//   // session_arr[session_id].activity_arr.push("User stopped dragging task "+todo_list[fromIndex].title+" at "+ new Date());
//   // localStorage.setItem("sessions", JSON.stringify(session_arr));
// }




// function dragDrop_st(e)
// {
//     items=document.querySelectorAll(".dragSubtask");
//     const containerRect = list_container.getBoundingClientRect();
//     const offsetY = e.clientY - containerRect.top;
//     let dropIndex_st = 0;
//     for (let i = 0; i < items.length; i++) 
//     {
//       const itemRect = items[i].getBoundingClientRect();
//       const itemMiddleY = itemRect.top - containerRect.top + itemRect.height / 2;
     
//       if (offsetY > itemMiddleY) 
//       {
//         //console.log(offsetY, itemMiddleY);
//         dropIndex_st = i + 1;
//       }
//     }
//     console.log(dropIndex_st);
//     var dropParentId_st=all_subtasks_arr[dropIndex_st].parent_id;

//     var dropParentElementIndex=todo_list.findIndex(function(item){
//       return (item.id===dropParentId_st)
//    })
    
//    var drop_subtask_arr= todo_list[dropParentElementIndex].subtask_arr;

//    dropIndex_inside_st_arr=drop_subtask_arr.findIndex(function(item){
//     return ( item.s_id===  all_subtasks_arr[dropIndex_st].s_id);
//   })


//     var parentDiv;
//     if(e.target.classList.contains("dragSubtask"))
//     {
//       parentDiv=e.target;
//     }
//     else parentDiv=findAncestorWithClass(e.target, "dragSubtask");
//     //console.log(parentDiv);
//     if(parentDiv)
//     {
    
//       var removed=from_subtask_arr.splice(fromIndex_inside_st,1);

//       if(fromIndex_st < dropIndex_st) dropIndex_st--;
//       drop_subtask_arr.splice(dropIndex_inside_st_arr, 0, removed[0]);
//       //console.log(todo_list);
//       localStorage.setItem('todos', JSON.stringify(todo_list));  
//       render_list(todo_list);
//    }
// }



function complete_function(id)
{ 
  var index= todo_list.findIndex(function(item)
    {
        return (item.id===id);
    })
    todo_list[index].completed=!(todo_list[index].completed);
    localStorage.setItem('todos', JSON.stringify(todo_list));
    var x= list_container.scrollTop;
    
    session_arr[session_id].activity_arr.push("User marked Task "+todo_list[index].title+" as complete at "+ new Date());
    localStorage.setItem("sessions", JSON.stringify(session_arr));

    render_list(todo_list);
    list_container.scrollTop=x;
}


function delete_function(button_id)
{
    var index= todo_list.findIndex(function(item)
    {
        return (item.id===button_id);
    })

    session_arr[session_id].activity_arr.push("User deleted Task "+todo_list[index].title+" at "+ new Date());
    localStorage.setItem("sessions", JSON.stringify(session_arr));

    todo_list.splice(index,1);
    localStorage.setItem('todos', JSON.stringify(todo_list));
    console.log(todo_list);
    var x= list_container.scrollTop;

    
    render_list(todo_list);
    list_container.scrollTop=x;
}


function edit_function(id)
{
    var index= todo_list.findIndex(function(item)
    {
        return (item.id===id);
    })
    todo_list[index].editable= true;
    //todo_list[index].subtask_arr.editable=true;
    localStorage.setItem('todos', JSON.stringify(todo_list));
    var x= list_container.scrollTop;
    session_arr[session_id].activity_arr.push("User edited Task "+todo_list[index].title+" at "+ new Date());
    localStorage.setItem("sessions", JSON.stringify(session_arr));

    render_list(todo_list);
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
      session_arr[session_id].activity_arr.push("User saved Task "+todo_list[index].title+" at "+ new Date());
      localStorage.setItem("sessions", JSON.stringify(session_arr));
      render_list(todo_list);
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
            duedate: new Date(duedate),
            reminderGiven:false,
            subtask_arr: [...subtask_arr],
            category_arr: [...category_arr],
            tag_arr: [...tag_arr]
        }

        todo_list.push(new_entry);
        localStorage.setItem('todos', JSON.stringify(todo_list));  
        document.getElementById("userinput").value='';
        session_arr[session_id].activity_arr.push("User added duedate as "+duedate+ " for task at "+ new Date());
        localStorage.setItem("sessions", JSON.stringify(session_arr));
        session_arr[session_id].activity_arr.push("User added a new Task "+userinput+" at "+ new Date());
        localStorage.setItem("sessions", JSON.stringify(session_arr));
        render_list(todo_list);
        
        subtask_arr.map(function(item){
          all_subtasks_arr.push({
            s_id:item.s_id,
            parent_id: unique_id,
            index: item.index
          })
        });
        localStorage.setItem("subtasks", JSON.stringify(all_subtasks_arr));


        list_container.scrollTop= -list_container.scrollHeight;
        unique_id++;
        priority= "none";
        duedate="none";
        index=0;
        while(subtask_arr.length) {subtask_arr.pop();}
        while(category_arr.length) {category_arr.pop();}
        while(tag_arr.length) {tag_arr.pop();}

        document.getElementById("subtask_list_container").textContent='';
        document.getElementById("category_list_container").textContent='';
        document.getElementById("tag_list_container").textContent='';

        document.getElementById("date").style.display="none";
        document.getElementById("high").style.backgroundColor="blueviolet";
        document.getElementById("medium").style.backgroundColor="blueviolet";
        document.getElementById("low").style.backgroundColor="blueviolet";
        document.getElementById("today").style.backgroundColor="blueviolet";
        document.getElementById("tmrw").style.backgroundColor="blueviolet";
        document.getElementById("custom").style.backgroundColor="blueviolet";
    }
})

var regex= /(by)\s((today)|(tmrw)|(tomorrow)|((\d{1,2})(st|nd|th|rd)\s((?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|June?|July?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?))\s(\d{4})(?:\s(\d{1,2})\s(AM|PM))?))/i;

var userinput= document.getElementById("userinput");

userinput.addEventListener("keyup", function(event)
{
   var date_input=(userinput.value).match(regex);
   if(date_input)
   {
      console.log(date_input);

          if(date_input[2].toLowerCase()=="today")
          {
            let today_date= new Date();
            duedate=new Date(today_date);
          }

          else if(date_input[2].toLowerCase()=="tomorrow" ||  date_input[2].toLowerCase()=="tmrw" )
          {
            let today_date= new Date();
            let tmrw= new Date(today_date);
            tmrw.setDate(today_date.getDate() + 1);
            duedate=new Date(tmrw);
          }
          else 
          {
            const monthNumber = new Date(`${date_input[9]} 1, ${date_input[10]}`).getMonth() + 1;
            duedate = new Date(date_input[10], monthNumber - 1, date_input[7]);
          }

          var newvalue=this.value.slice(0, this.value.length-date_input[0].length);
          this.value= newvalue;
   }

   
   session_arr[session_id].activity_arr.push("User is inputing task at "+ new Date());
   localStorage.setItem("sessions", JSON.stringify(session_arr));
   
})


//partial keyword search
//it returns the todo if the todo title contains any of the keywords mentioned by the user
search_button_1.addEventListener('click', function()
{
  var search_input= document.getElementById("search_input").value;
  var search_keywords=search_input.toLowerCase().split(' ');
  //console.log(search_keywords);

  var searched_arr=new Array(0);
  todo_list.map(function(item){
  var counter=0;
    search_keywords.map(function(item2){
      if(item.title.toLowerCase().includes(item2))
      {
        counter++;
      }
      item.subtask_arr.map(function(item3)
      { 
        if(item3.title.toLowerCase().includes(item2))
        {
          counter++;
        }  
      })
    })
    if(counter>0) searched_arr.push(item);
  })

  // console.log(searched_arr);
  // console.log(todo_list);

  session_arr[session_id].activity_arr.push("User searched for tasks with keywords= "+search_input+" at "+ new Date());
  localStorage.setItem("sessions", JSON.stringify(session_arr));
  render_list(searched_arr);

})

//priority tags
//adding event listeners to each of the list items
var list_items= document.getElementsByClassName("priority_item");
var arr=Array.from(list_items);
arr.map(function(item){

  item.addEventListener("click", function(event)
  {
    for(var i=0;i<arr.length;i++)
    {
      if(event.target==arr[i])
      {
        priority=event.target.id;
        event.target.style.backgroundColor="#4F0766";
        console.log(priority);
      }
      else arr[i].style.backgroundColor="blueviolet";
    }

  session_arr[session_id].activity_arr.push("User added "+priority+" priority for task at "+ new Date());
  localStorage.setItem("sessions", JSON.stringify(session_arr));
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
        if(event.target.style.backgroundColor=="rgb(79, 7, 102)") 
        {
          event.target.style.backgroundColor="blueviolet";
          document.getElementById("date").style.display="none";
          duedate="none";
        }
        else
        {
          if(event.target.id=="today")
          {
            let today_date= new Date();
            duedate=new Date(today_date);
            
          }
          else if(event.target.id=="tmrw")
          {
            let today_date= new Date();
            let tmrw= new Date(today_date);
            tmrw.setDate(today_date.getDate() + 1);
            duedate=new Date(tmrw);
          }
          else if(event.target.id=="custom")
          {
            document.getElementById("date").style.display="block";
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
  duedate= new Date(str);
})



//functionality of entering subtasks when plus button is clicked
document.getElementById("plus_button_subtask").addEventListener("click", function()
{
    var parent_div= document.getElementById("subtask_list_container");
    var subtask= document.getElementById("subtask_input").value;
    if(subtask.length>0)
    {
      //console.log(subtask);
      var new_p= document.createElement("p");
      new_p.innerText=subtask;
      new_p.setAttribute("class","subtask_para");
      parent_div.appendChild(new_p);
      last_subtask_uid= parseInt(localStorage.getItem("last_subtask_uid"));
      var new_entry=
      {
          index: index++,
          title: subtask,
          s_id: last_subtask_uid+1,
      }
      subtask_arr.push(new_entry);
      document.getElementById("subtask_input").value='';
      localStorage.setItem("last_subtask_uid", last_subtask_uid+1);
      //subtask_uid++;
      session_arr[session_id].activity_arr.push("User added subtask= "+subtask+ "for task at "+ new Date());
      localStorage.setItem("sessions", JSON.stringify(session_arr));
    }
    else alert("Subtask cannot be empty");
})

//adding tags on clicking in plus button
document.getElementById("plus_button_tag").addEventListener("click", function()
{
    var parent_div= document.getElementById("tag_list_container");
    var tag= document.getElementById("tag_input").value;
    if(tag.length>0)
    {
      //console.log(subtask);
      var new_p= document.createElement("p");
      new_p.innerText=tag;
      new_p.setAttribute("class","subtask_para");
      parent_div.appendChild(new_p);
      var new_entry=
      {
          title: tag,
          t_id: tag_uid,
      }
      tag_arr.push(new_entry);
      document.getElementById("tag_input").value='';
      tag_uid++;
      session_arr[session_id].activity_arr.push("User added a tag= "+tag+ "for task at "+ new Date());
      localStorage.setItem("sessions", JSON.stringify(session_arr));
    }
    else alert("Tag cannot be empty");
})


//adding category
document.getElementById("plus_button_category").addEventListener("click", function()
{
  
    var parent_div= document.getElementById("category_list_container");
    var category= document.getElementById("category_input").value;
    if(category.length>0 && category_arr.length<1)
    {
      //console.log(category);
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
      category_uid++;
      session_arr[session_id].activity_arr.push("User added category= "+category+ " for task at "+ new Date());
      localStorage.setItem("sessions", JSON.stringify(session_arr));
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
    var filtered_arr=new Array(0);
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
      if(counter>0) filtered_arr.push(item);
    })
    session_arr[session_id].activity_arr.push("User filtered for tasks with categories= "+search_input+" at "+ new Date());
    localStorage.setItem("sessions", JSON.stringify(session_arr));
    render_list(filtered_arr);
  }
})

//priority filter
//it returns the todo if the todo filter contains any of the priorities mentioned by the user
search_button_3.addEventListener('click', function()
{

  var search_input= document.getElementById("search_input_3").value;
  if(search_input.length>0)
  {
    var search_keywords=search_input.toLowerCase().split(' ');
    var filtered_arr=new Array(0);
    todo_list.map(function(item){
    var counter=0;
      search_keywords.map(function(item2)
      {
        if(item.priority.toLowerCase()==item2)
        {
             counter++;
        }
      })
      if(counter>0) filtered_arr.push(item);
    })
    session_arr[session_id].activity_arr.push("User filtered for tasks with priorities= "+search_input+" at "+ new Date());
    localStorage.setItem("sessions", JSON.stringify(session_arr));
    render_list(filtered_arr);
  }
})


//tag filter
//it returns the todo if the todo filter contains any of the tags mentioned by the user
search_button_5.addEventListener('click', function()
{

  var search_input= document.getElementById("search_input_5").value;
  if(search_input.length>0)
  {
    var search_keywords=search_input.toLowerCase().split(' ');
    var filtered_arr=new Array(0);
    todo_list.map(function(item){
    var counter=0;
      search_keywords.map(function(item2)
      {
        var x_arr= item.tag_arr;
        //console.log(x_arr);
        if(x_arr[0].title.toLowerCase().includes(item2))
        {
            counter++;
        }
      })
      if(counter>0) filtered_arr.push(item);
    })
    session_arr[session_id].activity_arr.push("User filtered for tasks with tags= "+search_input+" at "+ new Date());
    localStorage.setItem("sessions", JSON.stringify(session_arr));
    render_list(filtered_arr);
  }
})



function cancel_search(){

  document.getElementById("search_input").value='';
    document.getElementById("search_input_2").value='';
    document.getElementById("search_input_3").value='';
    document.getElementById("search_input_5").value='';
    session_arr[session_id].activity_arr.push("User clicked button to cancel Searching/Filtering at "+ new Date());
    localStorage.setItem("sessions", JSON.stringify(session_arr));
    render_list(todo_list);
}


function viewBacklogs()
{
  var filtered_arr=new Array();
  todo_list.map(function(item)
  {
     if(item.completed==false && new Date(item.duedate).getTime() < new Date().getTime()){
      filtered_arr.push(item);
     }
  })
  session_arr[session_id].activity_arr.push("User clicked button to view backlogs at "+ new Date());
  localStorage.setItem("sessions", JSON.stringify(session_arr));
  render_list(filtered_arr);
}


function viewAll()
{
  session_arr[session_id].activity_arr.push("User clicked button to view all tasks at "+ new Date());
  localStorage.setItem("sessions", JSON.stringify(session_arr));
   render_list(todo_list);
}


function sortTasks(event){
  console.log(event.target.value);
}

function sort_container_click()
{
  document.getElementById("sort_list").style.display= "block";
}

function sortByDuedate(){

  document.getElementById("search_input_4").value="Duedate";
  document.getElementById("sort_list").style.display= "none";
  var sorted_arr=[...todo_list];
  sorted_arr.sort( function compare(a,b)
  {
    if(new Date(a.duedate).getTime() > new Date(b.duedate).getTime()){
     return 1;
    }

    else return -1;
  })
  session_arr[session_id].activity_arr.push("User clicked button to sort tasks by Duedate at "+ new Date());
  localStorage.setItem("sessions", JSON.stringify(session_arr));
  render_list(sorted_arr);
}


function sortByPriority(){
  
  
  document.getElementById("search_input_4").value="Priority";
  document.getElementById("sort_list").style.display= "none";
  var sorted_arr=[...todo_list];
  sorted_arr.sort( function compare(a,b)
  {

    if(a.priority==b.priority) return 0; 
    if(a.priority=="high") return -1;
    if(a.priority=="none") return 1;
    if(a.priority=="medium" && b.priority=="high") return 1;
    if(a.priority=="medium" && (b.priority=="low" || b.priority=="none")) return -1;
    if(a.priority=="low" && b.priority=="none") return -1;
    if(a.priority=="low" && (b.priority=="medium" || b.priority=="high")) return 1;
    
  })
  session_arr[session_id].activity_arr.push("User clicked button to sort tasks by Priority at "+ new Date());
  localStorage.setItem("sessions", JSON.stringify(session_arr));
  render_list(sorted_arr);
}


cancel_search_button_4.addEventListener('click', function()
{
  document.getElementById("search_input_4").value='';
  document.getElementById("sort_list").style.display= "none";
  session_arr[session_id].activity_arr.push("User clicked button to cancel Sorting at "+ new Date());
  localStorage.setItem("sessions", JSON.stringify(session_arr));
  render_list(todo_list);
})

document.getElementById("view_activity_logs").addEventListener("click", viewActivityLogs);

 
function viewActivityLogs(){

  session_arr.map(function(item)
  {
    var p_heading= document.createElement("p");
    p_heading.style.margin="20px 0px 0px";
    p_heading.style.border="0px";
    p_heading.style.backgroundColor="white";
    p_heading.style.fontSize="22px";
    p_heading.innerText="Logs for session starting at "+item.start_time;
    
    var p_content= document.createElement("p");
    p_content.style.margin="0px 0px 10px";
    p_content.style.backgroundColor="white";
    p_heading.style.border="0px";
    item.activity_arr.map(function(item2){
      p_content.innerHTML+=`${item2}</br>`;
    })

    document.getElementById("activity_log_container").appendChild(p_heading);
    document.getElementById("activity_log_container").appendChild(p_content);

  })
  this.removeEventListener("click",viewActivityLogs);
  this.addEventListener("click",removeActivityLogs);
}


function removeActivityLogs()
{
  document.getElementById("activity_log_container").innerHTML='';
  this.removeEventListener("click",removeActivityLogs);
  this.addEventListener("click",viewActivityLogs);
}


function reminder()
{
  var now_date= new Date();
  todo_list.map(function(item){
    var item_date= new Date(item.duedate);
     if(item_date.getTime()- now_date.getTime() < 3600000 && item_date.getTime()- now_date.getTime() >0  && !item.reminderGiven){
      alert("Reminder for Task= "+ item.title+ ". Due at "+ item.duedate);
      item.reminderGiven=true;
      localStorage.setItem('todos', JSON.stringify(todo_list));       
    }
  })
}

setInterval(reminder(), 9000);