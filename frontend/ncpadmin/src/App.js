import React,{Component} from 'react';
import './App.css';
import Modal from 'react-modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure();

class App extends Component{

  constructor(props){
    super(props);
    this.state={
      events:[],
      users:[],
      modalIsOpen: false,
      name: '',
      details: '',
      date:new Date(),
      msg: '',
      id: 0,
      showUsers:false,
      showId:0
    }

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.logChange = this.logChange.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showUsersModal=this.showUsersModal.bind(this);
    this.closeUsersModal=this.closeUsersModal.bind(this);
  }

  deleteEvent(event){
    var data={
      id:event.id
    }
    fetch('/delete',{
      method:'DELETE',
      headers: {'Content-Type':'application/json'},
      body:JSON.stringify(data)
    }).then((response)=>{
      if(response.status>=400){
        throw new Error("Bad Response from Server.")
      }
      return response.json();
    }).then((data)=>{
      if(data.msg==="deleted")
      console.log("Event Deleted!");
      toast('Event has been deleted !',{position: "top-center",autoClose: 3000});
      window.location.reload();
    }).catch((err)=>{
      console.log(err);
    });
  }

  openModal(event){
    this.setState({
      modalIsOpen: true,
      name: event.name,
      details: event.details,
      date:event.date,
      id: event.id
    });
  }

  showUsersModal(){
    this.setState({
      showUsers:true,
    });
  }

  closeUsersModal(){
    this.setState({showUsers:false});
  }

  closeModal(){
    this.setState({modalIsOpen:false});
  }

  logChange(e){
    this.setState({
      [e.target.name]:e.target.value
    });
  }

  handleEdit(event){
    event.preventDefault();
    var data={
      name:this.state.name,
      details:this.state.details,
      date:this.state.date,
      id:this.state.id
    }

    fetch('/edit',{
      method:"PUT",
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(data)
    }).then((response)=>{
      if(response.status>=400){
        throw new Error("bad response from server");
      }
      return response.json();
    }).then((data)=>{
      console.log(data);
      if(data.msg==="edited"){
        console.log("Event Updated!");
        toast('Event has been updated !',{position: "top-center",autoClose: 3000});
        window.location.reload();
      }
    }).catch((err)=>{
      console.log(err);
    })

  }

  handleSubmit(event){
      event.preventDefault();
      var data={
        name:this.state.name,
        details:this.state.details,
        date:this.state.date
      }
      console.log(data);
      fetch('/add',{
        method:"POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      }).then((response)=>{
        if(response.status>=400){
          throw new Error("Bad Response from server");
        }
        return response.json();
      }).then((data)=>{
        console.log(data);
        if(data.msg==="added"){
          toast("Event added successfully!",{position:"top-center",autoClose:3000});
          window.location.reload();
        }
      }).catch((err)=>{
        console.log(err);
      })
  }

  componentDidMount(){
    fetch("/events",{method: 'GET'}).then((res) => {
      if (res.status >= 400){
        console.log(res.status);
        }
      return res.json();
    }).then((data) => {
      this.setState({events:data});
    }).catch((err) => {
      console.log('ERROR!',err);
    });

    fetch("/volunteers",{method:"GET"}).then((res)=>{
      if(res.status>=400){
        console.log(res.status);
      }
      return res.json();
    }).then((data)=>{
      this.setState({users:data});
    }).catch((err)=>{
      console.log('ERROR!',err);
    });
  }

  render(){

    return(
      <div className="container">
      <div className="container">
      <h2 className="title">THE OG NGO</h2> 
        <hr></hr>
        <h4>Events | <a onClick={()=>this.showUsersModal()}>Volunteers</a> <button className="btn addbtn btn-success" data-toggle="modal" data-target="#addform"><i className="fas fa-plus"></i> Add</button> </h4>
        
        <div className="modal fade" id="addform" tabindex="-1" role="dialog" >
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Add Event</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <form onSubmit={this.handleSubmit} method="POST">
                  <div className="form-group">
                      <label htmlFor="name">Event Name</label>
                      <input type="text" className="form-control" id="name" name="name" onChange={this.logChange} placeholder="Enter name of the event..." required/>
                  </div>

                  <div className="form-group">
                      <label htmlFor="details">Event Details</label>
                      <input type="textarea" className="form-control" id="details" name="details" onChange={this.logChange} placeholder="Enter details of the event..." required/>
                  </div>

                  <div className="form-group">
                      <label htmlFor="date">Event Date</label>
                      <input type="date" className="form-control" id="date" name="date" onChange={this.logChange} required/>
                  </div>
                  <button type="submit" class="btn btn-primary">Add</button>
                </form>
              </div>
            </div>  
          </div>
        </div>
      
      
      </div>

      <table className="table table-bordered table-hover">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Date</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {this.state.events.map(event=>
            <tr key={event.id} >

            <td>{event.id}</td>
            <td>{event.name}</td>
            <td>{event.date}</td>
            {/* <td> <a onClick={()=>this.openModal(event)} >Edit</a> | <a onClick={()=>this.deleteEvent(event)} >Delete</a> </td>   */}
            <td> 
              <div className="btn-group" role="group" aria-label="action btns">
                <button type="button" onClick={()=>this.openModal(event)} className="btn btn-outline-dark"><i className="fa fa-pencil" aria-hidden="true"></i> Edit</button>
                <button type="button" onClick={()=>this.deleteEvent(event)} className="btn btn-outline-dark"> <i className="fa fa-trash" aria-hidden="true"></i> Delete</button>
              </div> 
            </td>

            </tr> 
            )}

        <Modal 
            isOpen={this.state.modalIsOpen}
            onRequestClose={this.closeModal}
            contentLabel="Edit Modal"
        >

              <form onSubmit={this.handleEdit} method="POST">

                <div className="form-group">
                    <label htmlFor="name">Event Name</label>
                    <input type="text" className="form-control" id="name" name="name" onChange={this.logChange} defaultValue={this.state.name} placeholder="Enter name of the event..." required/>
                </div>

                <div className="form-group">
                    <label htmlFor="details">Event Details</label>
                    <textarea row="6" className="form-control" id="details" name="details" onChange={this.logChange} value={this.state.details}  placeholder="Enter the details of event..." />
                </div>

                <label htmlFor="date">Event Date</label>
                <input type="date" id="date" name="date" value={this.state.date} onChange={this.logChange} />

                {/* <div className="form-group">
                    <label htmlFor="date">Event Date</label>
                    <input type="date" className="form-control" id="date" name="date" onChange={this.logChange} defaultValue={this.state.date} />
                </div> */}
                <br></br><br></br>
                <button className="btn btn-success" type="submit">Edit</button>

              </form>

        </Modal>
        
        <Modal 
            isOpen={this.state.showUsers}
            onRequestClose={this.closeUsersModal}
            contentLabel="Volunteers Modal"
        >
          <h5 className="title1">VOLUNTEERS</h5>
          <table className="table table-bordered table-hover">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">eMail</th>
                <th scope="col">Mobile</th>
                <th scope="col">Event ID</th>
              </tr>
            </thead>
            <tbody>
                {this.state.users.map(user=>
                <tr key={user.id} >
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.number}</td>
                <td>{user.eventid}</td>
                </tr>
                )}
            </tbody>
          </table>
        </Modal>
        </tbody>
      </table>
      </div>
    )
  }

}

export default App;
