//import logo from './logo.svg';
import React, { Component } from 'react';
import CatList from "./components/cats/CatList"
import DogList from "./components/dogs/DogList"
import OwnerList from "./components/owners/OwnerList"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import './style/app.scss';

export default class App extends Component
{
  state = {
    catsList: [
      { id: 1, name: "felix", breed: "siamese", color: "Black", hasOwner: false },
      { id: 2, name: "Catalax", breed: "normal", color: "Silver", hasOwner: false },
      { id: 3, name: "Pizza", breed: "normal", color: "Golden", hasOwner: false },
    ],
    dogsList: [
      { id: 1, name: "Crispie", breed: "shitzu", color: "yellow", hasOwner: false },
      { id: 2, name: "Poptart", breed: "Labradoodle", color: "pink", hasOwner: false },
      { id: 3, name: "Donut", breed: "Labradour", color: "green", hasOwner: false },
    ],
    ownerList: [
      { id: 1, name: "Hamzah", age: 16, country: "Lebanon", catIds: [], dogIds: [] },
      { id: 2, name: "Adam", age: 32, country: "Egypt", catIds: [], dogIds: [] },
      { id: 3, name: "Laura", age: 33, country: "United Kingdom", catIds: [], dogIds: [] },
      { id: 4, name: "Denise", age: 54, country: "United Kingdom", catIds: [], dogIds: [] },
      { id: 5, name: "Hassan", age: 29, country: "United Kingdom", catIds: [], dogIds: [] },
      { id: 6, name: "Ali", age: 59, country: "Lebanon", catIds: [], dogIds: [] },
    ],
    draggedItem: {
      petId: -1,
      petType: ""
    }
  }

  //create notifications
  createNotification = (type, message) =>
  {
    switch (type) {
      case 'info':
        toast.info(message, {
          position: toast.POSITION.BOTTOM_CENTER
        });
        break;
      case 'success':
        toast.success(message, {
          position: toast.POSITION.BOTTOM_CENTER
        });
        break;
      case 'warning':
        toast.warn(message, {
          position: toast.POSITION.BOTTOM_CENTER
        });
        break;
      case 'error':
        console.log("here i am");
        toast.error(message, {
          position: toast.POSITION.BOTTOM_CENTER
        });
        break;
      default:
        toast.error("Something else went wrong", {
          position: toast.POSITION.BOTTOM_CENTER
        });
    }
  };

  //drag started > set draggedItem state which is used on drop (to know which item was dropped)
  onDrag = (petId, petType) =>
  {
    this.setState({
      draggedItem: {
        petId,
        petType
      }
    });
  }

  //on drop in one of the owners > assign the pet to the owner
  onDrop = (droppedOwnerId) =>
  {
    const { petId, petType } = this.state.draggedItem;

    //another method (firefox likes this)
    //var data = event.dataTransfer.getData("text");
    //console.log("Data id is: ", data);
    //const { id, draggedTask, todos } = this.state;

    console.log("Pet dropped - ID: ", petId, " Type: ", petType);
    console.log("Dropped on owner ID: ", droppedOwnerId);

    //assign pet to owner
    let updOwners = this.state.ownerList;
    let updOwner = updOwners.find(owner => owner.id === droppedOwnerId);
    if (updOwner === undefined) {
      this.createNotification("error", `Could not find Owner to update, Owner ID: ${droppedOwnerId}`);
      return;
    }
    if (petType === "cat") {
      updOwner.catIds.push(petId);
    }
    else if (petType === "dog") {
      updOwner.dogIds.push(petId);
    }

    console.log("updOwners is now: ", updOwners);

    //update owner state
    this.setState({
      ownerList: updOwners
    });


    //set the hasOwner on the pet to true
    let updCat, updDog;
    if (petType === "cat") {
      let updCatList = this.state.catsList;
      updCat = updCatList.find(cat => cat.id === petId);
      if (updCat === undefined) {
        this.createNotification("error", `Could not find Cat to update, Cat ID: ${petId}`);
        return;
      }
      updCat.hasOwner = true;

      //update state
      this.setState({
        catList: updCatList
      });

      this.createNotification("success", `Owner ${updOwner.name} has been allocated ${petType} ${updCat.name}`);
    }
    else if (petType === "dog") {
      let updDogList = this.state.dogsList;
      updDog = updDogList.find(dog => dog.id === petId);
      if (updDog === undefined) {
        this.createNotification("error", `Could not find Dog to update, Dog ID: ${petId}`);
        return;
      }

      updDog.hasOwner = true;

      //update state
      this.setState({
        dogList: updDogList
      });

      this.createNotification("success", `Owner ${updOwner.name} has been allocated ${petType} ${updDog.name}`);
    }

    // this.setState({
    //   owners: updOwners,
    //   todos: todos.filter(task => task.id !== draggedTask.id),
    // })
  }



  render()
  {
    return (
      <main>
        <ToastContainer closeOnClick/>

        <section id="sidebar-left">
          <h2>Cats</h2>
          <CatList list={this.state.catsList} onDrag={this.onDrag} />
        </section>

        <section id="pageArea">
          <h2>Owners</h2>
          <OwnerList ownerList={this.state.ownerList} onDrop={this.onDrop} />
        </section>

        <section id="sidebar-right">
          <h2>Dogs</h2>
          <DogList list={this.state.dogsList} onDrag={this.onDrag} />
        </section>

      </main>
    );
  }
}