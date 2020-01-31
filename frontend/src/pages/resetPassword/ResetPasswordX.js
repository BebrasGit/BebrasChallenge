import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box'; 
import Typography from '@material-ui/core/Typography'; 

import axios from 'axios'

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: 15,
    marginRight: 15,
    width: 200,
  },
   typo: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: theme.spacing(4),
    marginTop: theme.spacing(5),
    marginLeft: theme.spacing(5),
    color: theme.palette.text.hint,
  },
});

// function Transition(props) {
//   return <Slide direction="down" {...props} />;
// }

class ResetPassword extends React.Component {
  
  state = {
    password: "",
    confirmPassword:"",
    errorPassword:false,
    errorConfirmPassword:false,
    openDialog : false,
    uidb:"",
    token:""
  }

  componentDidMount() {
    
    var str = this.props.location.search;
    var uidb = str.match(new RegExp("=" + "(.*)" + "&token"));
    console.log("uidb1 " + uidb[1]);
    // var uidbString = uidb[1].substring(
    // str.lastIndexOf("b"));
    // console.log("uidb"+ uidbString);
    var tokenString = str.substring(
    str.lastIndexOf("n") + 2);
    
    this.setState({uidb:uidb[1] , token:tokenString});
  }

  confirmNewPassword = () => {
    if(this.state.password!= this.state.confirmPassword)
    {
      this.setState({errorPassword:true , errorConfirmPassword:true , openDialog : true})
    }
    else {
      axios.post(' http://localhost:8000/reset_password_confirm/(%3FP'+this.state.uidb+'%5B0-9A-Za-z%5D+)-(%3FP'+this.state.token+'.+)/$',
        {password : this.state.password},
        {
          headers: {
            'content-type' : 'application/json'
          }
        }
      ).then(response => {
        //sucess and redirect to login
        console.log("success" + response.data);
      }).catch(error => {
        console.log(error)});
    }
  }

  handleClose = () => {
    this.setState({ openDialog: false });
  };

  render() {
    const { classes } = this.props;

    return (
      <>
      <Typography className={classes.typo} variant="h4" size="sm">
        Reset Password
        </Typography>
      <Paper elevation={3} style={{width:'500px',marginLeft:'34%',marginTop:'150px'}}>
      <Box>
        <TextField
          id="password"
          label="Password"
          className={classes.textField}
          type="password"
          autoComplete="current-password"
          margin="normal"
          value={this.state.password}
          error={this.state.errorPassword}
          onChange={e => this.setState({errorPassword:false , password:e.target.value , errorConfirmPassword:false})}
        /></Box>
        <Box>
        <TextField
          id="confirmPassword"
          label="Confirm Password"
          className={classes.textField}
          type="password"
          autoComplete="current-password"
          margin="normal"
          value={this.state.confirmPassword}
          error={this.errorConfirmPassword}
          onChange={e => this.setState({errorConfirmPassword:false, confirmPassword:e.target.value , errorPassword:false})}
        /></Box>
        <Box display="flex" flexDirection='row' p={1} m={1}>
        <Button
            disabled={
              this.state.password.length === 0 || this.state.confirmPassword.length === 0 }
            onClick={() => this.confirmNewPassword()}
            variant="contained"
            color="primary"
            size="large">
            Submit
        </Button></Box>
        <>
          <Dialog
            open={this.state.openDialog}
            // TransitionComponent={Transition}
            keepMounted
            onClose={this.handleClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description">
            <DialogTitle id="alert-dialog-slide-title">
              Password and Confirm Password fields don't match!
            </DialogTitle>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                Close
              </Button>
            </DialogActions>
           </Dialog>
        </>
        </Paper>
      </>
    );
  }
}

ResetPassword.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ResetPassword);