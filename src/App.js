import React,{Component} from 'react';
import './App.css';
import EditorComponent from './editor/editor'
import SidebarComponent from './sidebar/sidebar'

const firebase=require('firebase');

class App extends Component {

  state={
    selectedNoteIndex:null,
    selectedNote:null,
    notes:[]
  };

  render(){
      return (
          <div style={{height: "100%"}}>
              <SidebarComponent
                  selectedNoteIndex={this.state.selectedNoteIndex}
                  notes={this.state.notes}
                  deleteNote={this.deleteNote}
                  selectNote={this.selectNote}
                  noteUpdate={this.noteUpdate}
                  newNote={this.newNote}
              />
              {
                this.state.selectedNote && 
                <EditorComponent {...this.state} noteUpdate={this.noteUpdate}/>
              }

              
          </div>
      )
  }

  componentDidMount=()=>{
    firebase
        .firestore()
        .collection('notes')
        .onSnapshot(serverUpdate=>{
          const notes = serverUpdate.docs.map( doc => {
            const data= doc.data();
            data['id']=doc.id;
            return data;
          })
          this.setState({notes:notes})
        });
  }

  deleteNote=async (note)=>{
    const currentNote=this.state.selectedNote;
    await this.setState({
      notes:this.state.notes.filter(_note => _note!==note)
    })
    const noteIndex=this.state.notes.indexOf(note);
    if(this.state.selectedNoteIndex===noteIndex){
      this.setState({selectedNoteIndex:null,selectedNote:null})
    }
    else{
        if(this.state.notes.length > 1) {
          const selectedNoteIndexAfterUpdate=this.state.notes.indexOf(this.state.notes.filter( note => note === currentNote )[0])
          this.selectNote( this.state.notes[selectedNoteIndexAfterUpdate],selectedNoteIndexAfterUpdate )
        }
        else{
          this.setState({selectedNoteIndex:null,selectedNote:null})
        }
    }

    firebase
      .firestore()
      .collection('notes')
      .doc(note.id)
      .delete()

  }

  noteUpdate=(id,noteObject)=>{
    firebase
      .firestore()
      .collection('notes')
      .doc(id)
      .update({
        ...noteObject,
        timestamp:firebase.firestore.FieldValue.serverTimestamp()
      })
  }

  selectNote=(note,index)=>{
      this.setState({
        selectedNoteIndex:index,
        selectedNote:note,
      })
  }

  newNote=async (title)=>{
    const note={
      title:title,
      body:''
    }
    const newFromDB=await firebase
                    .firestore()
                    .collection('notes')
                    .add({
                      title:note.title,
                      body:note.body,
                      timestamp:firebase.firestore.FieldValue.serverTimestamp()
                    })
    const newID=newFromDB.id;
    await this.setState({notes:[...this.state.notes,note]})
    const newNoteIndex=this.state.notes.indexOf(this.state.notes.filter(note => note.id==newID )[0])
    this.setState({
      selectedNote:this.state.notes[newNoteIndex],
      selectedNoteIndex:newNoteIndex
    })

  }

}

export default App;
