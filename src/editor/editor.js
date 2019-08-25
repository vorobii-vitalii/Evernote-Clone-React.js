import React from 'react';
import ReactQuill from 'react-quill';
import debounce from '../helpers';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import { withStyles } from '@material-ui/core/styles';
import styles from './styles';

class EditorComponent extends React.Component{

    state={
        text:"",
        title:"",
        id:""
    }

    render(){

        const {classes}=this.props;

        return (
            <div className={classes.editorContainer}>
                <BorderColorIcon className={classes.editIcon}></BorderColorIcon>
                <input 
                    type="text"
                    className={classes.titleInput}
                    value={this.state.title}
                    onChange={this.handleTitleChange}
                />
                <ReactQuill
                    value={this.state.text}
                    onChange={this.updateBody}
                />
            </div>
        )
    }

    componentDidUpdate(){
        const {body,title,id} = this.props.selectedNote;
        if(id===this.state.id) return;
        this.setState({
            text:body,
            title:title,
            id:id
        })
    }

    componentDidMount(){
        this.setState({
            text:this.props.selectedNote.body,
            title:this.props.selectedNote.title,
            id:this.props.selectedNote.id
        })
    }

    handleTitleChange = async e =>{
        await this.setState({
            title:e.target.value
        })
        this.update();
    }

    updateBody=async(val)=>{
        await this.setState({text:val})
        this.update();
    }

    update=debounce(()=>{
        this.props.noteUpdate(this.state.id,{
            title:this.state.title,
            body:this.state.text
        });
    },1500)
}

export default withStyles(styles)(EditorComponent);