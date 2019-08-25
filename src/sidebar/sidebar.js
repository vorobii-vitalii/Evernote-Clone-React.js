import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import styles from './styles';
import List from '@material-ui/core/List';
import { Divider, Button } from '@material-ui/core';
import SidebarItemComponent from '../sidebar_item/sidebar_item';

class SidebarComponent extends React.Component{

    state={
        addingNote:false,
        title:null
    }

    render(){

        const {notes,classes,selectedNoteIndex}= this.props;

        return (
            <div className={classes.sidebarContainer}>
                <Button 
                onClick={this.newNoteBtnClick}
                className={classes.newNoteBtn}    
                >
                {this.state.addingNote ? "Hide Note adding...":"Create New Note" }    
                </Button>
                {
                    this.state.addingNote 
                    && 
                    <div>
                        <input 
                            type="text"
                            className={classes.newNoteInput}
                            //value={this.state.title}
                            placeholder="Enter Note title"
                            onKeyUp={(e)=>this.updateNoteTitle(e.target.value)}
                        />
                        <Button onClick={this.submitTitle} className={classes.newNoteSubmitBtn} >Submit New Note</Button>
                    </div>
                }
                <List>
                    {
                        notes.map( (note,index) => (
                            <div key={index} >
                                <SidebarItemComponent 
                                        note={note}
                                        index={index}
                                        selectedNoteIndex={selectedNoteIndex}
                                        selectNote={this.selectNote}
                                        deleteNote={this.deleteNote}
                                />
                                <Divider></Divider>
                            </div>
                        ) )
                    }
                </List>

            </div>
        )
    }

    submitTitle=()=>{
        this.props.newNote(this.state.title);
    }

    updateNoteTitle=(val)=>{
        console.log(val);
        this.setState({
            title:val
        })
    }

    newNoteBtnClick=()=>{
        this.setState(prevState=>({
            addingNote:!prevState.addingNote,
            title:null
        }))
    }

    selectNote=(note,index)=>{
        this.props.selectNote(note,index);
    }

    deleteNote=(note)=>{
        this.props.deleteNote(note)
    }
}

export default withStyles(styles)(SidebarComponent);